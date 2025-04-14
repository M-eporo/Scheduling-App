import styles from "../styles/scheduleRegister.module.css";
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { DateSelectArg } from "@fullcalendar/core";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import { ColorOptionType, EventObjType } from "../types";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { isSameDate } from "../utils/isSameDate";
import { dateFormatter } from "../utils/dateFormatter";
import SelectColor from "./SelectColor";
type Props = {
  setIsShow: Dispatch<SetStateAction<boolean>>;
  data: DateClickArg | DateSelectArg | null;
};

const ScheduleRegister = ({setIsShow, data }: Props) => {
  const addSchedule = useAddSchedules();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // if (inputRef.current) {
  //   inputRef.current.focus();
  // }
  const [form, setForm] = useState<EventObjType>({
    id: "",
    title: "",
    desc: "",
    allDay: data?.allDay,
    createdAt: new Date().toISOString(),
    bgColor: "#3788D8",
    borderColor: "#3788D8",
  });

  const [color, setColor] = useState<ColorOptionType>({
    value: "#3788D8",
    label: "トマト",
    style: "tomato",
  });
  console.log(form);
  useEffect(() => {
    if (data === null) return;
    if ("dateStr" in data) {
      setForm(prev => ({
        ...prev,
        date: data.date.toISOString(),
        dateStr: data.dateStr
      }));
    } else if ("startStr" in data && "endStr" in data) {
      setForm(prev => ({
        ...prev,
        start: data.start.toISOString(),
        startStr: data.startStr,
        end: data.end.toISOString(),
        endStr: data.endStr
      }));
    }
  }, [data]);

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

  useEffect(() => {
    setForm({
      ...form,
      bgColor: color.value,
      borderColor: color.value,
    });
  }, [color]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
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
      desc: form.desc,
      allDay: form.allDay,
      createdAt: form.createdAt,
      date: form.date,
      dateStr: form.dateStr,
      start: form.start,
      end: form.end,
      startStr: form.startStr,
      endStr: form.endStr,
      bgColor: form.bgColor,
      borderColor: form.borderColor,
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
          value={form.desc}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="color">ラベルの色
          <SelectColor setColor={setColor} />
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