import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAppDispatch } from "../app/hooks";
import { addSchedulesReducer } from "../features/scheduleSlice";
import { EventObjType } from "../types";

export const useAddSchedules = () => {
  const dispatch = useAppDispatch();

  const addSchedule = async ({
    id, title, desc = "", allDay = true, createdAt,
    date = "", dateStr = "", 
    start = "", end = "", startStr = "", endStr = "",
    bgColor, borderColor
  }: EventObjType) => {
    if (auth.currentUser) {
      const docRef = doc(db, "user", auth.currentUser.uid, "schedules", id as string);
      const data: EventObjType = {
        id,
        title,
        desc,
        allDay,
        createdAt,
        bgColor,
        borderColor
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
        await setDoc(docRef, data, {merge: true});
        dispatch(addSchedulesReducer(data));
      } catch (err) {
        console.error("スケジュール追加エラー: ", err);
      }
    }
  };
  return addSchedule;
};
