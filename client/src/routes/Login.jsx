import { Link, Form, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useDispatch } from "react-redux";
import { profileActions } from "../stores/profileSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const postData = Object.fromEntries(formData);
    // console.log(postData);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      console.log(response);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.Status === "Success") {
          dispatch(profileActions.LoginState());
          dispatch(profileActions.Updateinfo(responseData));
          navigate("/chats");
        } else {
          alert("Incorrect password or username"); // Inform user about incorrect credentials
        }
      } else {
        alert("Failed to log in. Please try again later."); // Handle other errors
      }
    } catch (error) {
      // console.error(error);
      // Handle error, show error message, etc.
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
