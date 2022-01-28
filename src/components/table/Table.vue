<!--
 * @Description: elementui table组件二次封装
 * @Author: linZengFa
 * @parmas:
        tableData 表格list
        columns 列参数
        pageObj 分页参数
        selection 表格是否多选
        rowKey: 行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String || Function
        treeProps	渲染嵌套数据的配置选项
        handleSelectionChange 多选回调
        selectable 处理是否可选状态
 * @Date: 2019-11-14 13:55:36
 * @LastEditTime: 2019-11-19 11:47:11
 * @LastEditors:
 -->
<template>
  <div class="data-table">
    <!--<el-table :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange" :height="height" default-expand-all :row-key="rowkey" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">-->
    <el-table :data="tableDataTemp" style="width: 100%" border @selection-change="handleSelectionChange" :height="height" :row-key="rowKey" :tree-props="treeProps" :key="tableKey">
      <el-table-column v-if="selection" type="selection" width="55" fixed="left" :selectable="selectable"></el-table-column>
      <el-table-column
        v-if="defaultIndex"
        fixed
        label="序号"
        type="index"
        width="65"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        v-if="treeIndex"
        fixed
        label="顺序"
        width="100"
        prop="treeIndex"
        >
      </el-table-column>
      <template v-for="(col, index) in columns">
        <!-- 操作列/自定义列 -->
        <slot v-if="col.slot" :name="col.slot" />
        <!-- 普通列 -->
        <el-table-column 
          v-else 
          :key="index" 
          :prop="col.prop" 
          :label="col.label" 
          :width="col.width" 
          :formatter="col.formatter" 
          align="center" 
          :type="col.type" 
          :show-overflow-tooltip="col.showOverflow"
        />
      </template>
    </el-table>

    <!-- 是否调用分页 -->
    <div class='pagination' v-if="visiblePagination">
      <pagination :currentPage="pageObj.page" :total="pageObj.total" :handleSizeChange="pageObj.sizeChange" :handleCurrentChange="pageObj.pageChange" />
    </div>
  </div>
</template>

<script>
  import pagination from '../pagination'
  export default {
    name: 'dataTable',
    props: {
      tableData: {
        type: Array,
        default: () => []
      },
      tableKey: {
        type: String,
        default: ''
      },
      rowKey: {
        type: null
      },
      treeProps: {
        type: Object,
        default: () => {
          return { hasChildren: 'hasChildren', children: 'children' }
        }
      },
      columns: {
        type: Array,
        default: () => []
      },
      pageObj: {
        type: Object,
        default: () => {
          return {
            page: 1,
            total: 0,
            sizeChange: () => {},
            pageChange: () => {}
          }
        }
      },
      height: {
        type: String
      },
      visiblePagination: {
        type: Boolean,
        default: true
      },
      handleSelectionChange: {
        type: Function,
        default: () => { }
      },
      selection: {
        type: Boolean,
        default: false
      },
      selectable: {
        type: Function,
        default: () => { return true }
      },
      defaultIndex: {
        type: Boolean,
        default: false
      },
      treeIndex: {
        type: Boolean,
        default: false
      }
    },
    components: {
      pagination
    },
    data() {
      return {
        tableDataTemp: this.tableData
      }
    },
    watch: {
      tableData(data) {
        if (this.treeIndex) {
          data.forEach((item, index) => {
            item.treeIndex = index + 1
            if (item[this.treeProps.children] && item[this.treeProps.children].length) {
              item[this.treeProps.children].forEach((inner, innerIndex) => {
                inner.treeIndex = '' + (index + 1) + '-' + (innerIndex + 1)
              })
            }
          })
        }
        this.tableDataTemp = Object.assign([], data)
      }
    },
    methods: {
      indexMethod(index) {
        var size = this.pageObj.pageSize || PAGE_SIZE
        return (index + 1) + (this.pageObj.page - 1) * size
      }
    }
  }
</script>
<style lang="scss">
  .el-table .cell, .el-table th div {
    text-align: center;
  }
  .pagination {
    margin-top: 24px;
  }
</style>
