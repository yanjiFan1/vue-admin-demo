<template>
    <div>
        <AppContainer
            page-class="g-country-and-region"
            page-title="页面"
            list-title="页面列表"
        >
            <template #search>
                <Search
                    label-width="140px"
                    :form-list="searchConfig"
                    @reset="onSearchReset"
                    @search="onSearch"
                />
            </template>
            <template v-if="getBtnAuth.add" #action>
                <el-button
                    type="primary"
                    @click="onAddHolidays"
                >
                添加页面
                </el-button>
            </template>
            <template #table>
                <Table
                    :loading="loading"
                    table-key="g-holidays"
                    row-key="g-row-holidays"
                    :table-data="tableData"
                    :columns="tableColumns"
                    :page-obj="pageObj"
                    :visible-pagination="!!tableData.length"
                >
                <el-table-column
                    slot="operate"
                    label="操作"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-if="getBtnAuth.edit"
                            type="text"
                            style="margin-right: 10px"
                            @click="() => onEditHolidays(scope.rows)"
                        >
                            编辑
                        </el-button>
                        <el-popover
                            placement="left"
                            width="160"
                            :value="visible.deleteSingleData"
                            @show="() => setModal('deleteSingleData', true)"
                        >
                            <p>确定删除吗?</p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    size="mini"
                                    type="text"
                                    @click="() => setModal('deleteSingleData', false)"
                                >
                                    取消
                                </el-button>
                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="() => onDeleteSingleInfo(scope.row)"
                                >
                                    确定
                                </el-button>
                            </div>
                            <el-button
                                v-if="getBtnAuth.delete"
                                slot="reference"
                                type="text"
                            >
                                删除
                            </el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </template>
        </AppContainer>
        <UpdateModal
            v-if="visible.updateModal"
            :visible="visible.updateModal"
            :title="updateModalInfo.title"
            :type="updateModalInfo.type"
            :query-id="updateModalInfo.queryId"
            @cancel="setModal('updateModal', false)"
            @confirm="handleUpdateModal"
        />
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
import AppContainer from '@/components/appContainers/index.vue'
import Table from '@/components/Table/index.vue'
import Search from '@/components/Search/index.vue'
import UpdateModal from '@/components/UpdateModal/index.vue'
import { TABLE as PaginationInfo } from '@/components/Pagination/config'
import { searchConfig, tableColumns } from './config'

export default {
      name: 'Holidays',
      components: {
        AppContainer,
        Table,
        Search,
        UpdateModal
      },
      data() {
        return {
          form: {}, // 搜索项
          searchConfig, // 搜索配置项
          tableColumns,
          tableData: [],
          pageObj: {
            page: 1,
            total: 0,
            size: PaginationInfo.pageSize,
            sizeChange: this.handleSizeChange,
            pageChange: this.handlePageChange
          },
          loading: false,
          visible: {
            deleteSingleData: false,
            updateModal: false
          },
          updateModalInfo: {
            title: '添加页面', // 弹框title
            type: 'add' // 弹框类型
          } // 弹框属性集合
        }
      },
      computed: {
        ...mapGetters([
          'authInfos'
        ]),

        getBtnAuth() {
          return this.authInfos.holidays || {}
        }
      },
      mounted() {
        this.getList()
      },
      methods: {
        // 删除单条数据请求
        postDeleteData(id) {
          this.$api.resource.holidays.postDeleteData({ id }, res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          })
        },
        // 获取列表数据
        getList() {
          this.loading = true
          const params = {
            pageNum: this.pageObj.page,
            pageSize: this.pageObj.size
          }
          const requestParams = Object.assign(params, this.form)
          this.$api.resource.holidays.getList(requestParams, (res = {}) => {
            const { items = [], totalNumber = 0, currentIndex } = res
            this.tableData = items
            this.pageObj.total = totalNumber
            this.pageObj.page = currentIndex
            this.loading = false
          }, () => {
            this.loading = false
          })
        },
        // 搜索-重置
        onSearchReset(form) {
          this.pageObj.size = PaginationInfo.pageSize
          this.pageObj.page = 1
          this.form = form
          this.getList()
        },
        // 搜索
        onSearch(form) {
          this.form = form
          this.getList()
        },
        // 当前页面数量更改
        handleSizeChange(size) {
          this.pageObj.size = size
          this.getList()
        },
        // page更改
        handlePageChange(page) {
          this.pageObj.page = page
          this.getList()
        },
        // 设置弹框显隐
        setModal(type, bool) {
          this.visible[type] = bool
        },
        // 添加页面
        onAddHolidays() {
          this.setModal('updateModal', true)
          this.updateModalInfo = {
            title: '添加页面',
            type: 'add'
          }
        },
        // 编辑页面
        onEditHolidays(item = {}) {
          const { id } = item
          this.setModal('updateModal', true)
          this.updateModalInfo = {
            title: '编辑页面',
            type: 'edit',
            queryId: id
          }
        },
        // 处理updateModal弹框回调
        handleUpdateModal() {
          this.setModal('updateModal', false)
          this.getList()
        },
        // 删除单挑数据
        onDeleteSingleInfo(item = {}) {
          const { id } = item
          this.postDeleteData(id)
        }
      }
    }
</script>

<style lang="less">
    .g-country-and-regin-tooltip {
        max-width: 300px;
    }
</style>