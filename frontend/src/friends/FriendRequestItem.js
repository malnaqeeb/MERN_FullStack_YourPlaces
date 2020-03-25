import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/component/UIElements/Avatar';
import Card from '../shared/component/UIElements/Card';
import useHttpClient from '../shared/hooks/http-hook';
import ErrorModal from '../shared/component/UIElements/ErrorModal';
import Button from '@material-ui/core/Button'

const ReceivedFriendRequestItem = ({
  request: { _id: requestId, user: { id: userId, name, image } },
  auth,
  acceptFriendHandler,
  cancelFriendHandler,
}) => {
  const {  error, sendRequest, clearError } = useHttpClient();
  const acceptFriendRequest = async userID => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/friends/requests/${requestId}`,
        'PUT',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      acceptFriendHandler(userID);
    } catch (error) { }
  };
  const cancelFriendRequest = async userID => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/friends/requests/${requestId}`,
        'DELETE',
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
        </Card>
          <Button variant="contained" color="primary" onClick={() => acceptFriendRequest(userId)}>
            <i className="fas fa-check-circle"></i>Accept
          </Button>{' '}
          <Button variant="contained" color="secondary" onClick={() => cancelFriendRequest(userId)}>
            <i className="fas fa-window-close"></i>Cancel
          </Button>
      </li>
    </>
  );
};

export default ReceivedFriendRequestItem;
