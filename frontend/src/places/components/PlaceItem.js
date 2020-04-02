
import React, { useState, Fragment, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import "./PlaceItem.css";
import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/formElements/Button";
import Modal from "../../shared/component/UIElements/Modal";
import Map from "../../shared/component/UIElements/Map";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";
import { PLACE_TAG_TITLES } from "../../shared/Util/constants";
import Chip from "@material-ui/core/Chip";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";


const PlaceItem = ({ place, onDeletePlace }) => {
  const {error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [evaluation, setEvaluation] = useState();
  const [addLikes, setAddLikes] = useState();
  const [addDislikes, setAddDislike] = useState();
  const [showTravelWishButton, setShowTravelWishButton] = useState(true);
  const [showTick, setShowTick] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const {
    id,
    image,
    name,
    title,
    address,
    description,
    location,
    tags,
  } = place;
  const history = useHistory();
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/evaluation/${id}`,
        );
        setEvaluation(data.place);
      } catch (error) {}
    };
    fetchEvaluation();
  }, [addLikes, addDislikes, id, sendRequest]);

  const addLikeAndRemoved = async () => {
    if (auth.isLoggedIn) {
      try {
        const newData = { likes: auth.userId };
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/like/${id}`,
          'POST',
          JSON.stringify(newData),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          },
        );

        setAddLikes(data);
      } catch (error) {}
    } else {
      history.push('/auth');
    }
  };

  const addDisLikeAndRemoved = async () => {
    if (auth.isLoggedIn) {
      try {
        const newData = { disLike: auth.userId };
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/dislike/${id}`,

          'POST',

          JSON.stringify(newData),
          {
            Authorization: 'Bearer ' + auth.token,
            'Content-Type': 'application/json',
          },
        );

        setAddDislike(data);
      } catch (error) {}
    } else {
      history.push('/auth');
    }
  };

  const showDeleteWaringHandler = () => {
    setShowConfirmModal(true);
  };
  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token
        }
      );
      onDeletePlace(id);
    } catch (error) {}
  };
  const addBucketList = async () => {
    try {
      setShowTravelWishButton(false);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/bucketlist/${id}`,
        'PATCH',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        },
      );
      setShowTick(true);
    } catch (error) {
      setShowTravelWishButton(true);
    }
  };
  const [users, setUsers] = useState();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users`,
        );
        setUsers(data.users);
      } catch (error) {}
    };
    getUsers();
  }, [sendRequest]);

  const checkAdded = users => {
    if (!auth.userId) {
      return false;
    }
    const currentUser = users.find(item => item._id === auth.userId);
    const nonUniqueArray = currentUser.bucketList.filter(item => {
      return item.id === id;
    });
    if (nonUniqueArray.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__actions"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container no-select">
          <h2>THE MAP!</h2>
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        className="place-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? note that it can't be
          undone thereafter.
        </p>
      </Modal>
      {users && (
        <li className="place-item fade-in">
          <Card className="place-item__content">
            <div className="place-item__image">
              <img src={image.imageUrl} alt={name} />
            </div>
            <div className="place-item__info">
              <div className="evaluation no-select">
                {evaluation && (
                  <div className="like">
                    <p className="like-count">
                      {evaluation.likes >= 1000
                        ? evaluation.likes.length / 1000 + "k"
                        : evaluation.likes.length}
                    </p>
                    <i
                      className="fas fa-thumbs-up fa-2x"
                      onClick={addLikeAndRemoved}
                      style={{
                        color: evaluation.likes.includes(auth.userId) && "green"
                      }}
                    ></i>
                  </div>
                )}
                {evaluation && (
                  <div className="dislike">
                    <p className="dislike-count">
                      {evaluation.disLike >= 1000
                        ? evaluation.disLike.length / 1000 + "k"
                        : evaluation.disLike.length}
                    </p>
                    <i
                      className="fas fa-thumbs-down fa-2x"
                      onClick={addDisLikeAndRemoved}
                      style={{
                        color: evaluation.disLike.includes(auth.userId) && "red"
                      }}
                    ></i>
                  </div>
                )}
              </div>{" "}
              <p>{JSON.stringify()}</p>
              <h2>{title}</h2>
              <h3>{address}</h3>
              <p>{description}</p>
              <div>
                {tags.map(tag => {
                  return (
                    <Chip
                      key={tag}
                      className="tag-chip"
                      variant="outlined"
                      color="primary"
                      size="small"
                      label={PLACE_TAG_TITLES[tag]}
                    />
                  );
                })}
              </div>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
              </Button>
              <Link to={`/places/${id}`}>
                <Button>DETAILS</Button>
              </Link>
              {place.creator === auth.userId && (
                <Button to={`/places/${id}/edit`}>EDIT</Button>
              )}
              {place.creator === auth.userId && (
                <Button danger onClick={showDeleteWaringHandler}>
                  DELETE
                </Button>
              )}
              {auth.token &&
                place.creator !== auth.userId &&
                showTravelWishButton &&
                !checkAdded(users) && (
                  <Button onClick={addBucketList}>ADD TO BUCKET LIST</Button>
                )}
              {checkAdded(users) && auth.userId && (
                <span className="animated">
                  Already in your bucket{" "}
                  <span
                    role="img"
                    aria-label={"already-in your bucket"}
                    aria-hidden={false}
                  >
                    &#9989;
                  </span>
                </span>
              )}
              {showTick && (
                <span className=" fadeOut animated">
                  Added{" "}
                  <span role="img" aria-label={"added"} aria-hidden={false}>
                    &#9989;
                  </span>
                </span>
              )}
            </div>
          </Card>
        </li>
      )}
    </Fragment>
  );
};

export default PlaceItem;
