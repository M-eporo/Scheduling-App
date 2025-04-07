import { useEffect, useState } from "react";
import { EventType } from "../types";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

export const useGetUserSchedules = () => {
  const [schedules, setSchedules] = useState<EventType>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const collectionRef = collection(db, "user", auth.currentUser.uid, "schedules");

    const unsubscribe = onSnapshot(collectionRef, (snapshots) => {
      const documents: EventType = [];
      snapshots.forEach((doc) => {
        const document = doc.data();
        documents.push({
          id: document.id,
          title: document.title,
          desc: document.desc,
          allDay: document.allDay,
          createdAt: document.createdAt,
          date: document.date,
          dateStr: document.dateStr,
          start: document.start,
          end: document.end,
          startStr: document.startStr,
          endStr: document.endStr,
        });
      });
      setSchedules(documents);
    });
    return () => unsubscribe();
  }, []);

  return schedules;
};