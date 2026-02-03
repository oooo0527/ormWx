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

    case 'getMamiImages':
      return await getMamiImages(event)

    case 'getWorksData':
      return await getWorksData(event)

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

// 获取mami图片数据
async function getMamiImages(event) {
  try {
    // 从数据库获取mami图片数据，按照tabId和排序字段排序
    const result = await db.collection('mami_images')
      .orderBy('tabId', 'asc')
      .get()

    // 按照tabId分组数据


    return {
      success: true,
      data: result.data,
      message: '获取数据成功'
    }
  } catch (error) {
    console.error('获取mami图片数据失败:', error)
    return {
      success: false,
      data: null,
      message: error.message
    }
  }
}

// 获取作品数据
async function getWorksData(event) {
  try {
    // 从数据库获取作品数据
    const result = await db.collection('works')
      .orderBy('id', 'asc')
      .get()

    return {
      success: true,
      data: result.data,
      message: '获取作品数据成功'
    }
  } catch (error) {
    console.error('获取作品数据失败:', error)
    return {
      success: false,
      data: null,
      message: error.message
    }
  }
}
