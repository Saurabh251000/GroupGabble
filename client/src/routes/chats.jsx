/* eslint-disable */
import styles from "../styles/chat.module.css";
import { useState } from "react";
import Loading from "../components/Loading.jsx";
import MessageContainer from "../components/MessageContainer.jsx";
import UsersGroup from "../components/UsersGroup.jsx";
import useGetData from "../hooks/useGetData.js";
import Nochat from "../components/Nochat.jsx";
function Chat() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isGroup, setIsGroup] = useState(true);
  const [recieverID, setRecieverID] = useState(null);
  const { isLoading } = useGetData();

  const LOADING = (
    <>
      <Loading />
    </>
  );

  const content = (
    <>
      <div className={styles.chat}>
        <UsersGroup
          isGroup={isGroup}
          setIsGroup={setIsGroup}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          setRecieverID={setRecieverID}
        />
        {/* conversation container starts here -------- */}
        {(!selectedGroup && !selectedFriend) ? <Nochat /> : <MessageContainer
          isGroup={isGroup}
          selectedFriend={selectedFriend}
          selectedGroup={selectedGroup}
          recieverID={recieverID}
        />}

      </div>
    </>
  );

  return isLoading ? LOADING : content;
}

export default Chat;




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
































// const [socket, setSocket] = useState(null);
// const [message, setMessage] = useState("");
// const [messages, setMessages] = useState([]);
// const [isAddFriend, setIsAddFriend] = useState(false);
// const [selectedUser, setSelectedUser] = useState(null);
// const [recieverID, setRecieverID] = useState("");

// useEffect(() => {
//   if (!userInfo?.id) return;

//   const newSocket = io("http://localhost:3000", {
//     query: { userId: userInfo.id },
//     transports: ['websocket'] // Ensure WebSocket transport is used
//   });

//   newSocket.on("connect", () => {
//     console.log("Socket connected:", newSocket.id);
//     setSocket(newSocket);
//     setIsLoading(false);
//   });

//   newSocket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error);
//   });

//   newSocket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });

//   return () => {
//     newSocket.close();
//   };
// }, [userInfo?.id]);

// useEffect(() => {
//   if (!socket) return;

//   socket.on("receiveGroupMessage", (msg) => {
//     if (msg.groupid === selectedGroup?._id) {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     }
//   });

//   socket.on("receiveDirectMessage", (msg) => {
//     if (msg.senderid === selectedFriend?._id || msg.receiverid === selectedFriend?._id) {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     }
//   });

//   return () => {
//     socket.off("receiveGroupMessage");
//     socket.off("receiveDirectMessage");
//   };
// }, [socket, selectedGroup, selectedFriend]);

// const sendMessage = async () => {
//   if (!socket || !message.trim() || (!selectedGroup && !selectedFriend)) return;

//   const newMessage = {
//     text: message.trim(),
//     senderid: userInfo.id,
//     timestamp: new Date()
//   };

//   try {
//     if (isGroup) {
//       await fetch('http://localhost:3000/conversation/groupchat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           groupid: selectedGroup._id,
//           text: newMessage.text,
//           senderid: newMessage.senderid,
//         }),
//       });
//       socket.emit("sendMessageToGroup", {
//         roomId: selectedGroup._id,
//         message: newMessage.text,
//         senderId: newMessage.senderid
//       });
//     } else {
//       await fetch('http://localhost:3000/conversation/chats', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           receiverid: recieverID,
//           text: newMessage.text,
//           senderid: newMessage.senderid,
//         }),
//       });
//       socket.emit("sendMessageToUser", {
//         receiverId: recieverID,
//         message: newMessage.text,
//         senderId: newMessage.senderid
//       });
//     }

//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setMessage("");
//   } catch (error) {
//     console.error('Error sending message:', error);
//   }
// };
