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
import { useGetUserInfo } from "./hooks/useGetUserInfo";
import { doc, setDoc } from "firebase/firestore";
import Footer from "./component/Footer";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  //要確認
  useGetUserInfo();
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
        await setDoc(userRef, { emailVerified: loginUser?.emailVerified }, { merge: true });
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
          <div>
            <MyFullCalendar />
            <Footer />
          </div>
        :
          <div>
            <Login />
            <Footer/>  
          </div>
      }
      </ErrorBoundary>
    </>
  );
};

export default App;