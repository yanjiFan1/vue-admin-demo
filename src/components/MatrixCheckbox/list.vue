<!--
*** 矩阵多选-列表模式

* columnList 列列表
eg: [{
  lineName: 1,
  lineId: 1,
  mutual: 0
}, {
  lineName: 2,
  lineId: 2,
  mutual: 1
},{
  lineName: 3,
  lineId: 3,
  mutual: 0
}]

* groupList 组数据 Array
eg: [{
  groupName: 1,
  groupId: 1,
  rowList: [{
    rowName: 1,
    rowId: 1,
    max: 3, 每行最大值
    min: 1 每行最小值
  }, {
    rowName: 1,
    rowId: 1,
    max: 3, 每行最大值
    min: 1 每行最小值
  }]
}, {
  groupName: 2,
  groupId: 2,
  rowList: [{
    rowName: 1,
    rowId: 1,
    max: 3, 每行最大值
    min: 1 每行最小值
  }, {
    rowName: 1,
    rowId: 1,
    max: 3, 每行最大值
    min: 1 每行最小值
  }]
}]

* defaultValue  回填值
eg: 
{
  '1-2': ["1-1-1", "3-4-5"] // key中的1-2代表的是'组id-行id' '3-4-5' 代表的是'组id-行id-列id'
  '1-1': [],
  '2-4: []
}

* groupDisabled Boolean 全部禁止输入
-->

<template>
    <div class="m-martix-checkbox">
        <div class="m-matrix-checkbox-quesion">
            <div class="m-matrix-checkbox-quesion-row">
                <div class="m-matrix-checkbox-quesion-row-space"></div>
                <div
                    v-for="(item, index) in columnList"
                    :key="index"
                    class="m-matrix-checkbox-quesion-row-item"
                >
                    {{ item.lineName }}
                </div>
            </div>
            <div class="m-matrix-checkbox-quesion-content">
                <div
                    v-for="(item, index) in martixList"
                    :key="index"
                    class="m-matrix-checkbox-quesion-content-item"
                >
                    <div
                        v-if="matixList && matixList.length > 1"
                        class="checkbox-group-item-title"
                    >
                        <span>{{ item.groupName }}</span>
                    </div>
                    <div
                        class="checkbox-group-item-content"
                    >
                        <el-checkbox-group
                            v-for="(it, idx) in item.rowList"
                            :key="idx"
                            v-model="currentValue[`${item.groupId}.${item.rowId}`]"
                            :max="(it.min || it.max) ? it.max : 999"
                            :disabled="groupDisabled"
                        >
                            <div class="checkbox-group-title">
                                <span>{{ it.rowName }}</span>
                                <div v-if="it.min || it.max">(可选{{ it.min }}-{{ it.max }}项)</div>
                            </div>
                            <div class="checkbox-group-check-box">
                                <el-checkbox
                                    v-for="(el, elKey) in item.ceilList"
                                    :key="elKey"
                                    :lable="el.ceilId"
                                    :disabled="el.disabled"
                                    @change="(val) => change(val, el, item)"
                                >
                                    <br />
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MatrixCheckboxComp',
  props: {
    groupDisabled: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default: () => {}
    },
    // 组列表
    groupList: {
      type: Array,
      default: () => []
    },
    // 列列表
    columnList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentValue: {},
      matrixList: []
    }
  },
  watch: {
    defaultValue: {
      handle(val) {
        if (val && Object.keys(val).length) {
          this.currentValue = val
        } else {
          this.getDefaultCurrentValue()
        }
        this.updateData(1)
      },
      immedidate: true,
      deep: true
    },

    groupList: {
      handler(val) {
        this.getMatrixList(val)
      },
      immedidate: true,
      deep: true
    }
  },

  methods: {

    getMatrixList(groupList, params) {
      const { selectedOptions = [] } = this.form || {}
      const { columnId, groupId, rowId, disabled } = params || {}
      this.matrixList = (groupList || []).map(item => {
        if (!item) return {}
        return {
          ...item,
          rowList: (item.rowList || []).map(it => {
            if (!it) return {}
            return {
              ...it,
              ceilList: (this.columnList || []).map(el => {
                const ceilId = (item.groupId + '|') + (it.rowId + '|') + (el.lineId + '')
                if (!el) return {}
                const obj = {
                  groupName: item.groupName,
                  groupId: item.groupId,
                  rowId: it.rowId,
                  rowName: it.rowName,
                  rowMax: it.max,
                  rowMin: it.min,
                  columnName: el.lineName,
                  columnId: el.lineId,
                  mutual: el.mutual,
                  ceilId: ceilId
                }
                const mutualColumnIds = []
                const mutualGroupIds = [];
                (selectedOptions || []).forEach(it => {
                  const { columnId, mutual, groupId } = it || {}
                  if (mutual) {
                    if (columnId && !mutualColumnIds.includes(columnId)) {
                      mutualColumnIds.push(columnId)
                    }

                    if (groupId && !mutualGroupIds.includes(groupId)) {
                      mutualGroupIds.push(groupId)
                    }
                  }
                })

                if (params) {
                  if (mutualGroupIds.includes(item.groupId) && mutualColumnIds.includes(el.lineId)) {
                    selectedOptions.forEach(info => {
                      if (!info) return
                      if ((info.groupId === item.groupId) && (info.columnId === el.lineId) && (info.rowId === it.rowId)) {
                        obj.disabled = false
                      } else {
                        if ((info.groupId === item.groupId) && (info.columnId === el.lineId)) {
                          obj.disabled = disabled && mutualGroupIds.includes(item.groupId) && mutualColumnIds.includes(el.lineId)
                        }
                      }
                    })
                  } else {
                    obj.disabled = disabled && (groupId === item.groupId) && (columnId === el.lineId) && (rowId !== it.rowId)
                  }
                }

                return obj
              })
            }
          })
        }
      })
    },

    getDefaultCurrentValue() {
      (this.groupList || []).forEach(it => {
        if (it && it.rowList) {
          it.rowList.forEach(el => {
            if (el) {
              this.$set(this.currentValue, `${it.groupId}.${el.rowId}`, [])
            }
          })
        }
      })
    },

    // 获取矩阵单选必填情况下每行是否有数据，错误状态
    getMatrixErrorStatus(submitData) {
      const statusArr = []
      const groupIds = []
      const submitDataGroupIdIds = [] // 存储已经选中的groupId数量
      this.groupList.forEach(it => {
        if (!it) return
        if (it.groupId && !groupIds.includes(it.groupId)) {
          groupIds.push(it.groupId)
        }
        (it.rowList || []).forEach(el => {
          const ceilData = (submitData || []).filter(item => { return (it.groupId === item.groupId) && (item.rowId === el.rowId) })
          const ceilLength = ceilData.length
          statusArr.push(!!(ceilLength >= el.min))
        });

        // 判断可选项是0-0情况下每一组都有至少一个选项
        (submitData || []).forEach(it => {
          if (!it) return
          if (it.groupId && !submitDataGroupIdIds.includes(it.groupId)) {
            submitDataGroupIdIds.push(it.groupId)
          }
        })

        if (submitDataGroupIdIds.length < groupIds.length) {
          statusArr.push(false)
        }
      })

      return !!statusArr.includes(false)
    },

    updateData(isBackFill) {
      const { form: data, index } = this
      data.isCompleteSelection = !this.getMatrixErrorStatus(data.selectedOptions)
      if (isBackFill) {
        (data.selectedOptions || []).forEach(it => {
          const { mutual } = it || {}
          if (mutual) {
            this.$nextTick(() => {
              this.getMatrixList(this.matrixList, { ...it, disabled: true })
            })
          }
        })
      }
      this.$emit('updateData', { data, index })
    },

    change(val, item) {
      const { form: data, index } = this
      const { ceilId, mutual } = item

      if (val) {
        if (mutual) {
          this.getMatrixList(this.matrixList, { ...item, disabled: true })
        }

        const mutipleIds = [];
        (data.selectedOptions || []).forEach(it => {
          mutipleIds.push(it.ceilId)
        })
        if (!mutipleIds.includes(ceilId)) {
          data.selectedOptions = [...(data.selectedOptions || []), item]
        }
      } else {
        if (mutual) {
          this.getMatrixList(this.matrixList, { ...item, disabled: false })
        }

        data.selectedOptions = (data.selectedOptions || []).filter(it => it.ceilId !== ceilId)
      }

      data.isCompleteSelection = !this.getMatrixErrorStatus(data.selectedOptions)
      this.$emit('updateData', { data, index })
    }
  }
}
</script>

