import React, { useEffect, useState, useContext, Fragment } from "react";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import UserProfile from "../components/UserProfile";
import Messages from "../pages/Messages";
import UserPlaces from "../../places/pages/UserPlaces";
import Users from "../../users/pages/Users";
import UserProfileNav from "../components/UserProfileNav";
import BucketList from "../../places/components/BucketList";
import Friends from "../../friends/pages/Friends";
import "./User.css";

const User = () => {
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setUser(data.user);
        setNotifications(data.user.notifications);
        console.log(data.user.notifications);
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
          <Route path={`/:userId/my`} exact>
            <img  className= "fade-in" src="/images/my-page.png" alt="my-page" />
          </Route>
          <Route path={`/:userId/places`} exact component={withRouter(UserPlaces)}/>
            <Route path={`/:userId/profile`} exact>
              <UserProfile
                user={user}
                setUser={setUser}
                notifications={notifications}
              />
            </Route>
            <Route path={`/:userId/messages`} exact>
              <Messages />
            </Route>
            <Route path={`/:userId/bucketlist`} exact>
              <BucketList />
            </Route>
            <Route path={`/:userId/friends`} exact>
              <Friends />
            </Route>
            <Route path="/" exact>
              <Users />
            </Route>
          </Switch>
        </Router>
      )}
    </Fragment>
  );
};

export default User;
