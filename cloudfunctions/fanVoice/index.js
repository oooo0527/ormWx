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
    case 'getVoices':
      return await getVoices(event)
    case 'postVoice':
      return await postVoice(wxContext.OPENID, event)
    case 'likeVoice':
      return await likeVoice(wxContext.OPENID, event)
    case 'deleteVoice':
      return await deleteVoice(wxContext.OPENID, event)
    case 'getSupportImages':
      return await getSupportImages(event)
    // 新增互动留言相关操作
    case 'add':
      return await addInteraction(wxContext.OPENID, event)
    case 'update':
      return await updateInteraction(wxContext.OPENID, event)
    case 'getList':
      return await getInteractionList(event)
    case 'getInteractionById':
      return await getInteractionById(event)
    case 'delete':
      return await deleteInteraction(wxContext.OPENID, event)
    case 'addComment':
      return await addComment(wxContext.OPENID, event)
    case 'addCommentsBatch': // 新增批量添加评论
      return await addCommentsBatch(wxContext.OPENID, event)
    case 'deleteComment':
      return await deleteComment(wxContext.OPENID, event)
    case 'addCommentReply':
      return await addCommentReply(wxContext.OPENID, event)
    case 'addCommentRepliesBatch': // 新增批量添加回复
      return await addCommentRepliesBatch(wxContext.OPENID, event)
    case 'favorite':
      return await favoriteInteraction(wxContext.OPENID, event)
    case 'unfavorite':
      return await unfavoriteInteraction(wxContext.OPENID, event)
    case 'getFavoriteList':
      return await getFavoriteInteractionList(wxContext.OPENID, event)
    case 'getUserInteractions':
      return await getUserInteractions(wxContext.OPENID, event)
    case 'getUserReplies':
      return await getUserReplies(wxContext.OPENID, event)
    case 'getUserComments':
      return await getUserComments(wxContext.OPENID, event)
    case 'getUserReplyNotifications':
      return await getUserReplyNotifications(wxContext.OPENID, event)
    case 'markCommentAsRead':
      return await markCommentAsRead(wxContext.OPENID, event)
    case 'markReplyAsRead':
      return await markReplyAsRead(wxContext.OPENID, event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取声音列表
async function getVoices(event) {
  try {
    let query = db.collection('voices')

    // 如果有日期参数，则按日期筛选
    if (event.date) {
      query = query.where({
        date: event.date
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

// 发布声音
async function postVoice(openid, event) {
  try {
    // 检查必要参数
    if (!event.data || !event.data.content) {
      return {
        success: false,
        message: '内容不能为空'
      };
    }

    const voice = {
      content: event.data.content,
      userId: openid,
      userInfo: event.data.userInfo || {}, // 添加用户信息
      likes: 0,
      likedBy: [],
      createTime: event.data.createTime,
      date: event.data.date || new Date().toISOString().slice(0, 10)
    };

    const result = await db.collection('voices').add({
      data: voice
    });

    return {
      success: true,
      data: result
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

// 点赞声音
async function likeVoice(openid, event) {
  try {
    const voiceId = event.id;

    // 先获取声音文档
    const voiceResult = await db.collection('voices').doc(voiceId).get();
    if (!voiceResult.data) {
      return {
        success: false,
        message: '声音不存在'
      };
    }

    const voice = voiceResult.data;
    let updateData = {};

    // 检查用户是否已经点赞
    if (voice.likedBy && voice.likedBy.includes(openid)) {
      // 取消点赞
      updateData = {
        likes: _.inc(-1),
        likedBy: _.pull(openid)
      };
    } else {
      // 点赞
      updateData = {
        likes: _.inc(1),
        likedBy: _.push(openid)
      };
    }

    const result = await db.collection('voices').doc(voiceId).update({
      data: updateData
    });

    return {
      success: true,
      data: result
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

// 删除声音
async function deleteVoice(openid, event) {
  try {
    // 只能删除自己发布的声音
    const result = await db.collection('voices').where({
      _id: event.id,
      userId: openid
    }).remove()

    if (result.stats.removed === 0) {
      return {
        success: false,
        message: '删除失败，可能是声音不存在或不是您的声音'
      }
    }

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 获取中国应援图片数据
async function getSupportImages(event) {
  try {

    let query = db.collection('CNLIST')

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


// 新增互动留言
async function addInteraction(openid, event) {
  try {
    // 检查必要参数
    if (!event.data || !event.data.title || !event.data.content) {
      return {
        success: false,
        message: '标题和内容不能为空'
      };
    }

    const interaction = {
      title: event.data.title,
      content: event.data.content,
      images: event.data.images || [],
      userId: openid,
      userInfo: event.data.userInfo || {}, // 添加用户信息
      comments: [],
      createDate: event.data.createDate,
      createTime: event.data.createTime,
      updateTime: event.data.updateTime,
      status: event.data.status || '0',
      checked: event.data.checked || '0',
    };

    const result = await db.collection('interactions').add({
      data: interaction
    });

    return {
      success: true,
      data: {
        _id: result._id,
        ...interaction
      }
    };
  } catch (err) {
    console.error('新增互动留言失败：', err);
    return {
      success: false,
      message: err.message || '新增互动留言失败'
    };
  }
}

// 更新互动留言
async function updateInteraction(openid, event) {
  try {
    // 检查必要参数
    if (!event.data || !event.data.id || !event.data.title || !event.data.content) {
      return {
        success: false,
        message: '缺少必要参数'
      };
    }

    // 只能更新自己发布的互动留言
    const interactionResult = await db.collection('interactions').doc(event.data.id).get();
    if (!interactionResult.data) {
      return {
        success: false,
        message: '互动留言不存在'
      };
    }

    if (interactionResult.data.userId !== openid) {
      return {
        success: false,
        message: '无权限更新此留言'
      };
    }

    // 更新数据，重新设置为待审核状态
    const updateData = {
      title: event.data.title,
      content: event.data.content,
      images: event.data.images || [],
      updateTime: new Date().toISOString().slice(0, 10),
      status: '0', // 重新提交设置为待审核状态
      checked: event.data.checked || '0',
    };

    const result = await db.collection('interactions').doc(event.data.id).update({
      data: updateData
    });

    return {
      success: true,
      data: result
    };
  } catch (err) {
    console.error('更新互动留言失败：', err);
    return {
      success: false,
      message: err.message || '更新互动留言失败'
    };
  }
}

// 获取互动留言列表
async function getInteractionList(event) {
  try {
    let query = db.collection('interactions')

    if (event.date) {
      // 分页查询
      const result = await query
        .where({
          createDate: db.RegExp({
            regexp: event.date,
            options: 'i'
          }),
          status: event.status,
        })
        .orderBy('createTime', 'desc')
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
        .orderBy('createTime', 'desc')
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

// 根据ID获取单个互动留言
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
        message: '互动留言不存在'
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除互动留言
async function deleteInteraction(openid, event) {
  try {
    // 只能删除自己发布的互动留言
    const result = await db.collection('interactions').where({
      _id: event.id,
      userId: openid
    }).remove()

    if (result.stats.removed === 0) {
      return {
        success: false,
        message: '删除失败，可能是留言不存在或不是您的留言'
      }
    }

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

function randomCommentId() {
  return Math.random().toString(36).substring(2, 9);
}

// 添加评论
async function addComment(openid, event) {
  try {
    const comment = {
      content: event.content,
      userId: openid,
      userInfo: event.userInfo || {}, // 添加用户信息
      createTime: event.createTime,
      createDate: event.createDate,
      interactionId: event.interactionId,
      commentId: randomCommentId(),
    }

    // 向互动留言中添加评论
    const result = await db.collection('interactions').doc(event.interactionId).update({
      data: {
        comments: _.push([comment]),
        updateTime: new Date()
      }
    })

    // 为返回的评论对象添加一个唯一标识符
    comment._id = `${event.interactionId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 获取被评论的互动留言信息（用于存储到comments集合）
    const interactionResult = await db.collection('interactions').doc(event.interactionId).get();
    if (interactionResult.data) {
      const interaction = interactionResult.data;

      // 将评论信息存储到comments集合中，用于通知功能
      await db.collection('comments').add({
        data: {
          commentId: comment.commentId,
          content: comment.content,
          userId: comment.userId,         // 评论人ID
          userInfo: comment.userInfo,     // 评论人信息
          interactionId: event.interactionId,  // 被评论的帖子ID
          interactionUserId: interaction.userId,  // 发帖人ID
          interactionUserInfo: interaction.userInfo || {}, // 发帖人信息
          interactionTitle: interaction.title || '',  // 帖子标题
          createTime: comment.createTime,
          createDate: comment.createDate,
          read: false  // 是否已读，默认未读
        }
      });
    }

    return {
      success: true,
      data: comment
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 批量添加评论
async function addCommentsBatch(openid, event) {
  try {
    const comments = event.comments || [];
    if (comments.length === 0) {
      return {
        success: false,
        message: '没有评论数据'
      };
    }

    // 批量处理评论
    const results = [];
    const commentsToAdd = [];

    for (const commentData of comments) {
      const comment = {
        content: commentData.content,
        userId: openid,
        userInfo: commentData.userInfo || {}, // 添加用户信息
        createTime: commentData.createTime,
        createDate: commentData.createDate,
        interactionId: commentData.interactionId,
        commentId: randomCommentId(),
      };

      // 向互动留言中添加评论
      await db.collection('interactions').doc(commentData.interactionId).update({
        data: {
          comments: _.push([comment]),
          updateTime: new Date()
        }
      });

      // 为返回的评论对象添加一个唯一标识符
      comment._id = `${commentData.interactionId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      results.push(comment);

      // 获取被评论的互动留言信息（用于存储到comments集合）
      const interactionResult = await db.collection('interactions').doc(commentData.interactionId).get();
      if (interactionResult.data) {
        const interaction = interactionResult.data;

        // 准备存储到comments集合中的数据
        commentsToAdd.push({
          commentId: comment.commentId,
          content: comment.content,
          userId: comment.userId,         // 评论人ID
          userInfo: comment.userInfo,     // 评论人信息
          interactionId: commentData.interactionId,  // 被评论的帖子ID
          interactionUserId: interaction.userId,  // 发帖人ID
          interactionUserInfo: interaction.userInfo || {}, // 发帖人信息
          interactionTitle: interaction.title || '',  // 帖子标题
          createTime: comment.createTime,
          createDate: comment.createDate,
          read: false  // 是否已读，默认未读
        });
      }
    }

    // 批量插入到comments集合中
    if (commentsToAdd.length > 0) {
      await db.collection('comments').add({
        data: commentsToAdd
      });
    }

    return {
      success: true,
      data: results
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

// 删除评论
async function deleteComment(openid, event) {
  try {
    // 获取原始互动留言
    const interactionResult = await db.collection('interactions').doc(event.interactionId).get()
    if (!interactionResult.data) {
      return {
        success: false,
        message: '互动留言不存在'
      }
    }

    const interaction = interactionResult.data
    const comments = interaction.comments || []

    // 查找要删除的评论
    const commentIndex = comments.findIndex(comment =>
      comment._id === event.commentId && (comment.userId === openid || interaction.userId === openid)
    )

    if (commentIndex === -1) {
      return {
        success: false,
        message: '评论不存在或无权限删除'
      }
    }

    // 从数组中移除评论
    comments.splice(commentIndex, 1)

    // 更新互动留言中的评论列表
    const result = await db.collection('interactions').doc(event.interactionId).update({
      data: {
        comments: comments,
        updateTime: new Date()
      }
    })

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 收藏互动留言
async function favoriteInteraction(openid, event) {
  try {
    const interactionId = event.interactionId;

    // 检查互动留言是否存在
    const interactionResult = await db.collection('interactions').doc(interactionId).get();
    if (!interactionResult.data) {
      return {
        success: false,
        message: '互动留言不存在'
      };
    }

    // 检查是否已经收藏
    const favoriteResult = await db.collection('favorites').where({
      userId: openid,
      interactionId: interactionId
    }).get();

    if (favoriteResult.data && favoriteResult.data.length > 0) {
      return {
        success: false,
        message: '已经收藏过了'
      };
    }

    // 添加收藏记录
    const favorite = {
      userId: openid,
      interactionId: interactionId,
      createTime: event.createTime,
    };

    const result = await db.collection('favorites').add({
      data: favorite
    });

    return {
      success: true,
      data: {
        _id: result._id,
        ...favorite
      }
    };
  } catch (err) {
    console.error('收藏互动留言失败：', err);
    return {
      success: false,
      message: err.message || '收藏失败'
    };
  }
}

// 取消收藏互动留言
async function unfavoriteInteraction(openid, event) {
  try {
    const interactionId = event.interactionId;

    // 删除收藏记录
    const result = await db.collection('favorites').where({
      userId: openid,
      interactionId: interactionId
    }).remove();

    if (result.stats.removed === 0) {
      return {
        success: false,
        message: '取消收藏失败，可能未收藏过该留言'
      };
    }

    return {
      success: true,
      data: result
    };
  } catch (err) {
    console.error('取消收藏互动留言失败：', err);
    return {
      success: false,
      message: err.message || '取消收藏失败'
    };
  }
}

// 获取用户收藏的互动留言列表
async function getFavoriteInteractionList(openid, event) {
  try {
    // 先获取用户收藏的互动留言ID列表
    const favoriteResult = await db.collection('favorites')
      .where({
        userId: openid
      })
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
      .get();

    if (!favoriteResult.data || favoriteResult.data.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    // 获取收藏的互动留言详细信息
    const interactionIds = favoriteResult.data.map(fav => fav.interactionId);
    const interactionsResult = await db.collection('interactions')
      .where({
        _id: _.in(interactionIds)
      })
      .get();

    // 合并数据
    const favoritesWithDetails = favoriteResult.data.map(fav => {
      const interaction = interactionsResult.data.find(item => item._id === fav.interactionId);
      return {
        ...fav,
        interaction: interaction || null
      };
    });

    return {
      success: true,
      data: favoritesWithDetails
    };
  } catch (err) {
    console.error('获取收藏列表失败：', err);
    return {
      success: false,
      message: err.message || '获取收藏列表失败'
    };
  }
}

// 获取用户自己发布的互动留言
async function getUserInteractions(openid, event) {
  try {
    const result = await db.collection('interactions')
      .where({
        userId: openid
      })
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
      .get();

    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    console.error('获取用户互动留言失败：', err);
    return {
      success: false,
      message: err.message || '获取用户互动留言失败'
    };
  }
}

// 获取用户收到的回复
async function getUserReplies(openid, event) {
  try {
    // 计算一个月前的日期
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

    // 获取用户发布的所有互动留言（近一个月内的）
    const interactionsResult = await db.collection('interactions')
      .where({
        userId: openid,
        createDate: _.gte(oneMonthAgoStr)
      })
      .get();

    if (!interactionsResult.data || interactionsResult.data.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    // 获取所有互动留言的ID
    const interactionIds = interactionsResult.data.map(item => item._id);

    // 查询这些互动留言下的所有评论和回复
    const commentsResult = await db.collection('interactions')
      .where({
        _id: _.in(interactionIds)
      })
      .get();

    // 收集所有回复数据
    let allReplies = [];

    commentsResult.data.forEach(interaction => {
      // 遍历每条评论
      (interaction.comments || []).forEach(comment => {
        // 如果评论有回复
        if (comment.replies && comment.replies.length > 0) {
          // 为每个回复添加互动留言ID和评论ID
          comment.replies.forEach(reply => {
            allReplies.push({
              ...reply,
              interactionId: interaction._id,  // 原始留言帖子的_id
              interactionTitle: interaction.title,
              commentId: comment.commentId,
              parentId: comment._id || null
            });
          });
        }
      });
    });

    // 按时间倒序排列
    // 修复iOS日期格式兼容性问题
    allReplies.sort((a, b) => {
      const dateB = new Date(b.createTime.replace(' ', 'T'));
      const dateA = new Date(a.createTime.replace(' ', 'T'));
      return dateB - dateA;
    });

    return {
      success: true,
      data: allReplies
    };
  } catch (err) {
    console.error('获取用户回复失败：', err);
    return {
      success: false,
      message: err.message || '获取用户回复失败'
    };
  }
}

// 获取用户收到的评论通知
async function getUserComments(openid, event) {
  try {
    // 获取用户收到的评论通知（近一个月内的）
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

    // 查询未读评论数量
    const unreadCommentsCount = await db.collection('comments')
      .where({
        interactionUserId: openid,  // 发帖人是当前用户
        createDate: _.gte(oneMonthAgoStr),
        read: false  // 未读
      })
      .count();

    const commentsResult = await db.collection('comments')
      .where({
        interactionUserId: openid,  // 发帖人是当前用户
        createDate: _.gte(oneMonthAgoStr)
      })
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
      .get();

    return {
      success: true,
      data: commentsResult.data || [],
      unreadCount: unreadCommentsCount.total || 0
    };
  } catch (err) {
    console.error('获取用户评论通知失败：', err);
    return {
      success: false,
      message: err.message || '获取用户评论通知失败'
    };
  }
}

// 获取用户收到的回复通知（从replies集合中获取）
async function getUserReplyNotifications(openid, event) {
  try {
    // 获取用户收到的回复通知（近一个月内的）
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().slice(0, 10);

    // 查询未读回复数量
    const unreadRepliesCount = await db.collection('replies')
      .where({
        targetUserId: openid,  // 被回复的用户是当前用户
        createDate: _.gte(oneMonthAgoStr),
        read: false  // 未读
      })
      .count();

    const repliesResult = await db.collection('replies')
      .where({
        targetUserId: openid,  // 被回复的用户是当前用户
        createDate: _.gte(oneMonthAgoStr)
      })
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
      .get();

    return {
      success: true,
      data: repliesResult.data || [],
      unreadCount: unreadRepliesCount.total || 0
    };
  } catch (err) {
    console.error('获取用户回复通知失败：', err);
    return {
      success: false,
      message: err.message || '获取用户回复通知失败'
    };
  }
}

// 回复评论
async function addCommentReply(openid, event) {
  try {
    // 生成唯一的回复ID
    const replyId = `reply_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const reply = {
      id: replyId, // 添加唯一的回复ID
      content: event.content,
      userId: openid,
      userInfo: event.userInfo || {}, // 添加用户信息
      createTime: event.createTime,
      createDate: event.createDate,
      commentId: event.commentId
    }

    // 首先获取当前互动留言的数据
    const interactionResult = await db.collection('interactions').doc(event.interactionId).get();

    if (!interactionResult.data) {
      return {
        success: false,
        message: '互动留言不存在'
      };
    }

    const interaction = interactionResult.data;

    // 获取现有的评论数组
    const comments = interaction.comments || [];

    // 查找要回复的评论索引
    const commentIndex = comments.findIndex(comment =>
      comment.commentId === event.commentId ||
      // 兼容旧数据，如果没有_id字段，则使用数组索引
      (comment.commentId === undefined && comments.indexOf(comment).toString() === event.commentId)
    );

    if (commentIndex === -1) {
      return {
        success: false,
        message: '评论不存在'
      };
    }

    // 如果评论还没有 replies 字段，则初始化一个空数组
    if (!comments[commentIndex].replies) {
      comments[commentIndex].replies = [];
    }

    // 将回复添加到特定评论的 replies 数组中
    comments[commentIndex].replies.push(reply);

    // 更新数据库中的评论数据
    const result = await db.collection('interactions').doc(event.interactionId).update({
      data: {
        comments: comments,
        updateTime: new Date()
      }
    });

    // 将回复信息存储到replies集合中，用于通知功能
    // 首先需要找到被回复的用户ID（可能是评论的作者，也可能是其他回复的作者）
    let targetUserId = comments[commentIndex].userId; // 默认是评论作者
    let targetUserInfo = comments[commentIndex].userInfo || {}; // 默认是评论作者信息

    // 检查是否是对其他回复的回复
    if (event.replyToReplyId) {
      // 查找被回复的具体回复
      const targetReply = comments[commentIndex].replies.find(r => r.id === event.replyToReplyId);
      if (targetReply) {
        targetUserId = targetReply.userId;
        targetUserInfo = targetReply.userInfo || {};
      }
    }

    // 存储到replies集合中
    await db.collection('replies').add({
      data: {
        replyId: replyId, // 回复ID
        content: reply.content,
        userId: reply.userId,         // 回复人ID
        userInfo: reply.userInfo,     // 回复人信息
        interactionId: event.interactionId,  // 被回复的帖子ID
        interactionUserId: interaction.userId,  // 发帖人ID
        interactionUserInfo: interaction.userInfo || {}, // 发帖人信息
        interactionTitle: interaction.title || '',  // 帖子标题
        commentId: event.commentId,  // 被回复的评论ID
        targetUserId: targetUserId,  // 被回复的用户ID
        targetUserInfo: targetUserInfo, // 被回复的用户信息
        createTime: reply.createTime,
        createDate: reply.createDate,
        read: false  // 是否已读，默认未读
      }
    });

    return {
      success: true,
      data: reply
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 批量添加回复
async function addCommentRepliesBatch(openid, event) {
  try {
    const replies = event.replies || [];
    if (replies.length === 0) {
      return {
        success: false,
        message: '没有回复数据'
      };
    }

    // 批量处理回复
    const results = [];
    const repliesToAdd = [];

    for (const replyData of replies) {
      // 生成唯一的回复ID
      const replyId = `reply_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const reply = {
        id: replyId, // 添加唯一的回复ID
        content: replyData.content,
        userId: openid,
        userInfo: replyData.userInfo || {}, // 添加用户信息
        createTime: replyData.createTime,
        createDate: replyData.createDate,
        commentId: replyData.commentId
      };

      // 首先获取当前互动留言的数据
      const interactionResult = await db.collection('interactions').doc(replyData.interactionId).get();

      if (!interactionResult.data) {
        continue; // 跳过不存在的互动留言
      }

      const interaction = interactionResult.data;

      // 获取现有的评论数组
      const comments = interaction.comments || [];

      // 查找要回复的评论索引
      const commentIndex = comments.findIndex(comment =>
        comment.commentId === replyData.commentId ||
        // 兼容旧数据，如果没有_id字段，则使用数组索引
        (comment.commentId === undefined && comments.indexOf(comment).toString() === replyData.commentId)
      );

      if (commentIndex === -1) {
        continue; // 跳过不存在的评论
      }

      // 如果评论还没有 replies 字段，则初始化一个空数组
      if (!comments[commentIndex].replies) {
        comments[commentIndex].replies = [];
      }

      // 将回复添加到特定评论的 replies 数组中
      comments[commentIndex].replies.push(reply);

      // 更新数据库中的评论数据
      await db.collection('interactions').doc(replyData.interactionId).update({
        data: {
          comments: comments,
          updateTime: new Date()
        }
      });

      // 将回复信息存储到replies集合中，用于通知功能
      // 首先需要找到被回复的用户ID（可能是评论的作者，也可能是其他回复的作者）
      let targetUserId = comments[commentIndex].userId; // 默认是评论作者
      let targetUserInfo = comments[commentIndex].userInfo || {}; // 默认是评论作者信息

      // 检查是否是对其他回复的回复
      if (replyData.replyToReplyId) {
        // 查找被回复的具体回复
        const targetReply = comments[commentIndex].replies.find(r => r.id === replyData.replyToReplyId);
        if (targetReply) {
          targetUserId = targetReply.userId;
          targetUserInfo = targetReply.userInfo || {};
        }
      }

      // 准备存储到replies集合中的数据
      repliesToAdd.push({
        replyId: replyId, // 回复ID
        content: reply.content,
        userId: reply.userId,         // 回复人ID
        userInfo: reply.userInfo,     // 回复人信息
        interactionId: replyData.interactionId,  // 被回复的帖子ID
        interactionUserId: interaction.userId,  // 发帖人ID
        interactionUserInfo: interaction.userInfo || {}, // 发帖人信息
        interactionTitle: interaction.title || '',  // 帖子标题
        commentId: replyData.commentId,  // 被回复的评论ID
        targetUserId: targetUserId,  // 被回复的用户ID
        targetUserInfo: targetUserInfo, // 被回复的用户信息
        createTime: reply.createTime,
        createDate: reply.createDate,
        read: false  // 是否已读，默认未读
      });

      results.push(reply);
    }

    // 批量插入到replies集合中
    if (repliesToAdd.length > 0) {
      await db.collection('replies').add({
        data: repliesToAdd
      });
    }

    return {
      success: true,
      data: results
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

// 标记评论为已读
async function markCommentAsRead(openid, event) {
  try {
    const { commentId } = event;

    // 更新comments集合中的read字段
    const result = await db.collection('comments').doc(commentId).update({
      data: {
        read: true
      }
    });

    return {
      success: true,
      data: result
    };
  } catch (err) {
    console.error('标记评论为已读失败：', err);
    return {
      success: false,
      message: err.message || '标记评论为已读失败'
    };
  }
}

// 标记回复为已读
async function markReplyAsRead(openid, event) {
  try {
    const { replyId } = event;

    // 更新replies集合中的read字段
    const result = await db.collection('replies').doc(replyId).update({
      data: {
        read: true
      }
    });

    return {
      success: true,
      data: result
    };
  } catch (err) {
    console.error('标记回复为已读失败：', err);
    return {
      success: false,
      message: err.message || '标记回复为已读失败'
    };
  }
}