<style lang="less" scoped>
.m-martix-checkbox {
    /deep/ .el-radio.is-bordered+.el-raido.is-bordered {
        margin-left: 0;
    }

    /deep/ .el-checkbox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        white-space: nowrap;

        .checkbox-title {
            position: sticky;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 120px;
            min-height: 60px;
            padding: 6px 10px;
            font-size: 12px;
            text-align: left;
            word-break: break-all;
            word-wrap: break-word;
            white-space: pre-wrap;
            box-sizing: border-box;
            flex-shrink: 0;
            z-index: 0;
            background: #fff;
            span {
                display: flex;
                justify-content: center;
                align-items: center;
                line-height: 20px;
            }
            div {
                line-height: 20px;
                margin-top: 8px;
            }
        }

        .checkbox-group-check-box {
            box-sizing: border-box;
            flex: 1;
        }

        .el-checkbox {
            width: 100%;
            margin-left: 0;
            padding: 10px 0 10px 10px;
            border-radius: 2px;
            .el-checkbox__inner {
                width: 16px;
                height: 16px;
            }

            .el-checkbox__input {
              margin-top: 2px;
            }

            .el-checkbox__inner::after {
              width: 4px;
              height: 8px;
              left: 5px;
              top: 1px;
            }
        }
    }

    &-quesion {
      width: 100%;
      min-height: 0px;
      max-height: 600px;
      overflow: scroll;
      white-space: nowrap;
      &-row {
        display: flex;
        align-content: center;
        position: sticky;
        top: 0;
        min-height: 50px;
        box-sizing: border-box;
        z-index: 99;
        background: #fff;
        &-space {
          position: sticky;
          left: 0;
          width: 120px;
          background: #fff;
          z-index: 2;
          flex-shrink: 0;
        }
        &-item {
          flex-shrink: 0;
          width: 100%;
          min-height: 50px;
          line-height: 20px;
          vertical-align: top;
          text-align: left;
          word-wrap: break-word;
          white-space: pre-wrap;
          padding: 10px 0 10px 10px;
          background: #fff;
        }
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      &-item {
        display: flex;
        flex-direction: column;
        .checkbox-group-item-title {
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 12px;
            color: #606266;
            font-weight: 600;
            span {
                position: sticky;
                left: 0;
            }
        }
        .checkbox-group-item-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
        }
      }
    }
}
</style>