import styles from "../styles/button.module.css";
type ButtonProps = {
  type: "submit" | "reset" | "button" | undefined;
  disabled: boolean;
  value: string;
  styleName: string;
};
const Button = ({type, disabled, value, styleName}: ButtonProps) => {
  return (
    <button
      className={ styles[styleName] }
      type={type}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Button;