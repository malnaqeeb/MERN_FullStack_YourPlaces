import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../shared/component/UIElements/Avatar";
import Card from "../shared/component/UIElements/Card";
import useHttpClient from "../shared/hooks/http-hook";
import Button from "@material-ui/core/Button";
import "../users/components/UserItem.css";
const FriendItem = ({ user: { id, name, image }, auth, unfriendHandler }) => {
  const { error, sendRequest, clearError } = useHttpClient();
  const unfriend = async (userID) => {
    console.log(auth.token);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/friends/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      unfriendHandler(userID);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link className="user-holder" to={`/${id}/places`}>
          <div className="user-item__image">
            <Avatar image={image} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>{name}</h2>
          </div>
        </Link>
      </Card>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => unfriend(id)}
      >
        <i className="fas fa-window-close"></i>unfriend
      </Button>
    </li>
  );
};

export default FriendItem;
