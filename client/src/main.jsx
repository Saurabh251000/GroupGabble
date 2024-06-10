/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./routes/App.jsx";
import "./styles/index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chat from "./routes/chats.jsx";
import Setting, { FetchGroupData } from "./routes/settings.jsx";
import Home from "./routes/home.jsx";
import Login from "./routes/Login.jsx";
import SignUp from "./routes/SignUp.jsx";
import { Provider, useSelector } from "react-redux";
import chatStore from "./stores/index.js";
import Profile from "./routes/Profile.jsx";

// Custom route component to conditionally render routes based on authentication state , { FetchGroupData }
const AuthRoute = ({ path, element }) => {
  const { islogin } = useSelector((store) => store.profile);
  return islogin ? element : <Login />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chats",
        element: <AuthRoute element={<Chat />} />, // Use AuthRoute for protected routes
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
  <>
    <React.StrictMode>
      <Provider store={chatStore}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  </>
);
