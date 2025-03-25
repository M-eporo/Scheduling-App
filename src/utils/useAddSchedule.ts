import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { EventObjType } from "../types";
import { useAppDispatch } from "../app/hooks";
import { addSchedulesReducer } from "../features/scheduleSlice";

export const useAddSchedules = () => {
  const dispatch = useAppDispatch();

  const addSchedule = async ({
    id, title, allDay = true, createdAt,
    date = "", dateStr = "", 
    start = "", end = "", startStr = "", endStr = ""
  }: EventObjType) => {
    if (auth.currentUser) {
      const schedulesRef = collection(db, "user", auth.currentUser.uid, "schedules");
      const data: EventObjType = {
        id,
        title,
        allDay,
        createdAt
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
        await addDoc(schedulesRef, data);
        dispatch(addSchedulesReducer(data));
      } catch (err) {
        console.error("スケジュール追加エラー: ", err);
      }
    }
  };
  return addSchedule;
};
