import styles from "../styles/scheduleRegister.module.css";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from "uuid";
import CustomButton from "./CustomButton";
import { EventObjType } from "../types";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { isSameDate } from "../utils/isSameDate";
import { dateFormatter } from "../utils/dateFormatter";
import SelectColor from "./SelectColor";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
type Props = {
  setIsShow: Dispatch<SetStateAction<boolean>>;
  clickData: {
    allDay: boolean;
    date: Date;
    dateStr: string;
  }
  setShowSnackbar: Dispatch<SetStateAction<boolean>>;
  setSnackbarMsg: Dispatch<SetStateAction<string>>;
};

const ScheduleRegister = ({ setIsShow, clickData, setShowSnackbar, setSnackbarMsg }: Props) => {
  const addSchedule = useAddSchedules();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EventObjType>({
    id: "",
    title: "",
    allDay: clickData?.allDay,
    createdAt: new Date(),
    date: clickData.date.toISOString(),
    dateStr: clickData.dateStr,
    extendedProps: {
      desc: "",
      backgroundColor: "#3788D8",
      borderColor: "#3788D8",
    }
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (modalRef.current &&
          !modalRef.current.contains(target) &&
          !target.closest('[data-role="color-dropdown"]')
        ) {
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
    if (form.title !== "") {
      try {
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
        setSnackbarMsg("スケジュールを登録しました。");
        setShowSnackbar(true);
      } catch (err: any) {
        setIsShow(false);
        setSnackbarMsg(`${err.code}: スケジュールの登録に失敗しました。もう一度やり直してください。`);
        setShowSnackbar(true);
      }
    } else {
      setOpen(true);
    }
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
          <CustomButton
            type="submit"
            disabled={false}
            value="登録"
            styleName="registerBtn"
          /> 
          <CustomButton
            type="button"
            disabled={false}
            value="キャンセル"
            onClick={setIsShow}
            styleName="cancelBtn"
          />
        </div>
      </form>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <DialogContentText>
            タイトルが入力されていません。
            タイトルを入力してください。
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined" color="warning">閉じる</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleRegister;