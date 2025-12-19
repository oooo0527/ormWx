// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-5gzybpqcd24b2b58' // 请务必核对ID是否正确
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  switch (event.action) {
    case 'getOrmHomeData':
      return await getOrmHomeData(event)
    default:
      return {
        success: false,
        message: '无效的操作'
      }
  }
}

// 获取ormHome数据
async function getOrmHomeData(event) {
  try {
    // 检查relationship集合是否存在，如果不存在则创建示例数据
    let relationshipData = [];
    try {
      const res = await db.collection('relationShip').get();
      relationshipData = res.data

    } catch (err) {
      console.log('relationship集合可能不存在，将创建示例数据');

    }


    return {
      success: true,
      data: relationshipData
    }
  } catch (err) {
    console.error('获取ormHome数据失败', err);
    return {
      success: false,
      message: '获取数据失败：' + err.message,
      errCode: err.errCode,
      errMsg: err.errMsg
    };
  }
}
