import React, { Fragment, useState, useEffect } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams, useHistory } from 'react-router-dom';
import useHttpClient from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';
import { Select, Checkbox, MenuItem } from '@material-ui/core';

import { PLACE_TAGS } from '../../shared/Util/constants';
import './UserPlaces.css';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  const userId = useParams().userId;
  const history = useHistory();
  const [user, setUser] = useState();
  const [sortBy, setSortBy] = useState('');
  const [tags, setTags] = useState([]);

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
          `${
            process.env.REACT_APP_BACKEND_URL
          }/places/user/${userId}/?sortBy=${sortBy}&tagFilter=${tags.join(
            ',',
          )}`,
        );
        setPlaces(data.userWithPlaces);
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, userId, sortBy, tags]);
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
  const sortByTitleRateDate = event => {
    const menuItemValue = event.target.value;
    if (menuItemValue === 'rate') setSortBy('rate');
    if (menuItemValue === 'title') setSortBy('title');
    if (menuItemValue === 'created_at') setSortBy('created_at');
  };

  const handleTagChange = event => {
    const tagName = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setTags(oldTags => {
        return oldTags.includes(tagName) ? oldTags : [...oldTags, tagName];
      });
    } else {
      setTags(oldTags => {
        return oldTags.includes(tagName)
          ? oldTags.filter(tag => tag !== tagName)
          : oldTags;
      });
    }
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

  const tagInputs = [];

  PLACE_TAGS.map(tag => {
    const checked = tags.includes(tag.name);
    const tagInput = (
      <span key={tag.name}>
        <label>
          <Checkbox
            name={tag.name}
            checked={checked}
            onChange={handleTagChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          {tag.title}
        </label>
        <span>&nbsp;&nbsp;</span>
      </span>
    );
    tagInputs.push(tagInput);
  });

  return (
    <Fragment>
      <div className="place-overlay-container">
        <h2 className="center yellow-text inline">
          Places of <span className="pink-text"> {user && user.user.name}</span>{' '}
        </h2>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && places && (
          <Fragment>
            <div className="sort-filter-layout">
              <Select
                onChange={sortByTitleRateDate}
                defaultValue="none"
                style={{ color: 'white' }}
              >
                <MenuItem value="none" disabled>
                  Choose an option to Sort
                </MenuItem>
                <MenuItem value="rate">Sort By Rate</MenuItem>
                <MenuItem value="title">Sort By Title</MenuItem>
                <MenuItem value="created_at">Sort By Adding Date</MenuItem>
              </Select>
              {tagInputs}
            </div>

            <PlaceList items={places} onDeletePlace={placeDeleteHandler} />
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default UserPlaces;
