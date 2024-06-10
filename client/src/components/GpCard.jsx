/* eslint-disable */
import "../styles/GroupCard.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function GpCard({ group }) {
  const [Clicked, setClicked] = useState(false);

  const Users = useSelector((store) => store.user);
  const { email } = useSelector((store) => store.profile);
  const navigate = useNavigate();
  const isPart = group.participants.filter((username) => username === email);

  const [selectedUsers, setSelectedUsers] = useState([]);

  const HandleOnclick = () => {
    setClicked(!Clicked);
  };

  const HandleUserSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedUsers(selectedOptions);
  };

  const JoinOrExit = async (e) => {
    // console.log(e);
    let action;
    if (e.target.className.includes("Dltgp")) {
      action = "DELETE"; // Or any action identifier you prefer
    } else {
      action = isPart.length ? "EXIT" : "JOIN";
    }
    const postData = {
      email: email,
      action: action,
      gpname: group.gpname,
    };
    // console.log(action);
    // Post method to update user detail in group table
    try {
      const response = await fetch("http://localhost:3000/group/updategroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // console.log(response);
      const data = await response.json();
      if (response.ok) {
        // console.log(data);
        if (action === "JOIN") alert(data.msg);
        else if (action === "DELETE") alert(data.msg);
        else if (action === "EXIT") {
          if (Clicked) setClicked(!Clicked);
          alert(data.msg);
        } else alert("Invalid action");

        navigate("/setting");
        // console.log("Working ho ho ho");
      } else {
        if (action === "JOIN") alert("Failed to Join Group");
        else if (action === "DELETE") alert(data.msg);
        else if (action === "EXIT") alert("Failed Exit Group Successfully");
        else alert("Invalid action");
      }
    } catch (error) {
      alert(error);
    }
  };

  const AddRemove = async (e) => {
    let action;
    if (e.target.className.includes("Add")) {
      action = "ADD"; // Or any action identifier you prefer
    } else if (e.target.className.includes("Dlt")) {
      action = "REMOVE";
    } else alert("Invalid action");
    if (selectedUsers.length === 0) return alert("Select Users First");
    // console.log(selectedUsers);
    const postData = {
      gpname: group.gpname,
      action: action,
      users: selectedUsers,
    };

    try {
      const response = await fetch("http://localhost:3000/group/addremove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (action === "ADD") alert(data.msg);
      else if (action === "REMOVE") alert(data.msg);
      else alert("Invalid Action");
      navigate("/setting");
    } catch (error) {
      alert(error);
    }
  };

  /*   */
  return (
    <div className="List">
      <ul className="gpinfo">
        <li>{group.gpname}</li>
        <li>{group.createdBy}</li>
        <li>
          <button
            className={isPart.length === 0 ? "join btnn" : "exit btnn"}
            onClick={JoinOrExit}
          >
            {isPart.length === 0 ? (
              <>
                Join
                <PersonAddIcon />
              </>
            ) : (
              <>
                Exit
                <ExitToAppIcon />
              </>
            )}
          </button>
        </li>
      </ul>
      <div className={(Clicked ? "show" : "hide") + " " + "edit"}>
        <div className="users">
          <label htmlFor="users">Users:</label>
          <select
            name="userName"
            id="users"
            multiple="multiple"
            className="Select"
            onChange={HandleUserSelection}
          >
            {Users.map(
              (user) =>
                user.email &&
                user.email.length > 0 && (
                  <option value={user.email} key={user.email} className="List">
                    {user.email}
                  </option>
                )
            )}
          </select>
        </div>
        <button className="Add btnn" onClick={AddRemove}>
          Add Users <AddIcon />
        </button>
        <button className="Dlt btnn" onClick={AddRemove}>
          Remove Users <DeleteIcon />
        </button>
        <button className="Dltgp btnn" onClick={JoinOrExit}>
          Delete Group <DeleteIcon />
        </button>
      </div>
      <div className="arr" onClick={isPart.length === 0 ? null : HandleOnclick}>
        {Clicked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
    </div>
  );
}

export default GpCard;
