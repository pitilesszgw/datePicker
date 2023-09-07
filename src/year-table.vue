<template>
  <table @click="handleYearTableClick" class="el-year-table" @mousemove="handleMouseMove">
    <tbody>
      <tr>
        <td class="available" :class="getCellStyle(startYear + 0)">
          <div>
            <a class="cell">{{ startYear }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 1)">
          <div>
            <a class="cell">{{ startYear + 1 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 2)">
          <div>
            <a class="cell">{{ startYear + 2 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 3)">
          <div>
            <a class="cell">{{ startYear + 3 }}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="available" :class="getCellStyle(startYear + 4)">
          <div>
            <a class="cell">{{ startYear + 4 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 5)">
          <div>
            <a class="cell">{{ startYear + 5 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 6)">
          <div>
            <a class="cell">{{ startYear + 6 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 7)">
          <div>
            <a class="cell">{{ startYear + 7 }}</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="available" :class="getCellStyle(startYear + 8)">
          <div>
            <a class="cell">{{ startYear + 8 }}</a>
          </div>
        </td>
        <td class="available" :class="getCellStyle(startYear + 9)">
          <div>
            <a class="cell">{{ startYear + 9 }}</a>
          </div>
        </td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script type="text/babel">
import { hasClass } from 'element-ui/src/utils/dom'
import { range, nextDate, getDayCountOfYear, isDate } from 'element-ui/src/utils/date-util'
import { arrayFindIndex, coerceTruthyValueToArray } from 'element-ui/src/utils/util'
const datesInYear = year => {
  const numOfDays = getDayCountOfYear(year)
  const firstDay = new Date(year, 0, 1)
  return range(numOfDays).map(n => nextDate(firstDay, n))
}
export default {
  props: {
    defaultValue: {
      validator (val) {
        // null or valid Date Object
        return val === null || (val instanceof Date && isDate(val))
      }
    },
    disabledDate: {},
    date: {},
    value: {},
    year: {},
    minDate: {},
    maxDate: {},
    selectionMode: {
      default: 'year'
    },
    rangeState: {
      default () {
        return {
          endDate: null,
          selecting: false
        }
      }
    }
  },
  computed: {
    startYear () {
      return Math.floor(this.date.getFullYear() / 10) * 10
    }
  },
  methods: {
    getCellStyle (year) {
      const style = {}
      const today = new Date()
      style.disabled = typeof this.disabledDate === 'function'
        ? datesInYear(year).every(this.disabledDate)
        : false
      style.today = today.getFullYear() === year
      style.default = this.defaultValue && this.defaultValue.getFullYear() === year
      if (this.selectionMode === 'range') {
        let minYear = this.minDate
        let maxYear = this.maxDate
        if (maxYear) minYear = Math.min(minYear, maxYear)
        maxYear = Math.max(minYear, maxYear)
        style['start-date'] = year === minYear
        style['end-date'] = minYear && year === maxYear
        style['in-range'] = minYear && year >= minYear && year <= maxYear
      } else {
        style.current = arrayFindIndex(coerceTruthyValueToArray(this.value), date => date.getFullYear() === year) >= 0
      }
      return style
    },
    nextTenYear () {
      this.$emit('pick', Number(this.year) + 10, false)
    },
    prevTenYear () {
      this.$emit('pick', Number(this.year) - 10, false)
    },
    handleYearTableClick (event) {
      let target = event.target
      if (target.tagName === 'A') {
        target = target.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }
      if (target.tagName !== 'TD') return
      if (hasClass(target, 'disabled')) return
      /* istanbul ignore if  */
      const year = Number(target.textContent || target.innerText)
      if (this.selectionMode === 'range') {
        if (!this.rangeState.selecting) {
          this.$emit('pick', { minDate: year, maxDate: null })
          this.rangeState.selecting = true
          this.rangeState.endDate = null
        } else {
          this.rangeState.selecting = false
          if (year >= this.minDate && this.minDate) {
            this.$emit('pick', { minDate: this.minDate, maxDate: year })
          } else {
            this.$emit('pick', { minDate: year, maxDate: this.minDate })
          }
        }
      } else {
        this.$emit('pick', year)
      }
    },
    handleMouseMove (event) {
      let target = event.target
      if (!this.rangeState.selecting) return
      if (target.tagName === 'A') {
        target = target.parentNode.parentNode
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode
      }
      if (target.tagName !== 'TD') return
      const row = target.parentNode.rowIndex
      const column = target.cellIndex
      if (hasClass(target.parentNode, 'disabled')) return
      if (row !== this.lastRow || column !== this.lastColumn) {
        this.$emit('changerange', {
          minDate: this.minDate,
          maxDate: this.maxDate,
          rangeState: {
            selecting: true,
            endDate: Number(target.textContent || target.innerText)
          },
          el: target
        })
      }
    }
  }
}
</script>
<style scoped>
.el-year-table {
  font-size: 12px;
  margin: -1px;
  border-collapse: collapse
}

.el-year-table .el-icon {
  color: #232323
}

.el-year-table td {
  text-align: center;
  padding: 20px 0;
  cursor: pointer
}

.el-year-table td.today .cell {
  color: #0175FF;
  border: 1px solid #0175FF;
  font-weight: 700
}

.el-year-table td.disabled .cell {
  background-color: #f5f7fa;
  cursor: not-allowed;
  color: #c2c2c2
}

.el-year-table td.disabled .cell:hover {
  color: #c2c2c2
}

.el-year-table td .cell {
  width: 48px;
  height: 32px;
  display: block;
  line-height: 32px;
  color: #5c5c5c;
  margin: 0 auto
}

.el-year-table td.today .cell {
  height: 29px;
  line-height: 29px;
}

.el-year-table td .cell:hover {
  color: #232323;
  background-color: #F2F6FC;
}

.el-year-table td.today .cell:hover {
  color: #0175FF;
}

.el-year-table td.in-range div {
  background-color: #F2F6FC
}

.el-year-table td.in-range div:hover {
  background-color: #F2F6FC
}

.el-year-table td.end-date div,
.el-year-table td.start-date div {
  color: #fff
}

.el-year-table .today.in-range:hover .cell,
.el-year-table td.end-date .cell,
.el-year-table td.start-date .cell {
  color: #fff;
  background-color: #0175FF
}

.el-year-table td.start-date div {}

.el-year-table .start-date .cell {
  /* padding: 0px 14.367px; */
  margin: 0px auto;
}

.el-year-table .end-date .cell {
  /* padding: 0px 14.367px; */
  margin: 0px auto;
}

.el-year-table .is-right .el-year-table {
  margin-left: 20px;
}

.el-year-table td.current:not(.disabled) .cell {
  color: #FFFFFF;
  background-color: #0175FF;
}</style>
