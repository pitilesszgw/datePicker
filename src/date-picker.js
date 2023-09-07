import Picker from './picker'
import YearRangePanel from './year-range'

// const getPanel = function (type) {
//   return YearRangePanel
// }
export default {
  mixins: [Picker],
  name: 'DatePicker',
  props: {
    type: {
      type: String,
      default: 'date'
    },
    timeArrowControl: Boolean
  },
  watch: {
    type (type) {
      if (this.picker) {
        this.unmountPicker()
        this.panel = YearRangePanel
        this.mountPicker()
      } else {
        this.panel = YearRangePanel
      }
    }
  },
  created () {
    this.panel = YearRangePanel
  }
}
