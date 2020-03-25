import React from 'react';
import FriendRequestItem from './FriendRequestItem';
import Card from '../shared/component/UIElements/Card';

const FriendRequestList = ({
  auth,
  friendRequests,
  acceptFriendHandler,
  cancelFriendHandler
}) => {
  if (friendRequests.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No friend requests found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {friendRequests.map(request => (
        <FriendRequestItem
          auth={auth}
          request={request}
          key={request.id}
          acceptFriendHandler={acceptFriendHandler}
          cancelFriendHandler={cancelFriendHandler}
        />
      ))}
    </ul>
  );
};

export default FriendRequestList;
