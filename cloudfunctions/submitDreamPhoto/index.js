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
      case 'submitPhoto':
        return await submitPhoto(event)
      case 'getPendingPhotos':
        return await getPendingPhotos(event)
      case 'approvePhoto':
        return await approvePhoto(event)
      case 'rejectPhoto':
        return await rejectPhoto(event)
      case 'getUserPhotos':
        return await getUserPhotos(event)
      case 'getApprovedPhotos':
        return await getApprovedPhotos(event)
      case 'getRankingList':
        return await getRankingList(event)
      case 'likePhoto':
        return await likePhoto(event)
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

// 用户投稿
async function submitPhoto(event) {
  const { style, imageUrl, description, userId, userName, userAvatar } = event

  // 参数验证
  if (!style || !imageUrl || !description || !userId || !userName || !userAvatar) {
    return {
      success: false,
      message: '参数不完整'
    }
  }

  // 检查用户今天是否已经投稿
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const countResult = await db.collection('dream_photos').where({
    userId: userId,
    createTime: db.command.gte(today)
  }).count()

  if (countResult.total >= 1) {
    return {
      success: false,
      message: '每天只能投稿一次'
    }
  }

  // 插入新照片到待审核状态
  const result = await db.collection('dream_photos').add({
    data: {
      style: style,
      imageUrl: imageUrl,
      description: description,
      userId: userId,
      userName: userName,
      userAvatar: userAvatar,
      status: 'pending', // 待审核状态
      likes: 0,
      createTime: new Date()
    }
  })

  return {
    success: true,
    data: result._id,
    message: '投稿成功，等待审核'
  }
}

// 获取待审核的照片
async function getPendingPhotos(event) {
  try {
    // 获取待审核的照片
    const result = await db.collection('dream_photos').where({
      status: 'pending'
    }).orderBy('createTime', 'desc').get()

    return {
      success: true,
      data: result.data,
      message: '获取待审核照片成功'
    }
  } catch (err) {
    console.error('获取待审核照片失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}

// 审核通过照片
async function approvePhoto(event) {
  const { photoId } = event

  // 参数验证
  if (!photoId) {
    return {
      success: false,
      message: '缺少照片ID'
    }
  }

  try {
    // 更新照片状态为已审核
    await db.collection('dream_photos').doc(photoId).update({
      data: {
        status: 'approved',
        approveTime: new Date()
      }
    })

    // 获取照片信息用于更新排行榜
    const photoResult = await db.collection('dream_photos').doc(photoId).get()
    const photo = photoResult.data

    // 更新用户积分和照片数
    await updateUserScore(photo.userId, 5, 1)

    return {
      success: true,
      message: '审核通过成功'
    }
  } catch (err) {
    console.error('审核通过失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}

// 审核拒绝照片
async function rejectPhoto(event) {
  const { photoId, reason } = event

  // 参数验证
  if (!photoId) {
    return {
      success: false,
      message: '缺少照片ID'
    }
  }

  try {
    // 更新照片状态为已拒绝
    await db.collection('dream_photos').doc(photoId).update({
      data: {
        status: 'rejected',
        rejectReason: reason || '',
        rejectTime: new Date()
      }
    })

    return {
      success: true,
      message: '审核拒绝成功'
    }
  } catch (err) {
    console.error('审核拒绝失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}

// 获取用户投稿的照片
async function getUserPhotos(event) {
  const { userId } = event

  // 参数验证
  if (!userId) {
    return {
      success: false,
      message: '缺少用户ID'
    }
  }

  try {
    // 获取用户的所有投稿照片，按时间倒序排列
    const result = await db.collection('dream_photos')
      .where({
        userId: userId
      })
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: result.data,
      message: '获取用户投稿照片成功'
    }
  } catch (err) {
    console.error('获取用户投稿照片失败:', err)
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

// 获取排行榜数据
async function getRankingList(event) {
  try {
    // 获取排行榜数据，按积分降序排列
    const result = await db.collection('dream_photos')
      .orderBy('likes', 'desc')
      .limit(10) // 限制返回前10名
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

// 照片点赞功能
async function likePhoto(event) {
  const { photoId } = event;

  // 参数验证
  if (!photoId) {
    return {
      success: false,
      message: '缺少照片ID'
    };
  }

  try {
    // 增加照片的点赞数
    await db.collection('dream_photos').doc(photoId).update({
      data: {
        likes: db.command.inc(1)
      }
    });

    return {
      success: true,
      message: '点赞成功'
    };
  } catch (err) {
    console.error('点赞失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}

// 更新用户积分和照片数
async function updateUserScore(userId, scoreIncrement, photoIncrement) {
  try {
    // 查找用户是否已经在排行榜中
    const userResult = await db.collection('dream_ranking').where({
      userId: userId
    }).get()

    if (userResult.data.length > 0) {
      // 更新用户积分和照片数
      await db.collection('dream_ranking').where({
        userId: userId
      }).update({
        data: {
          score: db.command.inc(scoreIncrement),
          photos: db.command.inc(photoIncrement),
          updateTime: new Date()
        }
      })
    } else {
      // 创建新用户记录
      await db.collection('dream_ranking').add({
        data: {
          userId: userId,
          userName: '', // 需要从前端传递
          userAvatar: '', // 需要从前端传递
          score: scoreIncrement,
          photos: photoIncrement,
          createTime: new Date(),
          updateTime: new Date()
        }
      })
    }
  } catch (err) {
    console.error('更新用户积分失败:', err)
  }
}