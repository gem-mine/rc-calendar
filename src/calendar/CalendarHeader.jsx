import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import toFragment from 'rc-util/lib/Children/mapSelf';
import MonthPanel from '../month/MonthPanel';
import YearPanel from '../year/YearPanel';
import DecadePanel from '../decade/DecadePanel';

function goMonth(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'months');
  this.props.onValueChange(next);
}

function goYear(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'years');
  this.props.onValueChange(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

const CalendarHeader = createReactClass({
  propTypes: {
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    showYear: PropTypes.bool,
    onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    disabledMonth: PropTypes.func,
  },

  getDefaultProps() {
    return {
      enableNext: 1,
      enablePrev: 1,
      showYear: true,
      onPanelChange() { },
      onValueChange() { },
    };
  },

  getInitialState() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return { yearPanelReferer: null };
  },

  onMonthSelect(value) {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  },

  onYearSelect(value) {
    const referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    this.props.onPanelChange(value, referer);
    this.props.onValueChange(value);
  },

  onDecadeSelect(value) {
    this.props.onPanelChange(value, 'year');
    this.props.onValueChange(value);
  },

  monthYearElement(showTimePicker) {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const value = props.value;
    const showYear = props.showYear;
    const localeData = value.localeData();
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
    const timeClassName = showTimePicker ? ` ${prefixCls}-time-status` : '';
    const year = showYear ? (<a
      className={`${prefixCls}-year-select${timeClassName}`}
      role="button"
      onClick={showTimePicker ? null : () => this.showYearPanel('date')}
      title={showTimePicker ? null : locale.yearSelect}
    >
      {value.format(locale.yearFormat)}
    </a>) : null;
    const month = (<a
      className={`${prefixCls}-month-select${timeClassName}`}
      role="button"
      onClick={showTimePicker ? null : this.showMonthPanel}
      title={showTimePicker ? null : locale.monthSelect}
    >
      {locale.monthFormat ? value.format(locale.monthFormat) : localeData.monthsShort(value)}
    </a>);
    let day;
    if (showTimePicker) {
      day = (<a
        className={`${prefixCls}-day-select${timeClassName}`}
        role="button"
      >
        {value.format(locale.dayFormat)}
      </a>);
    }
    let my = [];
    if (monthBeforeYear) {
      my = [month, day, year];
    } else {
      my = [year, month, day];
    }
    return (<span className={selectClassName}>
      {toFragment(my)}
    </span>);
  },

  showMonthPanel() {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  },

  showYearPanel(referer) {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  },

  showDecadePanel() {
    this.props.onPanelChange(null, 'decade');
  },

  render() {
    const { props } = this;
    const {
      prefixCls,
      locale,
      mode,
      value,
      showTimePicker,
      enableNext,
      enablePrev,
      disabledMonth,
      showYear,
    } = props;

    let panel = null;
    if (mode === 'month') {
      panel = (
        <MonthPanel
          locale={locale}
          showYear={showYear}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledMonth}
          cellRender={props.monthCellRender}
          contentRender={props.monthCellContentRender}
        />
      );
    }
    if (mode === 'year') {
      panel = (
        <YearPanel
          locale={locale}
          showYear={showYear}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
        />
      );
    }
    if (mode === 'decade') {
      panel = (
        <DecadePanel
          locale={locale}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onDecadeSelect}
        />
      );
    }

    const disabledPrevMonth = !showYear && parseInt(value.format('M'), 10) === 1;
    const disabledNextMonth = !showYear && parseInt(value.format('M'), 10) === 12;
    const disabledPrevMonthCls = disabledPrevMonth ? `${prefixCls}-month-btn-disabled` : '';
    const disabledNextMonthCls = disabledNextMonth ? `${prefixCls}-month-btn-disabled` : '';

    return (<div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {showIf(enablePrev && !showTimePicker && showYear,
          <a
            className={`${prefixCls}-prev-year-btn`}
            role="button"
            onClick={this.previousYear}
            title={locale.previousYear}
          />)}
        {showIf(enablePrev && !showTimePicker,
          <a
            className={`${prefixCls}-prev-month-btn ${disabledPrevMonthCls}`}
            role="button"
            onClick={disabledPrevMonth ? null : this.previousMonth}
            title={locale.previousMonth}
          />)}
        {this.monthYearElement(showTimePicker)}
        {showIf(enableNext && !showTimePicker,
          <a
            className={`${prefixCls}-next-month-btn ${disabledNextMonthCls}`}
            onClick={disabledNextMonth ? null : this.nextMonth}
            title={locale.nextMonth}
          />)}
        {showIf(enableNext && !showTimePicker && showYear,
          <a
            className={`${prefixCls}-next-year-btn`}
            onClick={this.nextYear}
            title={locale.nextYear}
          />)}
      </div>
      {panel}
    </div>);
  },
});

export default CalendarHeader;
