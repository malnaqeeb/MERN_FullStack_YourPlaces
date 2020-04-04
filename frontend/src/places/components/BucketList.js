import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import BucketListItem from "./BucketListItem";
import useHttpClient from "../../shared/hooks/http-hook";
import "./BucketList.css";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";

const BucketList = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [places, setPlaces] = useState();
  const { userId } = useParams();
  const auth = useContext(AuthContext);
  const deleteFromBucketList = (id) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id._id !== id)
    );
  };
  useEffect(() => {
    const getBucketList = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/user/bucketlist?q=${userId}`
        );
        setPlaces(data.userWithBucketList);
      } catch (err) {}
    };
    getBucketList();
  }, [sendRequest, userId]);
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

  if (error) {
    return <ErrorModal error={error} onClear={clearError} header={`Hey!`} />;
  }
  if (isLoading)
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  else {
    return (
      <div>
        {userId === auth.userId && (
          <div className="share-box  no-select">
            <div className="share-button">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `${process.env.REACT_APP_PUBLIC_URL}/${userId}/bucketlist`
                )}&text=My+Travel+Bucket+List%2C+Connect+and+Explore.&hashtags=travelling,wanderlust,yourplacesapp`}
              >
                <i className="fab fa-twitter-square"></i>
              </a>
              <a
                href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                  `${process.env.REACT_APP_PUBLIC_URL}/${userId}/bucketlist`
                )}`}
              >
                <i className="fab fa-facebook-square"></i>
              </a>
            </div>
            <p>SHARE</p>
          </div>
        )}
        <React.Fragment>
          <div className="bucket-list-content">
            <div className="m-b-2">
              <h2 className=" white-text fade-in no-select center">
                Bucket List of{" "}
                <span className="m-05 yellow-text">
                  {" "}
                  {user && user.user.name}
                </span>{" "}
              </h2>
            </div>
            {places && places.length === 0 && auth.userId === userId && (
              <h2
                className="center white-text fade-in"
                style={{ flexDirection: "column" }}
              >
                You don't have any places in your bucket list. Maybe check some
                places?
                <Link to="/"> Go to home</Link>
              </h2>
            )}
            {auth.userId !== userId && places && places.length === 0 && (
              <h2 className="center white-text fade-in">
                This user does not have any places in their bucket list
              </h2>
            )}

            {places &&
              places.map((bucket, index) => {
                return (
                  <BucketListItem
                    bucket={bucket}
                    key={index}
                    index={index}
                    deleteBucket={deleteFromBucketList}
                  />
                );
              })}
          </div>
        </React.Fragment>
      </div>
    );
  }
};

export default BucketList;
