<template>
    <MatrixCheckboxModal 
        v-if="showType === 1"
        :group-disabled='groupDisabled'
        :group-list="groupList"
        :column-list="columnList"
        :default-value="defaultModalValue"
        @updateData='updateData'
    />

    <MatrixCheckboxList
        v-else
        :group-disabled='groupDisabled'
        :group-list="groupList"
        :column-list="columnList"
        :default-value="defaultValue"
        @updateData='updateData'
    />
</template>

<script>
import MatrixCheckboxList from './list.vue'
import MatrixCheckboxModal from './box.vue'
export default {
  name: 'MatrixCheckbox',
  components: {
    MatrixCheckboxList,
    MatrixCheckboxModal
  },
  data() {
    return {
      groupDisable: false,
      defaultValue: {}, // 列表模式回填数据
      defaultModalValue: {}, // 弹框模式回填数据
      groupList: [],
      columnList: []
    }
  },

  computed: {
    showType() {
      const { showType } = this.form
      return showType || 0
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.initData()
    },

    initData() {
      const { groupList, lines, selectOptions } = this.form
      this.groupList = groupList
      this.columnList = lines
      this.defaultValue = this.pipeBackFillData(selectOptions, groupList)
      this.defaultModalValue = this.pipeBackFillModalData(selectOptions)
    },

    pipeBackFillModalData(selectedOptions) {
      const ids = [] // 存储重复的groudIp和rowId
      let newArr = []
      newArr = (selectedOptions | []).map(it => {
        const { groupId, rowId, columnId, columnName } = it || {}
        const groupAndRow = `${groupId}.${rowId}`
        if (ids.includes(groupAndRow)) {
          return null
        }
        ids.push(groupAndRow)
        const ceilList = selectedOptions.filter(el => (el && el.groupId === groupId) && (el && el.rowId === rowId)).map(it => {
          const { columnName, columnId } = it || {}
          return {
            ...it,
            lineName: columnName,
            lineId: columnId
          }
        })

        return {
          ...it,
          lineName: columnName,
          lineId: columnId,
          ceilList: ceilList
        }
      })

      return newArr.filter(it => { return it !== null })
    },

    pipeBackFillData(selectedOptions, groupList) {
      const obj = {};
      (selectedOptions || []).forEach(it => {
        const { groupId, columnId, rowId } = it || {}
        const val = `${groupId}|${rowId}|${columnId}`
        const row = `${groupId}.${rowId}`
        if (groupId && columnId && rowId) {
          if (!obj[row]) {
            obj[row] = []
          }
          obj[row].push(val)
        }
      })(groupList || []).forEach(it => {
        const { groupId } = it || {}
        if (it && it.rowList) {
          it.rowList.forEach(el => {
            const { rowId } = el || {}
            const row = `${groupId}.${rowId}`
            if (!obj[row] && el) {
              obj[row] = []
            }
          })
        }
      })

      return obj
    },

    // 格式化rowNames
    pipeRowNames(rowName) {
      return (rowName || []).map(it => {
        if (!it) return {}
        return {
          ...it,
          rowName: it.rowTitle
        }
      })
    },

    updateData() {
      this.$emit('updateData')
    }
  }
}
</script>