import React from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import MonthTable from './MonthTable';

function goYear(direction) {
  this.props.changeYear(direction);
}

function noop() {

}

class MonthPanel extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    disabledMonth: PropTypes.func,
    onSelect: PropTypes.func,
    renderFooter: PropTypes.func,
    rootPrefixCls: PropTypes.string,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    showYear: PropTypes.bool,
  }

  static defaultProps = {
    onChange: noop,
    onSelect: noop,
    showYear: true,
  }

  constructor(props) {
    super(props);

    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.prefixCls = `${props.rootPrefixCls}-month-panel`;

    this.state = {
      value: props.value || props.defaultValue,
    };
  }

  static getDerivedStateFromProps(props) {
    let newState = {};

    if ('value' in props) {
      newState = {
        value: props.value,
      };
    }

    return newState;
  }

  setAndSelectValue = (value) => {
    this.setValue(value);
    this.props.onSelect(value);
  }

  setValue = (value) => {
    if ('value' in this.props) {
      this.setState({
        value,
      });
    }
  }

  render() {
    const props = this.props;
    const value = this.state.value;
    const { locale, cellRender, contentRender, renderFooter, showYear, selectedValue } = props;
    const year = value.year();
    const prefixCls = this.prefixCls;

    const footer = renderFooter && renderFooter('month');

    const disabledYearClass = showYear ?
      '' : `${prefixCls}-year-disabled`;

    return (
      <div className={prefixCls} style={props.style}>
        <div>
          <div className={`${prefixCls}-header`}>
            <a
              className={`${prefixCls}-prev-year-btn ${disabledYearClass}`}
              role="button"
              onClick={showYear ? this.previousYear : null}
              title={locale.previousYear}
            />

            <a
              className={`${prefixCls}-year-select ${disabledYearClass}`}
              role="button"
              onClick={showYear ? props.onYearPanelShow : null}
              title={locale.yearSelect}
            >
              <span className={`${prefixCls}-year-select-content`}>{year}</span>
              <span className={`${prefixCls}-year-select-arrow`}>x</span>
            </a>

            <a
              className={`${prefixCls}-next-year-btn ${disabledYearClass}`}
              role="button"
              onClick={showYear ? this.nextYear : null}
              title={locale.nextYear}
            />
          </div>
          <div className={`${prefixCls}-body`}>
            <MonthTable
              disabledDate={props.disabledDate}
              disabledMonth={props.disabledMonth}
              onSelect={this.setAndSelectValue}
              locale={locale}
              value={value}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
              selectedValue={selectedValue}
            />
          </div>
          {footer && (
            <div className={`${prefixCls}-footer`}>
              {footer}
            </div>)}
        </div>
      </div>);
  }
}

polyfill(MonthPanel);

export default MonthPanel;
