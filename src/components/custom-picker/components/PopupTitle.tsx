import { FunctionComponent } from 'react';
import { View } from '@tarojs/components';
import styles from '../index.module.scss';

const PopupTitle: FunctionComponent<{ setFalse: any; onConfirm: any }> = ({
  setFalse,
  onConfirm,
}) => {
  return (
    <View className={styles['popup-title']}>
      <View onClick={() => setFalse()} className={styles['popup-cancel']}>
        取消
      </View>
      <View className={styles['popup-text']}>选择日期</View>
      <View onClick={onConfirm} className={styles['popup-confirm']}>
        确定
      </View>
    </View>
  );
};

export default PopupTitle;
