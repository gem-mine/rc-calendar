import React from 'react';
import PropTypes from 'prop-types';
import CalendarHeader from '../calendar/CalendarHeader';
import DateTable from '../date/DateTable';
import DateInput from '../date/DateInput';
import MonthTable from '../month/MonthTable';
import { getTimeConfig } from '../util/index';
import YearTable from '../year/YearTable';

export default class CalendarPart extends React.Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    value: PropTypes.any,
    hoverValue: PropTypes.any,
    selectedValue: PropTypes.any,
    direction: PropTypes.any,
    locale: PropTypes.any,
    localeCode: PropTypes.string,
    showDateInput: PropTypes.bool,
    showTimePicker: PropTypes.bool,
    format: PropTypes.any,
    placeholder: PropTypes.any,
    disabledDate: PropTypes.any,
    disabledMonth: PropTypes.any,
    timePicker: PropTypes.any,
    disabledTime: PropTypes.any,
    onInputChange: PropTypes.func,
    onInputSelect: PropTypes.func,
    timePickerDisabledTime: PropTypes.object,
    enableNext: PropTypes.any,
    enablePrev: PropTypes.any,
    clearIcon: PropTypes.node,
    dateRender: PropTypes.func,
    inputMode: PropTypes.string,
    inputReadOnly: PropTypes.bool,
    hideDecade: PropTypes.bool,
  }
  render() {
    const props = this.props;
    const {
      prefixCls,
      value,
      hoverValue,
      selectedValue,
      mode,
      direction,
      locale, localeCode, format, placeholder,
      disabledDate, timePicker, disabledTime, disabledMonth,
      timePickerDisabledTime, showTimePicker,
      onInputChange, onInputSelect, enablePrev, enableNext,
      clearIcon,
      showClear,
      inputMode,
      inputReadOnly,
      hideDecade,
    } = props;
    const shouldShowTimePicker = showTimePicker && timePicker;
    const disabledTimeConfig = shouldShowTimePicker && disabledTime ?
      getTimeConfig(selectedValue, disabledTime) : null;
    const rangeClassName = `${prefixCls}-range`;
    const newProps = {
      locale,
      value,
      prefixCls,
      showTimePicker,
    };
    const index = direction === 'left' ? 0 : 1;
    const timePickerEle = shouldShowTimePicker &&
      React.cloneElement(timePicker, {
        showHour: true,
        showMinute: true,
        showSecond: true,
        ...timePicker.props,
        ...disabledTimeConfig,
        ...timePickerDisabledTime,
        onChange: onInputChange,
        defaultOpenValue: value,
        value: selectedValue[index],
      });

    const dateInputElement = props.showDateInput &&
      <DateInput
        format={format}
        locale={locale}
        prefixCls={prefixCls}
        timePicker={timePicker}
        disabledDate={disabledDate}
        placeholder={placeholder}
        disabledTime={disabledTime}
        value={value}
        showClear={showClear || false}
        selectedValue={selectedValue[index]}
        onChange={onInputChange}
        onSelect={onInputSelect}
        clearIcon={clearIcon}
        inputMode={inputMode}
        inputReadOnly={inputReadOnly}
      />;

    let body = null;
    if (props.picker === 'month') {
      body = (
        <MonthTable
          {...newProps}
          prefixCls={`${prefixCls}-month-panel`}
          selectedValue={selectedValue}
          dateRender={props.dateRender}
          onSelect={props.onSelect}
          onMonthHover={props.onDayHover}
          hoverValue={hoverValue}
          disabledDate={disabledDate}
        />
      );
    } else if (props.picker === 'year') {
      body = (
        <YearTable
          {...newProps}
          prefixCls={`${prefixCls}-year-panel`}
          picker={props.picker}
          selectedValue={selectedValue}
          dateRender={props.dateRender}
          onSelect={props.onSelect}
          onMonthHover={props.onDayHover}
          hoverValue={hoverValue}
          disabledDate={disabledDate}
        />
      );
    } else {
      body = (
        <DateTable
          {...newProps}
          hoverValue={hoverValue}
          selectedValue={selectedValue}
          dateRender={props.dateRender}
          onSelect={props.onSelect}
          onDayHover={props.onDayHover}
          disabledDate={disabledDate}
          disabledMonth={disabledMonth}
          showWeekNumber={props.showWeekNumber}
        />
      );
    }

    return (
      <div
        className={`${rangeClassName}-part ${rangeClassName}-${direction}`}
      >
        {dateInputElement}
        <div style={{ outline: 'none' }}>
          <CalendarHeader
            {...newProps}
            mode={mode}
            enableNext={enableNext}
            enablePrev={enablePrev}
            onValueChange={props.onValueChange}
            onPanelChange={props.onPanelChange}
            disabledMonth={disabledMonth}
            disabledYear={props.disabledYear}
            picker={props.picker}
            hideDecade={hideDecade}
            localeCode={localeCode}
          />
          {showTimePicker ? <div className={`${prefixCls}-time-picker`}>
            <div className={`${prefixCls}-time-picker-panel`}>
              {timePickerEle}
            </div>
          </div> : null}
          <div className={`${prefixCls}-body`}>
            {body}
          </div>
        </div>
      </div>
    );
  }
}
