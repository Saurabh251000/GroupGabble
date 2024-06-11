/* eslint-disable */
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./styles/index.css";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import Chat from "./routes/chats.jsx";
import Setting, { FetchGroupData } from "./routes/settings.jsx";
import Home from "./routes/home.jsx";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/SignUp.jsx";
import { Provider, useSelector, useDispatch } from "react-redux";
import chatStore from "./stores/index.js";
import Profile from "./routes/Profile.jsx";
import { profileActions } from "./stores/profileSlice";
import { jwtDecode } from "jwt-decode";

const AuthRoute = ({ element }) => {
  const { islogin } = useSelector((store) => store.profile);
  return islogin ? element : <Login />;
};

const checkToken = async (dispatch, navigate) => {
  let token = localStorage.getItem("accessToken");
  if (!token) {
    navigate("/login");
    return;
  }

  // Check if token is expired and refresh if necessary
  const isTokenExpired = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return now >= expiry;
  };

  if (isTokenExpired(token)) {
    try {
      const response = await fetch("http://localhost:3000/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        token = data.accessToken;
        localStorage.setItem("accessToken", token);
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
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
};

const AppWithAuthCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    checkToken(dispatch, navigate);
  }, [dispatch, navigate]);

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
        loader: FetchGroupData,
      },
      {
        path: "/setting",
        element: <AuthRoute element={<Setting />} />,
        loader: FetchGroupData,
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
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
