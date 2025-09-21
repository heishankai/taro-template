import dayjs from 'dayjs';

const DEFAULT_RANGE = 50; // 默认前后50年

// 获取月份天数
export const getDaysInMonth = (year: number, month: number | string) => {
  return Array.from({ length: dayjs(`${year}-${month}`).daysInMonth() }, (_, i) => i + 1);
};

// 日期限制处理
export const dateLimit = (props: any, type: 'date' | 'year-month') => {
  const { defaultDate, minDate, maxDate } = props ?? {};
  const current = dayjs();
  let initialDate = defaultDate ? dayjs(defaultDate) : current;

  if (minDate && initialDate.isBefore(dayjs(minDate))) initialDate = dayjs(minDate);
  if (maxDate && initialDate.isAfter(dayjs(maxDate))) initialDate = dayjs(maxDate);

  const currentYear = initialDate.year();
  const currentMonth = initialDate.month() + 1;
  const currentDate = initialDate.date();

  const minYear = minDate ? dayjs(minDate).year() : currentYear - DEFAULT_RANGE;
  const maxYear = maxDate ? dayjs(maxDate).year() : currentYear + DEFAULT_RANGE;
  const yearList = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  let monthList = Array.from({ length: 12 }, (_, i) => i + 1);
  if (currentYear === minYear && minDate)
    monthList = monthList.filter((m) => m >= dayjs(minDate).month() + 1);
  if (currentYear === maxYear && maxDate)
    monthList = monthList.filter((m) => m <= dayjs(maxDate).month() + 1);

  let dayList: number[] = [];
  if (type !== 'year-month') {
    dayList = getDaysInMonth(currentYear, currentMonth);
    if (
      minDate &&
      currentYear === dayjs(minDate).year() &&
      currentMonth === dayjs(minDate).month() + 1
    )
      dayList = dayList.filter((d) => d >= dayjs(minDate).date());
    if (
      maxDate &&
      currentYear === dayjs(maxDate).year() &&
      currentMonth === dayjs(maxDate).month() + 1
    )
      dayList = dayList.filter((d) => d <= dayjs(maxDate).date());
  }

  return {
    yearList,
    monthList,
    dayList,
    yearIdx: yearList.indexOf(currentYear),
    monthIdx: monthList.indexOf(currentMonth),
    dayIdx: dayList.indexOf(currentDate),
  };
};

// 滚动限制处理
export const scrollLimit = (values, props, years, setYears, type: 'date' | 'year-month') => {
  let [yIdx, mIdx, dIdx] = values;
  const { minDate, maxDate } = props ?? {};
  const loadRange = 30;

  const minYear = minDate ? dayjs(minDate).year() : years[0] - DEFAULT_RANGE;
  const maxYear = maxDate ? dayjs(maxDate).year() : years[years.length - 1] + DEFAULT_RANGE;

  // 前置加载年份
  if (yIdx <= 2) {
    const startYear = Math.max(years[0] - loadRange, minYear);
    const newYears = Array.from({ length: years[0] - startYear }, (_, i) => startYear + i);
    setYears((prev) => [...newYears, ...prev]);
    yIdx += newYears.length;
  }

  // 后置加载年份
  if (yIdx >= years.length - 3) {
    const lastYear = years[years.length - 1];
    const endYear = Math.min(lastYear + loadRange, maxYear);
    const newYears = Array.from({ length: endYear - lastYear }, (_, i) => lastYear + 1 + i);
    setYears((prev) => [...prev, ...newYears]);
  }

  const year = years[yIdx];

  let monthList = Array.from({ length: 12 }, (_, i) => i + 1);
  if (minDate && year === dayjs(minDate).year())
    monthList = monthList.filter((m) => m >= dayjs(minDate).month() + 1);
  if (maxDate && year === dayjs(maxDate).year())
    monthList = monthList.filter((m) => m <= dayjs(maxDate).month() + 1);

  if (mIdx >= monthList.length) mIdx = monthList.length - 1;
  const month = monthList[mIdx];

  let dayList: number[] = [];
  if (type !== 'year-month') {
    dayList = getDaysInMonth(year, month);
    if (minDate && year === dayjs(minDate).year() && month === dayjs(minDate).month() + 1)
      dayList = dayList.filter((d) => d >= dayjs(minDate).date());
    if (maxDate && year === dayjs(maxDate).year() && month === dayjs(maxDate).month() + 1)
      dayList = dayList.filter((d) => d <= dayjs(maxDate).date());

    if (dIdx >= dayList.length) dIdx = dayList.length - 1;
  }

  return { yIdx, mIdx, dIdx, monthList, dayList };
};
