Page({
  data: {
    stars: [
    ],
    selectedStar: null
  },

  onLoad: function (options) {
    console.log('jinlaile')
    wx.cloud.init({
      env: "cloud1-5gzybpqcd24b2b58",
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'user',
      data: {
        action: 'getUserInfo'
      }
    }).then(res => {
      console.log('用户信息:', res);
      if (res.result.success) {
        console.log('用户信息:', res.result.data);
        this.data.stars=res.result.data
      }
    });

  },

  // 查看明星详情
  viewStarDetail: function (e) {
    const index = e.currentTarget.dataset.index;
    const star = this.data.stars[index];
    this.setData({
      selectedStar: star
    });
  },

  // 关闭详情弹窗
  closeDetail: function () {
    this.setData({
      selectedStar: null
    });
  }
});