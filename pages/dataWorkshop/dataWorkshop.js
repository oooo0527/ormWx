Page({
  data: {
    isLogin: false,
    userInfo: null,
    dataItems: [
      {
        id: 1,
        title: "明星热度排行榜",
        description: "本周明星热度指数排名",
        updateTime: "2023-06-15",
        type: "排行榜"
      },
      {
        id: 2,
        title: "影视作品数据分析",
        description: "近期热门影视作品收视率分析",
        updateTime: "2023-06-10",
        type: "分析报告"
      },
      {
        id: 3,
        title: "社交媒体影响力",
        description: "明星在各社交平台的影响力数据",
        updateTime: "2023-06-05",
        type: "数据报告"
      }
    ],
    showUploadForm: false,
    uploadTitle: "",
    uploadDescription: ""
  },

  onLoad: function (options) {
    this.checkLoginStatus();
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  checkLoginStatus: function () {
    const app = getApp();
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
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

  // 上传数据
  uploadData: function () {
    const { uploadTitle, uploadDescription } = this.data;

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

    // 模拟上传数据
    const newData = {
      id: Date.now(),
      title: uploadTitle,
      description: uploadDescription,
      updateTime: this.formatDate(new Date()),
      type: "用户上传"
    };

    this.setData({
      dataItems: [newData, ...this.data.dataItems],
      showUploadForm: false,
      uploadTitle: "",
      uploadDescription: ""
    });

    wx.showToast({
      title: '上传成功',
      icon: 'success'
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