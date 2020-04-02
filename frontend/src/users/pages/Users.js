import React, { useEffect, useState, useContext, Fragment } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Select, MenuItem } from '@material-ui/core';

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

        let userData;
        if (auth.token) {
          userData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/me`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            },
          );
        }
        setUser(userData);
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      }
    };
    getUsers();

  }, [processedUsers, auth.token, sendRequest, sortBy]);


  const sendFriendRequestHandler = id => {
    setProcessedUsers(prevValue => [...prevValue, id]);
  };

  //sort users on selected option below
  const sortByNameCountDate = event => {
    const menuItemValue = event.target.value;
    if (menuItemValue === 'name') setSortBy('name');
    if (menuItemValue === 'placesCount') setSortBy('-placesCount');
    if (menuItemValue === 'registration') setSortBy('-created_at');
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && (
        <Fragment>
          <Select
            onChange={sortByNameCountDate}
            defaultValue="none"
            style={{ color: 'white', margin: '1rem' }}
          >
            <MenuItem value="none" disabled>
              Choose an option to Sort
            </MenuItem>
            <MenuItem value="placesCount">Place Count</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="registration">Registration Date</MenuItem>
          </Select>
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
