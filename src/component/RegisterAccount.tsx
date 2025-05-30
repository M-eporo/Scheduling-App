import { useState } from "react";
import styles from "../styles/registerAccount.module.css";
import Input from "./Input";
import CustomButton from "./CustomButton";
import { createUserWithEmailAndPassword, sendEmailVerification, UserCredential } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type FormType = {
  name: string;
  displayName: string;
  email: string;
  password: string;
}
type Props = {
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
};

const RegisterAccount = ({ setIsShow, setShowSnackbar, setSnackbarMsg }: Props) => {
  const [form, setForm] = useState<FormType>({
    name: "",
    displayName: "",
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
        displayName: form.displayName,
        email: form.email,
        emailVerified: user.user.emailVerified,
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.log(err);
    }
  };
  //ユーザー登録 & メール確認を送信
  const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
      if (result.user) {
        await sendEmailVerification(result.user);
        saveUserToFireStore(result);
        setSnackbarMsg("メールアドレス認証用のメールを送信しました。受信ボックスを確認してください。");
        setShowSnackbar(true);
      }
    } catch (error) {
      setSnackbarMsg(`アカウント作成に失敗しました。`);
      setShowSnackbar(true);
    }
    setIsShow(false);
  };
  return (
    <div className={styles.container}>
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
            <div className={styles.btnContainer}>
              <CustomButton
                styleName="registerBtn"
                type="submit"
                disabled={!form.name || !form.displayName || !form.email || !form.password}
                value="登録"
              />
              <CustomButton
                styleName="cancelBtn"
                type="button"
                disabled={false}
                value="キャンセル"
                onClick={() => setIsShow(prevState => !prevState)}
              />
            </div>
          </form>
        </>
    </div>
  )
}

export default RegisterAccount;