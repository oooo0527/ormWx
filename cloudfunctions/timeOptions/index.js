// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 根据事件参数决定操作
  switch (event.action) {
    case 'getTimeOptions':
      return await getTimeOptions(event, context)
    case 'getTimeOptionById':
      return await getTimeOptionById(event, context)
    default:
      return await getTimeOptions(event, context)
  }
}

// 获取时间选项数据
async function getTimeOptions(event, context) {
  try {
    const result = await db.collection('timeOptions').get()
    return {
      success: true,
      data: result.data,
      message: '获取选项成功'
    }
  } catch (error) {
    console.error('获取选项失败:', error)
    return {
      success: false,
      message: error.message || '获取选项失败'
    }
  }
}
