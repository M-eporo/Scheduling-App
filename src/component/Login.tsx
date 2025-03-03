import styles from "../styles/login.module.css";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"
import { useState } from "react";
import { useAppSelector } from "../app/hooks";
import GoogleIcon from '@mui/icons-material/Google';
import Input from "./Input";
import Container from "./Container";
import Button from "./Button";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const user = useAppSelector((state => state.user.user));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  //ユーザー登録 & メール確認を送信
  const createAccount = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log(result);

      if (result.user) {
        await sendEmailVerification(result.user);
      }
      alert("アカウント作成しました。メールを確認してください。");
    } catch (err) {
      console.error(err);
      alert("アカウント作成に失敗しました。");
    }
  };
  //ログイン - email & password
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, form.email, form.password);

      if (!result.user.emailVerified) {
        alert("メールアドレスが未確認です。")
        auth.signOut();
      } else {
        alert("ログインしました。");
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
    } catch (err) {
      console.error(err)
      alert("ログインに失敗しました。");
    }
  };

  //Logout]
  const logout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const isConfirmed = confirm("ログアウトしますか?");
    if (isConfirmed) {
      auth.signOut();
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
        <div>
          <p onClick={passwordChange}>パスワードをお忘れですか？</p>
          <p><button onClick={createAccount} disabled={!form.email || !form.password}>新規アカウント登録</button></p>
          <div>
            <GoogleIcon />
            <button onClick={googleLogin}>Googleでログイン</button>
          </div>
        </div>
        <div>
          <button type="button" onClick={logout} disabled={!user}>ログアウト</button>
        </div>
      </div>
    </Container>
  )
}

export default Login;