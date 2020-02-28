import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
const ROW = 4;
const COL = 3;

function goYear(direction) {
  const value = this.state.value.clone();
  value.add(direction, 'year');
  this.setState({
    value,
  });
}

function chooseYear(year) {
  const value = this.state.value.clone();
  value.year(year);
  value.month(this.state.value.month());
  this.setState({
    value,
  });
  this.props.onSelect(value);
}

export default class YearTable extends React.Component {
  constructor(props) {
    super(props);
    this.prefixCls = `${props.rootPrefixCls}-year-panel`;
    this.state = {
      value: props.value || props.defaultValue,
    };
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      });
    }
  }
  setAndSelectValue(value) {
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
    const { prefixCls, hoverValue, selectedValue } = props;
    const rangeValue = (hoverValue && hoverValue.length) ? hoverValue : selectedValue;
    const years = this.years();
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const endYear = startYear + 9;
    const yeasEls = years.map((row, index) => {
      const tds = row.map(yearData => {
        let disabled = false;
        const testValue = value.clone().year(yearData.year);
        if (props.disabledDate) {
          disabled = props.disabledDate(value.clone().year(yearData.year));
        }
        if (props.disabledDate) {
          disabled = props.disabledDate(testValue);
        }
        let isSelected = false;
        let isInRange = false;
        if (rangeValue && Array.isArray(rangeValue)) {
          const startValue = rangeValue[0];
          const endValue = rangeValue[1];

          if (startValue && endValue) {
            isSelected = testValue.isSame(startValue, 'year') ||
              testValue.isSame(endValue, 'year');
            isInRange = testValue.isAfter(startValue, 'year') &&
              testValue.isBefore(endValue, 'year');
          } else {
            isSelected = testValue.isSame(startValue, 'year');
          }
        } else {
          isSelected = yearData.value === currentYear;
        }

        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-in-range-cell`]: isInRange,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]: isSelected,
          [`${prefixCls}-last-decade-cell`]: yearData.year < startYear,
          [`${prefixCls}-next-decade-cell`]: yearData.year > endYear,
        };
        let clickHandler;
        if (yearData.year < startYear) {
          clickHandler = this.previousDecade;
        } else if (yearData.year > endYear) {
          clickHandler = this.nextDecade;
        } else {
          clickHandler = chooseYear.bind(this, yearData.year);
        }
        const firstDay = value.clone().year(yearData.year).startOf('day');
        return (
          <td
            role="gridcell"
            title={yearData.title}
            key={yearData.content}
            onClick={disabled ? null : clickHandler}
            className={classnames(classNameMap)}
            onMouseEnter={disabled ? undefined :
              (props.onMonthHover && props.onMonthHover.bind(null, firstDay) || undefined)}
          >
            <a
              className={`${prefixCls}-year`}
            >
              {yearData.content}
            </a>
          </td>);
      });
      return (<tr key={index} role="row">{tds}</tr>);
    });

    return (
      <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
        <tbody className={`${prefixCls}-tbody`}>
        {yeasEls}
        </tbody>
      </table>
    );
  }
}

YearTable.propTypes = {
  rootPrefixCls: PropTypes.string,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  renderFooter: PropTypes.func,
  disabledDate: PropTypes.func,
  onSelect: PropTypes.func,
};

YearTable.defaultProps = {
  onSelect() {
  },
};
