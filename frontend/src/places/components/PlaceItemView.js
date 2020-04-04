import React from "react";

import "./PlaceItem.css";
import Card from "../../shared/component/UIElements/Card";

const PlaceItemView = (props) => {
  const { name, image, title, address, description } = props.place;
  return (
    <div className="place-item">
      <Card className="place-item__content detailed-view">
        <div className="place-item__image">
          <img src={image.imageUrl} alt={name} />
        </div>
        <div className="place-item__info">
          <h2>{title}</h2>
          <h3>{address}</h3>
          <p>{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default PlaceItemView;
