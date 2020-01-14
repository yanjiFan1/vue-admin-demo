<template>
	<div class="login-container">
		<XTable :tableData="tableData" :columns="columns" :pageObj="pageObj"></XTable>
	</div>
</template>

<script>
import XTable from '@/components/table/Table'
import { testList } from '@/axios/index'
import { columns } from './columns'
export default {
  components: { XTable },
  name: 'Test',
  data() {
    return {
      tableData: [],
      columns: columns,
      pageObj: {
        total: 0,
        page: 1,
        sizeChange: size => {
          this.pageObj.pageSize = size
          this.testList()
        },
        pageChange: page => {
          this.pageObj.page = page
          this.testList()
        }
      }
    }
  },
  created() {
    this.testList()
  },
  methods: {
    testList() {
      testList().then(res => {
        this.tableData = res.result && res.result.list
        this.pageObj.total = res.result && res.result.list.length
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

