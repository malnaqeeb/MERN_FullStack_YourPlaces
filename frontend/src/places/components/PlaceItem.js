import React, { useState, Fragment, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./PlaceItem.css";
import Card from "../../shared/component/UIElements/Card";
import Button from "../../shared/component/formElements/Button";
import Modal from "../../shared/component/UIElements/Modal";
import Map from "../../shared/component/UIElements/Map";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";
const PlaceItem = ({ place, onDeletePlace }) => {
  const { error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [evaluation, setEvaluation] = useState();
  const [addLikes, setAddLikes] = useState();
  const [addDislikes, setAddDislike] = useState();
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const { id, image, name, title, address, description, location } = place;
  const history = useHistory();
  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/evaluation/${id}`
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
          "POST",
          JSON.stringify(newData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json"
          }
        );

        setAddLikes(data);
      } catch (error) {}
    } else {
      history.push("/auth");
    }
  };

  const addDisLikeAndRemoved = async () => {
    if (auth.isLoggedIn) {
      try {
        const newData = { disLike: auth.userId };
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/dislike/${id}`,

          "POST",

          JSON.stringify(newData),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json"
          }
        );

        setAddDislike(data);
      } catch (error) {}
    } else {
      history.push("/auth");
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

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__actions'
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className='map-container'>
          <h2>THE MAP!</h2>
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header='Are you sure?'
        className='place-item__modal-actions'
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
      <li className='place-item'>
        <Card className='place-item__content'>
          <div className='place-item__image'>
            <img src={image.imageUrl} alt={name} />
          </div>
          <div className='place-item__info'>
            <div className='evaluation'>
              {evaluation && (
                <div className='like'>
                  <p className='like-count'>
                    {evaluation.likes >= 1000
                      ? evaluation.likes.length / 1000 + "k"
                      : evaluation.likes.length}
                  </p>
                  <i
                    className='fas fa-thumbs-up fa-2x'
                    onClick={addLikeAndRemoved}
                    style={{
                      color: evaluation.likes.includes(auth.userId) && "green"
                    }}
                  ></i>
                </div>
              )}
              {evaluation && (
                <div className='dislike'>
                  <p className='dislike-count'>
                    {evaluation.disLike >= 1000
                      ? evaluation.disLike.length / 1000 + "k"
                      : evaluation.disLike.length}
                  </p>
                  <i
                    className='fas fa-thumbs-down fa-2x'
                    onClick={addDisLikeAndRemoved}
                    style={{
                      color: evaluation.disLike.includes(auth.userId) && "red"
                    }}
                  ></i>
                </div>
              )}
            </div>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {place.creator === auth.userId && (
              <Button to={`/places/${id}`}>EDIT</Button>
            )}
            {place.creator === auth.userId && (
              <Button danger onClick={showDeleteWaringHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};

export default PlaceItem;
