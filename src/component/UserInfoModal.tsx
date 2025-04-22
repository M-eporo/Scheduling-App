import styles from "../styles/userInfoModal.module.css";
import { Box, Button, Divider, IconButton, Modal, TextField, Typography } from "@mui/material";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { useState } from "react";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { UserType } from "../types";

// type Props = {
//   guser: {
//     uid: string;
//     photo: string;
//     email: string;
//     displayName: string;
//     emailVerified: boolean;
//   } | null
//   euser: {
//     uid: string;
//     name: string;
//     displayName: string;
//     email: string;
//     emailVerified: boolean;
//   } | null
// };
type Props = {
  user: UserType;
}

// const UserInfoModal = ({euser, guser}: Props) => {
const UserInfoModal = ({user}: Props ) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const user = euser ? euser : guser;

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

  const handleDelete = async () => {
    if (user) {
      try {
        await auth.currentUser?.delete();
        await deleteDoc(doc(db, "user", user.uid));
      } catch (err) {
        console.log(err);
      }
    }
    
    
      
  }
  
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
            onClick={handleDelete}
          >
            アカウント削除
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default UserInfoModal;