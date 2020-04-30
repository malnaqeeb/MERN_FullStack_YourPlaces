import React from "react";

import "./PlaceItem.css";
import { Container, Card } from "@material-ui/core";
const PlaceItemView = (props) => {
  const { name, image, title, address, description } = props.place;
  return (
    <Container>
      <Card className="place-item-comment">
        <div className="place-item__image">
          <img src={image.imageUrl} alt={name} />
        </div>
        <div className="place-item__info">
          <h2>{title}</h2>
          <h3>{address}</h3>
          <p>{description}</p>
        </div>
      </Card>
    </Container>
  );
};

export default PlaceItemView;
