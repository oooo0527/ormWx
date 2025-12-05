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
    const { avatarUrl } = e.detail;

    // 显示加载提示
    wx.showLoading({
      title: '上传头像中...'
    });

    // 上传头像到云存储
    const cloudPath = 'user/avatar-' + Date.now() + '-' + Math.floor(Math.random() * 1000) + '.png';
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: avatarUrl,
      success: res => {
        // 上传成功，获取文件ID
        const fileID = res.fileID;

        // 设置头像为云存储中的文件
        this.setData({
          avatar: fileID
        });

        wx.hideLoading();
        wx.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('头像上传失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        });

        // 上传失败时，仍然使用临时路径
        this.setData({
          avatar: avatarUrl
        });
      }
    });
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
              ...userInfo,
              nickname: updateData.nickname,
              avatar: updateData.avatar || userInfo.avatar || ''

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
    }

  }
});