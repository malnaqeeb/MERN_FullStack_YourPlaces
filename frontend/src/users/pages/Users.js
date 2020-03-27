import React, { useEffect, useState, useContext, Fragment } from 'react';
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import useHttpClient from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Select from '../../shared/component/Select';

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

  //sort users on seleced option below
  const optionValues = ['', 'name', 'placesCount', 'registration'];
  const sortByNameCountDate = selectElem => {
    if (selectElem.value === 'name') setSortBy('name');

    if (selectElem.value === 'placesCount') setSortBy('-placesCount');

    if (selectElem.value === 'registration') setSortBy('-created_at');
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
          <Select
            array={optionValues}
            method={'sort'}
            idName={'select-sort-users'}
            onChangeEvent={sortByNameCountDate}
          />
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
