import React from "react";
import UserItem from "./UserItem";

// import Card from "../../shared/component/UIElements/Card";
import { Grid, Card, Typography } from "@material-ui/core";
import "./UsersList.css";
import "./UserItem.css";

const UsersList = ({ items, userData, auth, sendFriendRequestHandler }) => {
  if (items.length === 0) {
    return (
      <Grid container>
        <div style={{ margin: "2rem auto" }}>
          <Grid item md={12}>
            <Card>
              <Typography style={{ textAlign: "center", padding:"1rem" }} variant="h6">
                No users found
              </Typography>
            </Card>
          </Grid>
        </div>
      </Grid>
    );
  }
  return (
    <React.Fragment>
      <ul className="users-list users-mobile">
        {items
          .filter((notAuth) => notAuth._id !== auth.userId)
          .map((user) => (
            <UserItem
              user={user}
              auth={auth}
              userData={userData}
              sendFriendRequestHandler={sendFriendRequestHandler}
              key={user.id}
            />
          ))}
      </ul>
    </React.Fragment>
  );
};

export default UsersList;
