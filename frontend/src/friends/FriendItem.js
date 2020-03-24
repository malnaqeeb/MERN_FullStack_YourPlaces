import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../shared/component/UIElements/Avatar';
import Card from '../shared/component/UIElements/Card';

const FriendItem = ({ user: { id, name, image } }) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`}>
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

export default FriendItem;
