import {
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useState,
} from "react";
import { useBoolean } from "ahooks";
import { View, PickerView, PickerViewColumn } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";
import styles from "./index.module.scss";
import { dateLimit, scrollLimit } from "./utils";
import PopupTitle from "./components/PopupTitle";

/* eslint-disable react/no-unused-prop-types */
interface DynamicDatePickerProps {
  type?: "date" | "year-month";
  defaultDate?: string;
  minDate?: string;
  maxDate?: string;
  onConfirm: (options: number[]) => void;
}

export interface CustomPickerRef {
  handleOpenPopup: () => void;
  onConfirm: () => void;
}

const DynamicDatePicker: ForwardRefRenderFunction<
  CustomPickerRef,
  DynamicDatePickerProps
> = (props, ref) => {
  const type = props?.type || "date";
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  console.log(props, "propspropsprops");

  const handleOpenPopup = () => {
    setTrue();
    const { yearList, monthList, dayList, yearIdx, monthIdx, dayIdx } =
      dateLimit(props, type);

    setYears(yearList);
    setMonths(monthList);
    setDays(dayList);

    console.log(yearList, "yearList");
    console.log(monthList, "monthList");
    console.log(dayList, "dayList");

    setSelected(
      type === "year-month" ? [yearIdx, monthIdx] : [yearIdx, monthIdx, dayIdx]
    );
  };

  const onConfirm = () => {
    const [yIdx, mIdx, dIdx] = selected;

    if (type === "year-month") {
      props?.onConfirm?.([years[yIdx], months[mIdx]]);
    } else {
      props?.onConfirm?.([years[yIdx], months[mIdx], days[dIdx]]);
    }

    setFalse();
  };

  const handleChange = (e: any) => {
    const values = e?.detail?.value;
    const { yIdx, mIdx, dIdx, monthList, dayList } = scrollLimit(
      values,
      props,
      years,
      setYears,
      type
    );

    setMonths(monthList);
    if (type !== "year-month") setDays(dayList);
    setSelected(type === "year-month" ? [yIdx, mIdx] : [yIdx, mIdx, dIdx]);
  };

  useImperativeHandle(ref, () => ({ handleOpenPopup, onConfirm }));

  return (
    <Popup
      visible={visible}
      position="bottom"
      round={false}
      className={styles["popup-content"]}
      style={{ height: "46%" }}
      onOverlayClick={() => setFalse()}
      destroyOnClose
    >
      <PopupTitle setFalse={setFalse} onConfirm={onConfirm} />

      <PickerView
        value={selected}
        onChange={handleChange}
        style={{ flex: 1 }}
        indicatorStyle="height: 60px"
      >
        {/* 年 */}
        <PickerViewColumn>
          {years.map((y) => {
            console.log(y, "y");

            return (
              <View key={y} className={styles["selected-text"]}>
                {y}年
              </View>
            );
          })}
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
        {type !== "year-month" && (
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
