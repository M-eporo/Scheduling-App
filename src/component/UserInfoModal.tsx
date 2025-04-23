import styles from "../styles/userInfoModal.module.css";
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from "@mui/material";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserType } from "../types";
import AlertDialog from "./AlertDialog";

type Props = {
  user: UserType;
}

const UserInfoModal = ({ user }: Props) => {
  //UserInfoModal表示用のStateとHandler
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //アカウント削除ボタン押下
  const [dialogShow, setDialogShow] = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleClick = async () => {
    try {
      if (user?.uid) {
        await setDoc(doc(db, "user", user.uid), {
          displayName: form.displayName,
        }, { merge: true} );
      }
    } catch (err) {
      console.log(err);
    }
    setOpen(false);
  };
  
  return (
    <div>
      <IconButton onClick={handleOpen}>
        <KeyboardArrowRightOutlinedIcon />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
      >
        <Box className={styles.box}>
          <Typography id="modal-title" variant="h5" component="h5" className={styles.modalTitle}>
            ユーザー情報
          </Typography>
          <Divider variant="middle" />
          <TextField
            id="uid"
            name="uid"
            label="ユーザーID"
            defaultValue={user?.uid}
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            helperText="Read Only"
            margin="normal"
          />
          
            <TextField
              id="name"
              name="name"
              label="お名前"
              defaultValue={user?.name ? user.name : user?.displayName}
              slotProps={{
                input: {
                  readOnly: true,
                }
              }}
            helperText="Read Only"
            margin="normal"
            />
          <TextField
            id="displayName"
            name="displayName"
            label="表示名"
            defaultValue={user?.displayName}
            margin="normal"
            onChange={handleChange}
          />
          <TextField
            id="email"
            name="email"
            label="メールアドレス"
            defaultValue={user?.email}
            slotProps={{
              input: {
                readOnly: true,
              }
            }}
            helperText="Read Only"
            margin="normal"
          />
          {}
          <Button
            variant="outlined"
            color="success"
            size="medium"
            onClick={handleClick}
            disabled={user?.photo ? true : false}
          >変更を登録</Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            sx={{ marginTop: "16px" }}
            onClick={() => setDialogShow(true)}
          >
            アカウント削除
          </Button>
          {dialogShow && <AlertDialog open={dialogShow} setOpen={setDialogShow} />}
        </Box>
      </Modal>
    </div>
  )
}

export default UserInfoModal;