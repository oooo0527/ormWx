Page({
  data: {
    username: '',
    password: ''
  },

  onLoad: function (options) {

  },

  // 输入用户名
  onUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },

  // 输入密码
  onPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录
  onLogin: function () {
    const { username, password } = this.data;

    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    // 使用本地模拟登录
    const app = getApp();
    app.login(username, password, (success) => {
      if (success) {
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        // 返回上一页或跳转到首页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 游客访问
  onGuestVisit: function () {
    wx.switchTab({
      url: '/pages/starArchive/starArchive'
    });
  }
});