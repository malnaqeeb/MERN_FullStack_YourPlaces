import { createContext } from "react";
export const MessageContext = createContext({
  messagesData: [], // to set all the messages involving the id below
  id: "", // to set the texted person object id
});
