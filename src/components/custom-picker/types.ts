import type { PopupProps } from "@nutui/nutui-react-taro";
import { TYPE_DATE, TYPE_YEAR_MONTH } from "./constants";

type YearMonth = [number, number]; // 年-月类型
type YearMonthDay = [number, number, number]; // 年-月-日类型

export interface DynamicDatePickerProps {
  type?: typeof TYPE_DATE | typeof TYPE_YEAR_MONTH; // 选择类型，默认 date
  defaultDate?: string; // 默认日期
  minDate?: string; // 限制最小日期
  maxDate?: string; // 限制最大日期
  title?: string; // 弹窗标题
  onConfirm: (options: YearMonth | YearMonthDay) => void; // 确认选择回调
  popupProps?: PopupProps; // 支持对 popup 的自定义
}

export interface CustomPickerRef {
  handleOpenPopup: () => void;
  onConfirm: (options: YearMonth | YearMonthDay) => void;
}
