// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'initMusicCollection':
      return await initMusicCollection(event)
    case 'initInteractionsCollection':
      return await initInteractionsCollection(event)
    case 'initCommentsCollection':
      return await initCommentsCollection(event)
    case 'initRepliesCollection':
      return await initRepliesCollection(event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 初始化音乐集合并添加示例数据
async function initMusicCollection(event) {
  try {
    // 示例音乐数据
    const musicData = [
      {
        "type": "mis",
        "url": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/music/รักแท้...ยังไง (真爱…如何) - Orm Kornnaphat & Nunew 251108 曼谷爱น演唱会上(3).mp3",
        "tag": "head",
        "src": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
        "title": "真爱…如何 - Orm Kornnaphat & Nunew",
        "singer": "Orm Kornnaphat & Nunew",
        "lrc": "[00:00.00]歌词内容1\n[00:05.00]歌词内容2\n[00:10.00]歌词内容3",
        "createTime": new Date()
      },
      {
        "type": "mis",
        "url": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/music/สตอร์เบอร์เยอรี่มรกต (Strawberry Morakot) - Orm Kornnaphat 251108 曼谷爱น演唱会上(1).mp3",
        "tag": "head",
        "src": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        "title": "Strawberry Morakot - Orm Kornnaphat",
        "singer": "Orm Kornnaphat",
        "lrc": "[00:00.00]歌词内容1\n[00:05.00]歌词内容2\n[00:10.00]歌词内容3",
        "createTime": new Date()
      }
    ];

    // 插入示例数据
    const results = [];
    for (const music of musicData) {
      const result = await db.collection('music').add({
        data: music
      });
      results.push(result);
    }

    return {
      success: true,
      data: results,
      message: '音乐数据初始化成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 初始化互动留言集合并添加示例数据
async function initInteractionsCollection(event) {
  try {
    // 创建 interactions 集合的索引
    // 注意：在实际环境中，这可能需要管理员权限

    // 示例互动留言数据
    const interactionData = [
      {
        "title": "粉丝留言",
        "content": "Orm你是最棒的！你的每一部作品都让我们感动，期待你更多的精彩表现！",
        "images": [],
        "userId": "sample_user_id_1",
        "comments": [],
        "createTime": new Date(),
        "updateTime": new Date()
      },
      {
        "title": "活动互动",
        "content": "Orm线上见面会精彩瞬间回顾，粉丝们热情参与互动游戏，现场气氛热烈，欢声笑语不断。",
        "images": [],
        "userId": "sample_user_id_2",
        "comments": [],
        "createTime": new Date(),
        "updateTime": new Date()
      }
    ];

    // 插入示例数据
    const results = [];
    for (const interaction of interactionData) {
      const result = await db.collection('interactions').add({
        data: interaction
      });
      results.push(result);
    }

    return {
      success: true,
      data: results,
      message: '互动留言数据初始化成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 初始化评论通知集合并添加示例数据
async function initCommentsCollection(event) {
  try {
    // 创建 comments 集合的索引
    // 注意：在实际环境中，这可能需要管理员权限

    // 示例评论通知数据
    const commentData = [
      {
        "commentId": "sample_comment_id_1",
        "content": "这是第一条测试评论",
        "userId": "sample_user_id_2",
        "userInfo": {
          "nickname": "测试用户1",
          "avatar": "/images/default-avatar.png"
        },
        "interactionId": "sample_interaction_id_1",
        "interactionUserId": "sample_user_id_1",
        "interactionUserInfo": {
          "nickname": "发帖用户1",
          "avatar": "/images/default-avatar.png"
        },
        "interactionTitle": "测试留言",
        "createTime": new Date().toLocaleTimeString('en-GB'),
        "createDate": new Date().toISOString().slice(0, 10),
        "read": false
      }
    ];

    // 插入示例数据
    const results = [];
    for (const comment of commentData) {
      const result = await db.collection('comments').add({
        data: comment
      });
      results.push(result);
    }

    return {
      success: true,
      data: results,
      message: '评论通知数据初始化成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}

// 初始化回复通知集合并添加示例数据
async function initRepliesCollection(event) {
  try {
    // 创建 replies 集合的索引
    // 注意：在实际环境中，这可能需要管理员权限

    // 示例回复通知数据
    const replyData = [
      {
        "replyId": "sample_reply_id_1",
        "content": "这是第一条测试回复",
        "userId": "sample_user_id_3",
        "userInfo": {
          "nickname": "测试用户2",
          "avatar": "/images/default-avatar.png"
        },
        "interactionId": "sample_interaction_id_1",
        "interactionUserId": "sample_user_id_1",
        "interactionUserInfo": {
          "nickname": "发帖用户1",
          "avatar": "/images/default-avatar.png"
        },
        "interactionTitle": "测试留言",
        "commentId": "sample_comment_id_1",
        "targetUserId": "sample_user_id_2",
        "targetUserInfo": {
          "nickname": "被回复用户1",
          "avatar": "/images/default-avatar.png"
        },
        "createTime": new Date().toLocaleTimeString('en-GB'),
        "createDate": new Date().toISOString().slice(0, 10),
        "read": false
      }
    ];

    // 插入示例数据
    const results = [];
    for (const reply of replyData) {
      const result = await db.collection('replies').add({
        data: reply
      });
      results.push(result);
    }

    return {
      success: true,
      data: results,
      message: '回复通知数据初始化成功'
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    }
  }
}