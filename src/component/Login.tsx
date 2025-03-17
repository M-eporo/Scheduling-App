import styles from "../styles/login.module.css";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, UserCredential } from "firebase/auth"
import { auth, db, provider } from "../firebase"
import { useState } from "react";
import GoogleIcon from '@mui/icons-material/Google';
import Input from "./Input";
import Container from "./Container";
import Button from "./Button";
import { doc, setDoc } from "firebase/firestore";
import NewAccountForm from "./NewAccountForm";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [isShow, setIsShow] = useState(false);

  //const user = useAppSelector((state => state.user.user));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const saveUserToFirestore = async (user: UserCredential) => {
    try {
      await setDoc(doc(db, "user", user.user.uid), {
        uid: user.user.uid,
        name: user.user.displayName,
        photoURL: user.user.photoURL,
        createdAt: new Date().toISOString()
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
      console.log(result);
      if (!result.user.emailVerified) {
        alert("メールアドレスが未確認です。")
        auth.signOut();
      }
      console.log(result);
    } catch (err) {
      console.error(err);
      alert("ログインに失敗しました。");
    }
  };

  //Google Login
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      if (result.user) {
        await saveUserToFirestore(result);
      }
    } catch (err) {
      console.error(err)
      alert("ログインに失敗しました。");
    }
  };

  //パスワード再設定
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
        {isShow && <NewAccountForm setIsShow={setIsShow} />}
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
            <Button type="submit" disabled={!form.email || !form.password} value="ログイン" styleName="loginBtn"></Button>
          </form>
        </div>
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <p className={styles.button} onClick={passwordChange}>パスワードをお忘れですか？</p>
            <p className={styles.button} onClick={() => setIsShow(prevState => !prevState)}>新規アカウント登録</p>
            <div className={styles.flexContainer}>
              <GoogleIcon />
              <p className={styles.button} onClick={googleLogin}>Googleでログイン</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Login;