import { ReactNode } from "react";
import styles from "../styles/container.module.css";

type ChildrenProps = {
  children: ReactNode;
};

const Container = ({ children }:ChildrenProps) => {
  return (
    <div className={styles.default}>
      {children}
    </div>
  )
}

export default Container