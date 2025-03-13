import { useState } from "react";
import styles from "../styles/newAccountForm.module.css";
import Input from "./Input";
import Button from "./Button";
import { createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

type FormType = {
  name: string;
  nickname: string;
  email: string;
  password: string;
}
type Props = {
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewAccountForm = ({setIsShow}: Props) => {
  const [form, setForm] = useState<FormType>({
    name: "",
    nickname: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //Firestoreにユーザー情報を登録
  const saveUserToFireStore = async (user: UserCredential) => {
    try {
      await setDoc(doc(db, "user", user.user.uid), {
        uid: user.user.uid,
        name: form.name,
        nickname: form.nickname,
        createdAt: new Date().toISOString(),
      }, { merge: true });
      console.log("アカウント登録しました");
    } catch (err) {
      console.log(err);
    }
  };
  //ユーザー登録 & メール確認を送信
  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      console.log(result);
      if (result.user) {
        await sendEmailVerification(result.user);
        if (result.user.emailVerified) {
          await saveUserToFireStore(result);
        } else {
          alert("メールアドレスが未確認です。")
        }
        
      }
      alert("新規カウント作成しました。メールを確認してください。");
    } catch (err) {
      console.log(err);
      alert("アカウント作成に失敗しました。");
    }
  };
  return (
    <div className={styles.container}>
      <h4 className={styles.heading}>新規アカウント登録</h4>
      <form onSubmit={createAccount} className={styles.form}>
        <div className={styles.innerContainer}>
        <Input
          type="text"
          placeholder="お名前"
          name="name"
          id="name"
          value={form}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="ニックネーム"
          name="nickname"
          id="nickname"
          value={form}
          onChange={handleChange}
        />
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
        </div>
        <Button
          styleName="loginBtn"
          type="submit"
          disabled={!form.name || !form.nickname || !form.email || !form.password}
          value="登録"
        />
        <Button
          styleName="cancelBtn"
          type="button"
          disabled={false}
          value="キャンセル"
          onClick={() => setIsShow(prevState => !prevState)}
        />
      </form>
    </div>
  )
}

export default NewAccountForm;