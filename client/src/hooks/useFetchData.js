
const useFetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    throw error; // Re-throw the error after logging it
  }
};

export const useFetchUsers = async () => {
  return await useFetchData('https://group-gabble-server.vercel.app/user/users');
};

export const useFetchGroups = async () => {
  return await useFetchData('https://group-gabble-server.vercel.app/group/groups');
};

export const useFetchFriends = async (username) => {
  return await useFetchData(`https://group-gabble-server.vercel.app/user/friends?username=${username}`);
};




// const groupsData = useFetchData('http://localhost:3000/group/groups');

// console.log(groupsData);
// return groupsData;
// , groupActions.YourGroups

// return useFetchData(`http://localhost:3000/user/friends?username=${username}`, !!username);
// return data;
// , friendsActions.SetData



// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { userActions } from '../stores/userSlice';
// import { groupActions } from '../stores/groupSlice';
// import { friendsActions } from '../stores/friendsSlice';

// const useFetchData = (url, condition = true) => {
// const dispatch = useDispatch();

//   useEffect(() => {
//     if (!condition) return;

//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         // dispatch(action(data));
//         console.log("data", data);
//         return data;
//       } catch (error) {
//         console.error(`Failed to fetch data from ${url}:`, error);
//       }
//     };

//     fetchData();
//   }, [url, condition]);
// };
