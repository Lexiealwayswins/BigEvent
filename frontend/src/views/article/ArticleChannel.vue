<script setup>
import { ref } from 'vue'
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage } from 'element-plus';

const channelList = ref([])

const loading = ref(false)

const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

const onEditChannel = (row) => {
  dialog.value.open(row)
}

const onAddChannel = () => {
  dialog.value.open({})
}

const onDelChannel = async (row) => {
  await ElMessageBox.confirm('Are you sure to delete categories?', 'Warm Tips', {
    type: 'warning',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}

const onSuccess = () => {
  getChannelList()
}

</script>

<template>
  <page-container title="Article Categories">
    <template #extra>
      <el-button @click="onAddChannel">Add Category</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="Index" width="100"></el-table-column>
      <el-table-column prop="cate_name" label="Category Name"></el-table-column>
      <el-table-column prop="cate_alias" label="Category Alias"></el-table-column>
      <el-table-column label="Operation" width="100">
        <!-- 这里赋值结构了obj里面的row和index -->
        <template #default="{ row, $index }"> 
          <el-button 
            :icon="Edit" 
            circle
            plain
            type="primary"
            @click="onEditChannel(row, $index)"
          ></el-button>
          <el-button 
            :icon="Delete" 
            circle
            plain
            type="danger"
            @click="onDelChannel(row, $index)"
          ></el-button>
        </template>
      </el-table-column>

      <!-- 没有数据的插槽 -->
      <template #empty>
        <el-empty description="No data"></el-empty>
      </template>
    </el-table>

    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>

  </page-container>
</template>

<style lang="scss" scoped></style>