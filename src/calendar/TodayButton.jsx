import React from 'react';
import { getTodayTimeStr, getTodayTimeNoYearStr, getTodayTime, isAllowedDate } from '../util/';

export default function TodayButton({
  prefixCls,
  locale,
  value,
  timePicker,
  disabled,
  disabledDate,
  onToday,
  text,
  showYear,
  mode,
}) {
  const localeNow = (!text && timePicker ? locale.now : text) || locale.today;
  const disabledToday =
          disabledDate && !isAllowedDate(getTodayTime(value), disabledDate, null, mode);
  const isDisabled = disabledToday || disabled;
  const disabledTodayClass = isDisabled ?
          `${prefixCls}-today-btn-disabled` : '';
  return (
    <a
      className={`${prefixCls}-today-btn ${disabledTodayClass}`}
      role="button"
      onClick={isDisabled ? null : onToday}
      title={showYear ? getTodayTimeStr(value) : getTodayTimeNoYearStr(value)}
    >
      {localeNow}
    </a>
  );
}
