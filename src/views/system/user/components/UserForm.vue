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
        <el-form-item label="头像" prop="avatar">
          <AliOSSUpload class="avatar-uploader" action="AliOSS" :show-file-list="false"
                        :on-success="handleSuccess"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </AliOSSUpload>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" :maxlength="16" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" placeholder="请输入账号" :maxlength="16" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" show-password :maxlength="16" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" :maxlength="16" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" :maxlength="16" />
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
        <el-form-item label="介绍" prop="introduction">
          <el-input v-model="form.introduction" type="textarea"
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
import { save } from '@/api/sys/user'
import { deepClone } from '@/utils'
import AliOSSUpload from '../../../../components/AliOSSUpload/index'

export default {
  name: 'UserForm',
  components: { AliOSSUpload },
  data() {
    return {
      permissions: {
        save: 'system:user:save'
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
        userId: null,
        nickname: null,
        avatar: null,
        username: null,
        password: null,
        email: null,
        phone: null,
        introduction: null,
        status: null
      },
      rules: {
        nickname: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '必填项, 不能为空', trigger: 'blur' }],
        phone: [{ pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }]
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
        userId: null,
        nickname: null,
        avatar: null,
        username: null,
        password: null,
        email: null,
        phone: null,
        introduction: null,
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
    },
    handleSuccess(...params) {
      if (params[0]) {
        // TODO
        console.log('上传成功', params[0])
      }
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
