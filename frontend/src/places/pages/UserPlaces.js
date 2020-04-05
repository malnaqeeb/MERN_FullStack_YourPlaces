import React, { Fragment, useState, useEffect, useContext } from "react";
import PlaceList from "../components/PlaceList";
import { useParams, useHistory, Link } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import "./UserPlaces.css";
import { AuthContext } from "../../shared/context/auth-context";
import { Select, Checkbox, MenuItem } from "@material-ui/core";
import { PLACE_TAGS } from "../../shared/Util/constants";
import Button from "../../shared/component/formElements/Button";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  const userId = useParams().userId;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [user, setUser] = useState();
  const [sortBy, setSortBy] = useState("");
  const [tags, setTags] = useState([]);

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
          `${
            process.env.REACT_APP_BACKEND_URL
          }/places/user/${userId}/?sortBy=${sortBy}&tagFilter=${tags.join(",")}`
        );
        setPlaces(data.userWithPlaces);
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, userId, sortBy, tags]);
  const placeDeleteHandler = (detetedPlaceId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((places) => places.id !== detetedPlaceId)
    );
  };
  const getError = (err) => {
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
          <div className="center fade-in-faster">
            <Button inverse to="/places/new">
              ADD A PLACE
            </Button>
          </div>
        </Fragment>
      );
    } else {
      return <h2>{err}</h2>;
    }
  };

  //sort on selected option below
  const sortByTitleRateDate = (event) => {
    const menuItemValue = event.target.value;
    if (menuItemValue === "rate") setSortBy("rate");
    if (menuItemValue === "title") setSortBy("title");
    if (menuItemValue === "created_at") setSortBy("created_at");
  };

  const handleTagChange = (event) => {
    const tagName = event.target.name;
    const checked = event.target.checked;
    if (checked) {
      setTags((oldTags) => {
        return oldTags.includes(tagName) ? oldTags : [...oldTags, tagName];
      });
    } else {
      setTags((oldTags) => {
        return oldTags.includes(tagName)
          ? oldTags.filter((tag) => tag !== tagName)
          : oldTags;
      });
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

  const tagInputs = [];

  PLACE_TAGS.map((tag) => {
    const checked = tags.includes(tag.name);
    const tagInput = (
      <span key={tag.name}>
        <label>
          <Checkbox
            name={tag.name}
            checked={checked}
            onChange={handleTagChange}
            inputProps={{ "aria-label": "primary checkbox" }}
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
      <div className="place-overlay-container fade-in">
        <h2 className="center white-text inline no-select">
          Places of{" "}
          <span className="yellow-text fade-in"> {user && user.user.name}</span>{" "}
        </h2>
        <ErrorModal error={error} onClear={clearError} />
        {!isLoading && places && (
          <Fragment>
            <div className="sort-filter-layout">
              <Select
                onChange={sortByTitleRateDate}
                defaultValue="none"
                style={{ color: "white" }}
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
