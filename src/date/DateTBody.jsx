import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateConstants from './DateConstants';
import { getTitleString, getTodayTime, getTitleNoYearString } from '../util/';

function isSameDay(one, two) {
  return one && two && one.isSame(two, 'day');
}

// function beforeCurrentMonthYear(current, today) {
//   if (current.year() < today.year()) {
//     return 1;
//   }
//   return current.year() === today.year() &&
//     current.month() < today.month();
// }
//
// function afterCurrentMonthYear(current, today) {
//   // 判断比如12月的时候， 1月的部分天数需要置灰的时候
//   if (current.year() > today.year()) {
//     return 1;
//   }
//   return current.year() === today.year() &&
//     current.month() > today.month();
// }

function getIdFromDate(date) {
  return `rc-calendar-${date.year()}-${date.month()}-${date.date()}`;
}

export default class DateTBody extends React.Component {
  static propTypes = {
    mode: PropTypes.string,
    contentRender: PropTypes.func,
    dateRender: PropTypes.func,
    disabledDate: PropTypes.func,
    prefixCls: PropTypes.string,
    selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
    value: PropTypes.object,
    hoverValue: PropTypes.any,
    showWeekNumber: PropTypes.bool,
    showYear: PropTypes.bool,
    full: PropTypes.bool, // 是否是在年面板下
  }

  static defaultProps = {
    hoverValue: [],
    showYear: true,
  }

  render() {
    const props = this.props;
    const {
      contentRender, prefixCls, selectedValue, value,
      showWeekNumber, dateRender, disabledDate,
      hoverValue, mode, showYear, firstDayOfWeek: propsFirstDayOfWeek,
      firstDayOfMonth,
    } = props;
    let iIndex;
    let jIndex;
    let current;
    const dateTable = [];
    const today = getTodayTime(value);
    const cellClass = `${prefixCls}-cell`;
    const weekNumberCellClass = `${prefixCls}-week-number-cell`;
    const dateClass = `${prefixCls}-date`;
    const todayClass = `${prefixCls}-today`;
    const selectedClass = `${prefixCls}-selected-day`;
    const selectedDateClass = `${prefixCls}-selected-date`;  // do not move with mouse operation
    const selectedStartDateClass = `${prefixCls}-selected-start-date`;
    const selectedEndDateClass = `${prefixCls}-selected-end-date`;
    const inRangeClass = `${prefixCls}-in-range-cell`;
    const lastMonthDayClass = `${prefixCls}-last-month-cell`;
    const nextMonthDayClass = `${prefixCls}-next-month-btn-day`;
    const disabledClass = `${prefixCls}-disabled-cell`;
    const firstDisableClass = `${prefixCls}-disabled-cell-first-of-row`;
    const lastDisableClass = `${prefixCls}-disabled-cell-last-of-row`;
    const lastDayOfMonthClass = `${prefixCls}-last-day-of-month`;
    const month1 = value.clone();
    const firstDayOfWeek = propsFirstDayOfWeek === undefined
      ? value.localeData().firstDayOfWeek()
      : propsFirstDayOfWeek;
    if (mode !== 'week') {
      // 有selectedValue表示是点击选中的, 否则则是初始化的时候
      if (selectedValue) {
        // 如果大于21 那么就是这个月的21，如果小于21  那么就是上个月的21
        if (month1.date() >= firstDayOfMonth) {
          month1.date(firstDayOfMonth);
        } else {
          month1.subtract(1, 'months').date(firstDayOfMonth);
        }
      } else {
        month1.date(firstDayOfMonth);
      }
    }

    // 定义相对的第一个月的第一天和最后一天  用来对比 置灰日期
    const firstDay = month1.clone();
    const lastDay = month1.clone().add(1, 'months').subtract(1, 'days');
    const day = month1.day();
    const lastMonthDiffDay = (day + 7 - firstDayOfWeek) % 7;
    // calculate last month
    const lastMonth1 = month1.clone();
    lastMonth1.add(0 - lastMonthDiffDay, 'days');
    let passed = 0;

    // 如果是week模式，只显示一行
    const rowCount = mode === 'week' ? 1 : DateConstants.DATE_ROW_COUNT;
    for (iIndex = 0; iIndex < rowCount; iIndex++) {
      for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex++) {
        current = lastMonth1;
        if (passed) {
          current = current.clone();
          current.add(passed, 'days');
        }
        dateTable.push(current);
        passed++;
      }
    }
    const tableHtml = [];
    passed = 0;

