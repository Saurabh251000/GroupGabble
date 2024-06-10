/* eslint-disable */

import "../styles/setting.css";
import { Form, useNavigate, useLoaderData } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import GpCard from "../components/GpCard";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../stores/userSlice";
import { profileActions } from "../stores/profileSlice";
import { useState, useEffect } from "react";

function Setting() {
  const navigate = useNavigate();
  const groupsdata = useLoaderData();
  const dispatch = useDispatch();

  const [UsersData, setUsersData] = useState([]);

  const { email, fetchDone } = useSelector((store) => store.profile);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/users");
      const Users = await response.json();
      if (response.ok) {
        dispatch(profileActions.MarkFetchDone());
        dispatch(userActions.Updateinfo(Users));
        setUsersData(Users);
      } else {
        alert("Failed to Fetch User Data");
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (!fetchDone) {
      fetchUsers();
    }
  }, []);

  const HandleOnsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // const postData = Object.fromEntries(formData);
    let participants = formData.getAll("participants[]"); // Get all selected participants
    const existingUser = participants.find((user) => user.email === email);
    if (!existingUser) {
      participants.push(email);
    }
    // console.log(participants);
    const postData = {
      gpname: formData.get("gpname"),
      createdBy: email,
      participants: participants,
    };
    // console.log(postData);
    try {
      const response = await fetch("http://localhost:3000/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // console.log(response);
      if (response.ok) {
        navigate("/chats");
        // console.log("Working ho ho ho");
      } else {
        alert("Failed to create group");
      }
    } catch (error) {
      // console.error(error);
      // Handle error, show error message, etc.
      alert(error);
    }
  };

  return (
    <>
      <div className="setting">
        <button className="create-group-button">+ Create group</button>
        <Form method="POST" id="form" onSubmit={HandleOnsubmit}>
          <div className="gpname">
            <label htmlFor="gpname">Group Name: </label>
            <input
              type="text"
              name="gpname"
              placeholder="Enter the group name"
              id="gpname"
              required
            />
          </div>

          <div className="participants">
            <label htmlFor="participants">Participants:</label>
            <select
              name="participants[]"
              id="participants"
              multiple="multiple"
              required
            >
              {UsersData.map((user) => (
                <option value={user.email} key={user.email} className="List">
                  {user.email}
                </option>
              ))}
            </select>
          </div>

          <button className="Creategp" type="submit">
            Create group
          </button>
        </Form>
      </div>
      <div className="searchbox">
        <input className="Searchgp" placeholder="Search group" required></input>
        <SearchIcon className="searchIcon" />
      </div>

      <div className="groups">
        <span>Group Name</span>
        <span>Created-by</span>
        <span>Status</span>
      </div>
      <div className="gplist">
        {Array.isArray(groupsdata) &&
          groupsdata.map((group) => (
            // console.log(group)
            <GpCard key={group.gpname} group={group} />
          ))}
      </div>
    </>
  );
}

export default Setting;

export const FetchGroupData = async () => {
  const response = await fetch("http://localhost:3000/group/groups");
  const groupsdata = await response.json();
  // console.log(groupsdata);
  return groupsdata;
};
