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
    // 根据action参数执行不同操作
    switch (event.action) {

      case 'getApprovedPhotos':
        return await getApprovedPhotos(event)
      case 'getRankingList':
        return await getRankingList(event)
      case 'getPhotosByStyle':
        return await getPhotosByStyle(event)
      case 'recordView':
        return await recordView(event)
      default:
        return {
          success: false,
          message: '无效的操作'
        }
    }
  } catch (err) {
    console.error('操作失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}



// 获取审核通过的照片
async function getApprovedPhotos(event) {
  try {
    // 获取审核通过的照片，按时间倒序排列
    const result = await db.collection('dream_photos')
      .where({
        status: 'approved'
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: result.data,
      message: '获取审核通过照片成功'
    }
  } catch (err) {
    console.error('获取审核通过照片失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}

// 根据风格获取照片
async function getPhotosByStyle(event) {
  const { style } = event;

  // 参数验证
  if (!style) {
    return {
      success: false,
      message: '缺少风格参数'
    };
  }

  try {
    // 获取指定风格的审核通过照片，按时间倒序排列
    const result = await db.collection('dream_photos')
      .where({
        style: style,
        status: 'approved'
      })
      .orderBy('createTime', 'desc')
      .get();

    return {
      success: true,
      data: result.data,
      message: '获取照片成功'
    };
  } catch (err) {
    console.error('获取照片失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}

// 获取排行榜数据
async function getRankingList(event) {
  try {
    // 获取排行榜数据，按浏览次数降序排列
    const result = await db.collection('dream_photos')
      .where({
        status: 'approved'
      })
      .orderBy('views', 'desc')
      .limit(7) // 限制返回前7名
      .get()

    // 为每条记录添加排名字段
    const rankingList = result.data.map((item, index) => {
      return {
        ...item,
        rank: index + 1
      };
    });

    return {
      success: true,
      data: rankingList,
      message: '获取排行榜数据成功'
    };
  } catch (err) {
    console.error('获取排行榜数据失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}



// 记录照片浏览
async function recordView(event) {
  const { photoId } = event;

  // 参数验证
  if (!photoId) {
    return {
      success: false,
      message: '缺少照片ID'
    };
  }

  try {
    // 增加照片的浏览数
    await db.collection('dream_photos').doc(photoId).update({
      data: {
        views: db.command.inc(1)
      }
    });

    return {
      success: true,
      message: '浏览记录成功'
    };
  } catch (err) {
    console.error('浏览记录失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}