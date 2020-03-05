import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function chooseMonth(month) {
  const next = this.state.value.clone();
  next.month(month);
  this.setAndSelectValue(next);
}

function noop() {

}

class MonthTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  }

  setAndSelectValue(value) {
    this.setState({
      value,
    });
    this.props.onSelect(value);
  }

  months() {
    const value = this.state.value;
    const current = value.clone();
    const months = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      months[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        current.month(index);
        const content = getMonthName(current);
        months[rowIndex][colIndex] = {
          value: index,
          content,
          title: content,
        };
        index++;
      }
    }
    return months;
  }

  render() {
    const props = this.props;
    const value = this.state.value;
    const today = getTodayTime(value);
    const months = this.months();
    const currentMonth = value.month();
    const { prefixCls, locale, contentRender, cellRender, hoverValue, selectedValue } = props;
    const rangeValue = (hoverValue && hoverValue.length) ? hoverValue : selectedValue;
    const monthsEls = months.map((month, index) => {
      const tds = month.map(monthData => {
        let disabled = false;
        const testValue = value.clone().month(monthData.value);
        if (props.disabledDate || props.disabledMonth) {
          // disabled = props.disabledDate(testValue);
          if (props.disabledDate) {
            disabled = props.disabledDate(testValue);
          }

          if (props.disabledMonth) {
            disabled = props.disabledMonth(testValue);
          }
        }

        let isSelected = false;
        let isInRange = false;
        if (rangeValue && Array.isArray(rangeValue)) {
          const startValue = rangeValue[0];
          const endValue = rangeValue[1];

          if (startValue && endValue) {
            isSelected = testValue.isSame(startValue, 'month') ||
              testValue.isSame(endValue, 'month');
            isInRange = testValue.isAfter(startValue, 'month') &&
              testValue.isBefore(endValue, 'month');
          } else if (startValue) {
            isSelected = testValue.isSame(startValue, 'month');
          }
        } else {
          isSelected = monthData.value === currentMonth;
        }

        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-in-range-cell`]: isInRange,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: isSelected,
          [`${prefixCls}-current-cell`]: today.year() === value.year() &&
          monthData.value === today.month(),
        };
        let cellEl;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = (
            <a className={`${prefixCls}-month`}>
              {content}
            </a>
          );
        }
        const firstDay = value.clone().month(monthData.value).startOf('day');
        return (
          <td
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? null : chooseMonth.bind(this, monthData.value)}
            title={monthData.title}
            className={classnames(classNameMap)}
            onMouseEnter={disabled ? undefined :
              (props.onMonthHover && props.onMonthHover.bind(null, firstDay) || undefined)}
          >
            {cellEl}
          </td>);
      });
      return (<tr key={index} role="row">{tds}</tr>);
    });

    return (
      <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody className={`${prefixCls}-tbody`}>
        {monthsEls}
        </tbody>
      </table>
    );
  }
}

MonthTable.defaultProps = {
  onSelect: noop,
};
MonthTable.propTypes = {
  onSelect: PropTypes.func,
  cellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: PropTypes.object,
};
export default MonthTable;
