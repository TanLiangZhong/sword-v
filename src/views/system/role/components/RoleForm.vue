<template>
  <el-drawer
    ref="drawer"
    :title="titleMap[dialogStatus]"
    :before-close="handleClose"
    :visible.sync="drawerVisible"
    :wrapper-closable="false"
    direction="rtl"
    size="40%"
  >
    <el-main>
      <el-form ref="form" label-width="80px" :model="form" :rules="rules" :disabled="formEdit" style="width: 70%">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" :maxlength="16" />
        </el-form-item>
        <el-form-item label="唯一编号" prop="code">
          <el-input v-model="form.code" placeholder="请输入唯一编号" :maxlength="64" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.val"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea"
                    :autosize="{ minRows: 3, maxRows: 7}" placeholder="请输入介绍" show-word-limit :maxlength="128"
          />
        </el-form-item>
      </el-form>
      <div class="sinon-drawer-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-permission="permissions.save" type="primary" :loading="loading" @click="save">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </el-main>
  </el-drawer>
</template>

<script>
import { save } from '@/api/sys/role'
import { deepClone } from '@/utils'

export default {
  name: 'RoleForm',
  data() {
    return {
      permissions: {
        save: 'system:role:save'
      },
      dialogStatus: 'add',
      drawerVisible: false,
      loading: false,
      formEdit: false,
      titleMap: {
        add: '新增',
        edit: '修改'
      },
      form: {
        roleId: null,
        name: null,
        code: null,
        remark: null,
        status: null
      },
      rules: {
        name: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }]
      },
      statusList: [
        { key: 1, val: '启用' },
        { key: 0, val: '禁用' }
      ]

    }
  },
  methods: {
    show(dialogStatus, data) {
      this.dialogStatus = dialogStatus
      this.form = {
        roleId: null,
        name: null,
        code: null,
        remark: null,
        status: null
      }
      this.drawerVisible = true
      data && (this.form = deepClone(data))
    },
    handleClose() {
      if (this.loading) return
      this.drawerVisible = false
      this.$refs.form.resetFields()
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          save(this.form).then(res => {
            this.loading = false
            if (res.success) {
              this.handleClose()
              this.$message.success(res.msg)
              this.$emit('refreshPage')
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
