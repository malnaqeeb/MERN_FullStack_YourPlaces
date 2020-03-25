import React from 'react';
import FriendItem from './FriendItem';
import Card from '../shared/component/UIElements/Card';

const FriendList = ({
  friends,
}) => {
  if (friends.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No friend found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {friends.map(user => (
        <FriendItem user={user} key={user.id} />
      ))}
    </ul>
  );
};

export default FriendList;
