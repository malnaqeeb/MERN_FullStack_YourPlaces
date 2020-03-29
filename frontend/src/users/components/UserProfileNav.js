import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Card from "../../shared/component/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import "./UserProfileNav.css";

const UserProfileNav = () => {
  const { userId } = useContext(AuthContext);

  const navBarHeight = { height: window.innerHeight - 0.11 * window.innerHeight };
  return (
    <Card className="sideBar" style={navBarHeight}>
      <Link className="navLink" to={`/${userId}/profile`}>
        <h2>Profile</h2>
      </Link>
      <Link className="navLink" to={`/${userId}/messages`}>
        <h2>Messages</h2>
      </Link>
    </Card>
  );
};

export default UserProfileNav;
