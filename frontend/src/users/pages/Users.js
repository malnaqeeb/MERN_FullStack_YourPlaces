import React, { useEffect, useState, useContext, Fragment } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [processedUsers, setProcessedUsers] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sortBy, setSortBy] = useState('');

  const auth = useContext(AuthContext);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users?sortBy=${sortBy}`,
        );
        setUsers(data.users);
        console.log(users);
        console.log(data.users);
        let userData;
        if (auth.token) {
          userData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/user/friends`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            },
          );
        }
        setUser(userData);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();
  }, [processedUsers, auth.token, sendRequest, sortBy]);

  const sendFriendRequestHandler = id => {
    setProcessedUsers(prevValue => [...prevValue, id]);
  };

  const sortByNameOrCount = () => {
    const selectElement = document.getElementById('select');
    let sortedUsers;
    if (selectElement.value === 'Name') {
      setSortBy('name');
    }
    if (selectElement.value === 'PlaceCount') {
      setSortBy('-placesCount');
    }
    if (selectElement.value === 'Registration') {
      setSortBy('-created_at');
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && (
        <Fragment>
          <select id="select" onChange={sortByNameOrCount}>
            <option value="PlaceCount">Sort By Place Count</option>
            <option value="Name">Sort By Name</option>
            <option value="Registration">Sort By Registration Date</option>
          </select>
          <UsersList
            items={users}
            userData={user}
            auth={auth}
            sendFriendRequestHandler={sendFriendRequestHandler}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Users;
