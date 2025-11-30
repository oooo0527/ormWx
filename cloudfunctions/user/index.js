// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5gzybpqcd24b2b58' // 请务必核对ID是否正确
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
    case 'login':
      return await login(event, wxContext)
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

// 用户登录
async function login(event, wxContext) {
  try {
    // 获取从前端传递的用户信息
    const userInfo = event.userInfo;

    // 获取用户的openid
    const openid = wxContext.OPENID;

    console.log('用户上下文信息:', { openid });
    console.log('前端传递的用户信息:', userInfo);

    // 检查是否获取到openid
    if (!openid) {
      return {
        success: false,
        message: '无法获取用户标识'
      };
    }

    // 查询用户是否存在
    const userRes = await db.collection('users').where({
      openid: openid
    }).get();

    let userData = null;

    if (userRes.data.length > 0) {
      // 用户已存在，更新用户信息和最后登录时间
      userData = userRes.data[0];

      // 准备更新数据
      const updateData = {
        lastLoginTime: new Date()
      };

      // 如果前端传递了用户信息，则更新
      if (userInfo) {
        updateData.nickname = userInfo.nickName || userData.nickname;
        updateData.avatar = userInfo.avatarUrl || userData.avatar;
      }

      await db.collection('users').where({
        openid: openid
      }).update({
        data: updateData
      });

      console.log('用户已存在，更新用户信息');
    } else {
      // 新用户，创建用户记录
      const newUser = {
        openid: openid,
        nickname: userInfo ? (userInfo.nickName || '匿名用户') : '匿名用户',
        avatar: userInfo ? (userInfo.avatarUrl || '') : '',
        createTime: new Date().getTime(),
        lastLoginTime: new Date().getTime()
      };

      const addRes = await db.collection('users').add({
        data: newUser
      });

      userData = {
        _id: addRes._id,
        ...newUser
      };
      console.log('创建新用户');
    }

    return {
      success: true,
      data: {
        openid: openid,
        ...userData
      }
    };
  } catch (err) {
    console.error('登录失败', err);
    // 更详细的错误信息
    return {
      success: false,
      message: '登录处理失败：' + err.message,
      errCode: err.errCode,
      errMsg: err.errMsg
    };
  }
}

// 获取用户信息
async function getUserInfo(openid, event) {
  console.log(openid, 'openid')
  try {
    const result = await db.collection('users').where({
      openid: openid
    }).get()

    if (result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      }
    } else {
      return {
        success: false,
        message: "没有数据"
      }
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
      nickname: event.nickname || '煎蛋卷',
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