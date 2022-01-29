<template>
    <div
        :class="`app-container ${pageClass}`"
    >
        <div class="app-container-title">{{ pageTitle }}</div>
        <div class="app-container-search">
            <slot name="search" />
        </div>
        <div :class="`app-container-content ${listClass}`">
            <div class="app-container-content-head flex">
                <div class="app-container-content-head-title">
                    {{ listTitle }}
                </div>
                <div class="app-container-content-head-action flex">
                    <slot name="action" />
                </div>
            </div>
            <div class="app-container-content-table">
                <slot name="table" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'AppContainer',
  props: {
    // 页面标题
    pageTitle: {
      type: String,
      default: ''
    },
    // 页面class
    pageClass: {
      type: String,
      default: ''
    },
    // 列表标题
    listTitle: {
      type: String,
      default: ''
    },
    // 页面class
    listClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.app-container {
    padding: 12px 24px 16px 24px;
    &-title {
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #24292B;
    }
    &-search {
        margin-bottom: 16px;
        padding: 20px;
        background: #fff;
        border-radius: 4px;
        .form-content {
            justify-content: space-between;
        }
        .el-form-item {
            margin-bottom: 0;
        }
        .ipt-item {
            width: 240px;
        }
    }
    &-content {
        padding: 20px;
        background: #fff;
        border-radius: 4px;
        &-head {
            justify-content: space-between;
            &-title {
                font-size: 16px;
                line-height: 22px;
                color: #262626;
            }
        }
        &-table {
            margin-top: 20px;
        }
    }
}
</style>