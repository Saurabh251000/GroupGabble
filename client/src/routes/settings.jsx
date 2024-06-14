/* eslint-disable */
import { useState, useEffect } from "react";
import "../styles/setting.css";
import { Form, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import GpCard from "../components/GpCard";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import { useFetchGroups, useFetchUsers } from "../hooks/useFetchData";

function Setting() {
  const navigate = useNavigate();
  const [usersData, setUsersData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useSelector((store) => store.profile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await useFetchUsers();
        const groups = await useFetchGroups();
        setUsersData(users);
        setGroupsData(groups);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const HandleOnsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    let participants = formData.getAll("participants[]");
    const existingUser = participants.find((user) => user === userInfo.userName);
    if (!existingUser) {
      participants.push(userInfo.userName);
    }
    const postData = {
      gpname: formData.get("gpname"),
      createdBy: userInfo.userName,
      participants: participants,
    };

    try {
      const response = await fetch("http://localhost:3000/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const newGroup = await response.json();
        setGroupsData([...groupsData, newGroup]);
        navigate("/chats");
      } else {
        alert("Failed to create group");
      }
    } catch (error) {
      alert(error);
    }
  };

  if (isLoading) return <Loading />;

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
              {usersData.map((user) => (
                <option value={user.username} key={user._id} className="List">
                  {user.username}
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
        {groupsData.map((group) => (
          <GpCard
            key={group.gpname}
            group={group}
            userInfo={userInfo}
            usersData={usersData}
            updateGroups={setGroupsData}
          />
        ))}
      </div>
    </>
  );
}

export default Setting;







/*
import "../styles/setting.css";
import { Form, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import GpCard from "../components/GpCard";
import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useFetchGroups, useFetchUserData } from "../hooks/useFetchData";


function Setting() {

  const navigate = useNavigate();
  // const { users } = useSelector((store) => store.users);
  // const { groups } = useSelector((store) => store.groups);
  const { usersData } = useFetchUserData();
  const { groupsData } = useFetchGroups();
  const { userInfo } = useSelector((store) => store.profile);

  // console.log("UsersData setting.jsx", usersData);
  console.log("groupsData setting.jsx", groupsData);

  // console.log(userInfo.userName);
  const HandleOnsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    // const postData = Object.fromEntries(formData);
    let participants = formData.getAll("participants[]"); // Get all selected participants
    const existingUser = participants.find((user) => user.username === userInfo.userName);
    if (!existingUser) {
      participants.push(userInfo.userName);
    }
    // console.log(participants);
    const postData = {
      gpname: formData.get("gpname"),
      createdBy: userInfo.userName,
      participants: participants,
    };
    // console.log("postData ------- : ", postData);
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
      alert(error);
    }
  };

  const isLoading = (
    <>
      <Loading />
    </>
  );
  const content = (
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
              {usersData.map((user) => (
                <option value={user.username} key={user._id} className="List">
                  {user.username}
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
        {
          groupsData.map((group) => (
            <GpCard value={group.gpname} key={group.gpname} group={group} />
          ))
        }
      </div>
    </>
  )

  if (usersData.length === 0 || groupsData.length == 0 || !userInfo) return isLoading;
  else return content;
}

export default Setting;

*/