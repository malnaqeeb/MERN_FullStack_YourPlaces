import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserProfileNav.css";

const UserProfileNav = ({ setDrawerOpen }) => {
  const { userId } = useContext(AuthContext);
  return (
    <Fragment>
      <div className="dropdown-content">
        <Link onClick={() => setDrawerOpen(false)} className="navLink" to={`/${userId}/bucketlist`}>
          <span>Bucket List</span>
        </Link>
        <Link onClick={() => setDrawerOpen(false)} className="navLink" to={`/${userId}/my`}>
          <span>Profile</span>
        </Link>
        <Link onClick={() => setDrawerOpen(false)} className="navLink" to={`/${userId}/friends`}>
          <span>Friends</span>
        </Link>
        <Link onClick={() => setDrawerOpen(false)} className="navLink" to={`/${userId}/messages`}>
          <span>Messages</span>
        </Link>
      </div>
    </Fragment>
  );
};

export default UserProfileNav;
