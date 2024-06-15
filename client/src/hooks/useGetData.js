/* eslint-disable */
import { useEffect, useState } from "react";
import { useFetchGroups, useFetchFriends, useFetchUsers } from "../hooks/useFetchData";
import { useSelector } from "react-redux";

const useGetData = () => {
  const { userInfo } = useSelector((store) => store.profile);
  const [groupsData, setGroupsData] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    if (!userInfo?.userName) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const groups = await useFetchGroups();
        const users = await useFetchUsers();
        const friends = await useFetchFriends(userInfo?.userName);
        setGroupsData(groups);
        setFriendList(friends);
        setUsersList(users);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching groups, friends, or users:', error);
        setError(error);
      }
    };

    fetchData();
  }, [userInfo?.userName]);

  return { groupsData, friendList, usersList, isLoading, error };
}

export default useGetData;
