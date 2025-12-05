// utils/basePage.js
// 基类页面，包含通用功能

const navbarMixin = require('./navbarMixin.js');

// 合并 mixin 到页面配置中
function mergeMixin(pageConfig, mixin) {
  // 合并 data
  if (mixin.data) {
    pageConfig.data = Object.assign({}, mixin.data, pageConfig.data || {});
  }

  // 合并方法
  for (let key in mixin) {
    if (key !== 'data') {
      if (!pageConfig[key]) {
        pageConfig[key] = mixin[key];
      }
    }
  }

  // 包装 onLoad 方法
  const originalOnLoad = pageConfig.onLoad;
  pageConfig.onLoad = function (options) {
    // 调用 mixin 的 onLoad 处理
    if (mixin.onLoadNavbarHeight) {
      mixin.onLoadNavbarHeight.call(this);
    }

    // 调用原始 onLoad 方法
    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };

  return pageConfig;
}

// 创建基类页面
function createPage(pageConfig) {
  // 应用 navbarMixin
  const config = mergeMixin(pageConfig, navbarMixin);

  return Page(config);
}

module.exports = {
  createPage: createPage
};