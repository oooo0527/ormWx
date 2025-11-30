Page({
  data: {
    title: '',
    content: '',
    imageList: [],
    maxImageCount: 1, // 限制只能上传一张图片
    __isDebug: false // 调试模式开关，默认关闭
  },

  onLoad: function () {
  },

  // 输入标题
  onTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    });
  },

  // 输入内容
  onContentInput: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  // 选择图片
  chooseImage: function () {
    const that = this;
    wx.chooseImage({
      count: that.data.maxImageCount - that.data.imageList.length, // 还能再选几张图片
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          imageList: that.data.imageList.concat(tempFilePaths)
        });
      },
      fail: function (err) {
        console.error('选择图片失败：', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 删除图片
  deleteImage: function (e) {
    const index = e.currentTarget.dataset.index;
    const imageList = this.data.imageList;
    imageList.splice(index, 1);
    this.setData({
      imageList: imageList
    });
  },

  // 提交发布
  submitPublish: function () {
    const that = this;
    const title = this.data.title;
    const content = this.data.content;
    const imageList = this.data.imageList;


    // 验证输入
    if (!title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }

    if (!content.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }

    // 显示加载提示
    wx.showLoading({
      title: '发布中...'
    });

    // 如果有图片，先上传图片
    if (imageList.length > 0) {
      // 上传图片到云存储
      const uploadTasks = imageList.map((filePath, index) => {
        return new Promise((resolve, reject) => {
          // 创建云存储文件路径
          const cloudPath = 'interactions/' + Date.now() + '_' + Math.floor(Math.random() * 1000) + '.png';

          wx.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: filePath,
            success: res => {
              resolve(res.fileID);
            },
            fail: err => {
              console.error('上传图片失败：', err);
              reject(new Error('上传图片失败'));
            }
          });
        });
      });

      // 等待所有图片上传完成
      Promise.all(uploadTasks)
        .then(fileIDs => {
          // 图片上传成功，保存到数据库
          that.saveToDatabase(title, content, fileIDs);
        })
        .catch(err => {
          console.error('图片上传失败：', err);
          wx.hideLoading();
          wx.showToast({
            title: '图片上传失败',
            icon: 'none'
          });
        });
    } else {
      // 没有图片，直接保存到数据库
      that.saveToDatabase(title, content, []);
    }
  },

  // 保存到数据库
  saveToDatabase: function (title, content, imageUrls) {
    const that = this;

    // 检查云环境是否已初始化
    if (!wx.cloud) {
      wx.hideLoading();
      wx.showToast({
        title: '云环境未初始化',
        icon: 'none'
      });
      return;
    }

    // 调用云函数保存数据
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'add',
        data: {
          title: title,
          content: content,
          images: imageUrls,
          createTime: new Date(),
          userInfo: getApp().globalData.userInfo
        }
      },
      success: res => {
        wx.hideLoading();
        console.log('云函数调用成功：', res);
        if (res.result && res.result.success) {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          });

          // 清空表单
          that.setData({
            title: '',
            content: '',
            imageList: []
          });

          // 返回上一页并刷新数据
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              const prevPage = pages[pages.length - 2]; // 上一个页面
              if (prevPage && typeof prevPage.loadInteractions === 'function') {
                prevPage.loadInteractions(); // 调用上一个页面的刷新方法
              }
            }
            wx.navigateBack();
          }, 1500);
        } else {
          console.error('发布失败：', res.result ? res.result.message : '未知错误');
          wx.showToast({
            title: res.result ? res.result.message : '发布失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('调用云函数失败：', err);
        wx.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    });
  },


});