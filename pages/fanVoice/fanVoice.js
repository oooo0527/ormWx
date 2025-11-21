Page({
  data: {
    isLogin: false,
    userInfo: null,
    currentCategory: 'interaction',

    // 中国应援数据
    supportData: {},

    showPostForm: false,
    postContent: ""
  },

  onLoad: function (options) {
    wx.cloud.init({
      env: "cloud1-5gzybpqcd24b2b58",
      traceUser: true,
    })
    // this.checkLoginStatus();
  },

  onShow: function () {
    // this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
    } else {
      this.setData({
        isLogin: false,
        userInfo: null
      });
    }
  },

  // 切换分类
  switchCategory: function (e) {
    const category = e.detail.category;

    // 如果点击的是"添加新专区"，显示提示
    if (category === 'new') {
      wx.showModal({
        title: '提示',
        content: '此功能正在开发中，敬请期待！',
        showCancel: false
      });
      return;
    }

    this.setData({
      currentCategory: category
    });
  },

  // 显示发布表单
  showPostForm: function () {
    this.checkLoginStatus();
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }

    this.setData({
      showPostForm: true,
      postContent: ""
    });
  },

  // 隐藏发布表单
  hidePostForm: function () {
    this.setData({
      showPostForm: false
    });
  },

  // 输入内容
  onContentInput: function (e) {
    this.setData({
      postContent: e.detail.value
    });
  },

  // 提交发布
  submitPost: function () {
    const { postContent } = this.data;

    if (!postContent) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 这里应该调用云函数提交数据
    // 模拟提交成功
    wx.showToast({
      title: '发布成功',
      icon: 'success'
    });

    this.hidePostForm();
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  }
})