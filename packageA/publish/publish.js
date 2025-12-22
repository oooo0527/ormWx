// pages/publish/publish.js
const timeUtils = require('../../utils/timeUtils.js');

Page({
  data: {
    id: '', // 添加留言ID，用于编辑
    title: '',
    content: '',
    imageList: [],
    maxImageCount: 1, // 限制只能上传一张图片
    __isDebug: false, // 调试模式开关，默认关闭
    checked: false,
    navBarHeight: 0 // 添加导航栏高度数据
  },

  onLoad: function (options) {
    // 检查是否有传入参数，如果有则用于编辑
    if (options.id) {
      this.setData({
        id: options.id,
        title: decodeURIComponent(options.title || ''),
        content: decodeURIComponent(options.content || ''),
        imageList: JSON.parse(decodeURIComponent(options.images || '[]'))
      });
    }
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

  // 提交 投稿
  submitPublish: function () {
    const that = this;
    const id = this.data.id;
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
      title: id ? '更新中...' : ' 投稿中...'
    });

    // 如果有图片，先上传图片
    if (imageList.length > 0 && imageList[0].startsWith('http')) {
      // 如果是网络图片链接，直接使用
      that.saveToDatabase(title, content, imageList);
    } else if (imageList.length > 0) {
      // 如果是本地图片，上传到云存储
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

  bindchange: function (e) {
    console.log('checkbox change', e.detail);
    this.setData({
      checked: e.detail.value.length > 0 ? '1' : '0'
    });
  },


  // 保存到数据库
  saveToDatabase: function (title, content, imageUrls) {
    const that = this;
    console.log('保存到数据库：', that.data.checked, content, imageUrls);

    // 检查云环境是否已初始化
    if (!wx.cloud) {
      wx.hideLoading();
      wx.showToast({
        title: '云环境未初始化',
        icon: 'none'
      });
      return;
    }

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo');
    console.log('用户信息：', userInfo);
    if (!userInfo) {
      wx.hideLoading();
      wx.showToast({
        title: '用户信息获取失败，请重新登录',
        icon: 'none'
      });
      return;
    }

    // 构造数据对象
    const data = {
      title: title,
      content: content,
      images: imageUrls,
      checked: that.data.checked,
      status: '0', // 重新提交设置为待审核状态
      userInfo: userInfo || {}, // 添加用户信息
      createDate: timeUtils.getCurrentDate(),
      createTime: timeUtils.getCurrentTime(),
      updateTime: timeUtils.getCurrentTime()
    };

    // 判断是新增还是更新
    const action = this.data.id ? 'update' : 'add';
    if (this.data.id) {
      data.id = this.data.id; // 更新时需要提供ID
    }

    // 调用云函数保存数据
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: action,
        data: data
      },
      success: res => {
        wx.hideLoading();
        console.log('云函数调用成功：', res);
        if (res.result && res.result.success) {
          wx.showToast({
            title: this.data.id ? '更新成功' : ' 投稿成功，请等待管理员审核',
            icon: 'success'
          });

          // 清空表单
          that.setData({
            id: '',
            title: '',
            content: '',
            imageList: [],
            checked: false
          });

          // 返回上一页并刷新数据
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              const prevPage = pages[pages.length - 2]; // 上一个页面
              if (prevPage && typeof prevPage.loadInteractions === 'function') {
                prevPage.loadInteractions(); // 调用上一个页面的刷新方法
              } else if (prevPage && typeof prevPage.onShow === 'function') {
                prevPage.onShow(); // 调用上一个页面的onShow方法刷新数据
              }
            }
            wx.navigateBack();
          }, 1500);
        } else {
          console.error('操作失败：', res.result ? res.result.message : '未知错误');
          wx.showToast({
            title: res.result ? res.result.message : '操作失败',
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
  }
});