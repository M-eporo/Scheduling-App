import "./App.css";
import MyFullCalendar from "./component/MyFullCalendar";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { auth, db } from "./firebase";
import { useEffect } from "react";
import { login, logout } from "./features/userSlice";
import Login from "./component/Login";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./utils/ErrorFallback";
import { emailLogin, emailLogout } from "./features/emailUserSlice";
import GetUserInfo from "./utils/getUserInfo";
import { doc, setDoc } from "firebase/firestore";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (loginUser) => {
      if (loginUser) {
        if (loginUser?.photoURL) {
          dispatch(login({
            uid: loginUser.uid,
            photo: loginUser.photoURL,
            email: loginUser.email,
            displayName: loginUser.displayName,
            emailVerified: loginUser.emailVerified,
          }));
        } else {
          dispatch(emailLogin({
            uid: loginUser.uid,
            name: loginUser?.displayName,
            displayName: loginUser?.displayName,
            email: loginUser?.email,
            emailVerified: loginUser?.emailVerified
          }));
        }
       
        const userRef = doc(db, "user", loginUser.uid);
        await setDoc(userRef, {emailVerified: loginUser?.emailVerified}, { merge: true})
      } else {
        dispatch(logout());
        dispatch(emailLogout());
      }
    });
    return () => unsubscribe();
  },[dispatch]);
  
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      {user || emailUser
        ? 
          <>
            <MyFullCalendar />   
            <GetUserInfo />
          </>
        :
          <Login />  
      }
      </ErrorBoundary>
    </>
  );
};

export default App;