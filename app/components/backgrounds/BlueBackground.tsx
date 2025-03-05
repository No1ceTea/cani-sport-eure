import React from "react";
import styles from "./BlueBackground.module.css";

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.background}>{children}</div>;
};

export default Background;