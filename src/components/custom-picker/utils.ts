import dayjs from "dayjs";
import { TYPE_YEAR_MONTH, DEFAULT_RANGE, LOAD_RANGE } from "./constants";

/**
 * 获取指定年月的天数数组
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 天数数组，例如 [1, 2, 3, ..., 30/31]
 */
export const getDaysInMonth = (year: number, month: number) =>
  Array.from(
    { length: dayjs(`${year}-${month}`).daysInMonth() }, // 获取当月天数
    (_, i) => i + 1 // 返回从 1 开始的天数数组
  );

/**
 * 获取限制范围内的月份
 * @param year 当前年份
 * @param minDate 最小日期（可选）
 * @param maxDate 最大日期（可选）
 * @returns 可选月份数组（1-12，可能被 min/max 限制）
 */
const getLimitedMonths = (year: number, minDate?: string, maxDate?: string) => {
  // 默认月份 1-12
  let months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 如果年份等于 minDate 的年份，则过滤小于 minDate 月份
  if (minDate && year === dayjs(minDate).year()) {
    months = months.filter((m) => m >= dayjs(minDate).month() + 1);
  }

  // 如果年份等于 maxDate 的年份，则过滤大于 maxDate 月份
  if (maxDate && year === dayjs(maxDate).year()) {
    months = months.filter((m) => m <= dayjs(maxDate).month() + 1);
  }

  return months;
};

/**
 * 获取限制范围内的天数
 * @param year 年份
 * @param month 月份（1-12）
 * @param minDate 最小日期（可选）
 * @param maxDate 最大日期（可选）
 * @returns 可选天数数组（1-31，可能被 min/max 限制）
 */
const getLimitedDays = (
  year: number,
  month: number,
  minDate?: string,
  maxDate?: string
) => {
  let days = getDaysInMonth(year, month);

  // 如果年月等于 minDate 的年月，则过滤小于 minDate 的天
  const minDay =
    minDate &&
    year === dayjs(minDate).year() &&
    month === dayjs(minDate).month() + 1;

  if (minDay) {
    days = days.filter((d) => d >= dayjs(minDate).date());
  }

  // 如果年月等于 maxDate 的年月，则过滤大于 maxDate 的天
  const maxDay =
    maxDate &&
    year === dayjs(maxDate).year() &&
    month === dayjs(maxDate).month() + 1;

  if (maxDay) {
    days = days.filter((d) => d <= dayjs(maxDate).date());
  }

  return days;
};

/**
 * 初始化日期选择器的数据
 * @param param0 对象参数，包含 defaultDate、minDate、maxDate
 * @param type 类型：'date' 或 'year-month'
 * @returns 包含年份列表、月份列表、天数列表及初始索引
 */
export const dateLimit = (
  { defaultDate, minDate, maxDate }: any,
  type: "date" | "year-month"
) => {
  const current = dayjs();
  // 初始化选择日期，优先使用 defaultDate, 否则使用当前日期
  let initDate = defaultDate ? dayjs(defaultDate) : current;

  // 确保 initDate 在 minDate 和 maxDate 范围内
  if (minDate && initDate.isBefore(dayjs(minDate))) initDate = dayjs(minDate);
  if (maxDate && initDate.isAfter(dayjs(maxDate))) initDate = dayjs(maxDate);

  const year = initDate.year();
  const month = initDate.month() + 1; // dayjs month 从 0 开始
  const day = initDate.date();

  // 年份范围
  const minYear = minDate ? dayjs(minDate).year() : year - DEFAULT_RANGE;
  const maxYear = maxDate ? dayjs(maxDate).year() : year + DEFAULT_RANGE;
  const yearList = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  // 月份列表
  const monthList = getLimitedMonths(year, minDate, maxDate);

  // 天数列表（年月类型不需要天数）
  const dayList =
    type === TYPE_YEAR_MONTH
      ? []
      : getLimitedDays(year, month, minDate, maxDate);

  return {
    yearList, // 可选年份列表
    monthList, // 可选月份列表
    dayList, // 可选天数列表
    yearIdx: yearList?.indexOf(year), // 当前年份索引
    monthIdx: monthList?.indexOf(month), // 当前月份索引
    dayIdx: dayList?.indexOf(day), // 当前天数索引
  };
};

/**
 * 滚动时更新年份、月份、天数
 * @param param0 当前选择索引 [yIdx, mIdx, dIdx]
 * @param param1 minDate/maxDate 对象
 * @param years 年份数组
 * @param setYears 更新年份数组的函数
 * @param type 类型：'date' 或 'year-month'
 * @returns 更新后的索引和月份/天数列表
 */
export const scrollLimit = (
  [yIdx, mIdx, dIdx]: number[],
  { minDate, maxDate }: any,
  years: number[],
  setYears: (updater: (prev: number[]) => number[]) => void,
  type: "date" | "year-month"
) => {
  // 滚动年份范围限制
  const minYear = minDate ? dayjs(minDate).year() : years[0] - DEFAULT_RANGE;
  const maxYear = maxDate
    ? dayjs(maxDate).year()
    : years[years.length - 1] + DEFAULT_RANGE;

  // 前置加载年份（滑动到前3个）
  if (yIdx <= 2) {
    const startYear = Math.max(years[0] - LOAD_RANGE, minYear);
    const prepend = Array.from(
      { length: years[0] - startYear },
      (_, i) => startYear + i
    );
    setYears((prev) => [...prepend, ...prev]);
    yIdx += prepend.length; // 索引同步更新
  }

  // 后置加载年份（滑动到后3个）
  if (yIdx >= years.length - 3) {
    const lastYear = years[years.length - 1];
    const endYear = Math.min(lastYear + LOAD_RANGE, maxYear);
    const append = Array.from(
      { length: endYear - lastYear },
      (_, i) => lastYear + 1 + i
    );
    setYears((prev) => [...prev, ...append]);
  }

  const year = years[yIdx];
  const monthList = getLimitedMonths(year, minDate, maxDate);

  // 修正月份索引，防止越界
  if (mIdx >= monthList.length) mIdx = monthList.length - 1;
  const month = monthList[mIdx];

  let dayList: number[] = [];

  if (type !== TYPE_YEAR_MONTH) {
    dayList = getLimitedDays(year, month, minDate, maxDate);
    // 修正天数索引，防止越界
    if (dIdx >= dayList.length) dIdx = dayList.length - 1;
  }

  return { yIdx, mIdx, dIdx, monthList, dayList };
};
