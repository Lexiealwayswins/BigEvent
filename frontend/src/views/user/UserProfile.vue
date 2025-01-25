<script setup>
  import PageContainer from '@/components/PageContainer.vue'
  import { ref } from "vue";
  import { ElMessage } from "element-plus"
  import { useUserStore } from '@/stores'
  import { userUpdateInfoService } from '@/api/user'

  const { 
    user: { email, id, nickname, username },
    getUser
  } = useUserStore()

  const userForm = ref()

  // 表单数据
  const form = ref({
    id,
    username, // 登录名称，默认值
    nickname, // 用户昵称
    email, // 用户邮箱
  })

  // 表单校验规则
  const rules = ref({
    nickname: [
        { required: true, message: "nickname cannot be empty", trigger: "blur" },
        { pattern: /^\S{2,10}/, message: "The length of nickname should be between 2-10", trigger: "blur" },
    ],
    email: [
        { required: true, message: "The email cannot be empty", trigger: "blur" },
        { type: "email", message: "Please input effective email", trigger: "blur" },
    ],
  })

  // 提交表单
  const submitForm = async () => {
    await userForm.value.validate()
    await userUpdateInfoService(form.value)
    getUser()
    ElMessage.success('Successfully modified')
  }
</script>

<template>
  <page-container title="Basic File">
    <!-- Form -->
    <el-form
        ref="userForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="form-container"
    >
        <!-- 第一行：登录名称 -->
        <el-form-item label="Username">
        <el-input v-model="form.username" disabled></el-input>
        </el-form-item>

        <!-- 第二行：用户昵称 -->
        <el-form-item label="Nickname" prop="nickname">
        <el-input v-model="form.nickname" placeholder="please input nickname"></el-input>
        </el-form-item>

        <!-- 第三行：用户邮箱 -->
        <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="Please input email"></el-input>
        </el-form-item>

        <!-- 第四行：提交按钮 -->
        <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        </el-form-item>
    </el-form>
  </page-container>
</template>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 50px auto;
}
</style>