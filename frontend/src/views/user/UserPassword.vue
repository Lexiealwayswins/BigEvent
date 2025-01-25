<script setup>
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { userUpdatePasswordService } from "@/api/user"
import { useUserStore } from "@/stores"
import { useRouter } from "vue-router"

const pwdFormRef = ref()
// Form data
const pwdForm = ref({
  old_pwd: "",
  new_pwd: "",
  re_pwd: "",
});

// Validation rules
const rules = {
  old_pwd: [
    { required: true, message: "Old password is required", trigger: "blur" },
    { min: 6, max: 15, message: "Password must be 6 to 15 characters", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === pwdForm.value.new_pwd) {
          callback(new Error("Old password and new password cannot be the same"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  new_pwd: [
    { required: true, message: "New password is required", trigger: "blur" },
    { min: 6, max: 15, message: "Password must be 6 to 15 characters", trigger: "blur" },
  ],
  re_pwd: [
    { required: true, message: "Confirm password is required", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error("New password and confirm password must match"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const userStore = useUserStore()
const router = useRouter()
// Submit password change
const submitPassword = async () => {
  try { 
    await pwdFormRef.value.validate()
    await userUpdatePasswordService(pwdForm.value)
    ElMessage.success('Successfully changed password')

    // 清空本地缓存的token和个人信息
    userStore.setToken('')
    userStore.setUser({})

    // 拦截登录
    router.push('/login')

  } catch (error) {
    console.log(error)
  }

};

// Reset form
const resetForm = () => {
  pwdForm.value.old_pwd = "";
  pwdForm.value.new_pwd = "";
  pwdForm.value.re_pwd = "";
}
</script>

<template>
  <page-container title="Change Password">
    <el-form
    ref="pwdFormRef"
    :model="pwdForm"
    :rules="rules"
    label-width="150px"
    class="form-container"
    >
        <!-- Row 1: Old Password -->
        <el-form-item label="Old Password" prop="old_pwd">
        <el-input type="password" v-model="pwdForm.old_pwd" placeholder="Enter old password"></el-input>
        </el-form-item>

        <!-- Row 2: New Password -->
        <el-form-item label="New Password" prop="new_pwd">
        <el-input type="password" v-model="pwdForm.new_pwd" placeholder="Enter new password"></el-input>
        </el-form-item>

        <!-- Row 3: Confirm Password -->
        <el-form-item label="Confirm Password" prop="re_pwd">
        <el-input type="password" v-model="pwdForm.re_pwd" placeholder="Confirm new password"></el-input>
        </el-form-item>

        <!-- Row 4: Buttons -->
        <el-form-item>
        <el-button type="primary" @click="submitPassword">Change Password</el-button>
        <el-button @click="resetForm">Reset</el-button>
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
