import React from "react";
import styles from "./styles.module.scss";

const AspectRatioBox = ({ children, ratio = 1 }) => {
  return (
    <div className={styles.aspect_ratio}>
      <div className={styles.aspect_ratio__item}>{children}</div>
      <div
        className={styles.aspect_ratio__shape}
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
      />
    </div>
  );
};

export default AspectRatioBox;
