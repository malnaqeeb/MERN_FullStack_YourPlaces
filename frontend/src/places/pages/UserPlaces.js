import React, { Fragment, useState, useEffect, useContext } from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import "./UserPlaces.css";
import { AuthContext } from "../../shared/context/auth-context";
import {
  Select,
  Checkbox,
  MenuItem,
  Grid,
  Container,
  Paper,
  InputBase,
  IconButton,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import { PLACE_TAGS } from "../../shared/Util/constants";
import Button from "../../shared/component/formElements/Button";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  centerd: {
    display: "flex",
    justifyContent: "center",
  },
  end: {
    display: "flex",
    justifyContent: "flex-end",
  },
  selectStyle: {
    background: "white",
    width: "100%",
    padding: "4px",
    borderRadius: "4px",
  },
}));

const UserPlaces = () => {
  const classes = useStyles();
  const userId = useParams().userId;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [tags, setTags] = useState([]);
  const [menuItemValue, setMenuItemValue] = useState();

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
  useEffect(() => {
    getPlaces();
    // eslint-disable-next-line
  }, [sendRequest, userId, sortBy, tags]);
  const placeDeleteHandler = (detetedPlaceId) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((places) => places.id !== detetedPlaceId)
    );
  };
  const searchPlaces = async (searchValue) => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/?search=${searchValue}`
      );
      setPlaces(data.places);
    } catch (error) {}
  };

  const getError = (err) => {
    if (!places && auth.userId !== userId) {
      return (
        <h2 className="center gray-text fade-in-faster">No places shared!</h2>
      );
    }
    if (!places && auth.userId === userId) {
      return (
        <Fragment>
          <h2 className="center gray-text fade-in-faster">
            No shared places yet, maybe add one?
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
    setMenuItemValue(menuItemValue);
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

  if (error)
    return (
      <ErrorModal
        error={getError(error)}
        header="Hello there!"
        onClear={clearError}
      />
    );

  const tagInputs = [];

  PLACE_TAGS.forEach((tag) => {
    const checked = tags.includes(tag.name);
    const tagInput = (
      <FormControlLabel
        key={tag.name}
        control={
          <Checkbox
            checked={checked}
            onChange={handleTagChange}
            name={tag.name}
          />
        }
        label={tag.title}
      />
    );
    tagInputs.push(tagInput);
  });

  const onSubmitSearchHandler = (e) => {
    e.preventDefault();
    searchPlaces(searchValue);
  };
  const inputSearchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className="place-overlay-container fade-in">
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && places && (
        <Container maxWidth="md">
          <Grid className={classes.centerd} container spacing={3}>
            <Grid item md={4} xs={12} sm={3}>
              <Select
                onChange={sortByTitleRateDate}
                defaultValue="none"
                className={classes.selectStyle}
                value={menuItemValue}
              >
                <MenuItem value="none" disabled>
                  Sort by
                </MenuItem>
                <MenuItem value="rate">Rate</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="created_at">Adding Date</MenuItem>
              </Select>
            </Grid>
            <Grid item md={4} xs={12} sm={3}>
              <Paper
                component="form"
                className={classes.root}
                onSubmit={onSubmitSearchHandler}
              >
                <InputBase
                  className={classes.input}
                  placeholder="Search places"
                  inputProps={{ "aria-label": "" }}
                  value={searchValue}
                  onChange={inputSearchHandler}
                />
                <IconButton
                  type="submit"
                  className={classes.iconButton}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <FormGroup>
              <Paper>{tagInputs}</Paper>
            </FormGroup>
            <PlaceList items={places} onDeletePlace={placeDeleteHandler} />
          </Grid>
        </Container>
      )}
    </div>
  );
};

export default UserPlaces;
