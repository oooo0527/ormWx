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
      updateTime: new Date()
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