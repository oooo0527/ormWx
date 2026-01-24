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
    case 'getList':
      return await getRewordList(event)
    case 'getById':
      return await getRewordById(event)
    case 'getNotifications':
      return await getNotifications(event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取奖项列表
async function getRewordList(event) {
  try {
    let query = db.collection('rewordList')

    // 根据type筛选（1:获奖, 2:品牌, 3:提名）
    if (event.type) {
      query = query.where({
        type: event.type
      })
    }

    // 分页查询
    const result = await query
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
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

// 获取通知消息列表
async function getNotifications(event) {
  try {
    let query = db.collection('notifications');

    // 添加日期过滤条件，只获取指定日期后的通知
    if (event.beforeDate) {
      query = query.where({
        beforeDate: _.gt(new Date(event.beforeDate))
      });
    }

    const result = await query.get();

    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

// 根据ID获取单个奖项
async function getRewordById(event) {
  try {
    const result = await db.collection('rewordList').doc(event.id).get()

    if (result.data) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: '奖项不存在'
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}