

// packageA/kornList/kornList.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前电视剧信息
    currentDrama: {
      id: '',
      title: "《绘梦婚礼》 (ชุดมายาฝันนิทรา)",
      heroineName: "Neen",
      coverImage: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/e95aa59912c04e5760fab36c3d5c8b5f.jpg",
      description: "改编自同名畅销小说的影集",
      totalEpisodes: 12,
      status: "拍摄中",
      releaseDate: "2026年5月27日"
    },

    // 剧集列表
    episodes: [],

    // 加载状态
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取剧集数据
    this.loadEpisodes();
  },

  /**
   * 加载剧集数据
   */
  async loadEpisodes() {
    this.setData({ loading: true });

    try {
      // 调用云函数获取剧集列表
      const result = await wx.cloud.callFunction({
        name: 'kornList',
        data: {
          action: 'getEpisodes',
        }
      });

      console.log('云函数返回结果:', result);

      if (result.result && result.result.success) {
        this.setData({
          episodes: result.result.data,
          loading: false
        });
      } else {
        throw new Error(result.result?.message || '获取数据失败');
      }
    } catch (error) {
      console.error('加载剧集数据失败:', error);
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  /**
   * 跳转到指定剧集详情
   */
  async navigateToEpisode(e) {
    const _id = e.currentTarget.dataset.id;
    const item = e.currentTarget.dataset.item;


    wx.showLoading({ title: '加载中...' });

    try {

      // 调用云函数获取剧集详情
      const result = await wx.cloud.callFunction({
        name: 'kornList',  // 使用kornList云函数而不是kornListPage
        data: {
          action: 'getEpisodeDetail',
          _id: _id
        }
      });

      console.log('云函数返回结果:', result);

      wx.hideLoading();

      if (result.result && result.result.success) {
        // 跳转到kornnaphat页面，传递完整数据
        wx.navigateTo({
          url: `/packageA/kornnaphat/kornnaphat?episodeData=${encodeURIComponent(JSON.stringify({ ...item, ...result.result.data }))}`
        });
      } else {
        throw new Error(result.result?.message || '获取剧集详情失败');
      }
    } catch (error) {
      console.error('获取剧集详情失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 继续观看下一集
   */
  continueWatching() {
    const nextEpisode = this.data.episodes.find(episode =>
      episode.episodeNumber === this.data.currentDrama.watchedEpisodes + 1
    );

    if (nextEpisode) {
      wx.navigateTo({
        url: `/packageA/kornnaphat/kornnaphat?episodeId=${nextEpisode.id}&episodeNum=${nextEpisode.episodeNumber}`
      });
    }
  },

  /**
   * 计算观看进度百分比
   */
  calculateProgress() {
    return Math.round((this.data.currentDrama.watchedEpisodes / this.data.currentDrama.totalEpisodes) * 100);
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
    return {
      title: `《${this.data.currentDrama.title}》剧集列表`,
      path: `/packageA/kornList/kornList?dramaId=${this.data.currentDrama.id}`
    };
  }
})