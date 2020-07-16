<template>
  <el-drawer
    ref="drawer"
    title="关联用户"
    :before-close="handleClose"
    :visible.sync="drawerVisible"
    :wrapper-closable="false"
    direction="rtl"
    size="40%"
  >
    <el-main>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="not">
          <template slot="title">
            <h3>未选</h3>
          </template>
          <el-form :inline="true" :model="listQuery.params" @keyup.enter.native="handleSearch">
            <el-form-item label="">
              <el-input v-model="listQuery.params.keyword" placeholder="输入关键字搜索" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain icon="el-icon-search" @click="handleSearch" />
            </el-form-item>
          </el-form>
          <el-table v-loading.body="listLoading" fit :data="list" tooltip-effect="dark" style="width: 100%" max-height="700">
            <el-table-column fixed label="操作" width="50">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-circle-plus" size="36" @click="selectUser(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="email" label="邮箱" />
          </el-table>
          <el-pagination
            :current-page="listQuery.currentPage"
            :page-sizes="[10, 30, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-collapse-item>
        <el-collapse-item name="selected">
          <template slot="title">
            <h3>已选</h3>
          </template>
          <el-table v-loading.body="listLoading" fit :data="selectedList" tooltip-effect="dark" style="width: 100%" max-height="700">
            <el-table-column fixed label="操作" width="50">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" size="36" @click="cancelSelect(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="nickname" label="昵称" />
            <el-table-column prop="username" label="账号" />
            <el-table-column prop="email" label="邮箱" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-drawer>
</template>

<script>

import { findPage } from '@/api/sys/user'
import { selectUserByRoleId, relatedUser, cancelRelatedUser } from '@/api/sys/role'

export default {
  name: 'RelationUser',
  data() {
    return {
      permissions: {
        relation: 'system:role:relation'
      },
      drawerVisible: false,
      loading: false,
      roleId: null,
      activeNames: ['not', 'selected'],
      multipleSelection: [],
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        sorter: {},
        params: { keyword: null, notInId: [] }
      },
      list: [],
      total: null,
      listLoading: false,
      selectedList: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  methods: {
    show(roleId) {
      this.roleId = roleId
      this.drawerVisible = true
      this.selectUserByRoleId()
    },
    handleClose() {
      if (this.loading) return
      this.drawerVisible = false
    },
    selectUserByRoleId() {
      this.listLoading = true
      selectUserByRoleId({ roleId: this.roleId }).then(res => {
        this.selectedList = res.data
        this.listQuery.params.notInId = res.data.map(it => it.userId)
        this.findPage()
      })
    },
    findPage() {
      findPage(this.listQuery).then(res => {
        const { data } = res
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      })
    },
    handleSearch() {
      this.listQuery.currentPage = 1
      this.findPage()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.findPage()
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.findPage()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectUser(row) {
      relatedUser({ roleId: this.roleId, linkIds: [row.userId] }).then(res => {
        this.$message.success(res.msg)
        this.selectUserByRoleId()
      })
    },
    cancelSelect(row) {
      cancelRelatedUser({ roleId: this.roleId, linkIds: [row.userId] }).then(res => {
        this.$message.success(res.msg)
        this.selectUserByRoleId()
      })
    }
  }
}
</script>

<style scoped>

</style>
