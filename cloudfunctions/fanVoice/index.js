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
    case 'getList':
      return await getInteractionList(event)
    case 'getInteractionById':
      return await getInteractionById(event)
    case 'delete':
      return await deleteInteraction(wxContext.OPENID, event)
    case 'addComment':
      return await addComment(wxContext.OPENID, event)
    case 'deleteComment':
      return await deleteComment(wxContext.OPENID, event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取心声列表
async function getVoices(event) {
  try {
    let query = db.collection('fan_voices')

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

// 发布心声
async function postVoice(openid, event) {
  try {
    const voice = {
      content: event.content,
      userId: openid,
      likes: [],
      comments: [],
      createTime: new Date(),
      updateTime: new Date(),
      userInfo: event.userInfo
    }

    const result = await db.collection('fan_voices').add({
      data: voice
    })

    return {
      success: true,
      data: {
        _id: result._id,
        ...voice
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 点赞心声
async function likeVoice(openid, event) {
  try {
    const voiceId = event.voiceId

    // 检查是否已经点赞
    const voiceResult = await db.collection('fan_voices').doc(voiceId).get()
    const voice = voiceResult.data

    if (!voice) {
      return {
        success: false,
        message: '心声不存在'
      }
    }

    const likes = voice.likes || []
    const likeIndex = likes.indexOf(openid)

    if (likeIndex > -1) {
      // 取消点赞
      likes.splice(likeIndex, 1)
    } else {
      // 点赞
      likes.push(openid)
    }

    // 更新点赞数
    const result = await db.collection('fan_voices').doc(voiceId).update({
      data: {
        likes: likes,
        updateTime: new Date()
      }
    })

    return {
      success: true,
      data: {
        likes: likes,
        likeCount: likes.length
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除心声
async function deleteVoice(openid, event) {
  try {
    // 只能删除自己发布的心声
    const result = await db.collection('fan_voices').where({
      _id: event.voiceId,
      userId: openid
    }).remove()

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
      createTime: new Date(),
      updateTime: new Date()
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

// 获取互动留言列表
async function getInteractionList(event) {
  try {
    let query = db.collection('interactions')

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

// 添加评论
async function addComment(openid, event) {
  try {
    const comment = {
      content: event.content,
      userId: openid,
      userInfo: event.userInfo || {}, // 添加用户信息
      createTime: new Date(),
      interactionId: event.interactionId
    }



    // 向互动留言中添加评论
    const result = await db.collection('interactions').doc(event.interactionId).update({
      data: {
        comments: _.push([comment]),
        updateTime: new Date()
      }
    })

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