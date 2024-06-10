import "../styles/navbar.css";
import icon from "../stores/image.png";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const { islogin } = useSelector((store) => store.profile);
  return (
    <>
      <div className="row">
        <NavLink to="/">
          <img
            src={icon}
            alt="logo"
            style={{ width: "80px", marginLeft: "20px", marginTop: "10px" }}
          />
        </NavLink>
        <ul id="nav">
          <NavLink to="/chats" className="nav">
            <li>Chats</li>
          </NavLink>
          <NavLink to="/setting" className="nav">
            <li>Group Setting</li>
          </NavLink>
          <NavLink to={islogin ? "/profile" : "/login"} className="nav">
            <li>{islogin ? "Profile" : "Login"}</li>
          </NavLink>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
