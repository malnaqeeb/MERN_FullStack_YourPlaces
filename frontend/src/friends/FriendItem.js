import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/component/UIElements/Avatar';
import Card from '../shared/component/UIElements/Card';
import useHttpClient from '../shared/hooks/http-hook';
import ErrorModal from '../shared/component/UIElements/ErrorModal';

const FriendItem = (props) => {
  const { userId, name, image } = props.user;
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${userId}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
          </div>
        </Link>
      </Card>
    </li>
  );
};

const ReceivedFriendRequestItem = (props) => {
  const { userId, name, image } = props.user;
  const { requestId, auth, acceptFriendHandler, cancelFriendHandler} = props;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const acceptFriendRequest = async userID => {
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/requests/${requestId}/accept`,
        'GET',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      acceptFriendHandler(userID);
    } catch (error) {}
  };
  const cancelFriendRequest = async userID => {
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/friends/requests/${requestId}/cancel`,
        'GET',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      cancelFriendHandler(userID);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <li className="user-item">
        <Card className="user-item__content">
          <Link to={`/${userId}/places`}>
            <div className="user-item__image">
              <Avatar image={image} alt={name} />
            </div>
            <div className="user-item__info">
              <h2>{name}</h2>
            </div>
          </Link>
          <button className="btn btn-success" onClick={() => acceptFriendRequest(userId)}>
            <i className="fas fa-check-circle"></i>Accept
          </button>{' '}
          <button className="btn btn-success" onClick={() => cancelFriendRequest(userId)}>
            <i className="fas fa-window-close"></i>Cancel
          </button>
        </Card>
      </li>
    </>
  );
};

export { FriendItem, ReceivedFriendRequestItem };
