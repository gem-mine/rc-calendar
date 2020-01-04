import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from './util/index';
import DateTable from './date/DateTable';

const ROW = 4;
const COL = 3;

function noop() {

}

class FullCalendarMonthTable extends Component {
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
    const { prefixCls, locale } = props;
    return months.map(month => {
      return month.map(monthData => {
        let disabled = false;
        if (props.disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = props.disabledDate(testValue);
        }
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: monthData.value === currentMonth,
          [`${prefixCls}-current-cell`]: today.year() === value.year() &&
          monthData.value === today.month(),
        };
        const currentValue = value.clone();
        currentValue.month(monthData.value);
        return (
          <div
            role="gridcell"
            key={monthData.value}
            title={monthData.title}
            className={classnames(prefixCls, classNameMap)}
          >
            <div className={`${prefixCls}-title`}>
              {currentValue.localeData().months(currentValue)}
            </div>
            <DateTable
              full // 区分普通的dataTable和作为年面板下的dateTable
              mode={props.mode}
              dateRender={props.dateCellRender}
              contentRender={props.dateCellContentRender}
              locale={locale}
              prefixCls={props.dateTablePrefixCls}
              onSelect={props.onSelect}
              value={currentValue}
              selectedValue={props.selectedValue} // 区分是否是点击选中的
              disabledDate={props.disabledDate}
              firstDayOfMonth={props.firstDayOfMonth}
            />
          </div>
        );
      });
    });
  }
}

FullCalendarMonthTable.defaultProps = {
  onSelect: noop,
};
FullCalendarMonthTable.propTypes = {
  onSelect: PropTypes.func,
  cellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: PropTypes.object,
  dateTablePrefixCls: PropTypes.string,
};
export default FullCalendarMonthTable;
