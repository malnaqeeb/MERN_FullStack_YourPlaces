import React, { useEffect, useState, useContext, Fragment } from 'react';
import FriendList from '../FriendList';
import { AuthContext } from '../../shared/context/auth-context';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import FriendRequestList from '../FriendRequestList';

const Friends = () => {
  const auth = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [processedFriends, setProcessedFriends] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    const getFriends = async () => {
      try {
        const userData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user/friends`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          },
        );
        setFriends(userData.friends);
      } catch (error) { }
    };
    const getFriendRequests = async () => {
      try {
        const userData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user/friends/requests`,
          'GET',
          null,
          {
            Authorization: 'Bearer ' + auth.token,
          },
        );
        setFriendRequests(userData.friendRequests);
      } catch (error) { }
    };
    getFriends();
    getFriendRequests();
  }, [processedRequests,processedFriends,auth.token,sendRequest]);

  const processFriendRequest = userId => {
    setProcessedRequests(prevValue => [...prevValue, userId]);
     }
////////////////////////////////////////////////////////////////////////
  const processFriend = userId => {
    setProcessedFriends(prevValue => [...prevValue, userId]);
   }

  return (
    <Fragment>
      <div className="fade-in no-select">
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && friends && (
          <FriendList
            friends={friends}
            unfriendHandler={processFriend}
            auth={auth}
          />
        )}
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && friendRequests && (
          <FriendRequestList
            auth={auth}
            friendRequests={friendRequests}
            acceptFriendHandler={processFriendRequest}
            cancelFriendHandler={processFriendRequest}     
          />
        )}
        </div>
    </Fragment>
  );
};

export default Friends;
