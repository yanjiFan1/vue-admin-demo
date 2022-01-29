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
            >
                <el-input
                    v-if="item.type === 'input'"
                    v-model="form[item.code]"
                    :disabled="item.disabled"
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
                    v-model="form[item.code]"
                    :clearable="item.clearable"
                    :disabled="item.disabled"
                    :placeholder="item.placeholder"
                    :options="item.options"
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
            <el-form-item style="float: right">
                <el-button @click="onReset">重置</el-button>
                <el-button
                    type="primary"
                    @click="onSearch"
                    @keydown.enter.native="onSearch"
                >
                    搜索
                </el-button>
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
      handler(val) {
        this.formList = val
        setTimeout(() => {
          this.init()
        }, 100)
      },
      immediate: true
    }
  },

  created() {
    this.init()
  },

  methods: {

    init() {
      this.formList.forEach(it => {
        if (it.optionsRequest) {
          this.getApi(this.$api, it.optionsRequest.api)(it.optionsRequest.params, (res) => {
            this.$set(it, 'options', res || [])
          })
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
