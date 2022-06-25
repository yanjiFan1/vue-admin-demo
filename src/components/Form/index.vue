<template>
    <div class="m-form">
        <el-form
            ref="form"
            class="u-form"
            :model="form"
            :size="size"
            :rules="rules"
            :label-width="lableWidth"    
        >
            <el-form-item
                v-for="(item, index) in formList"
                :key="index"
                :prop="item.code"
                :label="item.label"
                :rules="item.rules"
                :class="{ 'is-inline': item.isInline }"
                :style="{ 'width': item.width || '100%' }"
            >
                <el-input
                    v-if="item.type === 'input'"
                    v-model="form[item.code]"
                    :disabled="item.disabled"
                    :maxlength="item.maxLength"
                    :placeholder="item.placeholder"
                />
                <el-input
                    v-if="item.type === 'textarea'"
                    type="textarea"
                    v-model="form[item.code]"
                    :disabled="item.disabled"
                    :rows="item.rows || 2"
                    :maxlength="item.maxLength"
                    :show-word-limit="item.showWordLimit"
                    :placeholder="item.placeholder"
                />
                <el-select
                    v-if="item.type === 'select'"
                    v-model="form[item.code]"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :filterable="item.filterable"
                    :multiple="item.multiple"
                    :clearable="item.clearable"
                    @change="(val) => handleSelect(val, item)"
                >
                    <el-option
                        v-for="(it, idx) in item.options"
                        :key="idx"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-radio-group
                    v-if="item.type === 'radio'"
                    v-model="form[item.code]"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :options="item.options"
                >
                    <el-raido 
                        v-for="(it, idx) in item.options"
                        :key="idx"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-radio-group>
                <el-cascader
                    v-if="item.type === 'cascader'"
                    :ref="item.ref"
                    v-model="form[item.code]"
                    :style="item.style || 'width: 100%'"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :options="item.options"
                    :props="item.props || { 'children': 'children', 'label': 'label', 'value': 'value'}"
                    @change="handleCascader(item)"
                />
                <el-date-picker
                    v-if="item.type === 'datePicker'"
                    v-model="form[item.code]"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder || '请选择'"
                    :type="item.type"
                    :value-format="item.datePickerValueFormat"
                    range-separator="至"
                    :start-placeholder="item.startPlaceholder || '开始时间'"
                    :end-placeholder="item.endPlaceholder || '结束时间'"
                    @change="(val) => datePickerChange(val, item)"
                />
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'Form',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    formList: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: ''
    },
    // label的宽度
    lableWitdh: {
      type: String,
      default: '100px'
    },
    checkFormStatus: {
      type: Object,
      default: false
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {},
      parentForm: {}
    }
  },
  watch: {
    checkFormStatus(val) {
      if (val) {
        this.submitForm()
      }
    },
    form: {
      handler(val) {
        this.init()
        this.form = val
      },
      immediate: true
    },
    rules: {
      handler(val) {
        this.rules = val
      },
      immediate: true
    },
    formList: {
      handler(val, old) {
        if (JSON.stringify(val) !== JSON.stringify(old)) {
          this.formList = val
        }
      },
      immediate: true
    }
  },

  methods: {

    init() {
      this.formList.forEach(it => {
        if (it.optionsRequest) {
          this.getApi(this.$api, it.optionsRequest.api)(it.optionsRequest.params, (res) => {
            this.$set(it, 'options', this.updateSelectOptions(res || [], it.optionsField, it.optionsRequest.isNotNeedResetOptions))
          })
        }
      })
    },

    updateSelectOptions(options, optionsField, isNotNeedResetOptions) {
      if (isNotNeedResetOptions) { // 不需要重置options
        return options
      }
      return options.map(it => {
        return {
          label: it[optionsField && optionsField.label || 'label'],
          value: it[optionsField && optionsField.value || 'value']
        }
      })
    },

    getApi(api, path) {
      const pathArr = path.split('.')
      let methods = api
      pathArr.map(it => {
        if (methods[it]) {
          methods = methods[it]
        }
      })

      return methods
    },

    // 时间范围类型数据处理
    datePickerChange(val, item) {
      if (!item) {
        throw (new Error('时间范围类型参数不存在!'))
      }
      if (item.codeNav) {
        this.parentForm[item.code] = val && val[0]
        this.parentForm[item.codeNav] = val && val[1]
      } else {
        this.parentForm[item.code] = val
      }
    },

    // 处理select值变化
    handleSelect(it, item) {
      const { code, codeNav, movement, options } = item || {}
      const currentArr = (options || []).filter(el => { return el.value === it })
      const { value, label } = currentArr && currentArr[0] || {}
      const currentVal = codeNav ? value : it
      if (codeNav) {
        this.parentForm[code] = value
        this.parentForm[codeNav] = label
      }
      // 如果有关联-进行关联操作
      if (movement) {
        const { current, fields } = movement || {}
        this.$emit('movement', item, fields, currentVal === current)
      }
    },

    // 处理级联的变化
    handleCascader(item) {
      const { codeNav, singleMark, multipleMark } = item || {}
      if (codeNav) {
        let codeNavLabel = ''
        this.$nextTick(() => {
          // 获取级联的lable start
          const cascader = this.$refs[item.ref] && this.$refs[item.ref][0]
          const getCheckNodes = cascader && cascader.getCheckNodes && cascader.getCheckNodes();
          (getCheckNodes || []).forEach(it => {
            const { pathLables } = it || {}
            const firstVal = codeNavLabel === '' ? codeNavLabel : codeNavLabel + (multipleMark || ';')
            codeNavLabel = firstVal + (Array.isArray(pathLables) && pathLables.join(singleMark || '/'))
          })
          // 获取级联的label end
          this.parentForm[codeNav] = codeNavLabel
        })
      }
    },

    getParentForm() {
      return { ...this.form, ...this.parentForm }
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('getForm', this.getParentForm())
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.m-form {
	margin-bottom: 16px;
	padding: 42px 20px 20px 20px;
	background: #fff;
	border-radius: 4px;
	.u-form {
		padding: 0 30px 0 0;
	}
	.el-input, .el-select {
		width: 100%;
	}
    
}
</style>
