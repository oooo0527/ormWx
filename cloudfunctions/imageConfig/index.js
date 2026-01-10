const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 主处理函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { action, configType, configName, configData } = event;

  try {
    switch (action) {
      case 'getImageConfig':
        return await getImageConfig();
      case 'getGlobalConfig':
        return await getGlobalConfig();
      default:
        return {
          success: false,
          error: 'Invalid action'
        };
    }
  } catch (error) {
    console.error('Error in imageConfig function:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 获取图片配置
async function getImageConfig() {
  try {
    const result = await db.collection('imageConfig').get();
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('Error getting image config:', error);
    throw error;
  }
}
// 获取全局配置
async function getGlobalConfig() {
  try {
    const result = await db.collection('globalConfig').doc('global_settings').get();
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    // 如果全局配置不存在，返回默认值
    if (error.errMsg && error.errMsg.includes('document not found')) {
      return {
        success: true,
        data: {
          _id: 'global_settings',
          avatar: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/Home.jpg',
          bannerImage: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/banner.jpg',
          updatedAt: new Date()
        }
      };
    }
    console.error('Error getting global config:', error);
    throw error;
  }
}