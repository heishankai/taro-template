import { FunctionComponent, memo } from "react";
import { View } from "@tarojs/components";
import styles from "../index.module.scss";

interface PopupTitleProps {
  setFalse: () => void;
  onConfirm: () => void;
  title?: string;
}

const PopupTitle: FunctionComponent<PopupTitleProps> = ({
  setFalse,
  onConfirm,
  title,
}) => {
  console.log("title", title);

  return (
    <View className={styles["popup-title"]}>
      <View onClick={() => setFalse()} className={styles["popup-cancel"]}>
        取消
      </View>
      <View className={styles["popup-text"]}>{title}</View>
      <View onClick={onConfirm} className={styles["popup-confirm"]}>
        确定
      </View>
    </View>
  );
};

export default memo(PopupTitle);
