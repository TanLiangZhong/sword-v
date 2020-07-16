<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>菜单列表</span>
          </div>
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
            default-expand-all
            :expand-on-click-node="false" @node-click="getNode"
          />
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>编辑菜单</span>
          </div>
          <el-form ref="form" label-width="80px" :model="form" :rules="rules" :disabled="!formEdit" style="width: 70%">
            <el-form-item label="父级菜单" prop="parentId">
              <SelectTree v-model="form.parentId" :options="treeData" :props="defaultSelectTreeProps"
                          :disabled="!formEdit"
              />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" :maxlength="24" />
            </el-form-item>
            <el-form-item label="链接" prop="href">
              <el-input v-model="form.href" placeholder="请输入链接" :maxlength="128" />
            </el-form-item>
            <el-form-item label="组件" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件" :maxlength="128" />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" placeholder="请输入图标" :maxlength="128" />
            </el-form-item>
            <el-form-item label="权限标识" prop="authority">
              <el-input v-model="form.authority" placeholder="请输入权限标识" :maxlength="128" />
            </el-form-item>
            <el-form-item label="是否显示" prop="isShow">
              <el-switch
                v-model="form.isShow"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea"
                        :autosize="{ minRows: 3, maxRows: 7}" placeholder="请输入备注" show-word-limit :maxlength="128"
              />
            </el-form-item>
            <el-form-item v-if="formEdit">
              <el-popconfirm v-if="form.menuId" v-permission="permissions.delete" icon="el-icon-info" icon-color="red" title="确定删除吗？" class="ml-popConfirm"
                             @onConfirm="handleDel"
              >
                <el-button slot="reference" type="danger" plain>删 除</el-button>
              </el-popconfirm>
              <el-button @click="resetForm">清 空</el-button>
              <el-button v-permission="permissions.save" type="primary" :loading="loading" @click="save">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
            </el-form-item>
          </el-form>

          <ElementForm v-if="form.menuId" ref="ElementForm" />
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import { del, getTree, save } from '@/api/sys/menu'
import { deepClone } from '@/utils'
import SelectTree from '../../../components/SelectTree/index'
import ElementForm from './components/ElementForm'

export default {
  name: 'Index',
  components: { ElementForm, SelectTree },
  data() {
    return {
      permissions: {
        delete: 'system:menu:delete',
        save: 'system:menu:save'
      },
      defaultSelectTreeProps: {
        parent: 'parentId', // 父级唯一标识
        value: 'menuId', // 唯一标识
        label: 'name', // 标签显示
        children: 'children'// 子级
      },
      listLoading: false,
      treeData: [],
      filterText: null,

      loading: false,
      formEdit: false,
      form: {
        menuId: null,
        parentId: 0,
        name: null,
        href: null,
        component: null,
        icon: null,
        authority: null,
        isShow: 1,
        sort: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        href: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        authority: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    getTree() {
      this.listLoading = true
      getTree().then(res => {
        const { data } = res
        this.treeData = data
        this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.form = {
        menuId: null,
        parentId: 0,
        name: null,
        href: null,
        component: null,
        icon: null,
        authority: null,
        isShow: 1,
        sort: null,
        remark: null
      }
    },
    getNode(row) {
      this.formEdit = true
      this.resetForm()
      this.form = deepClone(row)
      setTimeout(_ => this.$refs.ElementForm.findList(row.menuId), 100)
    },
    handleDel() {
      if (!this.form.menuId) {
        this.$message.warning('请选择需要删除的菜单')
        return
      }
      del(this.form.menuId).then(res => {
        this.loading = false
        if (res.success) {
          this.getTree()
          this.resetForm()
          this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          save(this.form).then(res => {
            this.loading = false
            if (res.success) {
              this.getTree()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}

</script>

<style scoped>
  .ml-popConfirm {
    margin-right: 10px
  }
</style>
