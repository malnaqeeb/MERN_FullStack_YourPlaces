import React, { useContext, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
import UsersContext from "../../context/users/usersContext";
const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const usersContext = useContext(UsersContext);
  const { user } = usersContext;

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
          <li>
            <NavLink className="avatar-holder" to={`/${auth.userId}/my`}>
              MY
            </NavLink>
          </li>
          {user && <Avatar src={user.image} alt={user.name} />}
        </Fragment>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
