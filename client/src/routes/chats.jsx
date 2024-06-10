/* eslint-disable */
// import "./chat.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import styles from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function chat() {
  const groupsdata = useLoaderData();
  const { email } = useSelector((store) => store.profile);
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
      sender: email,
      message: message.trim(),
    });

    setMessage("");
  };

  let yourGroups = [];
  groupsdata.forEach((group) => {
    const isexist = group.participants.find((user) => user === email);
    if (isexist) {
      yourGroups.push(group.gpname);
    }
  });
  // console.log(yourGroups);

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
        {yourGroups.map((group) => (
          <button
            key={group}
            className={`${styles.group} ${
              selectedGroup === group ? styles.selected : ""
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
          {messages.map((msg, index) => (
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
