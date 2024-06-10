import "../styles/home.css";
import { Link } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";
import Typed from "typed.js";
import { useEffect } from "react";

function Home() {
  // Changed 'home' to 'Home'
  useEffect(() => {
    const Chats = [
      "Live chat with your friends",
      "Gossip with your best friends",
      "Talk with your teammates",
    ];
    const options = {
      strings: Chats,
      typeSpeed: 25,
      backSpeed: null,
      loop: true,
      loopCount: Infinity,
      showCursor: true,
      cursorChar: "|",
    };
    const typedSubtitle = new Typed("#subtitle", options);

    return () => {
      typedSubtitle.destroy();
    };
  }, []);

  return (
    <>
      <div className="home">
        <h1>Welcome to live-chat</h1>
        <h2 id="subtitle"></h2>
        <Link to="/chats">
          <button className="startBtn">
            Get Started <EastIcon className="arrow" />
          </button>
        </Link>
      </div>
    </>
  );
}

export default Home; // Changed 'home' to 'Home'
