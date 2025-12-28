// packageA/submitDream/submitDream.js
const timeUtils = require('../../utils/timeUtils.js');

Page({
  data: {

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
    styleOptions: ['韩系', '猫系', '狗系', '欧美', '性感', '可爱'],

    // Tab相关
    activeTab: 'form', // 'form' or 'list'
    dreamList: [],
    loading: false
  },

  onLoad() {
  },

  onShow() {
    // 页面显示时的操作
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
    const cloudPath = `dream/dream_${Date.now()}.jpg`;
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
  },

  // 切换tab
  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });

    if (tab === 'list') {
      this.loadDreamList();
    }
  },

  // 加载陈奥风格列表
  loadDreamList: function () {
    this.setData({ loading: true });

    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'getApprovedPhotos'
      },
      success: res => {
        if (res.result.success) {
          this.setData({
            dreamList: res.result.data || [],
            loading: false
          });
        } else {
          console.error('获取陈奥风格列表失败：', res.result.message);
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
          this.setData({
            loading: false
          });
        }
      },
      fail: err => {
        console.error('获取陈奥风格列表失败：', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
        this.setData({
          loading: false
        });
      }
    });
  },

  // 删除陈奥风格
  deleteDream: function (e) {
    const id = e.currentTarget.dataset.id;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张风格照片吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中...',
          });

          // 调用云函数删除数据
          wx.cloud.callFunction({
            name: 'submitDreamPhoto',
            data: {
              action: 'deletePhoto',
              photoId: id
            },
            success: res => {
              wx.hideLoading();
              if (res.result.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });

                // 重新加载列表
                this.loadDreamList();
              } else {
                console.error('删除陈奥风格失败：', res.result.message);
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            },
            fail: err => {
              wx.hideLoading();
              console.error('删除陈奥风格失败：', err);
              wx.showToast({
                title: '网络错误',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 编辑陈奥风格
  editDream: function (e) {
    const item = e.currentTarget.dataset.item;

    // 设置编辑状态
    this.setData({
      'submissionForm.style': item.style || '',
      'submissionForm.image': item.imageUrl || '',
      'submissionForm.description': item.description || '',
      activeTab: 'form'
    });

    wx.showToast({
      title: '已切换到编辑模式',
      icon: 'none'
    });
  }
});