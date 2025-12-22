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

  switch (event.action) {

    case 'getMusicList':
      return await getMusicList(event)

    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}



// 获取音乐列表
async function getMusicList(event) {
  try {
    // 查询music集合中的所有音乐数据
    const result = await db.collection('music')
      .where({
        type: 'mis'  // 根据你提供的数据，音乐类型为'mis'
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}
