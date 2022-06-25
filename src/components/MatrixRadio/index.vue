<template>
    <div class="m-martix-radio">
        <div
            v-for="(item, index) in martixList"
            :key="index"
            class="m-martix-radio-item"
        >
            <div
                v-if="matixList && matixList.length > 1"
                class="m-martix-radio-item-title"
            >
                <span>{{ item.groupName }}</span>
            </div>
            <div
                class="m-martix-radio-item-content"
            >
                <el-radio-group
                    v-for="(it, idx) in item.rowList"
                    :key="idx"
                    v-model="currentValue[`${item.groupId}.${item.rowId}`]"
                    :disabled="groupDisabled"
                >
                    <div class="m-martix-radio-item-content-row-name">
                        <span>{{ it.rowName }}</span>
                    </div>
                    <div class="m-martix-radio-item-content-check-box">
                        <el-radio
                            v-for="(el, elKey) in item.ceilList"
                            :key="elKey"
                            :lable="el.ceilId"
                            :disabled="groupDisabled"
                            @change="change(el)"
                        >
                            {{ el.columnName }}
                        </el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'MatrixRadio',
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
                const mutualGroupAndColumnIds = [];
                (selectedOptions || []).forEach(it => {
                  const { columnId, mutual, groupId } = it || {}
                  if (!mutualGroupAndColumnIds.includes(`${item.groupId}|${el.lineId}`) && groupId && columnId && mutual) {
                    mutualGroupAndColumnIds.push(`${groupId}|${columnId}`)
                  }
                })

                if (params) {
                  if (mutualGroupAndColumnIds.includes(`${item.groupId}|${el.lineId}`)) {
                    selectedOptions.forEach(info => {
                      if (!info) return
                      if ((info.groupId === item.groupId) && (info.columnId === el.lineId) && (info.rowId === it.rowId)) {
                        obj.disabled = false
                      } else {
                        if ((info.groupId === item.groupId) && (info.columnId === el.lineId)) {
                          obj.disabled = mutualGroupAndColumnIds.includes(`${item.groupId}|${el.lineId}`)
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
              this.$set(this.currentValue, `${it.groupId}.${el.rowId}`, null)
            }
          })
        }
      })
    },

    // 获取矩阵单选必填情况下每行是否有数据，错误状态
    getMatrixErrorStatus(submitData) {
      const statusArr = []
      this.groupList.forEach(it => {
        if (!it) return;
        (it.rowList || []).forEach(el => {
          const ceilData = (submitData || []).filter(item => { return (it.groupId === item.groupId) && (item.rowId === el.rowId) })
          const ceilLength = ceilData.length
          statusArr.push(!!(ceilLength === 1))
        })
      })
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

    change(item) {
      const { form: data, index } = this
      const { ceilId, mutual, groupId, rowId } = item
      const needDeleteData = [];
      (data.selectedOptions || []).forEach(el => {
        if (el.mutual && (el.groupId === groupId) && (el.rowId === rowId)) {
          needDeleteData.push(el)
        }
      })

      const needCurrentDeleteData = needDeleteData.filter(it => it.ceilId !== ceilId)
      const needCurrentDeleteDataObj = needCurrentDeleteData && needCurrentDeleteData[0]
      if (needCurrentDeleteDataObj) { // 去除数据
        this.getMatrixList(this.matrixList, { ...needCurrentDeleteDataObj })
        data.selectedOptions = (data.selectedOptions || []).filter(it => it.ceilId !== (needCurrentDeleteDataObj.ceilId))
      }

      this.$$nextTick(() => {
        if (mutual) {
          this.getMatrixList(this.matrixList, { ...item, disabled: true })
        } else if (needCurrentDeleteDataObj) {
          this.getMatrixList(this.matrixList, { ...needCurrentDeleteDataObj })
        }
        const mutualGroupAndRowIds = [];
        (data.selectedOptions || []).forEach(it => {
          mutualGroupAndRowIds.push(`${it.groupId}|${it.rowId}`)
        })

        if (mutualGroupAndRowIds.includes(`${groupId}|${rowId}`)) {
          data.selectedOptions = (data.selectedOptions || []).filter(it => `${it.groupId}|${it.rowId}` !== `${groupId}|${rowId}`)
        }

        data.selectedOptions = [...(data.selectedOptions || []), item]
        data.isCompleteSelection = !this.getMatrixErrorStatus(data.selectedOptions)
        this.$emit('updateData', { data, index })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.m-martix-radio {
    /deep/ .el-radio.is-bordered+.el-raido.is-bordered {
        margin-left: 0;
    }

    /deep/ .el-radio-group {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        white-space: nowrap;

        .radio-group-title {
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

        .radio-group-check-box {
            box-sizing: border-box;
            flex: 1;
        }

        .el-radio {
            width: 100%;
            margin-left: 0;
            padding: 10px 0 10px 10px;
            border-radius: 2px;
            .el-radio__inner {
                width: 16px;
                height: 16px;
            }
        }
    }

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    &-item {
        display: flex;
        flex-direction: column;
        &-title {
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
        &-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
        }
    }
}
</style>