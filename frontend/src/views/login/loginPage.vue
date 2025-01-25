<script setup>
import { ref, watch } from 'vue'
import { userLoginService, userRegisterService } from '@/api/user.js'
import { User, Lock, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref()
// 整个用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
// 整个表单的校验规则
const rules = {
  username: [
    // 1. 非空校验
    { required: true, message: 'Please input username', trigger: 'blur' },// 失焦的时候校验
    // 2. 长度校验
    { min: 5, max: 10, message:'The length of username must between 5 and 10', trigger: 'blur'},
    // 3. 正则校验 -- 可以自己加
  ],
  password: [
    // 1. 非空校验
    { 
      required: true, 
      message: 'Please input password', trigger: 'blur' 
    },
    // 2. 正则校验
    { 
      pattern: /^\S{6,15}$/, 
      message: 'The length of password must between 6 and 15', 
      trigger: 'blur' 
    }
  ],
  repassword: [
    // 1. 非空校验
    { 
      required: true, 
      message: 'Please input password again', trigger: 'blur' 
    },
    // 2. 正则校验
    { 
      pattern: /^\S{6,15}$/, 
      message: 'The length of password must between 6 and 15', 
      trigger: 'blur' 
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功， 也需要callback
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  // // 注册成功之前，先进行校验，校验成功 -> 请求；校验失败 -> 自动提示
  // await form.value.validate()
  // await userRegisterService(formModel.value)
  // ElMessage.success('Successfully Registered')
  // // 切换到登录
  // isRegister.value = false
  try {
    console.log(form.value); // 打印 form 实例，确保它存在
    await form.value.validate();
    await userRegisterService(formModel.value);
    ElMessage.success('Successfully Registered');
    isRegister.value = false;
  } catch (error) {
    console.error('Register failed:', error);
    ElMessage.error('Register failed!');
  }
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('Successfully login')
  router.push('/')
}

// 切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
    <!-- 注册相关表单 -->
      <el-form 
        :model="formModel"
        :rules="rules"
        ref="form" 
        size="large" 
        autocomplete="off" 
        v-if="isRegister">
        <el-form-item>
          <h1>Register</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input 
          v-model="formModel.username" 
          :prefix-icon="User" 
          placeholder="Please input username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please input password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="View"
            type="password"
            placeholder="Please input password again"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="register"
            class="button" 
            type="primary" 
            auto-insert-space>
            Register
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← Back
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form 
        :model="formModel"
        :rules="rules"
        ref="form" 
        size="large" 
        autocomplete="off"
        v-else>
        <el-form-item>
          <h1>Login</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input 
          v-model="formModel.username" :prefix-icon="User" placeholder="Please input username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password" 
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="Please input password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>Remember me</el-checkbox>
            <el-link type="primary" :underline="false">Forgot pwd？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button 
            @click="login"
            class="button" 
            type="primary" 
            auto-insert-space
            >Login</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            Register →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>