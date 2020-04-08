import React, { Suspense, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from "react-router-dom";
import MainNavigation from "./shared/component/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { MessageContext } from "./shared/context/message-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/component/UIElements/LoadingSpinner";
import Social from "./users/pages/Social";
import Search from "./search/pages/Search";
const Messages = React.lazy(()=>import("./users/pages/Messages")) ;
const ForgetPassword = React.lazy(() => import("./users/components/ForgetPassword"));
const ResetEmail = React.lazy(() => import("./users/components/ResetEmail"));

const Auth = React.lazy(() => import("./users/pages/Auth"));
const UserProfileNav = React.lazy(() => import("./users/components/UserProfileNav"));
const User = React.lazy(() => import("./users/pages/User"));
const Users = React.lazy(() => import("./users/pages/Users"));
const Friends = React.lazy(() => import("./friends/pages/Friends"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const BucketList = React.lazy(() => import("./places/components/BucketList"));
const Place = React.lazy(() => import("./places/pages/Place"));
const RegisterConfirmation = React.lazy(() => import("./users/components/RegisterConfirmation"));
const App = () => {
  const { token, login, logout, userId } = useAuth();
  const [messagesData, setMessagesData] = useState([]);

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/:userId/my">
          <User />
        </Route>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/search" exact component={withRouter(Search)} />

        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <Place />
        </Route>
        <Route path="/places/:placeId/edit">
          <UpdatePlace />
        </Route>
        <Route path="/:userId/friends" exact>
          <Friends />
        </Route>
        <Route path="/:userId/bucketlist">
          <BucketList />
        </Route>
        <Route path="/:userId/messages">
          <UserProfileNav />
          <Messages />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/:placeId" exact>
          <Place />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Route path="/social">
          <Social />
        </Route>
        <Route path="/forgetpassword">
          <ForgetPassword />
        </Route>
        <Route path="/resetpassword/:token">
          <ResetEmail />
        </Route>
        <Route path="/confirm/:token">
          <RegisterConfirmation />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        login,
        logout,
        userId,
      }}
    >
      <MessageContext.Provider value={{ messagesData }}>
        <Router>
          <MainNavigation />
          <main>
            <Suspense
              fallback={
                <div className="center">
                  <LoadingSpinner asOverlay />
                </div>
              }
            >
              {routes}
            </Suspense>
          </main>
        </Router>
      </MessageContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
