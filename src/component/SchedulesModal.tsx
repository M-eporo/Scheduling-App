import styles from "../styles/schedulesModal.module.css";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import Button from "./Button";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { dateFormatter } from "../utils/dateFormatter";
import { isSameDate } from "../utils/isSameDate";
import { EventObjType, EventType } from "../types";
import SelectColor from "./SelectColor";

type Props = {
  setIsSchedulesModalShow: Dispatch<SetStateAction<boolean>>;
  setSuccessMsg: Dispatch<SetStateAction<boolean>>;
  setDeleteScheduleMsg: Dispatch<SetStateAction<boolean>>;
  setFailMsg: Dispatch<SetStateAction<boolean>>;
  data: EventType;
};

const SchedulesModal = (({
  setIsSchedulesModalShow,
  setSuccessMsg, setDeleteScheduleMsg, setFailMsg, data
}: Props) => {
  const addSchedules = useAddSchedules();
  const [form, setForm] = useState<EventObjType>({
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
    extendedProps: {
      desc: data[0].extendedProps.desc,
      backgroundColor: data[0].extendedProps.backgroundColor,
      borderColor: data[0].extendedProps.borderColor,
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
  const handleNestChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      extendedProps: {
        ...form.extendedProps,
        [e.target.name]: e.target.value
      }
    });
  };
  //イベント情報の更新
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.currentUser) {
      if (!data[0].id) return;
      const answer = confirm("スケジュールを更新します。\nよろしいですか?");
      if (answer) {
        try {
          addSchedules({
            id: data[0].id,
            title: form.title ? form.title : data[0].title,
            allDay: data[0].allDay,
            createdAt: data[0].createdAt,
            date: data[0].date,
            dateStr: data[0].dateStr,
            start: data[0].start,
            end: data[0].end,
            startStr: data[0].startStr,
            endStr: data[0].endStr,
            extendedProps: form.extendedProps
          });
          setSuccessMsg(true);
        } catch (err) {
          setFailMsg(true);
        }
      } else return;
    } else {
      auth.signOut();
    }
    setIsSchedulesModalShow(false);
  };

  //イベントを削除
  const handleDelete = async () => {
    if (auth.currentUser) {
      if (!data[0].id) return;
      const docRef = doc(db, "user", auth.currentUser.uid, "schedules", data[0].id);
      const answer = confirm("スケジュールを削除します。\nよろしいですか?");
      if (answer) {
        await deleteDoc(docRef);
        setDeleteScheduleMsg(true);
      } else return;
    } else {
      auth.signOut();
    }
    setIsSchedulesModalShow(false);
  };

  return (
    <>
      <div className={styles.container}>
        <h4 className={styles.title}>
          {
            data[0].startStr && data[0].endStr && isSameDate(data[0].startStr, data[0].endStr)
              ?
              dateFormatter(data[0].startStr)
              :
              data[0].startStr && data[0].endStr && !isSameDate(data[0].startStr, data[0].endStr)
              ?
              `${dateFormatter(data[0].startStr)} ～ ${dateFormatter(data[0].endStr,true, isSameDate(data[0].startStr, data[0].endStr))}`
              :
                data[0].startStr && !data[0].endStr
                ?
                dateFormatter(data[0].startStr)
                :
                data[0].dateStr && dateFormatter(data[0].dateStr)
          }
        </h4>
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
          <textarea
            className={styles.textarea}
            name="desc"
            id="desc"
            value={form.extendedProps.desc}
            onChange={handleNestChange}
          ></textarea>
          <label>ラベルの色
            <SelectColor form={form} setForm={setForm} />
          </label>
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
              onClick={setIsSchedulesModalShow}
              styleName="cancelBtn"
            />
          </div>
        </form>
      </div>
    </>
  )
});

export default SchedulesModal;