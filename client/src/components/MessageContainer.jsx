/* eslint-disable */
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import MessagesBox from "./MessagesBox";
import useGetGroupMessages from "../hooks/useGetGroupMessages.js";
import useGetMessages from "../hooks/useGetMessages.js";
import useSendmessage from "../hooks/useSendmessage.js";
import useSendGroupMessage from "../hooks/useSendGroupMessage.js";
import Loading from "./Loading.jsx";
import { useSocketContext } from "../context/SocketContext";

function MessageContainer({ isGroup, selectedFriend, selectedGroup, recieverID }) {
  const { userInfo } = useSelector((store) => store.profile);
  const { GpMessages, loading } = useGetGroupMessages(selectedGroup?._id);
  const { Messages, isLoading } = useGetMessages(recieverID);
  const { sendGpMessage } = useSendGroupMessage();
  const { sendMessage } = useSendmessage();
  const { socket } = useSocketContext();

  const [message, setMessage] = useState("");
  const [groupMessages, setGroupMessages] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages, directMessages]);

  useEffect(() => {
    if (GpMessages?.messages) {
      setGroupMessages(GpMessages.messages);
    }
  }, [GpMessages]);

  useEffect(() => {
    if (Messages?.messages) {
      setDirectMessages(Messages.messages);
    }
  }, [Messages]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (newMessage) => {
        if (isGroup && newMessage.groupid === selectedGroup?._id) {
          setGroupMessages((prevMessages) => [...prevMessages, newMessage]);
        } else if (!isGroup && newMessage.senderid === recieverID) {
          setDirectMessages((prevMessages) => [...prevMessages, newMessage]);
        }
        scrollToBottom();
      };

      socket.on("receiveMessage", handleMessage);

      return () => {
        socket.off("receiveMessage", handleMessage);
      };
    }
  }, [socket, isGroup, selectedGroup?._id, recieverID]);

  const OnsendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message.trim(),
        senderid: userInfo.userId,
        timestamp: new Date(),
      };
      if (isGroup) {
        newMessage.groupid = selectedGroup._id;
        sendGpMessage(newMessage);
        setGroupMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        newMessage.receiverid = recieverID;
        sendMessage(newMessage);
        setDirectMessages((prevMessages) => [...prevMessages, newMessage]);
      }
      setMessage("");
      socket.emit("sendMessage", newMessage);
    }
  };

  const content = (
    <>
      <div className={styles.inputWrapper}>
        <div className={styles.SelectedRoom}>
          {(isGroup && selectedGroup) ? selectedGroup.gpname : (!isGroup && selectedFriend) ? selectedFriend : ""}
        </div>
        <div className={styles.messages}>
          {isGroup && (groupMessages.length ? groupMessages.map((msg, index) => (
            <MessagesBox key={index} message={msg} userId={userInfo.userId} />
          )) : " Say Hello 👋")}
          {!isGroup && (directMessages.length ? directMessages.map((msg, index) => (
            <MessagesBox key={index} message={msg} userId={userInfo.userId} />
          )) : " Say Hello 👋")}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inpchat}>
          <textarea
            className={styles.messagebox}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here"
          />
          <button className={styles.sent} onClick={OnsendMessage}>
            Send <SendIcon className={styles.sendicon} />
          </button>
        </div>
      </div>
    </>
  );

  if (loading || isLoading) return <Loading />;
  else return content;
}

export default MessageContainer;
