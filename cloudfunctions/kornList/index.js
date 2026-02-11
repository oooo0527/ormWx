// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    switch (event.action) {
      case 'getEpisodes':
        return await getEpisodes(event)
      case 'getEpisodeDetail':
        return await getEpisodeDetail(event)
      case 'getAllDramas':
        return await getAllDramas(event)
      default:
        return {
          success: false,
          message: '无效的操作类型'
        }
    }
  } catch (error) {
    console.error('云函数执行错误:', error)
    return {
      success: false,
      message: error.message
    }
  }
}

/**
 * 获取剧集列表
 * @param {Object} event - 请求参数
 */
async function getEpisodes(event) {
  const { dramaId } = event

  try {
    // 查询集合获取剧集列表
    const result = await db.collection('kornList')
      .get()

    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: '未找到对应的剧集数据'
      }
    }
  } catch (error) {
    console.error('获取剧集列表失败:', error)
    return {
      success: false,
      message: '获取剧集列表失败: ' + error.message
    }
  }
}

/**
 * 获取单个剧集详情
 * @param {Object} event - 请求参数
 */
async function getEpisodeDetail(event) {
  const { _id } = event

  try {

    // 多种查询方式尝试

    // 方式1: 按tabId字段查询
    let result = await db.collection('kornListPage')
      .where({
        _id: _id
      })
      .get()

    console.log('按tabId查询结果:', result);

    if (result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      }
    }
    return {
      success: false,
      message: `未找到`
    }

  } catch (error) {
    console.error('获取剧集详情失败:', error)
    return {
      success: false,
      message: '获取剧集详情失败: ' + error.message
    }
  }
}

/**
 * 获取所有电视剧列表
 * @param {Object} event - 请求参数
 */
async function getAllDramas(event) {
  try {
    const result = await db.collection('kornList')
      .field({
        _id: true,
        title: true,
        heroineName: true,
        coverImage: true,
        description: true,
        totalEpisodes: true,
        status: true
      })
      .get()

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error('获取电视剧列表失败:', error)
    return {
      success: false,
      message: '获取电视剧列表失败: ' + error.message
    }
  }
}