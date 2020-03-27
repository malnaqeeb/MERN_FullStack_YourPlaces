import React from 'react';
import UserItem from './UserItem';
import Card from '../../shared/component/UIElements/Card';
import './UsersList.css';
import './UserItem.css';
import Avatar from '../../shared/component/UIElements/Avatar';


const UsersList = ({ items, userData, auth, sendFriendRequestHandler }) => {

  if (items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <React.Fragment>
           {items.filter(authUser => authUser._id === auth.userId).map(user => (
        <div className="user-item">
          <div className="user-item__image">
            <Avatar image={user.image} alt={user.name} />
          </div>
          <div className="user-item__info">
            <h2>{user.name}</h2>
          </div>

        </div>
      ))}
      <ul className="users-list">
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
