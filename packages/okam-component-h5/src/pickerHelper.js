/**
 * @file Picker helper
 * @author sparklewhy@gmail.com
 */

'use strict';


function padZero(value) {
    if (value < 10) {
        return `0${value}`;
    }
    return value + '';
}

function getRangeData(start, end, suffix) {
    let data = [];
    for (let i = start; i <= end; i++) {
        data.push(padZero(i) + (suffix || ''));
    }
    return data;
}

export function getHourData() {
    return getRangeData(0, 23);
}

export function getMinuteData() {
    return getRangeData(0, 59);
}

export function parseHourMinute(value) {
    if (!value) {
        return {};
    }

    let parts = value.split(':');
    return {
        hour: parseInt(parts[0] || 0, 10),
        minute: parseInt(parts[1] || 0, 10)
    };
}

export function getTimeRangeInfo(start, end) {
    let {hour: sHour, minute: sMinute} = parseHourMinute(start);
    let {hour: eHour, minute: eMinute} = parseHourMinute(end);

    return [
        [sHour || 0, eHour],
        [sMinute || 0, eMinute]
    ];
}

export function getDefaultSelectedIndex(value, range) {
    return value == null
        ? Math.floor(range.length / 2)
        : parseInt(value, 10) || 0;
}


export function getDateTimeColumnRange(colIdx, selValues, colRanges) {
    let currColRange = colRanges[colIdx];
    if (!currColRange) {
        return;
    }

    let minCount = 0;
    let maxCount = 0;
    for (let i = 0; i < colIdx; i++) {
        let range = colRanges[i];
        if (!range) {
            break;
        }

        let colVal = selValues[i];
        if (colVal === range[0]) {
            minCount++;
        }

        if (colVal === range[1]) {
            maxCount++;
        }
    }

    let minVal;
    let maxVal;
    if (minCount === colIdx) {
        minVal = currColRange[0];
    }

    if (maxCount === colIdx) {
        maxVal = currColRange[1];
    }

    return (minVal || maxVal) ? [minVal, maxVal] : null;
}

export function normalizeSelectedDateTimeIndex(colIdx, colValue, selValues, colRanges) {
    let range = getDateTimeColumnRange(colIdx, selValues, colRanges);
    if (range) {
        let min = range[0];
        if (min != null && colValue < min) {
            return min;
        }

        let max = range[1];
        if (max != null && colValue > max) {
            return max;
        }
    }

    return colValue;
}

function parseDate(value) {
    if (!value) {
        return {};
    }

    let parts = value.split('-');
    return {
        year: parseInt(parts[0], 10) || 0,
        month: parseInt(parts[1], 10) || 0,
        day: parseInt(parts[2], 10) || 0
    };
}

export function getDateRangeInfo(start, end) {
    let {year: sYear, month: sMonth, day: sDay} = parseDate(start);
    let {year: eYear, month: eMonth, day: eDay} = parseDate(end);

    return [
        [sYear || 1900, eYear || 2100],
        [sMonth || 1, eMonth || 12],
        [sDay || 1, eDay]
    ];
}

export function dateRangeToIndexRange(ranges) {
    return ranges.map((item, index) => {
        if (index === 0) { // year
            return [0, item[1] - item[0]];
        }
        else {
            return item.map(
                value => (value != null) ? (value - 1) : value
            );
        }
    });
}

export function getYearData(start, end) {
    return getRangeData(start, end, '年');
}

export function getMonthData() {
    return getRangeData(1, 12, '月');
}

export function getDayData(dayCount) {
    return getRangeData(1, dayCount, '日');
}

export function getMonthDayCount(year, month) {
    let d = new Date(year, month, 0);
    return d.getDate();
}

function getSelectedYearIndex(yearRange, selYear) {
    let maxIdx = yearRange[1] - yearRange[0];
    let idx = selYear - yearRange[0];
    if (idx < 0) {
        return 0;
    }

    if (idx > maxIdx) {
        return 0;
    }

    return idx;
}

function getSelectedDateColumnValue(colIdx, selIdx, yearRange) {
    if (colIdx === 0) {
        return selIdx + yearRange[0];
    }

    return padZero(selIdx + 1);
}

export function getSelectedYearByIndex(yearRange, selIndex) {
    return getSelectedDateColumnValue(0, selIndex, yearRange);
}

export function getSelectedDateValue(selIndexes, yearRange) {
    let value = [];
    selIndexes.forEach((selIdx, colIdx) => {
        value[colIdx] = getSelectedDateColumnValue(colIdx, selIdx, yearRange);
    });
    return value.join('-');
}

export function getInitSelectedDateIndex(dateRange, initValue) {
    let {year, month, day} = parseDate(initValue);
    let date = new Date();
    let currYear = date.getFullYear();

    let selYearIdx = getSelectedYearIndex(dateRange[0], year || currYear);
    let selMonthIdx = 0;
    let selDayIdx = 0;
    if (selYearIdx === 0 && !month) {
        selMonthIdx = dateRange[1][0] - 1;
        selDayIdx = dateRange[2][0] - 1;
    }

    return [
        selYearIdx,
        month ? month - 1 : selMonthIdx,
        day ? day - 1 : selDayIdx
    ];
}