    for (iIndex = 0; iIndex < rowCount; iIndex++) {
      let isCurrentWeek;
      let weekNumberCell;
      let isActiveWeek = false;
      const dateCells = [];
      if (showWeekNumber) {
        weekNumberCell = (
          <td
            key={dateTable[passed].week()}
            role="gridcell"
            className={weekNumberCellClass}
          >
            {dateTable[passed].week()}
          </td>
        );
      }
      for (jIndex = 0; jIndex < DateConstants.DATE_COL_COUNT; jIndex++) {
        let next = null;
        let last = null;
        current = dateTable[passed];
        if (jIndex < DateConstants.DATE_COL_COUNT - 1) {
          next = dateTable[passed + 1];
        }
        if (jIndex > 0) {
          last = dateTable[passed - 1];
        }
        let cls = cellClass;
        let disabled = false;
        let selected = false;

        if (isSameDay(current, today)) {
          cls += ` ${todayClass}`;
          isCurrentWeek = true;
        }

        const isBeforeCurrentMonthYear = current < firstDay;
        const isAfterCurrentMonthYear = current > lastDay;

        // const isBeforeCurrentMonthYear = beforeCurrentMonthYear(current, value);
        // const isAfterCurrentMonthYear = afterCurrentMonthYear(current, value);

        if (selectedValue && Array.isArray(selectedValue)) {
          const rangeValue = hoverValue.length ? hoverValue : selectedValue;
          if (!isBeforeCurrentMonthYear && !isAfterCurrentMonthYear) {
            const startValue = rangeValue[0];
            const endValue = rangeValue[1];
            if (startValue) {
              if (isSameDay(current, startValue)) {
                selected = true;
                isActiveWeek = true;
                cls += ` ${selectedStartDateClass}`;
              }
            }
            if (startValue || endValue) {
              if (isSameDay(current, endValue)) {
                selected = true;
                isActiveWeek = true;
                cls += ` ${selectedEndDateClass}`;
              } else if ((startValue === null || startValue === undefined) &&
                current.isBefore(endValue, 'day')) {
                cls += ` ${inRangeClass}`;
              } else if ((endValue === null || endValue === undefined) &&
                current.isAfter(startValue, 'day')) {
                cls += ` ${inRangeClass}`;
              } else if (current.isAfter(startValue, 'day') &&
                current.isBefore(endValue, 'day')) {
                cls += ` ${inRangeClass}`;
              }
            }
          }
        } else if (isSameDay(current, value)) {
          // todo： 按键事件问题
          // keyboard change value, highlight works
          // 年面板下 点击选中的不是对应的日期则不是选中的日期
          // 每个月都已一天能被 isSameDay(current, value) 命中
          if (current !== selectedValue && props.full) {
            selected = false;
          } else {
            selected = true;
            // todo: 这个变量是否有影响
            isActiveWeek = true;
          }
        }
        if (isSameDay(current, selectedValue)) {
          cls += ` ${selectedDateClass}`;
        }

        if (isBeforeCurrentMonthYear) {
          cls += ` ${lastMonthDayClass}`;
          if (props.full) {
            cls += ` ${lastMonthDayClass}-hidden`;
          }
        }

        if (isAfterCurrentMonthYear) {
          cls += ` ${nextMonthDayClass}`;
          if (props.full) {
            cls += ` ${lastMonthDayClass}-hidden`;
          }
        }

        if (current.clone().endOf('month').date() === current.date()) {
          cls += ` ${lastDayOfMonthClass}`;
        }

        if (disabledDate) {
          if (disabledDate(current, value)) {
            disabled = true;

            if (!last || !disabledDate(last, value)) {
              cls += ` ${firstDisableClass}`;
            }

            if (!next || !disabledDate(next, value)) {
              cls += ` ${lastDisableClass}`;
            }
          }
        }

        if (selected) {
          cls += ` ${selectedClass}`;
        }

        if (disabled) {
          cls += ` ${disabledClass}`;
        }

        let dateHtml;
        if (dateRender) {
          dateHtml = dateRender(current, value);
        } else {
          const content = contentRender ? contentRender(current, value) : current.date();
          dateHtml = (
            <div
              key={getIdFromDate(current)}
              className={dateClass}
              aria-selected={selected}
              aria-disabled={disabled}
            >
              {content}
            </div>);
        }

        dateCells.push(
          <td
            key={passed}
            onClick={disabled ? undefined : props.onSelect.bind(null, current)}
            onMouseEnter={disabled ?
              undefined : props.onDayHover && props.onDayHover.bind(null, current) || undefined}
            role="gridcell"
            title={showYear ? getTitleString(current) : getTitleNoYearString(current)}
            className={cls}
          >
            {dateHtml}
          </td>);

        passed++;
      }


      tableHtml.push(
        <tr
          key={iIndex}
          role="row"
          className={cx({
            [`${prefixCls}-current-week`]: isCurrentWeek,
            [`${prefixCls}-active-week`]: isActiveWeek,
          })}
        >
          {weekNumberCell}
          {dateCells}
        </tr>);
    }
    return (<tbody className={`${prefixCls}-tbody`}>
      {tableHtml}
    </tbody>);
  }
}

DateTBody.defaultProps = {
  firstDayOfMonth: 1,
};
