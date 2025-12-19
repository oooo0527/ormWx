// packHome/ormHomeDetail/ormHomeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryName: '',
    sectionName: '',
    pageTitle: '',
    pageSubtitle: ''
  },

  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 根据传入的参数设置页面标题和内容
    let categoryName = '默认分类';
    let sectionName = '默认内容';
    let pageTitle = '详情页面';
    let pageSubtitle = '';

    // 解析参数
    if (options.type) {
      const typeMap = {
        'family': '家庭篇',
        'friendship': '友谊篇',
        'media': '媒体篇',
        'fans': '粉丝篇',
        'beginner': '入门篇',
        'values': '三观篇',
        'acting': '演技篇',
        'career': '事业篇'
      };
      categoryName = typeMap[options.type] || options.type;
    }

    if (options.section) {
      const sectionMap = {
        'story': '家庭故事',
        'moments': '温馨时刻',
        'details': '亲情点滴',
        'years': '友情岁月',
        'stories': '挚友故事',
        'eternal': '友谊长存',
        'reports': '媒体报道',
        'interviews': '专访记录',
        'showcase': '形象展示',
        'interactions': '粉丝互动',
        'activities': '应援活动',
        'letters': '感谢信件',
        'guide': '入门指南',
        'basic': '基础知识',
        'advanced': '进阶技巧',
        'beliefs': '价值观',
        'life': '人生观',
        'world': '世界观',
        'skills': '表演技巧',
        'creation': '角色塑造',
        'performance': '舞台表现',
        'development': '事业发展',
        'achievements': '成就回顾',
        'future': '未来规划'
      };
      sectionName = sectionMap[options.section] || options.section;
    }

    // 设置页面标题
    pageTitle = categoryName + ' - ' + sectionName;
    pageSubtitle = '关于' + categoryName + '的详细内容';

    this.setData({
      categoryName,
      sectionName,
      pageTitle,
      pageSubtitle
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})