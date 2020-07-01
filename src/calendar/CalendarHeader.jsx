import React from 'react';
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

export default class CalendarHeader extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    value: PropTypes.object,
    onValueChange: PropTypes.func,
    showTimePicker: PropTypes.bool,
    showYear: PropTypes.bool,
    onPanelChange: PropTypes.func,
    locale: PropTypes.object,
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    disabledDate: PropTypes.func,
    disabledMonth: PropTypes.func,
    renderFooter: PropTypes.func,
    onMonthSelect: PropTypes.func,
    onYearSelect: PropTypes.func,
  }

  static defaultProps = {
    enableNext: 1,
    enablePrev: 1,
    showYear: true,
    onPanelChange() { },
    onValueChange() { },
    picker: 'date',
  }

  constructor(props) {
    super(props);

    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);

    this.state = { yearPanelReferer: null };
  }

  onMonthSelect = (value) => {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  }

  onYearSelect = (value) => {
    const referer = this.state.yearPanelReferer;
    this.setState({ yearPanelReferer: null });
    this.props.onPanelChange(value, referer || 'month');
    if (this.props.onYearSelect) {
      this.props.onYearSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  }

  onDecadeSelect = (value) => {
    this.props.onPanelChange(value, 'year');
    this.props.onValueChange(value);
  }

  changeYear = (direction) => {
    if (direction > 0) {
      this.nextYear();
    } else {
      this.previousYear();
    }
  }

  monthYearElement = (showTimePicker) => {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const picker = props.picker;
    const value = props.value;
    const showYear = props.showYear;
    const localeData = value.localeData();
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
    const timeClassName = showTimePicker ? ` ${prefixCls}-time-status` : '';
    const year = showYear && picker !== 'year' ? (<a
      className={`${prefixCls}-year-select${timeClassName}`}
      role="button"
      onClick={showTimePicker ? null : () => this.showYearPanel('date')}
      title={showTimePicker ? null : locale.yearSelect}
    >
      {value.format(locale.yearFormat)}
    </a>) : null;
    let month;
    if (picker === 'date') {
      month = (<a
        className={`${prefixCls}-month-select${timeClassName}`}
        role="button"
        onClick={showTimePicker ? null : this.showMonthPanel}
        title={showTimePicker ? null : locale.monthSelect}
      >
        {locale.monthFormat ? value.format(locale.monthFormat) : localeData.monthsShort(value)}
      </a>);
    }
    let decade;
    if (picker === 'year') {
      const currentYear = value.year();
      const startYear = parseInt(currentYear / 10, 10) * 10;
      const endYear = startYear + 9;
      decade = (
        <a
          className={`${prefixCls}-decade-select${timeClassName}`}
          role="button"
          onClick={showTimePicker ? null : this.showDecadePanel}
          title={showTimePicker ? null : locale.decadeSelect}
        >
          {startYear}-{endYear}
        </a>
      );
    }
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
      my = [decade, month, day, year];
    } else {
      my = [decade, year, month, day];
    }
    return (<span className={selectClassName}>
      {toFragment(my)}
    </span>);
  }

  showMonthPanel = () => {
    // null means that users' interaction doesn't change value
    this.props.onPanelChange(null, 'month');
  }

  showYearPanel = (referer) => {
    this.setState({ yearPanelReferer: referer });
    this.props.onPanelChange(null, 'year');
  }

  showDecadePanel = () => {
    this.props.onPanelChange(null, 'decade');
  }

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
      disabledDate,
      disabledMonth,
      renderFooter,
      showYear,
      monthCellRender,
      monthCellContentRender,
      disabledYear,
      yearCellRender,
      yearCellContentRender,
      picker,
      selectedValue,
    } = props;

    let panel = null;
    // month range not show default monthpanel
    if (mode === 'month' && picker !== 'month') {
      panel = (
        <MonthPanel
          locale={locale}
          value={value}
          showYear={showYear}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onMonthSelect}
          onYearPanelShow={() => this.showYearPanel('month')}
          disabledDate={disabledDate}
          disabledMonth={disabledMonth}
          cellRender={monthCellRender}
          contentRender={monthCellContentRender}
          renderFooter={renderFooter}
          changeYear={this.changeYear}
          selectedValue={selectedValue}
        />
      );
    }
    // 同上; 不能用CalendarHeader内的，含有默认逻辑
    if (mode === 'year' && picker !== 'year') {
      panel = (
        <YearPanel
          locale={locale}
          value={value}
          showYear={showYear}
          defaultValue={value}
          rootPrefixCls={prefixCls}
          onSelect={this.onYearSelect}
          onDecadePanelShow={this.showDecadePanel}
          renderFooter={renderFooter}
          disabledDate={disabledDate}
          disabledYear={disabledYear}
          cellRender={yearCellRender}
          contentRender={yearCellContentRender}
          selectedValue={selectedValue}
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
          renderFooter={renderFooter}
          selectedValue={selectedValue}
        />
      );
    }

    const disabledPrevMonth = !showYear && parseInt(value.format('M'), 10) === 1;
    const disabledNextMonth = !showYear && parseInt(value.format('M'), 10) === 12;
    const disabledPrevMonthCls = disabledPrevMonth ? `${prefixCls}-month-btn-disabled` : '';
    const disabledNextMonthCls = disabledNextMonth ? `${prefixCls}-month-btn-disabled` : '';
    return (<div className={`${prefixCls}-header`}>
      <div style={{ position: 'relative' }}>
        {showIf(enablePrev && !showTimePicker && picker === 'year',
          <a
            className={`${prefixCls}-prev-decade-btn`}
            role="button"
            onClick={this.previousDecade}
            title={locale.previousDecade}
          />)}
        {showIf(enablePrev
          && !showTimePicker
          && showYear
          && (picker === 'month' || picker === 'date'),
          <a
            className={`${prefixCls}-prev-year-btn`}
            role="button"
            onClick={this.previousYear}
            title={locale.previousYear}
          />)}
        {showIf(enablePrev && !showTimePicker && picker === 'date',
          <a
            className={`${prefixCls}-prev-month-btn ${disabledPrevMonthCls}`}
            role="button"
            onClick={disabledPrevMonth ? null : this.previousMonth}
            title={locale.previousMonth}
          />)}
        {this.monthYearElement(showTimePicker)}
        {showIf(enableNext && !showTimePicker && picker === 'date',
          <a
            className={`${prefixCls}-next-month-btn ${disabledNextMonthCls}`}
            onClick={disabledNextMonth ? null : this.nextMonth}
            title={locale.nextMonth}
          />)}
        {showIf(enableNext
          && !showTimePicker
          && showYear
          && (picker === 'month' || picker === 'date'),
          <a
            className={`${prefixCls}-next-year-btn`}
            onClick={this.nextYear}
            title={locale.nextYear}
          />)}
        {showIf(enableNext && !showTimePicker && picker === 'year',
          <a
            className={`${prefixCls}-next-decade-btn`}
            role="button"
            onClick={this.nextDecade}
            title={locale.nextDecade}
          />)}
      </div>
      {panel}
    </div>);
  }
}
