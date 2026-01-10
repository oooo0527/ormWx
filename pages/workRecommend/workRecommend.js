Page({

  data: {
    currentCarousel: 0,
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
      },
      {
        id: 2,
        title: "Only You",
        role: "Ira",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/24c44a6355707a277309865e62c1b5cb.jpg",
      },
      {
        id: 3,
        title: "我们的秘密",
        role: "尔恩 (Earn)",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/329c3f47da4836e2c4ef41bf97540833.jpg",
      },
      {
        id: 4,
        title: "Potion of Love",
        role: "Pun",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
      },
      {
        id: 5,
        title: "Potion of Love2",
        role: "Pun",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/443aaee45d2852f42a20789b76793ea0.jpg",
      }
    ]
  },

  onLoad: function () {
    // 页面加载时的初始化操作
  },

  // 轮播图变化事件
  onCarouselChange: function (e) {
    this.setData({
      currentCarousel: e.detail.current
    });
  },

  // 卡片点击事件
  onCardTap: function (e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentCarousel: index
    });

    const currentWork = this.data.works[this.data.currentCarousel];
    wx.navigateTo({
      url: `/pages/workDetail/workDetail?work=${encodeURIComponent(JSON.stringify(currentWork))}`
    });
  }
})