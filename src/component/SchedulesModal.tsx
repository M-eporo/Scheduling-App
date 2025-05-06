import styles from "../styles/schedulesModal.module.css";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAddSchedules } from "../hooks/useAddSchedule";
import { dateFormatter } from "../utils/dateFormatter";
import { isSameDate } from "../utils/isSameDate";
import { EventObjType, EventType } from "../types";
import SelectColor from "./SelectColor";
import { Dialog, DialogActions, DialogTitle, Button, Box } from "@mui/material";

type Props = {
  setIsSchedulesModalShow: Dispatch<SetStateAction<boolean>>;
  data: EventType;
  setShowSnackbar: Dispatch<SetStateAction<boolean>>;
  setSnackbarMsg: Dispatch<SetStateAction<string>>;
  // setSuccessMsg: Dispatch<SetStateAction<boolean>>;
  // setDeleteScheduleMsg: Dispatch<SetStateAction<boolean>>;
  // setFailMsg: Dispatch<SetStateAction<boolean>>;
  
};

const SchedulesModal = (({
  setIsSchedulesModalShow, data,
  setShowSnackbar, setSnackbarMsg
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

  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [btnTitle, setBtnTitle] = useState("");
  const handleClose = () => setOpen(false);

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
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (auth.currentUser) {
      if (!data[0].id) return;
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
        setSnackbarMsg("スケジュールを更新しました。")
        setShowSnackbar(true);
      } catch (err) {
        setSnackbarMsg("処理に失敗しました。もう一度最初から実行して下さい。")
        setShowSnackbar(true);
      }
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
      await deleteDoc(docRef);
      setSnackbarMsg("スケジュールを削除しました。")
      setShowSnackbar(true);
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
        <form>
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
              onClick={
                () => {
                  setDialogTitle("スケジュールを更新しますか？");
                  setOpen(true);
                  setBtnTitle("更新");
                }
              }
              variant="contained"
              size="large"
              color="success"
              sx={{
                minWidth: "100px"
              }}
            >更新</Button>
            <Button
              onClick={
                () => {
                  setDialogTitle("スケジュールを削除しますか？");
                  setOpen(true);
                  setBtnTitle("削除");
                }
              }
              variant="outlined"
              sx={{
                minWidth: "100px",
                borderColor: "#1B5E20",
                color: "#1B5E20"
              }}
            >削除</Button>
            <Button
              onClick={() => setIsSchedulesModalShow(false)}
              variant="outlined"
              color="warning"
              sx={{
                minWidth: "100px"
              }}
            >キャンセル</Button>
          </div>
        </form>
        <Dialog
          open={open}
          onClose={handleClose}
        >
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <Box sx={{
            padding: "0.5em"
          }}>
          <DialogActions sx={{justifyContent: "space-evenly"}}>
            <Button
                onClick={(e) => {
                  if (btnTitle === "更新") {
                    handleSubmit(e);
                  } else {
                    handleDelete();
                  }
                }
              }
              variant="contained"
              color="success"
              sx={{width: "120px"}}
              >{btnTitle}
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="warning"
              sx={{width: "120px"}}
              >キャンセル
            </Button>
            </DialogActions>
          </Box>
        </Dialog>
        </div>
    </>
  )
});

export default SchedulesModal;