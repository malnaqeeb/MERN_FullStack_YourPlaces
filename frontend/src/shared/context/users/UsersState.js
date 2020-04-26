import React, { useState, useEffect, useContext, useCallback } from "react";
import useHttpClient from "../../hooks/http-hook";
import { AuthContext } from "../auth-context";
import UsersContext from "./usersContext";
const UsersState = (props) => {
  const auth = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [processedUsers, setProcessedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sortBy, setSortBy] = useState(" ");

  const getUsers = useCallback(
    async (searchValue) => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users?sortBy=${sortBy}&&search=${searchValue}`
        );
        setUsers(data.users);

        let userData;
        if (auth.token) {
          userData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/me`,
            "GET",
            null,
            {
              Authorization: "Bearer " + auth.token,
            }
          );
        }
        setUser(userData);
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      }
    },
    [auth.token, sendRequest, sortBy]
  );

  useEffect(() => {
    getUsers("");
  }, [processedUsers, auth.token, sendRequest, sortBy, getUsers]);

  const sendFriendRequestHandler = (id) => {
    setProcessedUsers((prevValue) => [...prevValue, id]);
  };
  return (
    <UsersContext.Provider
      value={{
        isLoading,
        error,
        clearError,
        users,
        user,
        setSortBy,
        sendFriendRequestHandler,
        getUsers,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
};

export default UsersState;
