Page({
  data: {
    isLogin: false,
    userInfo: null,
    dataItems: [],
    showUploadForm: false,
    uploadTitle: "",
    uploadDescription: "",
    uploadType: "用户上传"
  },

  onLoad: function (options) {
    // this.checkLoginStatus();
    // 加载数据项
    // this.loadDataItems();
  },

  onShow: function () {
    // this.checkLoginStatus();
    // 重新加载数据项
    // this.loadDataItems();
  },

  // 加载数据项
  loadDataItems: function () {
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getDataItems',
        limit: 20
      }
    }).then(res => {
      if (res.result.success) {
        this.setData({
          dataItems: res.result.data
        });
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('加载数据失败', err);
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      });
    });
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

  // 显示上传表单
  showUploadForm: function () {
    this.checkLoginStatus();
    if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      });
      return;
    }

    this.setData({
      showUploadForm: true,
      uploadTitle: "",
      uploadDescription: "",
      uploadType: "用户上传"
    });
  },

  // 隐藏上传表单
  hideUploadForm: function () {
    this.setData({
      showUploadForm: false
    });
  },

  // 输入标题
  onTitleInput: function (e) {
    this.setData({
      uploadTitle: e.detail.value
    });
  },

  // 输入描述
  onDescriptionInput: function (e) {
    this.setData({
      uploadDescription: e.detail.value
    });
  },

  // 选择类型
  onTypeChange: function (e) {
    const types = ['用户上传', '系统数据', '统计报表'];
    this.setData({
      uploadType: types[e.detail.value]
    });
  },

  // 上传数据
  uploadData: function () {
    const { uploadTitle, uploadDescription, uploadType } = this.data;

    if (!uploadTitle) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      });
      return;
    }

    if (!uploadDescription) {
      wx.showToast({
        title: '请输入描述',
        icon: 'none'
      });
      return;
    }

    // 调用云函数上传数据
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'uploadData',
        title: uploadTitle,
        description: uploadDescription,
        type: uploadType
      }
    }).then(res => {
      if (res.result.success) {
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });

        this.hideUploadForm();
        // 重新加载数据
        this.loadDataItems();
      } else {
        wx.showToast({
          title: res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('上传失败', err);
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    });
  },

  // 查看数据详情
  viewDataDetail: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.dataItems[index];
    this.setData({
      selectedDataItem: item
    });
  },

  // 关闭数据详情
  closeDataDetail: function () {
    this.setData({
      selectedDataItem: null
    });
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  },

  // 页面滚动事件
  onPageScroll: function (e) {
    // 空函数，用于被自定义导航栏组件重写
  }
})