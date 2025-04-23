import { SetStateAction, useState } from "react";
import { auth, db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from "@mui/material";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const AlertDialog = ({ open, setOpen }: Props) => {
  const user = auth.currentUser;
  //Alert Dialogを閉じる用
  const handleClose = () => setOpen(false);

  //再認証が必要な時のState、ハンドラー、パスワード
  const [innerShow, setInnerShow] = useState(false);
  const handleInnerClose = () => setInnerShow(false);
  const [password, setPassword] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(e.target.value);
  };

  //アカウント削除完了した時のスナックバーのState、ハンドラー
  const [seccessMsg, setSuccessMsg] = useState(false);

  //アカウント削除関数
  const accountDelete = async () => {
    if (!user) return;
    const uid = user.uid;
    try {
      await deleteUserData(uid);
      await user.delete();
      setOpen(false);
      setSuccessMsg(true);
    } catch (err: any) {
      //再認証のエラーが起きた場合
      if (err.code === "auth/requires-recent-login") {
        //dialogを呼び出す
        setInnerShow(true);
      }
    }
  };
  //Firestoreのユーザーデータ削除関数
  const deleteUserData = async (uid: string) => {
    await deleteDoc(doc(db, "user", uid))
  };

  const reauthenticationAndDelete = async (password: string) => {
    if (!user) return;
    const providerId = user.providerData[0]?.providerId;
    try {
      if (providerId === "password") {
        const credential = EmailAuthProvider.credential(user.email!, password);
        await reauthenticateWithCredential(user, credential);
      } else if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      }
      const uid = user.uid;
      await deleteUserData(uid);
      await user.delete();
    } catch (err: any) {
      alert("再認証またはアカウント削除に失敗しました。再度ログインしてください。");
    }
  }

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        アカウント情報削除
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          アカウントを削除するとスケジュールは全て削除されます。本当に削除しますか？。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={accountDelete} color="warning">アカウント削除</Button>
      </DialogActions>
      </Dialog>
      {/* 再認証が必要な場合のダイアログ */}
      <Dialog
        open={innerShow}
        onClose={handleInnerClose}
        aria-labelledby="reauthentication-dialog-title"
        aria-describedby="reauthentication-dialog-description"
        slotProps={{
          paper: {
            component: "form",
            onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              reauthenticationAndDelete(password);
              setInnerShow(false);
              setOpen(false);
              setSuccessMsg(true);
            }
          }
        }}
      >
        <DialogTitle id="reauthentication-dialog-title">
          再認証が必要です
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reauthentication-dialog-description">
            前回のログインから時間が経過しています。アカウントを削除するにはパスワードを入力して下さい。
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            margin="normal"
            id="passward"
            name="password"
            label="パスワード"
            variant="filled"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="warning">アカウント削除</Button>
          <Button onClick={handleInnerClose}>キャンセル</Button>
        </DialogActions>
      </Dialog>
      {/* 完了メッセージ */}
      <Snackbar
        open={seccessMsg}
        autoHideDuration={3000}
        message="アカウント削除が完了しました"
        onClose={() => setSuccessMsg(false)}
      />
    </>
  );
};
export default AlertDialog;