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
    case 'getDataItems':
      return await getDataItems(event)
    case 'getMusicList':
      return await getMusicList(event)
    case 'uploadData':
      return await uploadData(wxContext.OPENID, event)
    case 'deleteData':
      return await deleteData(wxContext.OPENID, event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取数据项列表
async function getDataItems(event) {
  try {
    let query = db.collection('data_items')

    // 如果指定了类型，按类型筛选
    if (event.type) {
      query = query.where({
        type: event.type
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

// 获取音乐列表
async function getMusicList(event) {
  try {
    // 查询music集合中的所有音乐数据
    const result = await db.collection('music')
      .where({
        type: 'mis'  // 根据你提供的数据，音乐类型为'mis'
      })
      .orderBy('createTime', 'desc')
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

// 上传数据
async function uploadData(openid, event) {
  try {
    const data = {
      title: event.title,
      description: event.description,
      type: event.type || '用户上传',
      userId: openid,
      createTime: new Date(),
      updateTime: new Date()
    }

    const result = await db.collection('data_items').add({
      data: data
    })

    return {
      success: true,
      data: {
        _id: result._id,
        ...data
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除数据
async function deleteData(openid, event) {
  try {
    // 只能删除自己上传的数据
    const result = await db.collection('data_items').where({
      _id: event.id,
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