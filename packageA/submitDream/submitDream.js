// packageA/submitDream/submitDream.js
const timeUtils = require('../../utils/timeUtils.js');

Page({
  data: {
    userInfo: null,
    // 投稿相关数据
    canSubmit: true,
    submissionCooldown: false,
    submissionTime: '',

    // 投稿表单数据
    submissionForm: {
      style: '',
      image: '',
      description: ''
    },
    // 风格选项
    styleOptions: ['韩系', '猫系', '狗系', '欧美', '性感', '可爱']
  },

  onLoad() {
    // 检查用户登录状态
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }

    // 检查投稿冷却时间
    this.checkSubmissionCooldown();
  },

  onShow() {
    // 页面显示时的操作
  },

  // 检查投稿冷却时间
  checkSubmissionCooldown() {
    const lastSubmission = wx.getStorageSync('lastDreamSubmission');
    if (lastSubmission) {
      const now = new Date();
      const last = new Date(lastSubmission);
      const diffHours = (now - last) / (1000 * 60 * 60);

      // 如果距离上次投稿不足24小时，则禁止投稿
      if (diffHours < 24) {
        this.setData({
          canSubmit: false,
          submissionTime: lastSubmission
        });

        // 设置定时器，在冷却期结束后启用投稿
        const remainingHours = 24 - diffHours;
        setTimeout(() => {
          this.setData({
            canSubmit: true
          });
        }, remainingHours * 60 * 60 * 1000);
      }
    }
  },

  // 选择投稿风格
  selectStyle(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      'submissionForm.style': style
    });
  },

  // 选择图片
  chooseImage() {
    if (!this.data.submissionForm.style) {
      wx.showToast({
        title: '请先选择风格',
        icon: 'none'
      });
      return;
    }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        this.setData({
          'submissionForm.image': tempFilePath
        });
      }
    });
  },

  // 输入描述
  inputDescription(e) {
    this.setData({
      'submissionForm.description': e.detail.value
    });
  },

  // 提交投稿
  submitPhoto() {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    const { style, image, description } = this.data.submissionForm;

    if (!style || !image || !description) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 显示上传进度
    wx.showLoading({
      title: '上传中...'
    });

    // 上传图片到云存储
    const cloudPath = `dream/${this.data.userInfo.openid}_${Date.now()}.jpg`;
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: image,
      success: res => {
        // 图片上传成功，保存到数据库
        wx.cloud.callFunction({
          name: 'submitDreamPhoto',
          data: {
            action: 'submitPhoto',
            style: style,
            imageUrl: res.fileID,
            description: description,
            userId: this.data.userInfo.openid,
            userName: this.data.userInfo.nickname,
            userAvatar: this.data.userInfo.avatar,
            createDate: timeUtils.getCurrentDate(),
            createTime: timeUtils.getCurrentTime(),
          },
          success: result => {
            wx.hideLoading();

            if (result.result.success) {
              wx.showToast({
                title: '投稿成功',
                icon: 'success'
              });

              // 记录投稿时间
              const now = new Date().toISOString();
              wx.setStorageSync('lastDreamSubmission', now);

              this.setData({
                canSubmit: false,
                submissionForm: {
                  style: '',
                  image: '',
                  description: ''
                }
              });

              // 24小时后重新启用投稿
              setTimeout(() => {
                this.setData({
                  canSubmit: true
                });
              }, 24 * 60 * 60 * 1000);

              // 返回上一页
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            } else {
              wx.showToast({
                title: '投稿失败: ' + result.result.message,
                icon: 'none'
              });
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '投稿失败',
              icon: 'none'
            });
            console.error('投稿失败:', err);
          }
        });
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '图片上传失败',
          icon: 'none'
        });
        console.error('图片上传失败:', err);
      }
    });
  }
});