
export const addRemoveFriend = async (username, friend, action, navigate) => {

  const postData = {
    username,
    friend,
    action
  };

  try {
    const response = await fetch("http://localhost:3000/user/friendaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.msg);
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
    navigate("/setting");
  } catch (error) {
    console.log(`Error in adding user to your friend list: ${error}`);
  }
};
