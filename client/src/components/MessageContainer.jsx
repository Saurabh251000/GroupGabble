/* eslint-disable */
import { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import MessagesBox from "./MessagesBox";

function MessageContainer({ isGroup, selectedFriend, selectedGroup }) {
  const { userInfo } = useSelector((store) => store.profile);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // console.log(userInfo);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message.trim(),
        senderid: userInfo.userId,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      // const nMessage = {
      //   text: "safhhjgfsdj sdahjsaf sfdhkj jds",
      //   senderid: "Ravi001",
      //   timestamp: new Date(),
      // }
      // setMessages([...messages, nMessage]);

    }
  };

  return (
    <div className={styles.inputWrapper}>
      <div className={styles.SelectedRoom}>
        {(isGroup && selectedGroup) ? selectedGroup.gpname : (!isGroup && selectedFriend) ? selectedFriend : ""}
      </div>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <MessagesBox key={index} message={msg} userId={userInfo.userId} />
        ))}
      </div>
      <div className={styles.inpchat}>
        <textarea
          className={styles.messagebox}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button className={styles.sent} onClick={sendMessage}>
          Send <SendIcon className={styles.sendicon} />
        </button>
      </div>
    </div>
  );
}

export default MessageContainer;
