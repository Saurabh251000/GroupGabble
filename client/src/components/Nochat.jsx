import { useSelector } from "react-redux";
import styles from "../styles/chat.module.css";

function Nochat() {
  const { userInfo } = useSelector((store) => store.profile);

  return (
    <div className={styles.NochatC}>
      <div className={styles.NochatSC}>
        <p className={styles.NTitle}>Welcome 👋 {userInfo?.name}🌟</p>
        <p className={styles.NText}> Select a chat to start messaging...</p>
      </div>
    </div>
  )
}

export default Nochat