import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared/component/UIElements/Avatar";
import Card from "../../shared/component/UIElements/Card";
import "./UserItem.css";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";

const UserItem = ({ user, userData, auth, sendFriendRequestHandler }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { id, image, name, places } = user;
  const Button = () => {
    const isFriend = userData.friends.filter(friend => friend.id === id);
    const isReceived = userData.friendRequests.filter(req => req.user.id === id && !req.isSent);
    const isSent = userData.friendRequests.filter(sendReq => sendReq.user.id === id && sendReq.isSent);
    const sendFriendRequest = async () => {
      try {
        const user = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/friends`,
          'POST',
          JSON.stringify({friendId: id}),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-type': 'application/json'
          },
        );
        sendFriendRequestHandler(id);
      } catch (error) {}
    };

    if (auth.isLoggedIn) {
      if (isFriend.length > 0) {
        return (
          <p className="text-primary my-1">
            <i className="fas fa-user-friends"></i>
          </p>
        );
      }

      if (isReceived.length > 0) {
        return (
          <p className="text-primary my-1">
            <i className="fab fa-get-pocket"></i>
          </p>
        );
      }

      if (isSent.length > 0) {
        return (
          <p className="text-primary my-1">
            {' '}
            <i className="fas fa-clock"></i>
          </p>
        );
      }

      if (id === userData.userId) {
        return <></>;
      }

      return (
        <button className="btn btn-success" onClick={() => sendFriendRequest(id)}>
          <i className="fas fa-user-plus"></i>Add
        </button>
      );
    }
    return <></>;
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <li className="user-item">
        <Card className="user-item__content">
          <Link to={`/${id}/places`}>
            <div className="user-item__image">
              <Avatar image={image} alt={name} />
            </div>
            <div className="user-item__info">
              <h2>{name}</h2>
              <h3>
                {places.length} {places.length === 1 ? 'Place' : 'Places'}
              </h3>
            </div>
          </Link>
          {!isLoading && userData && <Button />}
        </Card>
      </li>
    </>
  );
};

export default UserItem;
