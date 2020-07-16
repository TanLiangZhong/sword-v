<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="1">
      <template slot="title">
        <h3>页面元素</h3>
      </template>
      <div v-permission="permissions.save" class="ml-btn">
        <el-button v-if="menuId" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table v-loading.body="listLoading" :data="list" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="150">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.name" placeholder="名称,必填项" />
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="authority" label="权限标识" min-width="150">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.authority" placeholder="权限标识,必填项" />
            <span v-else>{{ scope.row.authority }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" min-width="150">
          <template slot-scope="scope">
            <el-select v-if="scope.row.isEdit" v-model="scope.row.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.val"
                :value="item.key"
              />
            </el-select>
            <span v-else>{{ scope.row.type | typeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" min-width="150">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.icon" placeholder="图标" />
            <span v-else>{{ scope.row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="href" label="路径" min-width="150">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.href" placeholder="路径" />
            <span v-else>{{ scope.row.href }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="是否有效" width="70">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              disabled
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="!scope.row.isEdit"
            />
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip min-width="150">
          <template slot-scope="scope">
            <el-input v-if="scope.row.isEdit" v-model="scope.row.remark" type="textarea"
                      :autosize="{ minRows: 3, maxRows: 7}" placeholder="请输入备注" show-word-limit :maxlength="128"
            />
            <span v-else>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.isEdit">
              <el-button v-permission="permissions.save" type="text" @click="handleSave(scope.row)">保存</el-button>
              <el-button type="text" @click="handleCancel(scope.row)">取消</el-button>
            </div>
            <div v-else>
              <el-button v-permission="permissions.save" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-popconfirm v-permission="permissions.delete" icon="el-icon-info" icon-color="red" title="确定删除吗？" class="ml-popConfirm"
                             @onConfirm="handleDel(scope.row)"
              >
                <el-link slot="reference" :underline="false" type="danger">删除</el-link>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>

    </el-collapse-item>
  </el-collapse>
</template>

<script>

import { findByMenuId, del, save } from '@/api/sys/element'
import { deepClone } from '@/utils'

export default {
  name: 'ElementForm',
  filters: {
    typeFilter(type) {
      const typeList = [
        { key: 1, val: '按钮' },
        { key: 2, val: '链接' }
      ]
      let name = ''
      typeList.forEach(it => {
        if (it.key === type) name = it.val
      })
      return name
    }
  },
  data() {
    return {
      permissions: {
        delete: 'system:element:delete',
        save: 'system:element:save'
      },
      activeNames: '1',
      list: [],
      listLoading: false,
      menuId: null,
      typeList: [
        { key: 1, val: '按钮' },
        { key: 2, val: '链接' }
      ]
    }
  },
  methods: {
    findList(menuId) {
      this.loading = true
      if (menuId) {
        this.menuId = menuId
      }
      findByMenuId(this.menuId).then(res => {
        this.loading = false
        this.list = res.data
      })
    },
    handleEdit(row) {
      this.$set(row, 'isEdit', true)
    },
    handleDel(row) {
      del(row.elementId).then(res => {
        if (res.success) {
          this.findList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleSave(row) {
      if (!row.authority || !row.name) {
        this.$message.warning('必填项不能为空!!!')
      }

      const body = deepClone(row)
      if (!body.parentId) {
        body.parentId = this.menuId
      }
      save(body).then(res => {
        this.loading = false
        if (res.success) {
          this.findList()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCancel() {
      this.findList()
    },
    handleAdd() {
      this.list.push({
        parentId: this.menuId,
        isEdit: true,
        status: 1,
        type: 1
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
  .ml-btn{
    padding-bottom: 10px;
  }
</style>
