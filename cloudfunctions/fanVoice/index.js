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
    // 新增投稿留言相关操作
    case 'add':
      return await addInteraction(event)
    case 'update':
      return await updateInteraction(event)
    case 'getList':
      return await getInteractionList(event)
    case 'getInteractionById':
      return await getInteractionById(event)
    case 'delete':
      return await deleteInteraction(event)

    default:
      return {
        success: false,
        message: '无效的操作'
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


// 新增投稿留言
async function addInteraction(event) {
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
      createDate: event.data.createDate,
      createTime: event.data.createTime,
      updateTime: event.data.updateTime,
      status: event.data.status,
      checked: event.data.checked
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
    console.error('新增投稿留言失败：', err);
    return {
      success: false,
      message: err.message || '新增投稿留言失败'
    };
  }
}

// 获取投稿留言列表
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

// 根据ID获取单个投稿留言
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
        message: '投稿留言不存在'
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 删除投稿留言
async function deleteInteraction(event) {
  try {
    // 只能删除自己发布的投稿留言
    const result = await db.collection('interactions').where({
      _id: event.id,
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

// 获取用户自己投稿留言
async function getUserInteractions(event) {
  try {
    const result = await db.collection('interactions')
      .orderBy('createTime', 'desc')
      .skip(event.skip || 0)
      .limit(event.limit || 20)
      .get();

    return {
      success: true,
      data: result.data
    };
  } catch (err) {
    console.error('获取用户投稿留言失败：', err);
    return {
      success: false,
      message: err.message || '获取用户投稿留言失败'
    };
  }
}