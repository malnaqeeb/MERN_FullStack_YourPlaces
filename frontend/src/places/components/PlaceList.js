import React, { useContext } from "react";
import "./PlaceList.css";
import Card from "../../shared/component/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/component/formElements/Button";
import { AuthContext } from "../../shared/context/auth-context";


const PlaceList = ({ items, onDeletePlace, userId }) => {
  const auth = useContext(AuthContext);
  if (items.length === 0) {
    console.log(userId, auth.userId)
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. {auth.userId === userId && ` Maybe create one?`}</h2>
          {auth.userId === userId && <Button to="/places/new">Share place</Button>}
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {items.map((place) => (
        <PlaceItem key={place.id} place={place} onDeletePlace={onDeletePlace} />
      ))}
    </ul>
  );
};

export default PlaceList;
