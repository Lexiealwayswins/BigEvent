<script setup>
  import { ref } from 'vue'
  import { Delete, Edit } from '@element-plus/icons-vue'
  import ChannelSelect from './components/ChannelSelect.vue'
  import ArticleEdit from './components/ArticleEdit.vue'
  import { artDelService, artGetListService } from '@/api/article'
  import { formatTime } from '@/utils/format.js'
  const articleList = ref([])
  const total = ref(0) //总条数
  const loading = ref(false) // loading状态
  
  // 定义请求参数对象
  const params = ref({
    pagenum: 1,
    pagesize: 5,
    cate_id: '',
    state: ''
  })

  // 基于params参数，获取文章列表
  const getArticleList = async () => {
    loading.value = true
    const res = await artGetListService(params.value)
    articleList.value = res.data.data
    total.value = res.data.total

    loading.value = false
  }
  getArticleList()

  // 处理分页逻辑
  const onSizeChange = (size) => {
    params.value.pagenum = 1
    params.value.pagesize = size
    // 基于最新的分页重新渲染
    getArticleList()
  }

  const onCurrentChange = (page) => {
    // 更新当前页
    params.value.pagenum = page
    // 基于最新的当前页，渲染数据
    getArticleList()
  }

  // search, 按照最新的条件重新检索，从第一页开始检索
  const onSearch = () => {
    params.value.pagenum = 1 // 重置页面
    getArticleList()
  }

  // reset, 将筛选条件清空，重新检索，从第一页开始展示
  const onReset = () => {
    params.value.pagenum = 1 //重置页面
    params.value.cate_id = ''
    params.value.state = ''
    getArticleList()
  }

  const articleEditRef = ref()

  const onAddArticle = () => {
    articleEditRef.value.open({})
  }

  const onEditArticle = (row) => {
    articleEditRef.value.open(row)
  }

  const onDeleteArticle = async (row) => {
    await ElMessageBox.confirm('Are you sure to delete this article?', 'Warm Tips', {
    type: 'warning',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
    await artDelService(row.id)
    ElMessage.success('删除成功')
    getArticleList()
  }

  // add/edit successfully
  const onSuccess = (type) => {
    if (type === 'add') {
      // 渲染最后一页
      const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
      // 更新成最大页码数再渲染
      params.value.pagenum = lastPage
      getArticleList()
    }
    // 直接渲染当前页
    getArticleList()
  }


</script>

<template>
    <page-container title="Article Management">
      <template #extra>
        <el-button type="primary" @click="onAddArticle">Add Articles</el-button>
      </template>
      <!-- Form area -->
      <el-form inline>
        <el-form-item label="Article Category">
          <channel-select v-model="params.cate_id"></channel-select>
        </el-form-item>
        <el-form-item label="Publish Status">
          <el-select v-model="params.state">
            <el-option label="Published" value="published"></el-option>
            <el-option label="Draft" value="draft"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch" type="primary">Search</el-button>
          <el-button @click="onReset">Reset</el-button>
        </el-form-item>

      </el-form>

      <!-- Table area -->
      <el-table :data="articleList" v-loading="loading">
        <el-table-column label="Article Title" prop="title">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Article Category" prop="cate_name"></el-table-column>
        <el-table-column label="Publish Time" prop="pub_date">
          <template #default="{ row }">
            {{ formatTime(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column label="Publish Status" prop="state"></el-table-column>
        <el-table-column label="Operation">
          <template #default="{ row }">
            <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)"></el-button>
            <el-button circle plain type="danger" :icon="Delete" @click="onDeleteArticle(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Paginator -->
      <el-pagination
        v-model:current-page="params.pagenum"
        v-model:page-size="params.pagesize"
        :page-sizes="[2, 3, 4, 10]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />

      <!-- Drawer -->
      <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

    </page-container>
  </template>
  
<style lang="scss" scoped></style>