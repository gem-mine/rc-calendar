import React from 'react';
import wareki from 'wareki';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import YearTable from './YearTable';

const ROW = 4;
const COL = 3;

function goYear(direction) {
  const value = this.state.value.clone();
  value.add(direction, 'year');
  this.setState({
    value,
  });
}

export default class YearPanel extends React.Component {
  constructor(props) {
    super(props);
    this.prefixCls = `${props.rootPrefixCls}-year-panel`;
    this.state = {
      value: props.value || props.defaultValue,
    };
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
  }
  setValue = (value) => {
    if ('value' in this.props) {
      this.setState({
        value,
      });
    }
  }
  setAndSelectValue = (value) => {
    this.setValue(value);
    this.props.onSelect(value);
  }
  years() {
    const value = this.state.value;
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const previousYear = startYear - 1;
    const years = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      years[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const year = previousYear + index;
        const content = String(year);
        years[rowIndex][colIndex] = {
          content,
          year,
          title: content,
        };
        index++;
      }
    }
    return years;
  }
  render() {
    const props = this.props;
    const value = this.state.value;
    const { locale, localeCode, renderFooter, selectedValue, hideDecade } = props;
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const endYear = startYear + 9;
    const prefixCls = this.prefixCls;

    const footer = renderFooter && renderFooter('year');

    const isJp = localeCode === 'ja';

    return (
      <div className={this.prefixCls}>
        <div>
          <div className={`${prefixCls}-header`}>
            <a
              className={`${prefixCls}-prev-decade-btn`}
              role="button"
              onClick={this.previousDecade}
              title={locale.previousDecade}
            />
            <a
              className={classnames(
                `${prefixCls}-decade-select`,
                {
                  [`${prefixCls}-decade-disabled`]: hideDecade,
                }
              )}
              role="button"
              onClick={props.onDecadePanelShow}
              title={locale.decadeSelect}
            >
              <span className={`${prefixCls}-decade-select-content`}>
                {isJp ? wareki(`${startYear}`, { unit: true }) : startYear}
                -
                {isJp ? wareki(`${endYear}`, { unit: true }) : endYear}
              </span>
              <span className={`${prefixCls}-decade-select-arrow`}>x</span>
            </a>

            <a
              className={`${prefixCls}-next-decade-btn`}
              role="button"
              onClick={this.nextDecade}
              title={locale.nextDecade}
            />
          </div>
          <div className={`${prefixCls}-body`}>
            <YearTable
              disabledDate={props.disabledDate}
              disabledYear={props.disabledYear}
              onSelect={this.setAndSelectValue}
              locale={locale}
              localeCode={localeCode}
              value={value}
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

YearPanel.propTypes = {
  rootPrefixCls: PropTypes.string,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  renderFooter: PropTypes.func,
  disabledDate: PropTypes.func,
  onSelect: PropTypes.func,
  hideDecade: PropTypes.bool,
};

YearPanel.defaultProps = {
  onSelect() {
  },
};
