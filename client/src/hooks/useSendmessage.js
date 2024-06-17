/* eslint-disable */

import { useEffect, useState } from "react";

const useSendmessage = (message) => {
  // const [GpMessages, setGpMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sendMessage = async (message) => {
    try {
      const postData = {
        message,
      }
      const response = await fetch('http://localhost:3000/conversation/chats', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData)
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Message sent");
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
  return { sendMessage, isLoading, error };

}

export default useSendmessage;