/* eslint-disable */
// import "./chat.css";
/*
import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useFetchGroups } from "../hooks/useFetchData";

function chat() {
  const groupsData = useFetchGroups();
  const { userInfo } = useSelector((store) => store.profile);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isGroup, setisGroup] = useState(true);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("message", (msg) => {
      // console.log(msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => {
      socket.off("message");
    };
  }, [socket]);

  // console.log(message);
  // console.log("Ab messeges aayenge");
  // console.log(messages);

  const sendMessage = () => {
    if (!socket || !message.trim() || !selectedGroup) return;

    socket.emit("message", {
      group: selectedGroup,
      sender: userInfo.id,
      message: message.trim(),
    });

    setMessage("");
  };

  let yourGroups = [];
  groupsData.forEach((group) => {
    const isexist = group.participants.find((user) => user === userInfo.userName);
    if (isexist) {
      yourGroups.push(group.gpname);
    }
  });
  console.log(yourGroups);

  const HandleOnclick = (group) => {
    setSelectedGroup(group);
    setMessages([]);
    // console.log(group);
  };
  const HandleGroup = (data) => {
    if (data !== "Group") setisGroup(false);
    else setisGroup(true);
  };

  return (
    <div className={styles.chat}>
      <div className={styles.groupname}>
        <div className={styles.partition}>
          <span
            className={`${styles.component} ${isGroup ? styles.Active : ""}`}
            onClick={() => HandleGroup("Group")}
          >
            Groups
          </span>
          <span
            className={`${styles.component} ${isGroup ? "" : styles.Active}`}
            onClick={() => HandleGroup("Friends")}
          >
            Friends
          </span>
        </div>
        {userInfo.grouplist.map((group) => (
          <button
            key={group}
            className={`${styles.group} ${selectedGroup === group ? styles.selected : ""
              } ${isGroup ? "" : styles.Hide}`}
            onClick={() => HandleOnclick(group)}
          >
            {group}
          </button>
        ))}

        <button
          className={`${styles.Add} ${isGroup ? "" : styles.Hide} `}
          onClick={() => navigate("/setting")}
        >
          ADD GROUPS
        </button>

        <button className={`${styles.Add} ${isGroup ? styles.Hide : ""}`}>
          ADD FRIENDS
        </button>
      </div>
      <div className={styles.inputWrapper}>
        <div className={styles.messages}>
          {messages && messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              <span className={styles.sender}>{msg.sender}:</span>
              <span>{msg.message}</span>
            </div>
          ))}
        </div>
        <div className={styles.inpchat}>
          <textarea
            className={styles.messeagebox}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button className={styles.sent} onClick={sendMessage}>
            Send <SendIcon className={styles.sendicon} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default chat;
*/

/* eslint-disable */
import { useNavigate } from "react-router-dom";
import styles from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useFetchGroups, useFetchFriends, useFetchUsers } from "../hooks/useFetchData";
import { addRemoveFriend } from "../hooks/useActions";
import Loading from "../components/Loading.jsx"

function Chat() {
  const { userInfo } = useSelector((store) => store.profile);
  const [groupsData, setGroupsData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [recieverID, setRecieverID] = useState("");
  const [isGroup, setIsGroup] = useState(true);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isAddFriend, setIsAddFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groups = await useFetchGroups();
        const users = await useFetchUsers();
        const friends = await useFetchFriends(userInfo?.userName);
        setGroupsData(groups);
        setFriendList(friends);
        setUsersList(users);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching groups, friends, or users:', error);
      }
    };

    fetchData();
  }, [userInfo?.userName]);

  useEffect(() => {
    const fetchUserId = async () => {
      if (!selectedFriend) return;

      try {
        const response = await fetch(`http://localhost:3000/user/userid?username=${selectedFriend}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data);
        setReceiverId(data);
      } catch (error) {
        console.error('Error fetching user_Id:', error);
      }
    };

    fetchUserId();
  }, [selectedFriend]);

  useEffect(() => {
    if (!userInfo?.id) return;
    const newSocket = io("http://localhost:3000", {
      query: { userId: userInfo.id }
    });
    setSocket(newSocket);
    setIsLoading(false);

    return () => newSocket.close();
  }, [userInfo.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveGroupMessage", (msg) => {
      if (msg.groupid === selectedGroup?._id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    socket.on("receiveDirectMessage", (msg) => {
      if (msg.senderid === selectedFriend?._id || msg.receiverid === selectedFriend?._id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
    });

    return () => {
      socket.off("receiveGroupMessage");
      socket.off("receiveDirectMessage");
    };
  }, [socket, selectedGroup, selectedFriend]);

  const sendMessage = () => {
    if (!socket || !message.trim() || (!selectedGroup && !selectedFriend)) return;

    const newMessage = {
      text: message.trim(),
      senderid: userInfo.id,
      timestamp: new Date()
    };

    if (isGroup) {
      socket.emit("sendMessageToGroup", {
        roomId: selectedGroup._id,
        message: newMessage.text,
        senderId: newMessage.senderid
      });
    } else {
      socket.emit("sendMessageToUser", {
        receiverId: recieverID,
        message: newMessage.text,
        senderId: newMessage.senderid
      });
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  const yourGroups = groupsData.filter(group => group.participants.includes(userInfo.userName));
  const nonFriends = usersList.filter(user => !friendList.includes(user.username));

  const handleOnClick = (room) => {
    // if (!socket) return; // Ensure socket is defined before using it
    setMessages([]);
    if (isGroup) {
      setSelectedGroup(room);
      setSelectedFriend(null);
      socket.emit("joinRoom", { roomId: room._id });
    } else {
      setSelectedFriend(room);
      setSelectedGroup(null);
      // Private rooms can be identified by a unique combination of the user IDs
      const privateRoomId = [userInfo.id, recieverID].sort().join('-');
      socket.emit("joinRoom", { roomId: privateRoomId });
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

  const LOADING = (
    <>
      <Loading />
    </>
  );

  const content = (
    <>
      <div className={styles.chat}>
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
              <button className={styles.Addfriend} onClick={() => addRemoveFriend(userInfo.userName, user.username, "ADD", navigate)}>
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
              <button className={styles.Addfriend} onClick={() => addRemoveFriend(userInfo.userName, friend, "REMOVE", navigate)}>
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
        <div className={styles.inputWrapper}>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div key={index} className={styles.message}>
                <span className={styles.sender}>{msg.senderid}:</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className={styles.inpchat}>
            <textarea
              className={styles.messeagebox}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
            />
            <button className={styles.sent} onClick={sendMessage}>
              Send <SendIcon className={styles.sendicon} />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) return LOADING;
  else return content;
}

export default Chat;
