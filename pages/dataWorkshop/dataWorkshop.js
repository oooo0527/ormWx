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
    this.loadDataItems();
  },

  onShow: function () {
    this.checkLoginStatus();
    // 重新加载数据项
    this.loadDataItems();
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

  // 显示上传表单
  showUploadForm: function () {
    if (!this.data.isLogin) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }

    this.setData({
      showUploadForm: true
    });
  },

  // 隐藏上传表单
  hideUploadForm: function () {
    this.setData({
      showUploadForm: false,
      uploadTitle: "",
      uploadDescription: ""
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
    const types = ['用户上传', '排行榜', '分析报告', '数据报告'];
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

        // 重新加载数据
        this.loadDataItems();

        this.setData({
          showUploadForm: false,
          uploadTitle: "",
          uploadDescription: "",
          uploadType: "用户上传"
        });
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

  // 格式化日期
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 查看数据详情
  viewDataDetail: function (e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.dataItems[index];

    wx.showModal({
      title: item.title,
      content: item.description,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});