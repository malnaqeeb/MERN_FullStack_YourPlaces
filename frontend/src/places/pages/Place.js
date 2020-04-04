import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import PlaceItemView from "../components/PlaceItemView";

export default function Place() {
  const [place, setPlace] = useState({});
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const placeId = useParams().placeId;

  useEffect(() => {
    const getPlace = async () => {
      try {
        const placeData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setPlace(placeData.place);
      } catch {}
    };
    getPlace();
  }, [sendRequest, placeId]);

  return (
    <div
      className="center"
      style={{ display: "flex", flexDirection: "column" }}
    >
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && place && Object.keys(place).length > 0 && (
        <PlaceItemView place={place} />
      )}
      <Comments placeId={placeId} />
    </div>
  );
}
