<!--
 * @Description: 分页组件
 * @Author: yanji
 * @Date: 2020-01-14 19:39:56
 -->
<template>
  <div class='flex just-center'>
    <span class='pagination-total'>共{{total}}条</span>
     <el-pagination
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :total="total"
      :current-page="currentPage"
      layout="sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { TABLE } from './config'

export default {
  name: 'Pagination',
  props: {
    handleSizeChange: {
      type: Function
    },
    handleCurrentChange: {
      type: Function
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    defaultPagesize: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pagesize: this.defaultPagesize ? this.defaultPagesize : TABLE.pageSize,
      pagesizes: TABLE.pageSizeS
    }
  }
}
</script>

<style lang="scss">
.pagination-total {
  color: #1890FF;
  font-size: 14px;
}
</style>
