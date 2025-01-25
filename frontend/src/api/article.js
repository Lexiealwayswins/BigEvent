import request from '@/utils/request'
// get article categories
export const artGetChannelsService = () => request.get('./my/cate/list')
// Add Article categories
export const artAddChannelService = (data) => request.post('/my/cate/add', data)
// Edit Article categories
export const artEditChannelService = (data) => request.put('/my/cate/info', data)
// Delete Article categories
export const artDelChannelService = (id) => request.delete('/my/cate/del', {
  params: { id }
})

// 文章: 获取文章列表
export const artGetListService = (params) => request.get('/my/article/list', {
  params
})

// 文章：添加文章
export const artPublishService = (data) => request.post('/my/article/add', data)

// 文章：删除文章
export const artDelService = (id) => request.delete('/my/article/info', {
  params: { id }
})

// 文章： 获取文章详情
export const artGetDetailService = (id) => 
  request.get('/my/article/info', {
    params: { id }
  })

// 文章： 编辑文章
export const artEditService = (data) => request.put('/my/article/info', data)

