// utils/systemInfo.js

/**
 * 获取系统信息
 */
function getSystemInfo() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 获取状态栏高度
 */
function getStatusBarHeight() {
  return new Promise((resolve) => {
    getSystemInfo().then(res => {
      resolve(res.statusBarHeight);
    }).catch(() => {
      // 默认值
      resolve(20);
    });
  });
}

/**
 * 获取导航栏高度
 */
function getNavBarHeight() {
  return new Promise((resolve) => {
    getSystemInfo().then(res => {
      // iOS和Android的导航栏高度计算方式不同
      let navHeight = 44; // 默认iOS导航栏高度

      // Android导航栏高度通常为48px
      if (res.system.indexOf('Android') !== -1) {
        navHeight = 48;
      }

      // 如果是iPhone X及以上机型（有刘海屏），需要额外增加安全区域高度
      if (res.model.indexOf('iPhone X') !== -1 ||
        res.model.indexOf('iPhone 11') !== -1 ||
        res.model.indexOf('iPhone 12') !== -1 ||
        res.model.indexOf('iPhone 13') !== -1 ||
        res.model.indexOf('iPhone 14') !== -1 ||
        res.model.indexOf('iPhone 15') !== -1) {
        navHeight = 88; // 包含状态栏和导航栏的高度
      }

      resolve(navHeight);
    }).catch(() => {
      // 默认值
      resolve(64);
    });
  });
}

module.exports = {
  getSystemInfo,
  getStatusBarHeight,
  getNavBarHeight
};