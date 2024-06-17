/* eslint-disable */
import { useEffect, useState } from "react";

const useGetGroupMessages = (groupId) => {
  const [GpMessages, setGpMessages] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    const postData = {
      groupid: groupId,
    }

    const fetchData = async () => {
      try {
        const response = await fetch('https://group-gabble-server.vercel.app/conversation/gpmessages', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData)
        });

        const data = await response.json();
        if (response.ok) {
          setGpMessages(data);
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

  }, [groupId]);

  return { GpMessages, loading, error };

}

export default useGetGroupMessages;
