<template>
    <div>
        <div v-show="show">
            <div :class="maskClassNames" @click="onClickMask"></div>
            <div :class="pickerClassNames" @animationend="onAnimationEnd" @webkitAnimationend="onAnimationEnd">
                <div class="weui-picker__hd">
                    <span @click="onCancel" class="weui-picker__action">取消</span>
                    <span @click="onOk" class="weui-picker__action">确定</span>
                </div>
                <div class="weui-picker__bd">
                    <picker-group ref="pickerGroup" :optionNameKey="rangeKey"
                        :optionList="groupItem"
                        :selectedIndex="selectedIndexes[index]"
                        :columnIndex="index"
                        :normalizeSelectedIndex="normalizeSelectedIndex"
                        @change="onGroupChange(index, $event)"
                        v-for="(groupItem, index) in groupData" :key="index">
                    </picker-group>
                </div>
            </div>
        </div>
        <div @click="onShowPicker"><slot></slot></div>
    </div>
</template>
<script>
import formField from './mixins/formField';
import PickerGroup from './PickerGroup';
import {
    getTimeRangeInfo,
    getHourData,
    getMinuteData,
    normalizeSelectedDateTimeIndex,
    getDefaultSelectedIndex,
    parseHourMinute,
    getDateRangeInfo,
    dateRangeToIndexRange,
    getYearData,
    getMonthData,
    getDayData,
    getMonthDayCount,
    getSelectedYearByIndex,
    getSelectedDateValue,
    getInitSelectedDateIndex
} from './pickerHelper';

