import "./App.css";
import MyFullCalendar from "./component/MyFullCalendar";
// import ReactCalendar from "./component/ReactCalendar";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { auth } from "./firebase";
import { useEffect } from "react";
import { login, logout } from "./features/userSlice";
import Login from "./component/Login";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./utils/ErrorFallback";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  console.log(user);
  useEffect(() => {
    auth.onAuthStateChanged((loginUser) => {
      if (loginUser) {
        console.log(loginUser);
        dispatch(login({
          uid: loginUser.uid,
          photo: loginUser.photoURL,
          email: loginUser.email,
          displayName: loginUser.displayName,
          emailVerified: loginUser.emailVerified,
        }));
      } else {
        dispatch(logout());
      }
    });
  },[dispatch]);

  return (
    <>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      
      {user
        ? 
        <MyFullCalendar />   
        :
        <Login />  
      }
      </ErrorBoundary>
    </>
  );
};

export default App;