import { useEffect, useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";

export default function Social() {
  const auth = useContext(AuthContext);
  const socialLog = () => {
    const token = new URL(window.location).searchParams.get("token");
    const uId = new URL(window.location).searchParams.get("userId");
    auth.login(uId, token);
  };
  useEffect(() => {
    socialLog();
  });
  return null;
}
