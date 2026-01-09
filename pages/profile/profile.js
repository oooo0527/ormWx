// 引入基类页面创建函数
const { createPage } = require('../../utils/basePage.js');

// 使用 createPage 创建页面，自动包含导航栏高度处理功能
createPage({
  data: {
    customNameListFlag: false,
    ormkornnaphat: {},
    customNameList: ['ORM', 'KORN', 'NAPAT', "❤️", "💜", "😍", "(❁´◡`❁)", "(●'◡'●)", "☆*", " o(≧▽≦)o", "(*/ω＼*)", "😘", "🥰", "😍", "🎈", "✨", "🍬", "🍼"],
    showEditModal: false, // 是否显示编辑弹窗
    currentList: "",

    menueList: [
      {
        title: '消息通知',
        path: '/packageA/noteList/noteList',
      },
    ]

  },

  onShow: function () {
    const app = getApp();
    if (app.globalData.ormkornnaphat && !this.data.ormkornnaphat) {
      this.setData({
        ormkornnaphat: app.globalData.ormkornnaphat
      });
    }


    // 从本地存储加载自定义 nameList
    this.loadCustomNameList();


  },

  // 从本地存储加载自定义 nameList
  loadCustomNameList() {
    try {
      const customNameList = wx.getStorageSync('customNameList');
      if (customNameList) {
        this.setData({
          customNameList: customNameList
        });
      }
    } catch (e) {
      console.error('加载自定义 nameList 失败', e);
    }
  },

  navigateToPage(e) {
    console.log(e);
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  },

  // 页面滚动事件
  onPageScroll: function (e) {
    // 空函数，用于被自定义导航栏组件重写
  },

  // 打开编辑 nameList 弹窗
  openNameListEditModal() {
    // 设置初始值为当前自定义值或默认值
    const currentList = this.data.customNameList.join(',')
    this.setData({
      showEditModal: true,
      currentList: currentList
    });
  },

  // 关闭弹窗
  closeModal() {
    this.setData({
      showEditModal: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 什么都不做，只是阻止事件冒泡
  },

  // 监听输入框变化
  onNameListInput(e) {
    this.setData({
      currentList: e.detail.value
    });
  },
  customNameListFlagFn() {
    this.setData({
      customNameListFlag: !this.data.customNameListFlag
    });
  },

  // 保存自定义 nameList
  saveNameList() {
    let customList = this.data.currentList.trim();
    this.setData({
      customNameList: customList.split(',')
    });
    // 保存到本地存储
    try {
      wx.setStorageSync('customNameList', customList.split(','));
      console.log('自定义 nameList 保存成功', customList.split(','));
    } catch (e) {
      console.error('保存自定义 nameList 失败', e);
    }

    // 关闭弹窗
    this.closeModal();

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },
})