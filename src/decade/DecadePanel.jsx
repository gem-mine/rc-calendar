import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import { getTodayTime } from '../util';

const ROW = 4;
const COL = 3;

function goYear(direction) {
  const next = this.state.value.clone();
  next.add(direction, 'years');
  this.setState({
    value: next,
  });
}

function chooseDecade(year, event) {
  const next = this.state.value.clone();
  next.year(year);
  next.month(this.state.value.month());
  this.props.onSelect(next);
  event.preventDefault();
}

export default class DecadePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
    };

    // bind methods
    this.prefixCls = `${props.rootPrefixCls}-decade-panel`;
    this.nextCentury = goYear.bind(this, 100);
    this.previousCentury = goYear.bind(this, -100);
  }

  render() {
    const value = this.state.value;
    const { locale, renderFooter, selectedValue } = this.props;
    const currentYear = value.year();
    const today = getTodayTime(value);
    const startYear = parseInt(currentYear / 100, 10) * 100;
    const preYear = startYear - 10;
    const endYear = startYear + 99;
    const decades = [];
    let index = 0;
    const prefixCls = this.prefixCls;

    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      decades[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const startDecade = preYear + index * 10;
        const endDecade = preYear + index * 10 + 9;
        decades[rowIndex][colIndex] = {
          startDecade,
          endDecade,
        };
        index++;
      }
    }

    const footer = renderFooter && renderFooter('decade');

    const decadesEls = decades.map((row, decadeIndex) => {
      const tds = row.map(decadeData => {
        const dStartDecade = decadeData.startDecade;
        const dEndDecade = decadeData.endDecade;
        const isLast = dStartDecade < startYear;
        const isNext = dEndDecade > endYear;
        let disabled = false;
        const testValue = value.clone().year(dStartDecade);
        if (this.props.disabledDate) {
          disabled = this.props.disabledDate(testValue);
        }
        const classNameMap = {
          [`${prefixCls}-cell`]: 1,
          [`${prefixCls}-cell-disabled`]: disabled,
          [`${prefixCls}-selected-cell`]:
          selectedValue && (dStartDecade <= currentYear && currentYear <= dEndDecade),
          [`${prefixCls}-current-cell`]: dStartDecade <= today.year() && today.year() <= dEndDecade,
          [`${prefixCls}-last-century-cell`]: isLast,
          [`${prefixCls}-next-century-cell`]: isNext,
        };
        const tStartDecade = moment(`${dStartDecade}`).format('YYYY');
        const tEndDecade = moment(`${dEndDecade}`).format('YYYY');
        const content = `${tStartDecade}-${tEndDecade}`;
        let clickHandler;
        if (isLast) {
          clickHandler = this.previousCentury;
        } else if (isNext) {
          clickHandler = this.nextCentury;
        } else {
          clickHandler = chooseDecade.bind(this, dStartDecade);
        }
        return (<td
          key={dStartDecade}
          onClick={clickHandler}
          role="gridcell"
          className={classnames(classNameMap)}
        >
          <a
            className={`${prefixCls}-decade`}
          >
            {content}
          </a>
        </td>);
      });
      return (<tr key={decadeIndex} role="row">{tds}</tr>);
    });

    return (
      <div className={this.prefixCls}>
        <div className={`${prefixCls}-header`}>
          <a
            className={`${prefixCls}-prev-century-btn`}
            role="button"
            onClick={this.previousCentury}
            title={locale.previousCentury}
          />

          <div className={`${prefixCls}-century`}>
            {moment(startYear).format('YYYY')}-{moment(endYear).format('YYYY')}
          </div>
          <a
            className={`${prefixCls}-next-century-btn`}
            role="button"
            onClick={this.nextCentury}
            title={locale.nextCentury}
          />
        </div>
        <div className={`${prefixCls}-body`}>
          <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
            <tbody className={`${prefixCls}-tbody`}>
            {decadesEls}
            </tbody>
          </table>
        </div>

        {footer && (
          <div className={`${prefixCls}-footer`}>
            {footer}
          </div>)}
      </div>);
  }
}

DecadePanel.propTypes = {
  locale: PropTypes.object,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  selectedValue: PropTypes.object,
  rootPrefixCls: PropTypes.string,
  renderFooter: PropTypes.func,
  disabledDate: PropTypes.func,
};

DecadePanel.defaultProps = {
  onSelect() {
  },
};
