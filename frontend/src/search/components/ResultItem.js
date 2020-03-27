import React from "react";
import { Link } from "react-router-dom";
import "./ResultItem.css";

export default function ResultItem(props) {
  return (
    <div>
      {props.place && (
        <div>
          <Link to={`/places/${props.item._id}`}>
            <p className='search-result__name'>{props.item.title}</p>
          </Link>
        </div>
      )}
      {props.user && (
        <div>
          <Link to={`/${props.item._id}/places`}>
            <p className='search-result__name'>{props.item.name}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
