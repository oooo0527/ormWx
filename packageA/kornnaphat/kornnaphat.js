// packageA/kornnaphat/kornnaphat.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 接收从kornList传递的数据
    currentEpisodeData: null,
    // 当前选中的集数索引
    currentEpisodeIndex: 0,

    // 所有剧集数据
    episodes: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 处理从kornList传递过来的数据
    if (options.episodeData) {
      try {
        const episodeData = JSON.parse(decodeURIComponent(options.episodeData));
        console.log('接收到的剧集数据:', episodeData);

        // 设置页面数据
        this.setData({
          currentEpisodeData: episodeData,
          // 可以根据需要更新其他相关数据
        });

        // 更新页面标题等信息
        wx.setNavigationBarTitle({
          title: episodeData.title || '剧集详情'
        });

      } catch (error) {
        console.error('解析剧集数据失败:', error);
        wx.showToast({
          title: '数据解析失败',
          icon: 'none'
        });
      }
    }

    // 如果有传入选集参数，则跳转到指定集数
    if (options.episode) {
      const episodeIndex = parseInt(options.episode) - 1;
      if (episodeIndex >= 0 && episodeIndex < this.data.episodes.length) {
        this.setData({
          currentEpisodeIndex: episodeIndex
        });
      }
    }
  },

  /**
   * 选择特定集数
   */
  selectEpisode(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentEpisodeIndex: index
    });

    // 滚动到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  },

  /**
   * 上一集
   */
  prevEpisode() {
    if (this.data.currentEpisodeIndex > 0) {
      this.setData({
        currentEpisodeIndex: this.data.currentEpisodeIndex - 1
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  /**
   * 下一集
   */
  nextEpisode() {
    if (this.data.currentEpisodeIndex < this.data.episodes.length - 1) {
      this.setData({
        currentEpisodeIndex: this.data.currentEpisodeIndex + 1
      });
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    }
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
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
    const currentEpisode = this.data.episodes[this.data.currentEpisodeIndex] || {};
    return {
      title: `${this.data.currentDrama.title} 第${currentEpisode.episodeNum}集 - ${currentEpisode.title}`,
      path: `/packageA/kornnaphat/kornnaphat?episode=${currentEpisode.episodeNum}`
    };
  }
})