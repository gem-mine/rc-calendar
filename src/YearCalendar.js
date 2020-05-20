import React from 'react';
import PropTypes from 'prop-types';
import KeyCode from 'rc-util/lib/KeyCode';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import {
  calendarMixinWrapper,
  calendarMixinPropTypes,
  calendarMixinDefaultProps,
} from './mixin/CalendarMixin';
import { commonMixinWrapper, propType, defaultProp } from './mixin/CommonMixin';
import moment from 'moment';

class YearCalendar extends React.Component {
  static propTypes = {
    ...calendarMixinPropTypes,
    ...propType,
    yearCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    selectedValue: PropTypes.object,
    defaultSelectedValue: PropTypes.object,
    disabledDate: PropTypes.func,
    mode: PropTypes.oneOf(['time', 'date', 'month', 'year', 'decade']),
    onPanelChange: PropTypes.func,
  }

  static defaultProps = Object.assign({}, defaultProp, calendarMixinDefaultProps);

  constructor(props) {
    super(props);

    this.state = {
      mode: 'year',
      value: props.value || props.defaultValue || moment(),
      selectedValue: props.selectedValue || props.defaultSelectedValue,
    };
  }
  onKeyDown = (event) => {
    const keyCode = event.keyCode;
    const stateValue = this.state.value;
    const { disabledDate, mode } = this.props;
    let value = stateValue;
    switch (keyCode) {
      case KeyCode.DOWN:
        value = stateValue.clone();
        value.add(3, 'years');
        break;
      case KeyCode.UP:
        value = stateValue.clone();
        value.add(-3, 'years');
        break;
      case KeyCode.LEFT:
        value = stateValue.clone();
        value.add(-1, 'years');
        break;
      case KeyCode.RIGHT:
        value = stateValue.clone();
        value.add(1, 'years');
        break;
      case KeyCode.ENTER:
        if (!disabledDate || !disabledDate(stateValue, mode)) {
          this.onSelect(stateValue);
        }
        event.preventDefault();
        return 1;
      default:
        return undefined;
    }
    if (value !== stateValue) {
      this.setValue(value);
      event.preventDefault();
      return 1;
    }
  }
  handlePanelChange = (value, mode) => {
    const { props, state } = this;
    if (mode === 'month') {
      return;
    }
    this.setState({ mode });
    if (props.onPanelChange) {
      props.onPanelChange(value || state.value, mode);
    }
  }
  render() {
    const { props, state } = this;
    const { mode, value } = state;
    const children = [props.renderSidebar(),
      <div className={`${props.prefixCls}-year-calendar-content`} key={'panel'}>
        <div className={`${props.prefixCls}-year-header-wrap`}>
          <CalendarHeader
            prefixCls={props.prefixCls}
            mode={mode}
            value={value}
            locale={props.locale}
            disabledYear={props.disabledDate}
            yearCellRender={props.yearCellRender}
            yearCellContentRender={props.yearCellContentRender}
            onYearSelect={this.onSelect}
            onValueChange={this.setValue}
            onPanelChange={this.handlePanelChange}
          />
        </div>
        <CalendarFooter
          prefixCls={props.prefixCls}
          renderFooter={props.renderFooter}
        />
      </div>,
    ];
    return this.renderRoot({
      className: `${props.prefixCls}-year-calendar`,
      children,
    });
  }
}

export default calendarMixinWrapper(commonMixinWrapper(YearCalendar));
