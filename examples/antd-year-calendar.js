/* eslint react/no-multi-comp:0, no-console:0 */
import '@sdp.nd/rc-calendar/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import YearCalendar from '@sdp.nd/rc-calendar/src/YearCalendar';
import DatePicker from '@sdp.nd/rc-calendar/src/Picker';
import zhCN from '@sdp.nd/rc-calendar/src/locale/zh_CN';
import enUS from '@sdp.nd/rc-calendar/src/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
const format = 'YYYY';
const cn = location.search.indexOf('cn') !== -1;
const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}
const defaultCalendarValue = now.clone();
// defaultCalendarValue.add(-1, 'month');
class Demo extends React.Component {
  static propTypes = {
    defaultValue: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = {
      showTime: true,
      disabled: false,
      value: props.defaultValue,
    };
  }
  onChange = (value) => {
    console.log(`DatePicker change: ${value && value.format(format)}`);
    this.setState({
      value,
    });
  }
  onShowTimeChange = (e) => {
    this.setState({
      showTime: e.target.checked,
    });
  }
  toggleDisabled = () => {
    this.setState({
      disabled: !this.state.disabled,
    });
  }
  render() {
    const state = this.state;
    const calendar = (<YearCalendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
    />);
    return (<div style={{ width: 240, margin: 20 }}>
      <div style={{ marginBottom: 10 }}>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <label>
          <input
            checked={state.disabled}
            onChange={this.toggleDisabled}
            type="checkbox"
          /> disabled
        </label>
      </div>
      <div style={{
        boxSizing: 'border-box',
        position: 'relative',
        display: 'block',
        lineHeight: 1.5,
        marginBottom: 22,
      }}
      >
        <DatePicker
          animation="slide-up"
          disabled={state.disabled}
          calendar={calendar}
          value={state.value}
          onChange={this.onChange}
        >
          {
            ({ value }) => {
              return (<input
                style={{ width: 200 }}
                readOnly
                disabled={state.disabled}
                value={value && value.format(format)}
                placeholder="请选择日期"
              />);
            }
          }
        </DatePicker>
      </div>
    </div>);
  }
}
function onStandaloneSelect(value) {
  console.log('year-calendar select', (value && value.format(format)));
}
function onStandaloneChange(value) {
  console.log('year-calendar change', (value && value.format(format)));
}
function disabledDate(value) {
  return value.year() > now.year();
}
function onYearCellContentRender(value) {
  return `${value.year()}月`;
}
ReactDOM.render(
  (<div
    style={{
      zIndex: 1000,
      position: 'relative',
      width: 600,
      margin: '0 auto',
    }}
  >
    <YearCalendar
      locale={cn ? zhCN : enUS}
      style={{ zIndex: 1000 }}
      disabledDate={disabledDate}
      onSelect={onStandaloneSelect}
      onChange={onStandaloneChange}
      yearCellContentRender={onYearCellContentRender}
      defaultValue={defaultCalendarValue}
      renderFooter={() => 'extra footer'}
    />
    <div style={{ marginTop: 200 }}>
      <Demo defaultValue={now} />
    </div>
  </div>)
  , document.getElementById('__react-content'));