import React, { useEffect, useState, useContext } from "react";

import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import UserProfile from "../components/UserProfile";

import "./User.css";

const User = () => {
  const { userId } = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState();
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setUser(data.user);
        setNotifications(data.user.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [sendRequest, userId]);

  return (
    <UserProfile user={user} setUser={setUser} notifications={notifications} />
  );
};

export default User;
