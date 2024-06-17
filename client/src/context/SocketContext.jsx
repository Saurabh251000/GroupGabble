/* eslint-disable */
import { useSelector } from "react-redux";
import { createContext, useState, useEffect, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const { userInfo } = useSelector((store) => store.profile);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (userInfo) {
      const socket = io('https://group-gabble-server.vercel.app', {
        query: {
          userId: userInfo.userId,
        },
        withCredentials: true,
      });

      setSocket(socket);
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
