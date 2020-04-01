import React, { Fragment, useState, useEffect, useContext } from "react";
import PlaceList from "../components/PlaceList";
import { useParams, useHistory, Link } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import "./UserPlaces.css";
import { AuthContext } from "../../shared/context/auth-context";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  const userId = useParams().userId;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [user, setUser] = useState();
   useEffect(() => {
    const getUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}/`
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
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setPlaces(data.userWithPlaces);
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, userId]);
  const placeDeleteHandler = detetedPlaceId => {
    setPlaces(prevPlaces =>
      prevPlaces.filter(places => places.id !== detetedPlaceId)
    );
  };
  const getError = err => {
    if (!places && auth.userId !== userId) {
      return (
        <h2 className="center gray-text fade-in-faster">
          There is no place shared by this user
        </h2>
      );
    }
    if (!places && auth.userId === userId) {
      return (
        <Fragment>
          <h2 className="center gray-text fade-in-faster">
            You don't have any shared places. Would you like to add one?
          </h2>
          <Link to="/places/new" className="center fade-in-faster add-place-button">ADD A PLACE</Link>
        </Fragment>
      );
    } else {
      return <h2>{err}</h2>;
    }
  };
  const goHome = () => {
    history.push("/");
  };
  if (error)
    return (
      <ErrorModal
        error={getError(error)}
        header="Hello there!"
        onClear={goHome}
      />
    );

  return (
    <Fragment>
      <div className="place-overlay-container fade-in">
        <h2 className="center white-text inline no-select">
          Places of <span className="yellow-text fade-in"> {user && user.user.name}</span>{" "}
        </h2>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && places && (
          <PlaceList items={places} onDeletePlace={placeDeleteHandler} />
        )}
      </div>
    </Fragment>
  );
};

export default UserPlaces;
