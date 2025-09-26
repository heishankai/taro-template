import type { PopupProps } from "@nutui/nutui-react-taro";

type YearMonth = [number, number]; // 年-月类型
type YearMonthDay = [number, number, number]; // 年-月-日类型
export type YearMonthOrDay = "date" | "year-month"; // 选择类型

export interface DynamicDatePickerProps {
  type?: YearMonthOrDay; // 选择类型，默认 date
  defaultDate?: string; // 默认日期
  minDate?: string; // 限制最小日期
  maxDate?: string; // 限制最大日期
  title?: string; // 弹窗标题
  onConfirm: (options: YearMonth | YearMonthDay) => void; // 确认选择回调
  popupProps?: Partial<PopupProps>; // 支持对 popup 的自定义
}

export interface CustomPickerRef {
  handleOpenPopup: () => void;
  onConfirm: (options: YearMonth | YearMonthDay) => void;
}
