import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAppDispatch } from "../app/hooks";
import { addSchedulesReducer } from "../features/scheduleSlice";
import { EventObjType } from "../types";

export const useAddSchedules = () => {
  const dispatch = useAppDispatch();

  const addSchedule = async ({
    id, title, allDay = true, createdAt,
    date = "", dateStr = "", 
    start = "", end = "", startStr = "", endStr = "",
    extendedProps
  }: EventObjType) => {
    if (auth.currentUser) {
      const docRef = doc(db, "user", auth.currentUser.uid, "schedules", id as string);
      const data: EventObjType = {
        id,
        title,
        allDay,
        createdAt,
        extendedProps
      }
      if (date && dateStr) {
        data.date = date;
        data.dateStr = dateStr;
      }
      if (start && end) {
        data.start = start;
        data.end = end;
        data.startStr = startStr;
        data.endStr = endStr;
      };
      try {
        await setDoc(docRef, {...data, createdAt: serverTimestamp()}, {merge: true});
        dispatch(addSchedulesReducer({...data, createdAt: new Date().toISOString()}));
      } catch (err) {
        console.error("スケジュール追加エラー: ", err);
      }
    }
  };
  return addSchedule;
};
