import styles from "../styles/modal.module.css";
import { EventType, InitialEventType } from "../types";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { dateFormatter } from "../utils/dateFormatter";
import Button from "./Button";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAddSchedules } from "../hooks/useAddSchedule";

type Props = {
  setIsAlterShow: Dispatch<SetStateAction<boolean>>;
  setStoredSchedules: Dispatch<SetStateAction<InitialEventType>>;
  data: EventType;
};

const Modal = (({
  setIsAlterShow,
  setStoredSchedules,
  data
}: Props) => {

  const addSchedules = useAddSchedules();

  const [form, setForm] = useState({
    id: data[0].id,
    title: data[0].title,
    allDay: data[0].allDay,
    createdAt: data[0].createdAt,
    date: data[0].date,
    dateStr: data[0].dateStr,
    start: data[0].start,
    end: data[0].end,
    startStr: data[0].startStr,
    endStr: data[0].endStr,
  });
  console.log(data);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  console.log(form);
  // const handleFormChecked = (e: ChangeEvent<HTMLInputElement>) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]: e.target.checked
  //   });
  // };
  //イベント情報の更新
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.currentUser) {
      if (!data[0].id) return;
      const answer = confirm("スケジュールを更新します。\nよろしいですか?");
      if (answer) {
        addSchedules({
          id: data[0].id,
          title: form.title ? form.title : data[0].title,
          allDay: data[0].allDay,
          createdAt: data[0].createdAt as string,
          date: data[0].date,
          dateStr: data[0].dateStr,
          start: data[0].start,
          end: data[0].end,
          startStr: data[0].startStr,
          endStr: data[0].endStr,
        });
        if (form.title) {
          setStoredSchedules(prevSchedules => prevSchedules.map((schedule) => {
            if (schedule.id === data[0].id) {
              return {
                ...schedule,
                title: form.title
              };
            }
            return schedule;
          }));
        } 
      }
    }
  };

  //イベントを削除
  const handleDelete = async () => {
    if (auth.currentUser) {
      if (!data[0].id) return;
      const docRef = doc(db, "user", auth.currentUser.uid, "schedules", data[0].id);
      const answer = confirm("スケジュールを削除します。\nよろしいですか?");
      if (answer) {
        await deleteDoc(docRef);
        setStoredSchedules(prevEvents => prevEvents.filter((prevEvent) => {
        return prevEvent.id !== data[0].id;
        }));
      }
      setIsAlterShow(false);
    } else {
      auth.signOut();
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h4 className={styles.title}>{
          data[0].dateStr &&
          dateFormatter(data[0].dateStr)
        }</h4>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder={data[0].title}
            name="title"
            id="id"
            value={form.title}
            onChange={handleChange}
          />
          <div className={styles.btnContainer}>
            <Button
              type="submit"
              disabled={false}
              value="変更"
              styleName="alterBtn"
            />
            <Button
              type="button"
              disabled={false}
              value="削除"
              onClick={handleDelete}
              styleName="deleteBtn"
            />
            <Button
              type="button"
              disabled={false}
              value="キャンセル"
              onClick={setIsAlterShow}
              styleName="cancelBtn"
            />
          </div>
        </form>
        
      </div>
    </>
  )
});

export default Modal;