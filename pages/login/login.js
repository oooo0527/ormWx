// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatar: '',
    userInfo: null
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatar: avatarUrl,
    })


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取全局用户信息
    const app = getApp();
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    console.log('用户6666信息', userInfo);

    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        nickname: '',
        avatar: userInfo.avatar || ''
      });
    }
  },

  /**
   * 输入昵称
   */
  onNicknameInput: function (e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  /**
   * 选择头像
   */
  chooseAvatar: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 这里应该上传图片到云存储，然后设置avatar字段
        // 为了简化，我们直接使用本地路径
        that.setData({
          avatar: res.tempFilePaths[0]
        });
      },
      fail(err) {
        console.error('选择头像失败', err);
        wx.showToast({
          title: '选择头像失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 保存用户信息
   */
  saveUserInfo: function () {
    const { nickname, avatar, userInfo } = this.data;

    // 验证昵称是否填写
    if (!nickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }
    if (nickname.trim() == '微信用户') {
      wx.showToast({
        title: '请不要使用微信用户',
        icon: 'none'
      });
      return;
    }

    // 显示加载提示
    wx.showLoading({
      title: '保存中...'
    });

    // 准备更新的数据
    const updateData = {
      nickname: nickname.trim()
    };

    // 如果有新头像，则更新头像
    if (avatar) {
      updateData.avatar = avatar;
    }

    // 如果已经有用户信息（包含openid），则更新数据库中的用户信息
    if (userInfo && userInfo.openid) {
      // 调用云函数更新用户信息
      wx.cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateUserInfo',
          nickname: updateData.nickname,
          avatar: updateData.avatar || ''
        },
        success: res => {
          wx.hideLoading();

          if (res.result && res.result.success) {
            // 更新成功，更新本地存储和全局数据
            const updatedUserInfo = {
              openid: userInfo.openid,
              userInfo: {
                ...userInfo,
                nickname: updateData.nickname,
                avatar: updateData.avatar || userInfo.avatar || ''
              }

            };

            // 更新全局数据
            const app = getApp();
            app.globalData.userInfo = updatedUserInfo;
            app.globalData.isLogin = true;
            console.log('用户信息', updatedUserInfo);
            // 更新本地存储
            wx.setStorageSync('userInfo', updatedUserInfo);

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
    } else {
      // 如果没有用户信息，说明是新用户或者用户信息丢失
      // 这种情况下，我们需要重新获取用户授权

      // 先隐藏加载提示
      wx.hideLoading();

      // 提示用户需要重新授权登录
      wx.showModal({
        title: '提示',
        content: '需要重新授权登录才能保存信息',
        showCancel: true,
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            // 跳转回首页进行重新登录
            wx.redirectTo({
              url: '/pages/index/index'
            });
          }
        }
      });
    }
  }
});