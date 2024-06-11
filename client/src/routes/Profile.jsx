import "../styles/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../stores/profileSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { userInfo } = useSelector((store) => store.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");

    // Clear user info from Redux store
    dispatch(profileActions.LogoutState());

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="profileContainer">
      <div className="infoContainer">
        <div className="username">Hello! {userInfo?.name}</div>
        <div className="info">
          <div className="name">{userInfo?.name}</div>
          <div className="email">{userInfo?.userName}</div>
        </div>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
