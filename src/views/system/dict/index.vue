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
          <el-button v-permission="permissions.save" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" style="width: 100%" row-key="dictId" lazy :load="loadChildren">
      <el-table-column prop="dictId" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="tag" label="标签" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="gmtCreated" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreated | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)" />
          <el-popconfirm v-permission="permissions.delete" icon="el-icon-info" icon-color="red" title="确定删除吗？" class="ml-popConfirm"
                         @onConfirm="handleDel(scope.row)"
          >
            <el-button slot="reference" type="danger" plain icon="el-icon-delete" />
          </el-popconfirm>
          <el-button v-if="scope.row.parentId === 0" v-permission="permissions.save" type="primary" icon="el-icon-menu" @click="handleAddChildren(scope.row)" />
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

    <DictForm ref="DictForm" @refreshPage="handleSearch" />
  </el-main>
</template>

<script>
import { del, findPage } from '@/api/sys/dict'
import DictForm from './components/DictForm'

export default {
  name: 'Index',
  components: { DictForm },
  data() {
    return {
      permissions: {
        delete: 'system:dict:delete',
        save: 'system:dict:save'
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
      this.$refs.DictForm.show('add')
    },
    handleEdit(row) {
      this.$refs.DictForm.show('edit', row)
    },
    handleDel(row) {
      del(row.dictId).then(res => {
        this.loading = false
        if (res.success) {
          this.handleSearch()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAddChildren(row) {
      this.$refs.DictForm.show('addChildren', row)
    },
    loadChildren(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve()
      }, 1000)
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
