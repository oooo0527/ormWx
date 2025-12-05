// utils/systemInfo.js

/**
 * 获取系统信息
 */
function getSystemInfo() {
  return new Promise((resolve, reject) => {
    try {
      const res = wx.getSystemInfoSync();
      resolve(res);
    } catch (err) {
      reject(err);
    }
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
    getSystemInfo().then(systemInfo => {
      // 安全区域顶部位置（从屏幕顶部到安全区域的距离）
      const { statusBarHeight } = systemInfo;

      // 获取菜单按钮（胶囊按钮）的布局位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

      // 计算导航栏高度
      // 公式：状态栏高度 + (胶囊按钮顶部到状态栏底部的距离) * 2 + 胶囊按钮高度
      const navBarHeight = statusBarHeight + (menuButtonInfo.top - statusBarHeight) * 2 + menuButtonInfo.height;

      resolve(navBarHeight);
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