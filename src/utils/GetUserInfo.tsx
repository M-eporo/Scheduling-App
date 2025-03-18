import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getUserInfo } from "../features/emailUserSlice";
import { useEffect } from "react";

const GetUserInfo = () => {
  const emailUser = useAppSelector((state) => state.emailUser.emailUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!emailUser?.uid) return;
    const getdocument = async () => {
      try {
        const docRef = doc(db, "user", emailUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          dispatch(getUserInfo({
            name: data.name,
            displayName: data.displayName,
            emailVerified: data.emailVerified ?? false
          }));
        } else {
          console.log("No Such Documents");
        }
      } catch (err) {
        console.error(err);
      }
    };
    getdocument();
  },[dispatch, emailUser]);
  
  return (
    <p>asdf</p>
  );
};

export default GetUserInfo;
