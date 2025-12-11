// packageA/hot/hot.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotList: [], // 热门留言列表
    loading: false, // 是否正在加载数据
    hasMore: true, // 是否还有更多数据
    page: 0, // 当前页码
    pageSize: 20, // 每页数据条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取热门留言数据
    this.getHotList();
  },

  /**
   * 获取热门留言列表
   */
  getHotList() {
    // 如果没有更多数据或正在加载，则直接返回
    if (!this.data.hasMore || this.data.loading) {
      return;
    }

    this.setData({
      loading: true
    });

    // 调用云函数获取热门留言数据
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        skip: this.data.page * this.data.pageSize,
        limit: this.data.pageSize,
        checked: '2' // 已审核通过的留言
      },
      success: res => {
        if (res.result && res.result.success) {
          const newList = res.result.data || [];

          // 更新数据
          this.setData({
            hotList: this.data.page === 0 ? newList : this.data.hotList.concat(newList),
            page: this.data.page + 1,
            hasMore: newList.length === this.data.pageSize,
            loading: false
          });
        } else {
          console.error('获取热门留言失败：', res.result.message);
          this.setData({
            loading: false
          });
          wx.showToast({
            title: '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);
        this.setData({
          loading: false
        });
        wx.showToast({
          title: '网络请求失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 切换内容展开/收起状态
   */
  toggleContent(e) {
    const index = e.currentTarget.dataset.index;
    const hotList = this.data.hotList.map((item, idx) => {
      if (idx === index) {
        return {
          ...item,
          isExpanded: !item.isExpanded
        };
      }
      return item;
    });

    this.setData({
      hotList: hotList
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
    // 下拉刷新时重新获取数据
    this.setData({
      hotList: [],
      page: 0,
      hasMore: true
    }, () => {
      this.getHotList();
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 上拉加载更多
    this.getHotList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})