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

// 获取中国应援图片数据
async function getSupportImages(event) {
  try {
    // 这里应该从云开发数据库获取实际的图片数据
    // 暂时返回模拟数据
    const supportImages = [
      {
        id: '321432',
        title: "Orm生日应援活动",
        coverImage: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/CN/2025.5曼谷生日/IMG_1538.JPG",
        tiime: "202505",
        year: "2025",
        address: "曼谷",
        img: [
          ".jnsxjbkh"
        ]
      }
    ];

    // 格式化数据以适应前端显示
    const formattedSupportImages = supportImages.map(item => ({
      id: item.id,
      title: item.title,
      coverImage: item.coverImage,
      date: item.tiime,
      year: item.year,
      location: item.address,
      images: item.img
    }));

    return {
      success: true,
      data: formattedSupportImages
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}