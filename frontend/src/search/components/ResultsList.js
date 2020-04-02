import React from "react";
import "./ResultsList.css";
import ResultItem from "./ResultItem";

export default function ResultsList({ items }) {
  const placesExist = items && items.places && items.places.length;
  const usersExist = items && items.users && items.users.length;

  return (
    <div>
      {placesExist ? (
        <React.Fragment>
          <h4 className='search-headers'>PLACES</h4>
          {items.places.map(item => (
            <ResultItem key={item.id} item={item} place />
          ))}
        </React.Fragment>
      ) : (
        <p>No places found</p>
      )}

      {usersExist ? (
        <React.Fragment>
          <h4 className='search-headers'>USERS</h4>
          {items.users.map(item => (
            <ResultItem key={item.id} item={item} user />
          ))}
        </React.Fragment>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
