import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";

type ArgsType = {
  title: string;
  createdAt: Date;
  dayInfo?: {
    date: Date;
    dateStr: string;
    allDay: boolean;
  };
  daysInfo?: {
    start: Date;
    end: Date;
    startStr: string;
    endStr: string;
    allDay: boolean;
  }
}

export const addSchedules = async ({title, createdAt, dayInfo, daysInfo}: ArgsType) => {
  if (auth.currentUser) {
    const schedulesRef = collection(db, "user", auth.currentUser.uid, "schedules");
    const data: ArgsType = {
      title,
      createdAt,
    };
    if (dayInfo) {
      data.dayInfo = dayInfo
    } else if (daysInfo) {
      data.daysInfo = daysInfo
    }
    await addDoc(schedulesRef, data);
  }
}
