import React, { PropTypes }from 'react';
import YearPanel from './year/YearPanel';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import KeyCode from 'rc-util/lib/KeyCode';

const YearCalendar = React.createClass({
  propTypes: {
    monthCellRender: PropTypes.func,
    dateCellRender: PropTypes.func,
  },
  mixins: [CommonMixin, CalendarMixin],

  onKeyDown(event) {
    const keyCode = event.keyCode;
    const stateValue = this.state.value;
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
        this.onSelect(stateValue);
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
  },

  render() {
    const props = this.props;
    const children = [
      props.renderSidebar(),
      <YearPanel
        key="year-calendar"
        rootPrefixCls={props.prefixCls}
        className={`${props.prefixCls}`}
        style={{ position: 'relative' }}
        value={this.state.value}
        locale={props.locale}
        onChange={this.setValue}
        onSelect={this.onSelect}
        disabledDate={props.disabledDate}
      />,
    ];
    return this.renderRoot({
      children,
    });
  },
});

export default YearCalendar;
