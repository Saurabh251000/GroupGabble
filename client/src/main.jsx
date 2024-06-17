/* eslint-disable */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./styles/index.css";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import Chat from "./routes/chats.jsx";
import Setting from "./routes/settings.jsx";
import Home from "./routes/home.jsx";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/SignUp.jsx";
import { Provider, useSelector, useDispatch } from "react-redux";
import chatStore from "./stores/index.js";
import Profile from "./routes/Profile.jsx";
import { profileActions } from "./stores/profileSlice";
import { jwtDecode } from 'jwt-decode';
// import { useFetchUsers, useFetchGroups, useFetchUserData } from './hooks/useFetchData';
import Loading from './components/Loading.jsx'; // Import the loading component
import { SocketContextProvider } from "./context/SocketContext.jsx";

const AuthRoute = ({ element }) => {
  const { islogin } = useSelector((store) => store.profile);
  return islogin ? element : <Login />;
};

const checkToken = async (dispatch, navigate, setLoading) => {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
    setLoading(false); // Stop loading
    return;
  }

  // Check if token is expired and refresh if necessary
  const isTokenExpired = (token) => {
    const payload = jwtDecode(token);
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now >= expiry;
  };

  if (isTokenExpired(token)) {
    try {
      const response = await fetch("https://group-gabble-server.vercel.app/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        token = data.accessToken;
        localStorage.setItem("accessToken", token);
      } else {
        navigate("/login");
        setLoading(false); // Stop loading
        return;
      }
    } catch (error) {
      navigate("/login");
      setLoading(false); // Stop loading
      return;
    }
  }

  // Decode the token to get user information
  const decodedToken = jwtDecode(token);
  const userInfo = {
    userId: decodedToken.UserInfo.userid,
    userName: decodedToken.UserInfo.userName,
    name: decodedToken.UserInfo.name,
  };

  dispatch(profileActions.LoginState());
  dispatch(profileActions.Updateinfo(userInfo));
  dispatch(profileActions.MarkFetchDone());
  setLoading(false); // Stop loading after data is fetched
};

const AppWithAuthCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // Manage loading state

  // Use custom hooks to fetch data
  // useFetchUsers();
  // useFetchGroups();
  // const { userInfo } = useSelector((store) => store.profile);
  // useFetchUserData(userInfo?.userName);

  useEffect(() => {
    checkToken(dispatch, navigate, setLoading);
  }, [dispatch, navigate]);

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched
  }

  return <App />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWithAuthCheck />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chats",
        element: <AuthRoute element={<Chat />} />,
      },
      {
        path: "/setting",
        element: <AuthRoute element={<Setting />} />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <AuthRoute element={<Profile />} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={chatStore}>
      <SocketContextProvider>
        <RouterProvider router={router} />
      </SocketContextProvider>
    </Provider>
  </React.StrictMode>
);
