import {
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useState,
  useCallback,
} from "react";
import { useBoolean } from "ahooks";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";
import type { PopupProps } from "@nutui/nutui-react-taro";
import styles from "./index.module.scss";
// utils
import { dateLimit, scrollLimit } from "./utils";
// components
import PopupTitle from "./components/PopupTitle";

const TYPEDATE = "date"; // YYYY-MM-DD
const TYPEYEARMONTH = "year-month"; // YYYY-MM

interface DynamicDatePickerProps {
  type?: typeof TYPEDATE | typeof TYPEYEARMONTH; // 选择类型，默认 date
  defaultDate?: string; // 默认日期
  minDate?: string; // 限制最小日期
  maxDate?: string; // 限制最大日期
  title?: string; // 弹窗标题
  onConfirm: (options: number[]) => void; // 确认选择回调
  popupProps?: PopupProps; // 支持对 popup 的自定义
}

export interface CustomPickerRef {
  handleOpenPopup: () => void;
  onConfirm: () => void;
}

const DynamicDatePicker: ForwardRefRenderFunction<
  CustomPickerRef,
  DynamicDatePickerProps
> = (
  {
    type = TYPEDATE,
    defaultDate,
    minDate,
    maxDate,
    onConfirm: onConfirmProp,
    popupProps,
    title = "选择日期",
  },
  ref
) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  // 是否为 年月 类型
  const isYearMonthType = type === TYPEYEARMONTH;

  // 打开弹窗
  const handleOpenPopup = useCallback(() => {
    setTrue();
    const { yearList, monthList, dayList, yearIdx, monthIdx, dayIdx } =
      dateLimit({ defaultDate, minDate, maxDate }, type);

    setYears(yearList);
    setMonths(monthList);
    setDays(dayList);

    setSelectedIndexes(
      isYearMonthType ? [yearIdx, monthIdx] : [yearIdx, monthIdx, dayIdx]
    );
  }, [defaultDate, minDate, maxDate, type, isYearMonthType, setTrue]);

  // 确认选择 - 回调
  const handleConfirm = useCallback(() => {
    const [yIdx, mIdx, dIdx] = selectedIndexes;

    if (isYearMonthType) {
      onConfirmProp?.([years[yIdx], months[mIdx]]);
    } else {
      onConfirmProp?.([years[yIdx], months[mIdx], days[dIdx]]);
    }

    setFalse();
  }, [
    selectedIndexes,
    years,
    months,
    days,
    isYearMonthType,
    onConfirmProp,
    setFalse,
  ]);

  // 滑动选择
  const handleChange = useCallback(
    (e: any) => {
      const values = e?.detail?.value;
      const { yIdx, mIdx, dIdx, monthList, dayList } = scrollLimit(
        values,
        { defaultDate, minDate, maxDate },
        years,
        setYears,
        type
      );

      setMonths(monthList);
      if (!isYearMonthType) setDays(dayList);
      setSelectedIndexes(isYearMonthType ? [yIdx, mIdx] : [yIdx, mIdx, dIdx]);
    },
    [years, defaultDate, minDate, maxDate, type, isYearMonthType]
  );

  useImperativeHandle(ref, () => ({
    handleOpenPopup,
    onConfirm: handleConfirm,
  }));

  return (
    <Popup
      {...popupProps}
      visible={visible}
      position="bottom"
      round={false}
      className={styles["popup-content"]}
      style={{ height: "46%" }}
      onOverlayClick={setFalse}
      destroyOnClose
    >
      <PopupTitle setFalse={setFalse} onConfirm={handleConfirm} title={title} />

      <PickerView
        value={selectedIndexes}
        onChange={handleChange}
        style={{ flex: 1 }}
        indicatorClass={styles["indicator-class"]}
      >
        {/* 年 */}
        <PickerViewColumn>
          {years.map((y) => (
            <View key={y} className={styles["selected-text"]}>
              {y}年
            </View>
          ))}
        </PickerViewColumn>

        {/* 月 */}
        <PickerViewColumn>
          {months.map((m) => (
            <View key={m} className={styles["selected-text"]}>
              {m}月
            </View>
          ))}
        </PickerViewColumn>

        {/* 日 */}
        {!isYearMonthType && (
          <PickerViewColumn>
            {days.map((d) => (
              <View key={d} className={styles["selected-text"]}>
                {d}日
              </View>
            ))}
          </PickerViewColumn>
        )}
      </PickerView>
    </Popup>
  );
};

export default forwardRef<CustomPickerRef, DynamicDatePickerProps>(
  DynamicDatePicker
);
