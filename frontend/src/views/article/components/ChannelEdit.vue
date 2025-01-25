<script setup>
  import { ref } from 'vue'
  import { artAddChannelService, artEditChannelService } from '@/api/article'
  import { ElMention, ElMessage } from 'element-plus'
  const dialogVisible = ref(false)
  const formRef = ref()
  const formModel = ref({
    cate_name: '',
    cate_alias: ''
  })

  const rules = {
    cate_name: [
      { required: true, message: 'Please input category name', trigger: 'blur' },
      { 
        pattern: /^\S{1,10}$/,
        message: 'The length of category name must between 1 and 10',
        trigger: 'blur'
      }
    ],
    cate_alias: [
      { required: true, message: 'Please input category alias', trigger: 'blur' },
      { 
        pattern: /^[a-zA-Z0-9]{1,15}$/,
        message: 'The length of category alias must between 1 and 15',
        trigger: 'blur'
      }
    ]
  }

  const emit = defineEmits(['success'])
  const onSubmit = async () => {
    await formRef.value.validate()
    const isEdit = formModel.value.id
    if (isEdit) {
      await artEditChannelService(formModel.value)
      ElMessage.success('Successfully edited')
    } else {
      await artAddChannelService(formModel.value)
      ElMessage.success('Successfully added')
    }

    dialogVisible.value = false
    emit('success')

  }
  // 组件对外暴露一个方法 open， 基于open传来的参数，区分添加还是编辑
  // open({}) => 表单无需渲染，说明是添加
  // open({ id, cate_name, ... }) => 表单需要渲染，说明是编辑
  // open 调用后，可以打开弹窗
  const open = (row) => {
    dialogVisible.value = true
    formModel.value = { ...row } 
  }

  // 向外暴露方法
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? 'Edit Category' : 'Add Category'"
    width="30%"
    :before-close="handleClose"
    >
    <el-form
      ref="formRef"
      :model="formModel" 
      :rules="rules" 
      label-width="100px" 
      style="padding-right: 30px">
      <el-form-item label="Name" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="Please input category name"></el-input>
      </el-form-item>
      <el-form-item label="Alias" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="Please input category alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">
            Confirm
        </el-button>
        </div>
    </template>
  </el-dialog>
</template>
