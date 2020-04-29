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
  const [sortBy, setSortBy] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const getUsers = useCallback(
    async (searchValue) => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users?sortBy=${sortBy}&&search=${searchValue}&page=${currentPage}&limit=10`
        );

        setUsers(data.users);

        setTotalPages(data.totalPages);
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
    [auth.token, sendRequest, sortBy, currentPage]
  );

  useEffect(() => {
    getUsers("");
  }, [processedUsers, auth.token, sendRequest, sortBy, getUsers, currentPage]);

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
        totalPages,
        currentPage,
        setCurrentPage,
      }}
    >
      {props.children}
    </UsersContext.Provider>
  );
};

export default UsersState;
