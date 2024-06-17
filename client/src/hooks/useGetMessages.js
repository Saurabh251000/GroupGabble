/* eslint-disable */
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const useGetMessages = (recieverID) => {
  const [Messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useSelector((store) => store.profile);

  useEffect(() => {
    if (!userInfo?.userName || !recieverID) {
      setIsLoading(false);
      return;
    }

    const postData = {
      senderid: userInfo.userId,
      receiverid: recieverID
    }

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/conversation/chatmessages', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData)
        });
        const data = await response.json();
        if (response.ok) {
          setMessages(data);
        } else {
          console.log(data.error);
          setError(data.error);
        }
      } catch (error) {
        console.log(`Internal Server Error:  ${error}`);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

  }, [recieverID, userInfo?.userName]);

  return { Messages, isLoading, error };

}

export default useGetMessages;