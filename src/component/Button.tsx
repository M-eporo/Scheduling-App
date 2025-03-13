import styles from "../styles/button.module.css";
type ButtonProps = {
  type: "submit" | "reset" | "button" | undefined;
  disabled: boolean;
  value: string;
  styleName: string;
  onClick?: (value: React.SetStateAction<boolean>) => void;
  signOut?: () => Promise<void>;
};
const Button = ({ type, disabled, value, styleName, onClick, signOut }: ButtonProps) => {
  return (
    <button
      className={styles[styleName]}
      type={type}
      disabled={disabled}
      onClick={async () => {
        if (onClick) {
          onClick((prevState: boolean) => !prevState)
        }
        if (signOut) {
          await signOut();
        }
      }}
    >
      {value}
    </button>
  );
};
 
export default Button;