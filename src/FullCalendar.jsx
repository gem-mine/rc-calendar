import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import DateTable from './date/DateTable';
import MonthTable from './month/MonthTable';
import FullCalendarMonthTable from './FullMonthTable';
import {
  calendarMixinWrapper,
  calendarMixinPropTypes,
  calendarMixinDefaultProps,
  getNowByCurrentStateValue,
} from './mixin/CalendarMixin';
import { commonMixinWrapper, propType, defaultProp } from './mixin/CommonMixin';
import CalendarHeader from './full-calendar/CalendarHeader';
import moment from 'moment';

class FullCalendar extends React.Component {
  static propTypes = {
    ...calendarMixinPropTypes,
    ...propType,
    mode: PropTypes.string,
    defaultType: PropTypes.string,
    type: PropTypes.string,
    prefixCls: PropTypes.string,
    locale: PropTypes.object,
    onTypeChange: PropTypes.func,
    fullscreen: PropTypes.bool,
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
    showTypeSwitch: PropTypes.bool,
    Select: PropTypes.func.isRequired,
    headerComponents: PropTypes.array,
    headerComponent: PropTypes.object, // The whole header component
    headerRender: PropTypes.func,
    showHeader: PropTypes.bool,
    disabledDate: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    selectedValue: PropTypes.object,
    defaultSelectedValue: PropTypes.object,
    firstDayOfWeek: PropTypes.number,
    firstDayOfMonth: PropTypes.number,
    dateCellContentRender: PropTypes.func,
  }

  static defaultProps = {
    ...calendarMixinDefaultProps,
    ...defaultProp,
    defaultType: 'date',
    fullscreen: false,
    showTypeSwitch: true,
    showHeader: true,
    onTypeChange() {
    },
  }

  constructor(props) {
    super(props);

    let type;
    if ('type' in props) {
      type = props.type;
    } else {
      type = props.defaultType;
    }

    this.state = {
      type,
      value: props.value || props.defaultValue || moment(),
      selectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  }

  onMonthSelect = (value) => {
    this.onSelect(value, {
      target: 'month',
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    let newState = {};
    const { value, selectedValue } = nextProps;

    if ('type' in nextProps) {
      newState = {
        type: nextProps.type,
      };
    }
    if ('value' in nextProps) {
      newState.value = value || nextProps.defaultValue || getNowByCurrentStateValue(state.value);
    }
    if ('selectedValue' in nextProps) {
      newState.selectedValue = selectedValue;
    }

    return newState;
  }

  setType = (type) => {
    if (!('type' in this.props)) {
      this.setState({
        type,
      });
    }
    this.props.onTypeChange(type);
  }

  renderMonthTable = () => {
    const props = this.props;
    const {
      locale,
      fullscreen,
      prefixCls,
      disabledDate,
      firstDayOfWeek,
      firstDayOfMonth,
    } = props;
    const { value, selectedValue } = this.state;
    if (fullscreen) {
      return (
        <FullCalendarMonthTable
          mode={props.mode}
          contentRender={props.monthCellContentRender}
          locale={locale}
          onSelect={this.onSelect}
          prefixCls={`${prefixCls}-month-panel-full`}
          dateTablePrefixCls={prefixCls}
          value={value}
          dateCellRender={props.dateCellRender}
          selectedValue={selectedValue}
          dateCellContentRender={props.dateCellContentRender}
          disabledDate={disabledDate}
          firstDayOfWeek={firstDayOfWeek}
          firstDayOfMonth={firstDayOfMonth}
        />
      );
    }
    return (
      <MonthTable
        cellRender={props.monthCellRender}
        contentRender={props.monthCellContentRender}
        locale={locale}
        onSelect={this.onMonthSelect}
        prefixCls={`${prefixCls}-month-panel`}
        value={value}
        disabledDate={disabledDate}
      />
    );
  }

  render() {
    const props = this.props;
    const {
      locale,
      prefixCls,
      fullscreen,
      showHeader,
      headerComponent,
      headerRender,
      disabledDate,
      firstDayOfWeek,
      firstDayOfMonth,
    } = props;
    const { value, type, selectedValue } = this.state;

    let header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(value, type, locale);
      } else {
        const TheHeader = headerComponent || CalendarHeader;
        header = (
          <TheHeader
            key="calendar-header"
            {...props}
            prefixCls={`${prefixCls}-full`}
            type={type}
            value={value}
            onTypeChange={this.setType}
            onValueChange={this.setValue}
          />
        );
      }
    }

    const table = type === 'date' ? (
      <DateTable
        mode={props.mode}
        dateRender={props.dateCellRender}
        contentRender={props.dateCellContentRender}
        locale={locale}
        prefixCls={prefixCls}
        onSelect={this.onSelect}
        value={value}
        selectedValue={selectedValue} // 用于设定月起始天时 判断是点击还是初始化改变了面板
        disabledDate={disabledDate}
        firstDayOfWeek={firstDayOfWeek}
        firstDayOfMonth={firstDayOfMonth}
      />
    ) : this.renderMonthTable();

    const children = [
      header,
      (<div key="calendar-body" className={`${prefixCls}-calendar-body`}>
        { table }
      </div>),
    ];


    const className = [`${prefixCls}-full`];

    if (fullscreen) {
      className.push(`${prefixCls}-fullscreen`);
    }

    return this.renderRoot({
      children,
      className: className.join(' '),
    });
  }
}

polyfill(FullCalendar);

export default calendarMixinWrapper(commonMixinWrapper(FullCalendar));
