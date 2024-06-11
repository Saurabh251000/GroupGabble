
/* eslint-disable */
import { Link, Form, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useDispatch } from "react-redux";
import { profileActions } from "../stores/profileSlice";
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postData = Object.fromEntries(formData);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        const { accessToken } = data;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);

          // Decode the token to get user information
          const decodedToken = jwtDecode(accessToken);
          const userInfo = {
            userId: decodedToken.UserInfo.userid,
            userName: decodedToken.UserInfo.userName,
            name: decodedToken.UserInfo.name,
          };

          // Dispatch actions to update login state and user info
          dispatch(profileActions.LoginState());
          dispatch(profileActions.Updateinfo(userInfo));

          navigate("/chats");
        }
      } else {
        alert(data.error || "Incorrect password or username");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="loginContainer">
      <Form method="POST" onSubmit={handleSubmit} className="inputContainer">
        <div className="Title">Log in to your Account</div>
        <div className="LabelC">
          <label htmlFor="username" className="Label">
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Email address"
            required
          />
        </div>
        <div className="LabelC">
          <label htmlFor="password" className="Label">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="submitbtn">
          Continue
        </button>
        <div className="nothave">
          {" "}
          Don&#39;t have an account?{" "}
          <Link to="/signup" className="signupL">
            {" "}
            Sign Up
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
