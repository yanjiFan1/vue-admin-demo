<template>
    <div :class="`m-search ${pageClass}`">
        <el-form
            ref="form"
            class="m-search-form"
            :inline="true"
            :model="form"
            :size="size"
            :label-width="lableWidth"
            @submit.native.prevent 
        >
            <div style="flex: 1">
              <div class="m-search-form-box">
                <el-form-item
                    v-for="(item, index) in formList"
                    :key="index"
                    :style="{ minWidth: minItemWidth }"
                    class="m-search-form-box-item"
                    :prop="item.code"
                    :label="item.label"
                    :rules="item.rules"
                    :class="{ 'is-inline': item.isInline }"
                >
                    <el-input
                        v-if="item.type === 'input'"
                        v-model="form[item.code]"
                        :style="{ width: item.width }"
                        :disabled="item.disabled"
                        :placeholder="item.placeholder"
                        @input="(val) => getInputValueChange(item.code, val)"
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
                        @change="(val) => getInputValueChange(item.code, val)"
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
                <el-form-item
                  v-if="btnMode === 'right'"
                  style="margin-left: auto"
                >
                    <el-button
                      v-if="isShowReset"
                      @click="onReset"
                    >
                      重置
                    </el-button>
                    <el-button
                        type="primary"
                        @click="onSearch"
                        @keydown.enter.native="onSearch"
                    >
                        搜索
                    </el-button>
                </el-form-item>
              </div>
              <el-form-item
                  v-if="btnMode === 'footer'"
                  style="float: right"
                >
                    <el-button
                      v-if="isShowReset"
                      @click="onReset"
                    >
                      重置
                    </el-button>
                    <el-button
                        type="primary"
                        @click="onSearch"
                        @keydown.enter.native="onSearch"
                    >
                        搜索
                    </el-button>
                </el-form-item> 
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
  name: 'Search',
  props: {
    formList: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: ''
    },
    pageClass: {
      type: String,
      default: ''
    },
    btnMode: {
      type: String,
      default: 'footer'
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    isShowReset: {
      type: Boolean,
      default: true
    },
    minItemWidth: {
      type: String,
      default: '30%'
    }
  },
  data() {
    return {
      form: {},
      parentForm: {}
    }
  },
  methods: {
    onReset() {
      this.form = {}
      this.parentForm = {}
      this.$emit('reset', {})
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

    // 获取input值变化
    getInputValueChange(code, val) {
      this.form = Object.assign(this.form, { [code]: val })
      this.$emit('input-change', this.getParentForm())
    },

    getParentForm() {
      return { ...this.form, ...this.parentForm }
    },

    onSearch() {
      this.$emit('search', this.getParentForm())
    }
  }
}
</script>

<style lang="less" scoped>
.m-search {
    margin-bottom: 16px;
    padding: 42px 20px 20px 20px;
    background: #fff;
    border-radius: 4px;
    &-form {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          &-item {
            min-width: 30%;
          }
        }
    }
    .ipt-elem {
        width: 240px;
    }
}
</style>
