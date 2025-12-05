// 引入基类页面创建函数
const { createPage } = require('../../utils/basePage.js');

// 使用 createPage 创建页面，自动包含导航栏高度处理功能
createPage({
  data: {
    userInfo: null,
    isLogin: true,
    menueList: [
      {
        title: '待我审核',
        path: '/packageA/waitProve/waitProve',
        isManager: '1'
      },
      {
        title: '我得留言版',
        path: '/pages/selfListDetail/selfListDetail',
        isManager: '0'
      },
    ]

  },

  onLoad: function (options) {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  navigateToPage(e) {
    console.log(e);
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      userInfo: {
        openid: this.data.userInfo.openid,
        userInfo: {
          ...this.data.userInfo.userInfo,
          avatar: avatarUrl || ''
        }
      },
    })
    this.saveUserInfo()
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    console.log('用户信息', userInfo);
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
      // 未登录则跳转到登录页面
      wx.redirectTo({
        url: '/pages/login/login'
      });
    }
  },


  /**
   * 保存用户信息
   */
  saveUserInfo: function () {


    // 显示加载提示
    wx.showLoading({
      title: '保存中...'
    });


    // 调用云函数更新用户信息
    wx.cloud.callFunction({
      name: 'user',
      data: {
        action: 'updateUserInfo',
        avatar: this.data.userInfo.userInfo.avatar || ''
      },
      success: res => {
        wx.hideLoading();

        if (res.result && res.result.success) {
          // 更新成功，更新本地存储和全局数据

          // 更新全局数据
          const app = getApp();
          app.globalData.userInfo = this.data.userInfo;
          app.globalData.isLogin = true;

          // 更新本地存储
          wx.setStorageSync('userInfo', this.data.userInfo);

          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });

          // 延迟跳转到首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/Home/Home'
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.result ? res.result.message : '保存失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('更新用户信息失败', err);
        wx.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    });


  },

  // 编辑资料
  editProfile: function () {
    wx.showToast({
      title: '编辑资料功能待开发',
      icon: 'none'
    });

    // 可以在这里添加实际的编辑逻辑
    /*
    wx.navigateTo({
      url: '/pages/editProfile/editProfile'
    });
    */
  },

  // 退出登录
  logout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmColor: '#f48eb5',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          wx.removeStorageSync('userInfo');

          // 更新全局数据
          const app = getApp();
          app.globalData.userInfo = null;
          app.globalData.isLogin = false;

          this.setData({
            isLogin: false,
            userInfo: null
          });

          // 跳转到首页
          wx.redirectTo({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 跳转到背景设置页面
  goToBackgroundSetting: function () {
    wx.navigateTo({
      url: '/packageA/backgroundSetting/backgroundSetting'
    });
  },

  // 页面滚动事件
  onPageScroll: function (e) {
    // 空函数，用于被自定义导航栏组件重写
  }
})