import styles from "../styles/scheduleRegister.module.css";
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { DateSelectArg } from "@fullcalendar/core";
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import { EventObjType } from "../types";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { isSameDate } from "../utils/isSameDate";
import { dateFormatter } from "../utils/dateFormatter";
type Props = {
  setIsShow: Dispatch<SetStateAction<boolean>>;
  data: DateClickArg | DateSelectArg | null;
};

const ScheduleRegister = ({setIsShow, data }: Props) => {
  console.log(data);
  const addSchedule = useAddSchedules();

  const id = uuidv4();
  const [form, setForm] = useState<EventObjType>({
    id,
    title: "",
    desc: "",
    allDay: data?.allDay,
    createdAt: new Date().toISOString(),
  });
  useEffect(() => {
    if (data === null) return;
    if ("dateStr" in data) {
      setForm({
        ...form,
        date: data.date.toISOString(),
        dateStr: data.dateStr
      });
    } else if ("startStr" in data && "endStr" in data) {
      setForm({
        ...form,
        start: data.start.toISOString(),
        startStr: data.startStr,
        end: data.end.toISOString(),
        endStr: data.endStr
      });
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addSchedule({
      id: form.id,
      title: form.title,
      allDay: form.allDay,
      createdAt: form.createdAt,
      start: form.start,
      end: form.end,
      startStr: form.startStr,
      endStr: form.endStr,
    });
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{
        form.startStr && form.endStr && isSameDate(form.startStr, form.endStr)
        ?
        dateFormatter(form.startStr)
        :
        form.startStr && form.endStr && !isSameDate(form.startStr, form.endStr)
          ?
          `${dateFormatter(form.startStr)} ～ ${dateFormatter(form.endStr,true, isSameDate(form.startStr, form.endStr))}`
          :
            form.startStr && !form.endStr
            ?
            dateFormatter(form.startStr)
            :
            form.dateStr && dateFormatter(form.dateStr)
      }</h4>
      <form onSubmit={handleSubmit}>
        
        <input
          className={styles.input}
          type="text"
          placeholder="タイトル"
          name="title"
          id="title"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          placeholder="詳細を登録"
          className={styles.textarea}
          name="desc"
          id="desc"
          value={form.desc}
          onChange={handleChange}
        ></textarea>
        <div className={styles.btnContainer}>
          <Button
            type="submit"
            disabled={false}
            value="登録"
            styleName="registerBtn"
          />
          <Button
            type="button"
            disabled={false}
            value="キャンセル"
            onClick={setIsShow}
            styleName="cancelBtn"
          />
        </div>
      </form>
    </div>
  );
};

export default ScheduleRegister;