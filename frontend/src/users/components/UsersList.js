import React from "react";
import { Link } from 'react-router-dom';
import UserItem from "./UserItem";
import Card from "../../shared/component/UIElements/Card";
import "./UsersList.css";
import "./UserItem.css";

const UsersList = ({ items, userData, auth, sendFriendRequestHandler }) => {
  if (items.length === 0) {
    return (
      <div className="center fade-in">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <React.Fragment>
           {items.filter(authUser => authUser._id === auth.userId).map(user => (
        <div className="profile-banner fade-in">
            <img src={user.image} alt={user.name} />
            <Link to={`/${auth.userId}/my`} ><span>{user.name}</span></Link>
        </div>
      ))}
      <ul className="users-list users-mobile">
        {
          items
          .filter(notAuth => notAuth._id !== auth.userId)
          .map(user => (
            <UserItem
              user={user}
              auth={auth}
              userData={userData}
              sendFriendRequestHandler={sendFriendRequestHandler}
              key={user.id}
            />
          ))
        }
      </ul>
    </React.Fragment>
  );
};

export default UsersList;
