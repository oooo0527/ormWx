// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'getEvents':
      return await getEvents(event)
    case 'addEvent':
      return await addEvent(event)
    case 'deleteEvent':
      return await deleteEvent(event)
    default:
      return await getEvents(event)
  }
}

// 获取所有事件
async function getEvents(event) {
  try {
    let query = db.collection('events');

    // 如果指定了月份，则查询该月份的事件
    if (event.month) {
      // 构造月份查询条件，例如 '2025-12'
      const monthStart = new Date(`${event.month}-01`);
      const nextMonth = new Date(monthStart);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      query = query.where({
        date: db.command.gte(monthStart.toISOString().slice(0, 10))
          .and(db.command.lt(nextMonth.toISOString().slice(0, 10)))
      });
    }

    // 从数据库获取events数据
    const result = await query.get();

    return {
      success: true,
      data: result.data,
      message: '获取事件数据成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 添加事件
async function addEvent(event) {
  try {
    const { date, title, description } = event.event

    // 参数验证
    if (!date || !title || !description) {
      return {
        success: false,
        message: '参数不完整'
      }
    }

    // 插入新事件
    const result = await db.collection('events').add({
      data: {
        date: date,
        title: title,
        description: description,
        createTime: new Date()
      }
    })

    return {
      success: true,
      data: result._id,
      message: '添加事件成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除事件
async function deleteEvent(event) {
  try {
    const { id } = event

    // 参数验证
    if (!id) {
      return {
        success: false,
        message: '缺少事件ID'
      }
    }

    // 删除事件
    const result = await db.collection('events').doc(id).remove()

    return {
      success: true,
      data: result,
      message: '删除事件成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}