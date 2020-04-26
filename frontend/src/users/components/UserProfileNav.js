import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserProfileNav.css";

const UserProfileNav = ({ setDrawerOpen }) => {
  const { userId } = useContext(AuthContext);
  return (
    <Fragment>
      <div className="dropdown-content">
        <Link className="navLink" to={`/${userId}/bucketlist`}>
          <span onClick={() => setDrawerOpen(false)}>My Bucket List</span>
        </Link>
        <Link className="navLink" to={`/${userId}/my`}>
          <span onClick={() => setDrawerOpen(false)}>Profile</span>
        </Link>
        <Link className="navLink" to={`/${userId}/friends`}>
          <span onClick={() => setDrawerOpen(false)}>My Friends</span>
        </Link>
        <Link className="navLink" to={`/${userId}/messages`}>
          <span onClick={() => setDrawerOpen(false)}>Messages</span>
        </Link>
      </div>
    </Fragment>
  );
};

export default UserProfileNav;
