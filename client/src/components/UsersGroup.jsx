/* eslint-disable */
import styles from "../styles/chat.module.css";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { addRemoveFriend } from "../hooks/useActions";
import useGetData from "../hooks/useGetData";

function UsersGroup({ isGroup, setIsGroup, selectedGroup, setSelectedGroup, selectedFriend, setSelectedFriend }) {
  const { userInfo } = useSelector((store) => store.profile);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddFriend, setIsAddFriend] = useState(false);
  const navigate = useNavigate();
  const [recieverID, setRecieverID] = useState("");
  const { groupsData, friendList, usersList, error } = useGetData();

  if (error) return (<>{error}</>);
  // console.log("Selected Friend : ", selectedFriend);
  // console.log("Selected Group : ", selectedGroup);

  console.log(recieverID, "Reciever Id aa gya bhaiya");

  useEffect(() => {
    const fetchUserId = async () => {
      if (!selectedFriend) return;

      try {
        const response = await fetch(`http://localhost:3000/user/userid?username=${selectedFriend}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRecieverID(data);
      } catch (error) {
        console.error('Error fetching user_Id:', error);
      }
    };

    fetchUserId();
  }, [selectedFriend]);

  const handleOnClick = (room) => {
    setSelectedUser(null);
    // setMessages([]);
    if (isGroup) {
      setSelectedGroup(room);
      setSelectedFriend(null);
    } else {
      setSelectedFriend(room);
      setSelectedGroup(null);
    }
  };

  const handleGroupToggle = (type) => {
    setIsGroup(type === "Group");
    setIsAddFriend(false);
  };

  const handleUser = (user) => {
    setSelectedUser(user);
  };

  const handleAddFriend = () => {
    setIsAddFriend(true);
  };

  const handleCloseAddFriend = () => {
    setIsAddFriend(false);
  };

  const yourGroups = groupsData.filter(group => group.participants.includes(userInfo.userName));
  const nonFriends = usersList.filter(user => !friendList.includes(user.username));

  return (
    <div className={styles.groupname}>
      <div className={styles.partition}>
        <span
          className={`${styles.component} ${isGroup ? styles.Active : ""}`}
          onClick={() => handleGroupToggle("Group")}
        >
          Groups
        </span>
        <span
          className={`${styles.component} ${isGroup ? "" : styles.Active}`}
          onClick={() => handleGroupToggle("Friends")}
        >
          {isAddFriend ? "Add Friends" : "Friends"}
        </span>
      </div>
      {yourGroups.map(group => (
        <button
          key={group._id}
          className={`${styles.group} ${selectedGroup?._id === group._id ? styles.selected : ""} ${isGroup ? "" : styles.Hide}`}
          onClick={() => handleOnClick(group)}
        >
          {group.gpname}
        </button>
      ))}

      {friendList.map(friend => (
        <button
          key={friend}
          className={`${styles.group} ${selectedFriend === friend ? styles.selected : ""} ${isGroup ? styles.Hide : ""} ${isAddFriend ? styles.Hide : ""}`}
          onClick={() => handleOnClick(friend)}
        >
          {friend}
        </button>
      ))}

      {nonFriends.map(user => (
        <div
          key={user._id}
          className={`${styles.group} ${selectedUser === user.username ? styles.selected : ""} ${isAddFriend ? "" : styles.Hide}`}
          onClick={() => handleUser(user.username)}
        >
          {user.username}
          <button className={styles.Addfriend} onClick={(e) => { e.stopPropagation(); addRemoveFriend(userInfo.userName, user.username, "ADD", navigate) }}>
            <PersonAddIcon />
          </button>
        </div>
      ))}

      {friendList.map(friend => (
        <div
          key={friend}
          className={`${styles.group} ${selectedUser === friend ? styles.selected : ""} ${isGroup ? styles.Hide : ""} ${isAddFriend ? "" : styles.Hide}`}
          onClick={() => handleUser(friend)}
        >
          {friend}
          <button className={styles.Addfriend} onClick={(e) => { e.stopPropagation(); addRemoveFriend(userInfo.userName, friend, "REMOVE", navigate) }}>
            <PersonRemoveIcon />
          </button>
        </div>
      ))}

      <button
        className={`${styles.Add} ${isGroup ? "" : styles.Hide}`}
        onClick={() => navigate("/setting")}
      >
        ADD GROUPS
      </button>

      <button className={`${styles.Add} ${isGroup ? styles.Hide : ""} ${isAddFriend ? styles.Hide : ""}`} onClick={handleAddFriend}>
        ADD FRIENDS
      </button>

      <button className={`${styles.Add} ${isAddFriend ? "" : styles.Hide}`} onClick={handleCloseAddFriend}>
        CLOSE ADD FRIENDS
      </button>
    </div>
  );
}

export default UsersGroup;
