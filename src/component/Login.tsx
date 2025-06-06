import styles from "../styles/login.module.css";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth"
import { auth, db, provider } from "../firebase"
import { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import Input from "./Input";
import Container from "./Container";
import CustomButton from "./CustomButton";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import RegisterAccount from "./RegisterAccount";
import { Snackbar } from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  //新規登録用フォーム表示用モーダル
  const [isShow, setIsShow] = useState(false);
  //snackbar表示用とメッセージ設定
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const saveUserToFirestore = async (user: UserCredential) => {
    try {
      await setDoc(doc(db, "user", user.user.uid), {
        uid: user.user.uid,
        name: user.user.displayName,
        photoURL: user.user.photoURL,
        email: user.user.email,
        createdAt: serverTimestamp()
      }, { merge: true});
    } catch (err) {
      console.error(err);
    }
  }
  //ログイン - email & password
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);
      if (!result.user.emailVerified) {
        alert("メールアドレスが未確認です。")
        auth.signOut();
      }
    } catch (err) {
      console.error(err);
      alert("ログインに失敗しました。");
    }
  };
  //Google Login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await saveUserToFirestore(result);
      }
    } catch (err) {
      console.error(err)
      alert("ログインに失敗しました。");
    }
  };
  //パスワード再設定 ==============================要チェック
  const passwordChange = async () => {
    if (!form.email) {
      alert("メールアドレスを入力してください。");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      alert("パスワードリセット用メールを送信しました。メールを確認してください。");
    } catch (err) {
      console.error(err);
      alert("パスワードのリセットに失敗しました。");
    }
  };
  
  return (
    <Container>
      <div className={styles.wrapper}>
        {isShow && <RegisterAccount setIsShow={setIsShow} setShowSnackbar={setShowSnackbar} setSnackbarMsg={setSnackbarMsg} />}
        <div className={styles.container}>
          <form onSubmit={login}>
            <Input
              type="email"
              placeholder="メールアドレス"
              name="email"
              id="email"
              value={form}
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="パスワード"
              name="password"
              id="password"
              value={form}
              onChange={handleChange}
            />
            <CustomButton type="submit" disabled={!form.email || !form.password} value="ログイン" styleName="loginBtn"></CustomButton>
          </form>
        </div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <p role="button" className={styles.button} onClick={passwordChange}>パスワードをお忘れですか？</p>
            <p role="button" className={styles.button} onClick={() => setIsShow(prevState => !prevState)}>新規アカウント登録</p>
            <div className={styles.flexContainer}>
              <GoogleIcon />
              <p role="button" className={styles.button} onClick={googleLogin}>Googleでログイン</p>
            </div>
          </div>
        </div>
        
        {showSnackbar &&
          <Snackbar
            open={showSnackbar}
            onClose={() => setShowSnackbar(false)}
            autoHideDuration={4000}
            message={snackbarMsg}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          />
        }
      </div>
    </Container>
  )
}

export default Login;