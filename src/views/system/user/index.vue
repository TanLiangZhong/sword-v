<template>
  <el-main>
    <el-row class="filter-container">
      <el-form :inline="true" :model="listQuery.params" @keyup.enter.native="handleSearch">
        <el-form-item label="">
          <el-input v-model="listQuery.params.keyword" placeholder="输入关键字搜索" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain icon="el-icon-search" @click="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button v-permission="permissions.save" type="primary" icon="el-icon-plus" @click="handleAdd">新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="username" label="账号" />
      <el-table-column prop="roleNames" label="角色" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column prop="status" label="启用状态" width="70">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            disabled
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          />
        </template>
      </el-table-column>
      <el-table-column prop="introduction" label="介绍" show-overflow-tooltip />
      <el-table-column prop="gmtCreatedStr" label="创建时间" />
      <el-table-column fixed="right" align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" />
          <el-popconfirm v-permission="permissions.delete" icon="el-icon-info" icon-color="red" title="确定删除吗？"
                         class="ml-popConfirm" @onConfirm="handleDel(scope.row)"
          >
            <el-button slot="reference" type="danger" plain icon="el-icon-delete" />
          </el-popconfirm>
        </template>
      </el-table-column>
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

    <UserForm ref="UserForm" @refreshPage="handleSearch" />
  </el-main>
</template>

<script>
import { del, findPage } from '@/api/sys/user'
import UserForm from './components/UserForm'

export default {
  name: 'Index',
  components: { UserForm },
  data() {
    return {
      permissions: {
        delete: 'system:user:delete',
        save: 'system:user:save'
      },
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        sorter: {},
        params: { keyword: null }
      },
      list: [],
      total: null,
      listLoading: false

    }
  },
  created() {
    this.findPage()
  },
  methods: {
    findPage() {
      this.listLoading = true
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
    handleAdd() {
      this.$refs.UserForm.show('add')
    },
    handleEdit(row) {
      this.$refs.UserForm.show('edit', row)
    },
    handleDel(row) {
      del(row.userId).then(res => {
        this.loading = false
        if (res.success) {
          this.handleSearch()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .ml-popConfirm {
    margin-right: 10px;
    margin-left: 10px;
  }
</style>
