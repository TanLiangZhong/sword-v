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
          <el-input v-model="form.name" placeholder="请输入名称" :maxlength="24" />
        </el-form-item>
        <el-form-item label="父级字典" prop="parentId">
          <el-input v-model="form.parentName" placeholder="最上级不需填写" :readonly="true" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="form.tag" placeholder="请输入唯一标签" :maxlength="64" />
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
import { save } from '@/api/sys/dict'
import { deepClone } from '@/utils'

export default {
  name: 'DictForm',
  data() {
    return {
      permissions: {
        save: 'system:dict:save'
      },
      dialogStatus: 'add',
      drawerVisible: false,
      loading: false,
      formEdit: false,
      titleMap: {
        add: '新增',
        edit: '修改',
        addChildren: '新增下级字典'
      },
      form: {
        dictId: null,
        parentId: 0,
        parentName: null,
        name: null,
        tag: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        tag: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }]
      }

    }
  },
  methods: {
    show(dialogStatus, data) {
      this.dialogStatus = dialogStatus
      this.form = {
        dictId: null,
        parentId: 0,
        parentName: null,
        name: null,
        tag: null,
        remark: null
      }
      this.drawerVisible = true
      if (dialogStatus === 'addChildren') {
        this.form.parentId = data.dictId
        this.form.parentName = data.name
        return
      }
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
