import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from './util/index';
import DateTable from './date/DateTable';

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
    const { prefixCls, locale } = props;
    const monthsEls = months.map((month) => {
      const tds = month.map(monthData => {
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
        let cellEl;
        const currentValue = value.clone();
        currentValue.month(monthData.value);
        cellEl = (
          <div className={`${prefixCls}`} style={{ height: '250px', width: '250px' }}>
            <div className={`${prefixCls}-title`}>
              {currentValue.localeData().months(currentValue)}
            </div>
            <DateTable
              fullscreen={false}
              dateRender={props.dateCellRender}
              contentRender={props.dateCellContentRender}
              locale={locale}
              prefixCls={`rc-calendar`} // todo: 优化
              onSelect={props.onSelect}
              value={currentValue}
              disabledDate={props.disabledDate}
            />
          </div>
        );

        return (
          <div
            role="gridcell"
            key={monthData.value}
            onClick={disabled ? null : chooseMonth.bind(this, monthData.value)}
            title={monthData.title}
            className={classnames(classNameMap)}
          >
            {cellEl}
          </div>);
      });
      return tds;
    });

    return monthsEls;
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
