<template>
  <el-drawer
    ref="drawer"
    title="关联菜单"
    :before-close="handleClose"
    :visible.sync="drawerVisible"
    :wrapper-closable="false"
    direction="rtl"
    size="40%"
  >
    <el-main>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="menu">
          <template slot="title">
            <h3>菜单</h3>
          </template>
          <el-form :inline="true">
            <el-form-item label="">
              <el-input v-model="filterText" placeholder="输入关键字搜索" />
            </el-form-item>
          </el-form>
          <el-tree
            ref="menuTree"
            class="filter-tree"
            :data="treeData"
            node-key="menuId"
            :highlight-current="true"
            :props="defaultSelectTreeProps"
            :filter-node-method="filterNode"
            show-checkbox
            default-expand-all
            :expand-on-click-node="false"
            @node-click="getNode"
            @check="treeCheck"
          />
        </el-collapse-item>
        <el-collapse-item name="element">
          <template slot="title">
            <h3>页面元素</h3>
          </template>
          <el-table ref="elementTable" v-loading.body="listLoading" :data="list" tooltip-effect="dark" style="width: 100%" row-key="elementId" @select="handleTableSelect" @select-all="handleTableSelect">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="authority" label="权限标识" />
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <span>{{ scope.row.type | typeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标" />
            <el-table-column prop="href" label="路径" />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-drawer>
</template>

<script>
import { getTree } from '@/api/sys/menu'
import { findLinkIds, batchAddRoleLink } from '@/api/sys/role'
import { findByMenuId as findElementList } from '@/api/sys/element'

export default {
  name: 'RelationMenu',
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
      drawerVisible: false,
      loading: false,
      roleId: null,
      filterText: null,
      defaultSelectTreeProps: {
        parent: 'parentId', // 父级唯一标识
        value: 'menuId', // 唯一标识
        label: 'name', // 标签显示
        children: 'children'// 子级
      },
      treeData: [],
      activeNames: ['menu', 'element'],
      list: [],
      listLoading: false
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
      this.list = []
      findLinkIds({ roleId, type: 0 }).then(res => {
        this.$refs.menuTree.setCheckedKeys(res.data)
      })
      this.drawerVisible = true
      this.treeData.length || this.getMenuTree()
    },
    handleClose() {
      if (this.loading) return
      this.drawerVisible = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getMenuTree() {
      getTree().then(res => {
        const { data } = res
        this.treeData = data
      })
    },
    save(linkIds, type, cancelIds) {
      this.loading = true
      batchAddRoleLink({ roleId: this.roleId, linkIds, type, cancelIds }).then(res => {
        this.loading = false
        if (res.success) {
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getNode(row) {
      this.findElementList(row.menuId)
    },
    async findElementList(menuId) {
      this.loading = true
      const { data } = await findLinkIds({ roleId: this.roleId, type: 1 })
      findElementList(menuId).then(res => {
        this.loading = false
        this.list = res.data
        setTimeout(_ => {
          this.list.forEach(row => {
            if (data.includes(row.elementId)) {
              this.$refs.elementTable.toggleRowSelection(row)
            }
          })
        }, 50)
      })
    },
    treeCheck(_, { checkedKeys }) {
      this.save(checkedKeys, 0)
    },
    handleTableSelect(val, _) {
      this.save(val.map(it => it.elementId), 1, this.list.map(it => it.elementId))
    }

  }
}
</script>

<style scoped>
  .sinon-drawer-footer{
    margin-top: 20px;
  }
</style>
