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
      case 'getApprovedPhotos':
        return await getApprovedPhotos(event)
      case 'getRankingList':
        return await getRankingList(event)
      case 'likePhoto':
        return await likePhoto(event)
      case 'getPhotosByStyle':
        return await getPhotosByStyle(event)
      case 'deletePhoto':
        return await deletePhoto(event)
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

  // if (countResult.total >= 1) {
  //   return {
  //     success: false,
  //     message: '每天只能投稿一次'
  //   }
  // }

  // 插入新照片到待审核状态
  const result = await db.collection('dream_photos').add({
    data: {
      style: style,
      imageUrl: imageUrl,
      description: description,
      userId: userId,
      userName: userName,
      userAvatar: userAvatar,
      status: 'approved', // 已审核状态
      likes: 0,
      createTime: event.createTime,
      createDate: event.createDate
    }
  })

  return {
    success: true,
    data: result._id,
    message: '投稿成功，等待审核'
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
    // 获取排行榜数据，按积分降序排列
    const result = await db.collection('dream_photos')
      .where({
        status: 'approved'
      })
      .orderBy('likes', 'desc')
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

// 照片点赞功能
async function likePhoto(event) {
  const { photoId, cancelLike } = event;

  // 参数验证
  if (!photoId) {
    return {
      success: false,
      message: '缺少照片ID'
    };
  }

  try {
    if (cancelLike) {
      // 取消点赞，减少照片的点赞数
      await db.collection('dream_photos').doc(photoId).update({
        data: {
          likes: db.command.inc(-1)
        }
      });

      return {
        success: true,
        message: '取消点赞成功'
      };
    } else {
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
    }
  } catch (err) {
    console.error('点赞操作失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}

// 删除照片功能
async function deletePhoto(event) {
  const { photoId, userId } = event;

  // 参数验证
  if (!photoId || !userId) {
    return {
      success: false,
      message: '缺少必要参数'
    };
  }

  try {
    // 先查询照片信息，确保是该用户上传的照片
    const photoResult = await db.collection('dream_photos').doc(photoId).get();

    if (!photoResult.data) {
      return {
        success: false,
        message: '照片不存在'
      };
    }

    // 验证照片是否属于该用户
    if (photoResult.data.userId !== userId) {
      return {
        success: false,
        message: '无权限删除此照片'
      };
    }

    // 删除照片记录
    await db.collection('dream_photos').doc(photoId).remove();

    // 如果照片已审核通过，需要更新用户积分和照片数
    if (photoResult.data.status === 'approved') {
      await updateUserScoreOnDelete(userId, -5, -1);
    }

    return {
      success: true,
      message: '删除成功'
    };
  } catch (err) {
    console.error('删除照片失败:', err);
    return {
      success: false,
      message: err.message
    };
  }
}

// 更新用户积分和照片数（删除时使用）
async function updateUserScoreOnDelete(userId, scoreIncrement, photoIncrement) {
  try {
    // 查找用户是否已经在排行榜中
    const userResult = await db.collection('dream_ranking').where({
      userId: userId
    }).get();

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
      });
    }
  } catch (err) {
    console.error('更新用户积分失败:', err);
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