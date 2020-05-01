import React, { useContext, useState, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
import UserProfileNav from "../../../users/components/UserProfileNav";
import UsersContext from "../../context/users/usersContext";
const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const usersContext = useContext(UsersContext);
  const { user } = usersContext;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ul className="nav-links no-select">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <Fragment>
          <li className="desktop-menu">
            <div
              className="avatar-holder"
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              MY
              {user && (
                <Avatar
                  src={user.image}
                  alt={user.name}
                  style={{ margin: "0 1rem" }}
                />
              )}
            </div>
            {drawerOpen && <UserProfileNav setDrawerOpen={setDrawerOpen} />}
          </li>
          <li className="mobile-submenu">
            <div className="avatar-holder">
              <p>MY</p>
              {user && (
                <Avatar
                  src={user.image}
                  alt={user.name}
                  style={{ margin: "0 1rem" }}
                />
              )}
            </div>
            <div className="mobile-links">
              <NavLink to={`/${auth.userId}/bucketlist`}>
                <span>Bucket List</span>
              </NavLink>
              <NavLink to={`/${auth.userId}/my`}>
                <span>Profile</span>
              </NavLink>
              <NavLink to={`/${auth.userId}/friends`}>
                <span>Friends</span>
              </NavLink>
              <NavLink to={`/${auth.userId}/messages`}>
                <span>Messages</span>
              </NavLink>
            </div>
          </li>
        </Fragment>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Register</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOG OUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
