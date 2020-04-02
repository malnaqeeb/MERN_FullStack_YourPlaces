import React, { useState, useContext, Fragment } from "react";
import Button from "../../shared/component/formElements/Button";
import Modal from "../../shared/component/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import useHttpClient from "../../shared/hooks/http-hook";
import "./BucketListItem.css";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import { Link, useParams } from "react-router-dom";

const BucketListItem = ({ bucket, deleteBucket }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [visitStyle, setVisitStyle] = useState(bucket.isVisited);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { id } = bucket;
  const { userId } = useParams();
  const openDetailsHandler = () => {
    setShowDetails(true);
  };
  const closeDetailsHandler = () => {
    setShowDetails(false);
  };

  const deleteFromBucketList = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/bucketlist/${bucket.id._id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token
        }
      );
      deleteBucket(bucket.id._id);
    } catch (err) {}
  };

  const visitedPlace = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/bucketlist/${bucket.id._id}`,
        "PUT",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token
        }
      );
    } catch (error) {}
  };
  if (error) return <ErrorModal error={error} onClear={clearError} />;
  return (
    <Fragment>
      {isLoading && <LoadingSpinner asOverlay />}

      <div className="bucket-list-item no-select">
        <Modal
          show={showDetails}
          onCancel={closeDetailsHandler}
          header={bucket.name}
          contentClass="place-item__modal-content"
          footerClass="place-item__actions"
          footer={<Button onClick={closeDetailsHandler}>Close</Button>}
        >
          <div className="detail-item">
            <div className="bucket-image">
              <img
                style={{ width: "100%" }}
                src={id.image.imageUrl}
                alt="bucket-place"
              ></img>
            </div>

            <div className="bucket-info">
              <p style={{ fontSize: "1.5em" }}>{id.title}</p>
              <p>{id.description}</p>
              <p>Address: {id.address}</p>
              <p className="bucket-creator">
                {" "}
                <strong>Shared by:</strong>{" "}
                <Link to={`/${id.creator}/places`}>{bucket.createdBy}</Link>
              </p>
            </div>
          </div>
        </Modal>
        <p style={{ textDecoration: visitStyle ? "line-through" : "none" }}>
          {bucket && bucket.id.title}
        </p>
        {userId === auth.userId && (
          <Button
            size="mobile"
            danger
            onClick={() => {
              deleteFromBucketList();
            }}
          >
            Delete
          </Button>
        )}

        <Button size="mobile" onClick={() => openDetailsHandler()}>
          Show Details
        </Button>
        {userId === auth.userId && (
          <Button
            size="mobile"
            inverse
            onClick={() => {
              setVisitStyle(!visitStyle);
              visitedPlace();
            }}
          >
            {visitStyle ? "Not Visited" : "Visited"}
          </Button>
        )}
      </div>
    </Fragment>
  );
};
export default BucketListItem;
