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
      </el-form>
    </el-row>

    <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" style="width: 100%">
      <el-table-column prop="logId" label="ID" width="70" />
      <el-table-column prop="username" label="操作人" width="120" />
      <el-table-column prop="operation" label="用户操作" width="150" />
      <el-table-column prop="timeConsuming" label="耗时" width="70" />
      <el-table-column prop="method" label="请求方法" show-overflow-tooltip	/>
      <el-table-column prop="params" label="请求参数" show-overflow-tooltip	/>
      <el-table-column prop="ip" label="IP地址" width="120" />
      <el-table-column prop="gmtCreated" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreated | moment('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.currentPage"
      :page-sizes="[50, 100]"
      :page-size="50"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </el-main>
</template>

<script>
import { findPage } from '@/api/sys/log'

export default {
  name: 'Index',
  data() {
    return {
      listQuery: {
        currentPage: 1,
        pageSize: 50,
        sorter: { logId: 'DESC' },
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
    }
  }
}
</script>

<style scoped>

</style>
