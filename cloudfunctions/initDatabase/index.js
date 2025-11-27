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
        "url": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/music/รักแท้...ยังไง (真爱…如何) - Orm Kornnaphat & Nunew 251108 曼谷万人演唱会(3).mp3",
        "tag": "head",
        "src": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
        "title": "真爱…如何 - Orm Kornnaphat & Nunew",
        "singer": "Orm Kornnaphat & Nunew",
        "createTime": new Date()
      },
      {
        "type": "mis",
        "url": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/music/สตอร์เบอรี่มรกต (Strawberry Morakot) - Orm Kornnaphat 251108 曼谷万人演唱会(1).mp3",
        "tag": "head",
        "src": "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        "title": "Strawberry Morakot - Orm Kornnaphat",
        "singer": "Orm Kornnaphat",
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