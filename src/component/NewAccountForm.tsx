import { useEffect, useState } from "react";
import styles from "../styles/newAccountForm.module.css";
import Input from "./Input";
import Button from "./Button";
import { createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import EmailVerifying from "./EmailVerifying";
import { useAppSelector } from "../app/hooks";

type FormType = {
  name: string;
  displayName: string;
  email: string;
  password: string;
}
type Props = {
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewAccountForm = ({ setIsShow }: Props) => {
  const user = useAppSelector((state) => state.user.user);
  
  const [form, setForm] = useState<FormType>({
    name: "",
    displayName: "",
    email: "",
    password: "",
  });
  const [showVerified, setShowVerified] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //Firestoreにユーザー情報を登録
  const saveUserToFireStore = async (user: UserCredential) => {
    try {
      await setDoc(doc(db, "user", user.user.uid), {
        uid: user.user.uid,
        name: form.name,
        displayName: form.displayName,
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
      setShowVerified(true);
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

  useEffect(() => {
    if (user?.emailVerified) {
      setShowVerified(true);
    }
  },[user]);
  return (
    <div className={styles.container}>
      {showVerified ? (
        <EmailVerifying/>
      ) : (
        <>
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
              placeholder="表示名"
              name="displayName"
              id="displayName"
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
              disabled={!form.name || !form.displayName || !form.email || !form.password}
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
        </>
    )}
    </div>
  )
}

export default NewAccountForm;