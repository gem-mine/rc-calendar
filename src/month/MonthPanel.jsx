import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import MonthTable from './MonthTable';

function goYear(direction) {
  const next = this.state.value.clone();
  next.add(direction, 'year');
  this.setAndChangeValue(next);
}

function noop() {

}

const MonthPanel = createReactClass({
  propTypes: {
    onChange: PropTypes.func,
    disabledDate: PropTypes.func,
    onSelect: PropTypes.func,
    showYear: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      onChange: noop,
      onSelect: noop,
      showYear: true,
    };
  },

  getInitialState() {
    const props = this.props;
    // bind methods
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.prefixCls = `${props.rootPrefixCls}-month-panel`;
    return {
      value: props.value || props.defaultValue,
    };
  },

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  },

  setAndChangeValue(value) {
    this.setValue(value);
    this.props.onChange(value);
  },

  setAndSelectValue(value) {
    this.setValue(value);
    this.props.onSelect(value);
  },

  setValue(value) {
    if (!('value' in this.props)) {
      this.setState({
        value,
      });
    }
  },

  render() {
    const props = this.props;
    const value = this.state.value;
    const cellRender = props.cellRender;
    const showYear = props.showYear;
    const contentRender = props.contentRender;
    const { locale } = props;
    const year = value.year();
    const prefixCls = this.prefixCls;

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
              onSelect={this.setAndSelectValue}
              locale={locale}
              value={value}
              cellRender={cellRender}
              contentRender={contentRender}
              prefixCls={prefixCls}
            />
          </div>
        </div>
      </div>);
  },
});

export default MonthPanel;
