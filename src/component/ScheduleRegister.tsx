import styles from "../styles/scheduleRegister.module.css";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import { EventObjType } from "../types";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { isSameDate } from "../utils/isSameDate";
import { dateFormatter } from "../utils/dateFormatter";
import SelectColor from "./SelectColor";
type Props = {
  setIsShow: Dispatch<SetStateAction<boolean>>;
  data: {
    allDay: boolean;
    date: Date;
    dateStr: string;
  }
};

const ScheduleRegister = ({ setIsShow, data }: Props) => {
  const addSchedule = useAddSchedules();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<EventObjType>({
    id: "",
    title: "",
    allDay: data?.allDay,
    createdAt: new Date().toISOString(),
    date: data.date.toISOString(),
    dateStr: data.dateStr,
    extendedProps: {
      desc: "",
      backgroundColor: "#3788D8",
      borderColor: "#3788D8",
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [setIsShow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.title) {
      alert("タイトルが入力されていません。");
      return;
    }
    addSchedule({
      id: uuidv4(),
      title: form.title,
      allDay: form.allDay,
      createdAt: form.createdAt,
      date: form.date,
      dateStr: form.dateStr,
      start: form.start,
      end: form.end,
      startStr: form.startStr,
      endStr: form.endStr,
      extendedProps: form.extendedProps
    });
    setIsShow(false);
  };

  return (
    <div className={styles.container} ref={modalRef}>
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
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="title">タイトル
          <input
            className={styles.input}
            type="text"
            placeholder="予定を入力"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
            ref={inputRef}
          />
        </label>
        <textarea
          placeholder="詳細を入力"
          className={styles.textarea}
          name="desc"
          id="desc"
          value={form.extendedProps.desc}
          onChange={handleNestChange}
        ></textarea>
        <label htmlFor="color">ラベルの色
          <SelectColor form={form} setForm={setForm} />
        </label>
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