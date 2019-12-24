import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getMonthName } from '../util';

function noop() {
}

class CalendarHeader extends Component {
  onYearChange(year) {
    const newValue = this.props.value.clone();
    newValue.year(parseInt(year, 10));
    this.props.onValueChange(newValue);
  }

  onMonthChange(month) {
    const newValue = this.props.value.clone();
    newValue.month(parseInt(month, 10));
    this.props.onValueChange(newValue);
  }

  onWeekChange(week) {
    const newValue = this.props.value.clone();
    newValue.week(parseInt(week, 10));
    this.props.onValueChange(newValue);
  }

  yearSelectElement(year) {
    const { yearSelectOffset, yearSelectTotal, prefixCls, Select } = this.props;
    const start = year - yearSelectOffset;
    const end = start + yearSelectTotal;

    const options = [];
    for (let index = start; index < end; index++) {
      options.push(<Select.Option key={`${index}`}>{index}</Select.Option>);
    }
    return (
      <Select
        className={`${prefixCls}-header-year-select`}
        onChange={this.onYearChange.bind(this)}
        dropdownStyle={{ zIndex: 2000 }}
        dropdownMenuStyle={{ maxHeight: 250, overflow: 'auto', fontSize: 12 }}
        optionLabelProp="children"
        value={String(year)}
        showSearch={false}
      >
        { options }
      </Select>
    );
  }

  monthSelectElement(month) {
    const props = this.props;
    const t = props.value.clone();
    const { prefixCls } = props;
    const options = [];
    const Select = props.Select;

    for (let index = 0; index < 12; index++) {
      t.month(index);
      options.push(
        <Select.Option key={`${index}`}>
          {getMonthName(t)}
        </Select.Option>
      );
    }

    return (
      <Select
        className={`${prefixCls}-header-month-select`}
        dropdownStyle={{ zIndex: 2000 }}
        dropdownMenuStyle={{ maxHeight: 250, overflow: 'auto', overflowX: 'hidden', fontSize: 12 }}
        optionLabelProp="children"
        value={String(month)}
        showSearch={false}
        onChange={this.onMonthChange.bind(this)}
      >
        { options }
      </Select>
    );
  }

  changeTypeToDate() {
    this.props.onTypeChange('date');
  }

  changeTypeToMonth() {
    this.props.onTypeChange('month');
  }

  changeTypeToWeek() {
    this.props.onTypeChange('week');
  }

  renderTitle() {
    const { type, mode, prefixCls } = this.props;
    const titleCls = `${prefixCls}-header-title`;
    let title = null;
    let handlePrev = null;
    let handleNext = null;
    if (type === 'month') {
      title = this.props.value.format(`YYYY`);
      handlePrev = () => {
        this.onYearChange(this.props.value.year() - 1);
      };
      handleNext = () => {
        this.onYearChange(this.props.value.year() + 1);
      };
    } else if (type === 'date' && mode !== 'week') {
      title = this.props.value.format('YYYY MM');
      handlePrev = () => {
        this.onMonthChange(this.props.value.month() - 1);
      };
      handleNext = () => {
        this.onMonthChange(this.props.value.month() + 1);
      };
    } else if (type === 'date' && mode === 'week') {
      title = this.props.value.format('YYYY wo');
      handlePrev = () => {
        this.onWeekChange(this.props.value.week() - 1);
      };
      handleNext = () => {
        this.onWeekChange(this.props.value.week() + 1);
      };
    }
    return (
      <span className={`${titleCls}`}>
        <span className={`${titleCls}-prev`} onClick={handlePrev} />
        <span>{title}</span>
        <span className={`${titleCls}-next`} onClick={handleNext} />
      </span>
    );
  }

  render() {
    const {
      value,
      locale,
      prefixCls,
      type,
      showTypeSwitch,
      headerComponents,
      backToday,
      mode,
    } = this.props;
    const year = value.year();
    const month = value.month();
    const yearSelect = this.yearSelectElement(year);
    const monthSelect = type === 'month' ? null : this.monthSelectElement(month);
    const switchCls = `${prefixCls}-header-switcher`;
    const typeSwitcher = showTypeSwitch ? (
      <span className={switchCls}>
        { type === 'month' ?
          <span className={`${switchCls}-focus`}>{locale.year}</span> :
          <span
            onClick={this.changeTypeToMonth.bind(this)}
            className={`${switchCls}-normal`}
          >
            {locale.year}
          </span>
        }
        {(type === 'date' && mode !== 'week') ?
          <span className={`${switchCls}-focus`}>{locale.month}</span> :
          <span
            onClick={this.changeTypeToDate.bind(this)}
            className={`${switchCls}-normal`}
          >
            {locale.month}
          </span>
        }
        {
          (type === 'date' && mode === 'week') ?
            <span className={`${switchCls}-focus`}>{locale.week}</span> :
            <span
              onClick={this.changeTypeToWeek.bind(this)}
              className={`${switchCls}-normal`}
            >
            {locale.week}
          </span>
        }
      </span>
    ) : null;

    return (
      <div className={`${prefixCls}-header`}>
        {this.renderTitle()}
        { typeSwitcher }
        { monthSelect }
        { yearSelect }
        {
          backToday ? (
            <button className={`${prefixCls}-header-back-today`} onClick={() => {
              this.props.onValueChange(moment());
            }}
            >{locale.today}</button>
          ) : null
        }
        { headerComponents }
      </div>
    );
  }
}
CalendarHeader.propTypes = {
  value: PropTypes.object,
  locale: PropTypes.object,
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  onValueChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  Select: PropTypes.func,
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  showTypeSwitch: PropTypes.bool,
  backToday: PropTypes.bool,
  headerComponents: PropTypes.array,
  mode: PropTypes.string,
};
CalendarHeader.defaultProps = {
  yearSelectOffset: 10,
  yearSelectTotal: 20,
  onValueChange: noop,
  onTypeChange: noop,
};

export default CalendarHeader;
