// packHome/ormHomeDetail/ormHomeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageDetail: {}
  },

  onPageScroll: function (e) {
    // 页面级滚动事件处理
    this.updateNavbarForScroll(e.scrollTop || 0);
  },

  onScroll: function (e) {
    // scroll-view 滚动事件处理
    this.updateNavbarForScroll(e.detail.scrollTop || 0);
  },

  updateNavbarForScroll: function (scrollTop) {
    // 将滚动信息传递给自定义导航栏组件
    const customNav = this.selectComponent('#custom-nav');
    if (customNav) {
      customNav.handleScroll({ scrollTop: scrollTop });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取从上一页传递过来的数据
    const eventChannel = this.getOpenerEventChannel();
    console.log('eventChannel', eventChannel)
    eventChannel.on('acceptDataFromOrmPage', (data) => {
      console.log('da ta', data)
      this.setData({
        pageDetail: data.data
      });
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