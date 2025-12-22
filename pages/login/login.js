// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    avatar: '/images/default-avatar.png',
    userInfo: null,
    isLoading: false,
    showPrivacyDialog: true, // 默认显示隐私协议弹窗
    privacyAgreed: false // 隐私协议是否已同意
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;

    // 立即预览头像
    this.setData({
      avatar: avatarUrl
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

        wx.showToast({
          title: '头像上传成功',
          icon: 'success'
        });
      },
      fail: err => {
        console.error('头像上传失败', err);
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
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
    console.log('用户信息', userInfo);

    if (userInfo && userInfo.nickname && userInfo.avatar) {
      this.setData({
        userInfo: userInfo,
        nickname: userInfo.nickname || '',
        avatar: userInfo.avatar || '/images/default-avatar.png'
      });
    } else {
      // 设置默认值确保UI正常显示
      this.setData({
        avatar: '/images/default-avatar.png'
      });

      // 检查是否已经同意隐私协议
      const agreed = wx.getStorageSync('privacyAgreed');
      if (agreed) {
        // 已同意隐私协议，尝试获取微信用户信息
        this.setData({
          privacyAgreed: true,
          showPrivacyDialog: false
        });
        this.getWechatUserProfile();
      } else {
        // 未同意隐私协议，显示弹窗
        this.setData({
          showPrivacyDialog: true
        });
      }
    }

    // 检查用户授权状态
    this.checkUserAuthorization();
  },

  /**
   * 检查用户授权状态
   */
  checkUserAuthorization() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 用户已授权，直接获取用户信息
          wx.getUserInfo({
            success: (res) => {
              console.log('已授权用户信息:', res.userInfo);
              this.setData({
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl
              });

              // 更新全局数据
              const app = getApp();
              app.globalData.userInfo = {
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl
              };

              // 保存到本地存储
              wx.setStorageSync('userInfo', app.globalData.userInfo);
            },
            fail: (err) => {
              console.log('获取已授权用户信息失败:', err);
            }
          });
        }
      },
      fail: (err) => {
        console.log('检查授权状态失败:', err);
      }
    });
  },

  /**
   * 获取微信用户信息
   */
  getWechatUserProfile() {
    // 检查是否已同意隐私协议
    if (!this.data.privacyAgreed) {
      console.log('未同意隐私协议，无法获取用户信息');
      // 即使没有同意隐私协议，也要设置默认值以确保UI正常显示
      this.setData({
        avatar: '/images/default-avatar.png'
      });
      return;
    }

    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取微信用户信息成功', res);
        const userInfo = res.userInfo;

        // 更新页面数据
        that.setData({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        });

        // 同时更新全局数据
        const app = getApp();
        app.globalData.userInfo = {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        };

        // 保存到本地存储
        wx.setStorageSync('userInfo', app.globalData.userInfo);
      },
      fail: (err) => {
        console.log('获取微信用户信息失败', err);
        // 获取失败时使用默认值
        that.setData({
          avatar: '/images/default-avatar.png'
        });
      }
    });
  },

  /**
   * 隐私协议同意
   */
  onPrivacyAgree() {
    console.log('用户同意隐私协议');
    this.setData({
      showPrivacyDialog: false,
      privacyAgreed: true
    });

    // 保存同意状态到本地存储
    wx.setStorageSync('privacyAgreed', true);

    // 获取微信用户信息
    // 使用setTimeout确保setData完成后再调用
    setTimeout(() => {
      this.getWechatUserProfile();
    }, 100);
  },

  /**
   * 隐私协议拒绝
   */
  onPrivacyDisagree() {
    console.log('用户拒绝隐私协议');
    this.setData({
      showPrivacyDialog: false
    });

    wx.showModal({
      title: '提示',
      content: '需要您同意隐私协议才能继续使用小程序。如果您不同意，将无法使用相关功能。',
      showCancel: true,
      cancelText: '暂不使用',
      confirmText: '重新考虑',
      success: (res) => {
        if (res.confirm) {
          // 用户点击重新考虑，再次显示隐私协议弹窗
          this.setData({
            showPrivacyDialog: true
          });
        } else if (res.cancel) {
          // 用户点击暂不使用，可以返回上一页或退出小程序
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  },

  /**
   * 查看更多隐私协议
   */
  onPrivacyLearnMore() {
    console.log('用户查看隐私协议详情');
    // 跳转到隐私政策页面
    wx.navigateTo({
      url: '/pages/privacyPolicy/privacyPolicy'
    });
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

    // 显示加载状态
    this.setData({
      isLoading: true
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
          // 隐藏加载状态
          this.setData({
            isLoading: false
          });

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
          // 隐藏加载状态
          this.setData({
            isLoading: false
          });

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