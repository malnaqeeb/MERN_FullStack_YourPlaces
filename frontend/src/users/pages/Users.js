import React, { useEffect, useState, Fragment, useContext } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/context/auth-context";
const Users = () => {
  const [users, setUsers] = useState();
  const [user, setUser] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const getUsers = async () => {
      try {
        if (!auth.token) {
          const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
          setUsers(data.users);
        } else {
          const data = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`);
          setUsers(data.users);
          const friendsData= await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/friends`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            },
          );
          const requestsData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/friends/requests`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            },
          );
          setUser({userId: auth.userId, friends: friendsData.friends, friendRequests: requestsData.friendRequests});
        }
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  const sendFriendRequestHandler = id => {
    const { _id, name, image, email } = users.find(users => users._id === id);
    const sentUserObj = {
      userId: _id,
      name,
      image,
      email,
    };
    setUser(prevUser => {
      const newUserState = JSON.parse(JSON.stringify(prevUser));
      newUserState.friendStatus.sentFriendRequest.push(sentUserObj);
      return newUserState;
    });
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && 
        <UsersList
          items={users}
          userData={user}
          auth={auth}
          sendFriendRequestHandler={sendFriendRequestHandler}
        />
      }
    </Fragment>
  );
};

export default Users;
