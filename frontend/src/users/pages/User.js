import React, { useEffect, useState, useContext, Fragment } from "react";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Messages from "../pages/Messages";
import Users from "../../users/pages/Users";
import UserProfileNav from "../components/UserProfileNav";

const User = () => {
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`);
        setUser(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [sendRequest, userId]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Router>
          <UserProfileNav />
          <Switch>
            <Route path={`/:userId/profile`} exact>
              <UserProfile user={user} setUser={setUser} />
            </Route>
            <Route path={`/:userId/messages`} exact>
              <Messages />
            </Route>
            <Route path="/">
              <Users />
            </Route>
          </Switch>
        </Router>
      )}
    </Fragment>
  );
};

export default User;
