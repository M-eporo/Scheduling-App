import styles from "../styles/input.module.css";
type PropsType = {
  type: "email" | "password";
  placeholder: string;
  name: string;
  id: string;
  value: {
    email: string;
    password: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = (
  { type, placeholder, name, id, value, onChange }: PropsType
) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={type}>
        {type}
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          value={type === "email" ? value.email : value.password}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Input;