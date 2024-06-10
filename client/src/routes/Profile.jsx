import "../styles/Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { profileActions } from "../stores/profileSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { name, email } = useSelector((store) => store.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleOnclick = () => {
    dispatch(profileActions.LoginState());
    dispatch(profileActions.Updateinfo({ name: "", email: "" }));
    navigate("/login");
  };
  return (
    <div className="profileContainer">
      <div className="infoContainer">
        <div className="username"> Hello! {name}</div>
        <div className="info">
          <div className="name">{name}</div>
          <div className="email">{email}</div>
        </div>

        <button className="logout" onClick={HandleOnclick}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
