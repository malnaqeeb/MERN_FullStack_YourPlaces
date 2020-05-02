import React, { useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserProfileNav.css";

const UserProfileNav = ({ setDrawerOpen, drawerOpen }) => {
  const { userId } = useContext(AuthContext);
  return (
    <Fragment>
      <div className={drawerOpen ? `dropdown-content` : `dropdown-hidden`}>
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
