import React from 'react';
import { FriendItem, ReceivedFriendRequestItem } from './FriendItem';
import Card from '../shared/component/UIElements/Card';

const FriendList = ({
  auth,
  receivedFriend,
  friends,
  acceptFriendHandler,
  cancelFriendHandler,
}) => {
  return (
    <ul className="users-list">
      {!friends.length && 
        <div className="center">
          <Card>
            <h2>No friend found.</h2>
          </Card>
        </div>
      }
      {friends.map(friend => (
        <FriendItem user={friend} key={friend.id} />
      ))}
      {receivedFriend.map(reqPack => (
        <ReceivedFriendRequestItem
          user={reqPack.user}
          auth={auth}
          acceptFriendHandler={acceptFriendHandler}
          cancelFriendHandler={cancelFriendHandler}
          key={reqPack._id}
          requestId={reqPack._id}
        />
      ))}
    </ul>
  );
};

export default FriendList;
