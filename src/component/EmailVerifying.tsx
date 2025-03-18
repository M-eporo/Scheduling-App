import styles from "../styles/emailVerifying.module.css";

const EmailVerifying = () => {
  return (
    <div className={styles.cover}>
      <p>登録したメールアドレスにメールアドレス確認用のメールを送信しました。メールを確認してください。</p>
    </div>
  )
}

export default EmailVerifying;