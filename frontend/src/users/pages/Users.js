import React, { useState, useContext, Fragment } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import UsersContext from "../../shared/context/users/usersContext";
import { AuthContext } from "../../shared/context/auth-context";
import { Select, MenuItem } from "@material-ui/core";

import {
  InputBase,
  Paper,
  IconButton,
  Grid,
  Container,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
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

const Users = () => {
  const usersContext = useContext(UsersContext);
  const {
    isLoading,
    error,
    clearError,
    users,
    user,
    setSortBy,
    sendFriendRequestHandler,
    getUsers,
    totalPages,
    currentPage,
    setCurrentPage,
  } = usersContext;
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [menuItemValue, setMenuItemValue] = useState();
  const auth = useContext(AuthContext);

  //sort users on selected option below
  const sortByNameCountDate = (event) => {
    const menuItemValue = event.target.value;
    if (menuItemValue === "name") setSortBy("name");
    if (menuItemValue === "placesCount") setSortBy("-placesCount");
    if (menuItemValue === "registration") setSortBy("-created_at");
    setMenuItemValue(menuItemValue);
  };
  const onSubmitSearchHandler = (e) => {
    e.preventDefault();
    getUsers(searchValue);
  };
  const inputSearchHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && (
        <Container maxWidth="md">
          <Grid className={classes.centerd} container spacing={3}>
            <Grid item md={3} xs={12} sm={3}>
              <Select
                onChange={sortByNameCountDate}
                defaultValue="none"
                className={classes.selectStyle}
                value={menuItemValue}
              >
                <MenuItem value="none" disabled>
                  Choose an option to Sort
                </MenuItem>
                <MenuItem value="placesCount">Place Count</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="registration">Registration Date</MenuItem>
              </Select>
            </Grid>

            <Grid item md={3} xs={12} sm={3}>
              <Paper
                component="form"
                className={classes.root}
                onSubmit={onSubmitSearchHandler}
              >
                <InputBase
                  className={classes.input}
                  placeholder="Search"
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
            <UsersList
              items={users}
              userData={user}
              auth={auth}
              sendFriendRequestHandler={sendFriendRequestHandler}
            />
          </Grid>

          <Pagination
            className={classes.centerd}
            color="secondary"
            count={totalPages}
            page={currentPage}
            onChange={handleChange}
          />
        </Container>
      )}
    </Fragment>
  );
};

export default Users;
