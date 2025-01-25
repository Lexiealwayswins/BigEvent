<script setup>
  import { ref } from 'vue'
  import ChannelSelect from './ChannelSelect.vue'
  import { Plus } from '@element-plus/icons-vue'
  import { QuillEditor } from '@vueup/vue-quill'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { artEditService, artGetDetailService, artPublishService } from '@/api/article'
  import { ElMessage } from 'element-plus'
  import { baseURL } from '@/utils/request'

  // 控制抽屉显示隐藏
  const visibleDrawer = ref(false)

  const defaultForm = {
    title: '',
    cate_id: '',
    cover_img: '', // file object
    content: '',
    state: ''
  }

  const formModel = ref({
    ...defaultForm
  })
  const imgUrl = ref('')
  const onSelectFile = (uploadFile) => {
    // 用于预览
    imgUrl.value = URL.createObjectURL(uploadFile.raw)
    // 用于提交
    formModel.value.cover_img = uploadFile.raw
  }

  const emit = defineEmits('success')
  // Submit
  const onPublish = async (state) => {
    try {
      formModel.value.state = state
      // transform object to formdata object
      const fd = new FormData()
      for (let key in formModel.value) {
        fd.append(key, formModel.value[key])
      }

      // request
      if (formModel.value.id) {
        // Edit
        await artEditService(fd)
        ElMessage.success('Successfully editted')
        visibleDrawer.value = false
        emit('success', 'edit')
      } else {
        // Add
        await artPublishService(fd)
        ElMessage.success('Successfully Published')
        visibleDrawer.value = false
        // 通知到父组件，添加成功了
        emit('success', 'add')
      }
    } catch (error) { 
      console.error('Error during publish:', error)
      ElMessage.error('Failed to publish article')
    }
    
  }

  const editorRef = ref()
  const open = async (row) => {
    visibleDrawer.value = true // 显示抽屉
    if (row.id) {
      // 编辑回显
      const res = await artGetDetailService(row.id)
      formModel.value = res.data.data
      // 图片需要单独处理回显
      imgUrl.value = baseURL + formModel.value.cover_img
      // 注意：提交给后台，需要的数据格式是file对象
      formModel.value.cover_img = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    } else {
      formModel.value = { ...defaultForm }
      imgUrl.value = ''
      // clear rich text
      nextTick(() => {
        editorRef.value.setHTML('')
      })
    }
  }

  // 将网络图片地址转换为File对象
  async function imageUrlToFile(url, fileName) {
    try {
      // 第一步：使用axios获取网络图片数据
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageData = response.data;

      // 第二步：将图片数据转换为Blob对象
      const blob = new Blob([imageData], { type: response.headers['content-type'] });

      // 第三步：创建一个新的File对象
      const file = new File([blob], fileName, { type: blob.type });

      return file;
    } catch (error) {
      console.error('将图片转换为File对象时发生错误:', error);
      throw error;
    }
  }

  defineExpose({
    open
  })

</script>

<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? 'Edit Article' : 'Add Article'"
    direction="rtl"
    size="50%"
  >
  <!-- 发表文章表单 -->
  <el-form :model="formModel" ref="formRef" label-width="120px">
    <el-form-item label="Article Title" prop="title">
      <el-input v-model="formModel.title" placeholder="Please input article title"></el-input>
    </el-form-item>
    <el-form-item label="Article Category" prop="cate_id">
      <channel-select
        v-model="formModel.cate_id"
        width="100%"
      ></channel-select>
    </el-form-item>
    <el-form-item label="Article Avatar" prop="cover_img">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="onSelectFile"
      >
        <img v-if="imgUrl" :src="imgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="Article Content" prop="content">
      <div class="editor">
        <quill-editor 
          ref="editorRef"
          theme="snow"
          v-model:content="formModel.content"
          content-type="html"
        >
        </quill-editor>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button @click="onPublish('已发布')" type="primary">Post</el-button>
      <el-button @click="onPublish('草稿')" type="info">Draft</el-button>
    </el-form-item>
  </el-form>
</el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>