export default {
    mixins: [formField],
    model: {
        prop: 'value',
        event: '_change'
    },
    components: {
        PickerGroup
    },

    props: {
        name: String,
        mode: String, // time / date / region / selector / multiSelector
        range: Array, // for mode="selector" or mode="multiSelector"
        rangeKey: String,
        value: [Number, String, Array],
        disabled: {
            type: Boolean,
            default: false
        },
        start: String, // for time / date mode
        end: String,   // for time / date mode
        fields: {      // for date mode, validated value: year/month/day
            type: String,
            default: 'day'
        },
        customItem: String // for region mode
    },

    data() {
        let self = this;

        return {
            show: false,
            open: false,
            inited: false,
            selectedIndexes: [],
            groupData: [],
            normalizeSelectedIndex(colIdx, colVal) {
                if (self.isTimeMode || self.isDateMode) {
                    return normalizeSelectedDateTimeIndex(
                        colIdx, colVal,
                        self.selectedIndexes,
                        self.dateTimeIndexRange
                    );
                }

                return colVal;
            }
        };
    },

    computed: {
        maskClassNames() {
            return [
                'weui-mask',
                this.open ? 'weui-animate-fade-in' : 'weui-animate-fade-out'
            ];
        },
        isSelectorMode() {
            let mode = this.mode;
            return !mode || (mode === 'selector');
        },
        isMultiSelectorMode() {
            return this.mode === 'multiSelector';
        },
        isTimeMode() {
            return this.mode === 'time';
        },
        isDateMode() {
            return this.mode === 'date';
        },
        pickerClassNames() {
            return [
                'weui-picker',
                this.open ? 'weui-animate-slide-up' : 'weui-animate-slide-down'
            ];
        }
    },

    watch: {
        value: 'initSelectedDataIndex',
        range: 'initGroupData'
    },

    created() {
        this.initGroupData();
        this.initSelectedDataIndex(this.value);
    },

    methods: {

        initGroupData() {
            let range = this.range;
            if (this.isSelectorMode) {
                range && (this.groupData = [range]);
            }
            else if (this.isMultiSelectorMode) {
                range && (this.groupData = range);
            }
            else if (this.isTimeMode) {
                this.dateTimeIndexRange = getTimeRangeInfo(this.start, this.end);
                let hourData = getHourData();
                let minuteData = getMinuteData();
                this.groupData = [hourData, minuteData];
            }
            else if (this.isDateMode) {
                let dateRange = getDateRangeInfo(this.start, this.end);
                this.dateRange = dateRange;
                this.dateTimeIndexRange = dateRangeToIndexRange(dateRange);
                let fields = this.fields;
                let groupData = [];
                let yearData = dateRange[0];
                yearData = getYearData(yearData[0], yearData[1]);

                if (fields === 'year') {
                    groupData = [yearData];
                }
                else if (fields === 'month') {
                    groupData = [
                        yearData,
                        getMonthData()
                    ];
                }
                else {
                    groupData = [
                        yearData,
                        getMonthData(),
                        []
                    ];
                }

                this.groupData = groupData;
            }
        },

        initSelectedDataIndex(value) {
            let range = this.range;
            let groupData = this.groupData;
            if (this.isSelectorMode) {
                this.selectedIndexes = [getDefaultSelectedIndex(value, range)];
            }
            else if (this.isMultiSelectorMode) {
                this.selectedIndexes = value.map(
                    (item, idx) => getDefaultSelectedIndex(value && value[idx], item)
                );
            }
            else if (this.isTimeMode) {
                let {hour, minute} = parseHourMinute(value);
                this.selectedIndexes = [
                    getDefaultSelectedIndex(hour, groupData[0]),
                    getDefaultSelectedIndex(minute, groupData[1])
                ];
            }
            else if (this.isDateMode) {
                this.selectedIndexes = getInitSelectedDateIndex(
                    this.dateRange, value
                );
                this.selectedIndexes = this.selectedIndexes.slice(
                    0, this.groupData.length
                );

                this.initDateDayGroupData();
            }
        },

        onShowPicker() {
            if (this.disabled) {
                return;
            }

            this.show = true;
            this.open = true;

            if (!this.inited) {
                this.inited = true;
                this.$nextTick(() => {
                    this.$refs.pickerGroup.forEach(
                        item => item.updateSizeInfo()
                    );
                });
            }
        },

        onClickMask() {
            this.open = false;
            this.$emit('cancel', {detail: {}});
        },

        onAnimationEnd() {
            if (!this.open && this.show) {
                this.show = false;
            }
        },

        onCancel() {
            this.open = false;
            this.$emit('cancel', {detail: {}});
        },

        onOk() {
            this.open = false;
            let value = this.getFieldValue();
            this.$emit('change', {detail: {value}});
            this.$emit('_change', value);
        },

        initDateDayGroupData() {
            let groupData = this.groupData;
            if (!this.isDateMode || groupData.length !== 3) {
                return;
            }

            let yearRange = this.dateRange[0];
            let selIndexes = this.selectedIndexes;
            let year = getSelectedYearByIndex(yearRange, selIndexes[0]);
            let month = selIndexes[1] + 1;
            let count = getMonthDayCount(year, month);
            groupData.splice(2, 1, getDayData(count));
        },

        onGroupChange(index, selIdx) {
            let selIndexes = this.selectedIndexes;
            selIndexes[index] = selIdx;
            if (this.isMultiSelectorMode) {
                this.$emit(
                    'columnchange',
                    {detail: {column: index, value: selIdx}}
                );
            }
            else if (this.isDateMode || this.isTimeMode) {
                let colNum = this.groupData.length;
                for (let i = index + 1; i < colNum; i++) {
                    if (i === 2 && this.isDateMode) { // day
                        this.initDateDayGroupData();
                    }

                    let colSelIdx = selIndexes[i];
                    let val = this.normalizeSelectedIndex(i, colSelIdx);
                    if (val !== colSelIdx) {
                        selIndexes.splice(i, 1, val);
                        this.$refs.pickerGroup[i].setSelectedIndex(val);
                    }
                }
            }
        },

        getFieldValue() {
            let value;
            let selIndexes = this.selectedIndexes;
            if (this.isSelectorMode) {
                value = selIndexes[0];
            }
            else if (this.isMultiSelectorMode) {
                value = selIndexes.slice();
            }
            else if (this.isTimeMode) {
                let groupData = this.groupData;
                value = [
                    groupData[0][selIndexes[0]],
                    groupData[1][selIndexes[1]]
                ].join(':');
            }
            else if (this.isDateMode) {
                value = getSelectedDateValue(selIndexes, this.dateRange[0]);
            }

            return value;
        },

        resetFieldValue() {
            this.initSelectedDataIndex('');
        }
    }
};
</script>
