import React, { Fragment, useState, useEffect } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams, useHistory } from 'react-router-dom';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import Select from '../../shared/component/Select';
import './UserPlaces.css';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  const userId = useParams().userId;
  const history = useHistory();
  const [user, setUser] = useState();
  const [sortBy, setSortBy] = useState('');
  const [filterBy, setFilterBy] = useState('');
  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/`,
        );
        setUser(data);
      } catch (err) {}
    };
    getUser();
  }, [sendRequest, userId]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}/?sortBy=${sortBy}&filterBy=${filterBy}`,
        );
        setPlaces(data.userWithPlaces);
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, userId, sortBy]);
  const placeDeleteHandler = detetedPlaceId => {
    setPlaces(prevPlaces =>
      prevPlaces.filter(places => places.id !== detetedPlaceId),
    );
  };
  const getError = err => {
    if (!places && !isLoading) {
      console.log(err);
      return (
        <h2 className="center yellow-text fade-in">
          There is no place shared by this user
        </h2>
      );
    } else {
      return <h2>{err}</h2>;
    }
  };

  //sort on selected option below
  const optionValues = ['', 'rate', 'title', 'created_at'];
  const sortByTitleRateDate = selectElem => {
    if (selectElem.value === 'rate') setSortBy('rate');
    if (selectElem.value === 'title') setSortBy('title');
    if (selectElem.value === 'created_at') setSortBy('created_at');
  };

  const categories = [
    '',
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
  ];

  const filterByCategory = selectElem => {
    categories.forEach(category => {
      if (selectElem.value === category) setFilterBy(category);
    });
  };

  const goHome = () => {
    history.push('/');
  };
  if (error)
    return (
      <ErrorModal
        error={getError(error)}
        header="Hello there!"
        onClear={goHome}
      />
    );
  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );

  return (
    <Fragment>
      <div className="place-overlay-container">
        <h2 className="center yellow-text inline">
          Places of <span className="pink-text"> {user && user.user.name}</span>{' '}
        </h2>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && places && (
          <Fragment>
            <Select
              array={optionValues}
              method={'sort'}
              idName={'select-sort-places'}
              onChangeEvent={sortByTitleRateDate}
            />
            <Select
              array={categories}
              method={'filter'}
              idName={'select-filter-places'}
              onChangeEvent={filterByCategory}
            />

            <PlaceList items={places} onDeletePlace={placeDeleteHandler} />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default UserPlaces;
