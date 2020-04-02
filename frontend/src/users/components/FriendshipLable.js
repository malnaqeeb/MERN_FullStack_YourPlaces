import React from "react";
import { styled } from "@material-ui/core/styles";
import Card from "@material-ui/core/card";

const FriendshipLable = styled(Card)({
  background: "#ff0055",
  border: 0,
  font: "inherit",
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
  color: "white",
  height: 40,
  width: 175,
  padding: "10px",
});

export default function StyledComponents(props) {
  return <FriendshipLable>{props.children}</FriendshipLable>;
}
