// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 确保数据库集合存在
  try {
    await db.collection('users').limit(1).get()
  } catch (err) {
    console.log('集合可能不存在，将在首次插入数据时自动创建')
  }

  switch (event.action) {
    case 'getUserInfo':
      return await getUserInfo(wxContext.OPENID, event)
    case 'updateUserInfo':
      return await updateUserInfo(wxContext.OPENID, event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取用户信息
async function getUserInfo(openid, event) {
  console.log(openid,'openid')
  try {
    const result = await db.collection('user').where({
      openid: openid
    }).get()

    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      }
    } else {
      // 如果用户不存在，创建新用户
      return await createNewUser(openid, event)
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 创建新用户
async function createNewUser(openid, event) {
  try {
    const userData = {
      openid: openid,
      nickname: event.nickname || '匿名用户',
      avatar: event.avatar || '',
      createTime: new Date(),
      updateTime: new Date()
    }

    const result = await db.collection('users').add({
      data: userData
    })

    return {
      success: true,
      data: {
        _id: result._id,
        ...userData
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 更新用户信息
async function updateUserInfo(openid, event) {
  try {
    const result = await db.collection('users').where({
      openid: openid
    }).update({
      data: {
        nickname: event.nickname,
        avatar: event.avatar,
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