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

      // 将日期转换为时间戳进行查询
      const startTime = monthStart.getTime();
      const endTime = nextMonth.getTime();

      query = query.where({
        date: db.command.gte(startTime)
          .and(db.command.lt(endTime))
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

