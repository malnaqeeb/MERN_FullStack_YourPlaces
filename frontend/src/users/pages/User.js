import React, { useEffect, useState, useContext, Fragment } from "react";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
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
        const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`);
        setUser(data.user);
        setNotifications(data.user.notifications);

      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [sendRequest, userId]);

  return <UserProfile user={user} setUser={setUser} notifications={notifications} />

     
};

export default User;
