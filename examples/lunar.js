/* eslint react/no-multi-comp:0, no-console:0 */

import '@gem-mine/rc-calendar/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import solarLunar from 'solarLunar';
import FullCalendar from '@gem-mine/rc-calendar/src/FullCalendar';

import 'rc-select/assets/index.css';
import Select from 'rc-select';

import zhCN from '@gem-mine/rc-calendar/src/locale/zh_CN';
import enUS from '@gem-mine/rc-calendar/src/locale/en_US';

import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';

const format = 'YYYY-MM-DD';
const cn = location.search.indexOf('cn') !== -1;

const now = moment();
if (cn) {
  now.locale('zh-cn').utcOffset(8);
} else {
  now.locale('en-gb').utcOffset(0);
}

const defaultCalendarValue = now.clone();
defaultCalendarValue.add(-1, 'month');

function onSelect(value) {
  console.log('select', value.format(format));
}

class Demo extends React.Component {
  state = {
    type: 'month',
  };

  onTypeChange = (type) => {
    this.setState({
      type,
      mode: type, // todo: 之前的修改是根据mode和type共同判断面板，后续看怎么优化
    });
  }

  render() {
    return (
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <FullCalendar
          style={{ margin: 10 }}
          Select={Select}
          fullscreen={false}
          onSelect={onSelect}
          defaultValue={now}
          locale={cn ? zhCN : enUS}
          dateCellRender={(current) => (
            <div
              className="rc-calendar-date"
              style={{ height: '40px', fontSize: '12px', lineHeight: 1.5 }}
            >
              <span style={{ display: 'inline-block', height: '16px' }}>{current.date()}</span>
              <span style={{ display: 'inline-block', height: '16px' }}>
                {solarLunar.solar2lunar(current.year(), current.month(), current.date()).dayCn}
              </span>
            </div>
          )}
        />
        <FullCalendar
          backToday
          style={{ margin: 10 }}
          Select={Select}
          fullscreen
          defaultValue={now}
          onSelect={onSelect}
          type={this.state.type === 'week' ? 'date' : this.state.type}
          mode={this.state.mode}
          onTypeChange={this.onTypeChange}
          locale={cn ? zhCN : enUS}
          dateCellRender={(current) => {
            return <div className="rc-calendar-date">{current.format('DD')}</div>;
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('__react-content'));
