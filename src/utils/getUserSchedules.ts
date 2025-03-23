import { collection, DocumentData, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export const getUserSchedules = async () => {
  if (!auth.currentUser) return;

  const userId: string = auth.currentUser.uid;
  const schedulesRef = collection(db, "user", userId, "schedules");
  //ログインユーザーのスケジュールをfirestoreから取得
  const querySnapShot = await getDocs(schedulesRef);

  const schedules = querySnapShot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    const convertTimestamp = (timestamp: DocumentData) => {
      if (timestamp && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toISOString();
      }
      return timestamp;
    };
    return {
      title: data.title,
      allDay: data.allDay,
      createdAt: convertTimestamp(data.createdAt),
      date: data.date,
      dateStr: data.dateStr,
      start: convertTimestamp(data.start),
      end: convertTimestamp(data.end),
      startStr: data.startStr,
      endStr: data.endStr,
    };
  });

  return schedules;
};
