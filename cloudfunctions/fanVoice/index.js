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
      return await getInteractionList(event)
    case 'getInteractionById':
      return await getInteractionById(event)

    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

function convertUTCToBeijing(utcString) {
  // 1. 解析UTC时间字符串
  const utcDate = new Date(utcString); // 假设utcString是 "2025-12-08T05:51:31Z"

  // 2. 转换为北京时间（UTC+8）
  const beijingDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);

  // 3. 格式化输出
  const year = beijingDate.getFullYear();
  const month = String(beijingDate.getMonth() + 1).padStart(2, '0');
  const day = String(beijingDate.getDate()).padStart(2, '0');
  const hour = String(beijingDate.getHours()).padStart(2, '0');
  const minute = String(beijingDate.getMinutes()).padStart(2, '0');
  const second = String(beijingDate.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

// 获取投稿留言列表
async function getInteractionList(event) {
  try {
    let query = db.collection('interactions')
    if (event.createdAt) {
      // 使用时间戳查询，处理传入的时间戳参数
      // 将时间戳转换为当天的开始和结束时间
      const targetDate = new Date(event.createdAt);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await query
        .where({
          createdAt: _.and(_.gte(startOfDay.getTime()), _.lte(endOfDay.getTime())),
          status: event.status,
        })
        .orderBy('createdAt', 'desc')
        .skip(event.skip || 0)
        .limit(event.limit || 20)
        .get()
      return {
        success: true,
        data: result.data
      }
    }
    else {
      // 分页查询
      const result = await query
        .where({
          checked: event.checked
        })
        .orderBy('createdAt', 'desc')
        .skip(event.skip || 0)
        .limit(event.limit || 20)
        .get()
      return {
        success: true,
        data: result.data
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 根据ID获取单个投稿留言
async function getInteractionById(event) {
  try {
    const result = await db.collection('interactions').doc(event.id).get()

    if (result.data) {
      return {
        success: true,
        data: result.data
      }
    } else {
      return {
        success: false,
        message: '投稿留言不存在'
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}



