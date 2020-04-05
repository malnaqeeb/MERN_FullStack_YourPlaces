import React, { useContext, Fragment, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../shared/component/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserProfileNav.css";

const UserProfileNav = () => {
  const { userId } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(true);
  const toggleMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  const navBarHeight = {
    height: window.innerHeight - 0.11 * window.innerHeight,
  };
  return (
    <Fragment>
      <i
        className={
          userMenuOpen
            ? `fas fa-angle-double-right mobile-hidden-icon desktop-hidden-icon`
            : `fas fa-angle-double-right mobile-icon desktop-hidden-icon`
        }
        onClick={toggleMenu}
      ></i>
      <Card
        className={
          userMenuOpen
            ? `sideBar fade-in `
            : `sideBar mobile-hidden-menu fade-in`
        }
        style={navBarHeight}
      >
        <i
          className="fas fa-angle-double-left desktop-hidden-icon"
          onClick={toggleMenu}
        ></i>
        <Link className="navLink" to={`/${userId}/bucketlist`}>
          <span>My Bucket List</span>
        </Link>
        <Link className="navLink" to={`/${userId}/profile`}>
          <span>Profile</span>
        </Link>

        <Link className="navLink" to={`/${userId}/friends`}>
          <span>My Friends</span>
        </Link>
        <Link className="navLink" to={`/${userId}/messages`}>
          <span>Messages</span>
        </Link>
      </Card>
    </Fragment>
  );
};

export default UserProfileNav;
