/* eslint-disable */
import styles from "../styles/chat.module.css";
function MessagesBox({ message, userId }) {


  if (userId === message.senderid) {
    return (
      <div className={styles.message}>
        <div className={styles.mymessage}>
          {message.text}
        </div>
      </div>

    )
  }
  else {
    return (
      <div className={styles.response}>
        <div className={styles.usermessage}>
          <span className={styles.sender}>{message.senderid}:</span> {message.text}
        </div>
      </div>
    )
  }
}

export default MessagesBox;