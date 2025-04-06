import styles from "../styles/input.module.css";
type PropsType = {
  type: "email" | "password" | "text" | "date" | "file" | "time" | "checkbox";
  placeholder: string;
  name: string;
  id: string;
  value: {
    name?: string;
    nickname?: string;
    email?: string;
    password?: string;
    startTime?: string;
    endTime?: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input = (
  { type, placeholder, name, id, value, onChange }: PropsType
) => {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={type}>
        {placeholder}
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          name={name}
          id={id}
          value={value[name as keyof typeof value]}
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default Input;