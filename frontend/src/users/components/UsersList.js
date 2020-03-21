import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/component/UIElements/Card";
import "./UsersList.css";
const UsersList = ({ items, userData, auth, sendFriendRequestHandler }) => {
  if (items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className='users-list'>
      {items.map(user => (
        <UserItem
          user={user}
          auth={auth}
          userData={userData}
          sendFriendRequestHandler={sendFriendRequestHandler}
          key={user.id}
        />
      ))}
    </ul>
  );
};

export default UsersList;
