<!--
//  更新页面
// type 类型 add edit detail
// title 标题
-->
<template>
  <el-dialog
    :title="title"
    :visible="visible"
    :width="width"
    @close="handleClass"
  >
    <Form 
      :form="form"
      lable-width="120px"
      :form-list="formConfig"
      :is-reset="isResetForm"
      :rules="forrmRules"
      :check-form-status="checkFromStatus"
      @getFrom="getFrom"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClass">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleConfirm"
      >
        确 定
      </el-button>
    </span> 
  </el-dialog>
</template>

<script>
import Form from '@/components/Form/index.vue'
import { formConfig, formRules, formInit } from './config'
export default {
  name: 'UpdateMpdel',
  components: {
    Form
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      defult: ''
    },
    type: {
      type: String,
      default: 'add'
    },
    callback: {
      type: Function,
      default: () => {}
    },
    width: {
      type: [String, Number],
      defult: '700px'
    },
    queryId: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      formConfig,
      formRules,
      checkFormStatus: false,
      form: formInit,
      submitForm: {},
      isResetForm: false,
      loading: false
    }
  },

  watch: {
    type: {
      handler(val) {
        if (val === 'edit') {
          this.updateFormConfig()
          this.getFormFromID()
        }
      },
      immediate: true
    },

    visible: {
      handler(val) {
        if (val) {
          this.form = {}
        }
      },
      immediate: true
    }
  },
  methods: {
    // 通过id获取form表单信息
    getFormFromID() {
      this.$api.resource.holidays.getSingleInfo({ id: this.queryId }, (res = {}) => {
        this.form = res
      })
    },
    // 更新数据
    updateForm() {
      this.$api.resource.postUpdateData(this.submitForm, () => {
        this.$emit('confirm')
      })
    },
    // 获取form表单数据
    getForm(form) {
      this.submitForm = form
      this.updateForm()
    },
    // 更新form表单配置项
    updateFormConfig() {
      const fields = ['holidayDate']
      this.formConfig.formEach(it => {
        if (fields.includes(it.code)) {
          it.disabled = true
        }
      })
    },
    // 取消
    handleClose() {
      this.$emit('cancel')
    },
    // 确定
    handleConfirm() {
      this.checkFormStatus = true
    }
  }
}
</script>
<style lang="less" scoped>
  .m-update-modal {
    &-form {
      padding: 0 30px - 20px;
    }
  }
</style>