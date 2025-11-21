Page({
  data: {
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        type: "电影",
        cover: "/images/work1.jpg",
        year: "2025",
        description: "首部大银幕作品，票房佳绩",
        likes: 0,
        isLiked: false
      },
      {
        id: 2,
        title: "Only You",
        role: "Ira",
        type: "电视剧",
        cover: "/images/work2.jpg",
        year: "2024",
        description: "饰演人气歌手",
        likes: 0,
        isLiked: false
      },
      {
        id: 3,
        title: "我们的秘密",
        role: "尔恩 (Earn)",
        type: "电视剧",
        cover: "/images/work3.jpg",
        year: "2024",
        description: "对主角情感生活产生重大影响的人物",
        likes: 0,
        isLiked: false
      },
      {
        id: 4,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "/images/work4.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      }
    ]
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  // 点赞作品
  toggleLike: function (e) {
    const id = e.currentTarget.dataset.id;
    const works = this.data.works.map(work => {
      if (work.id === id) {
        return {
          ...work,
          likes: work.isLiked ? work.likes - 1 : work.likes + 1,
          isLiked: !work.isLiked
        };
      }
      return work;
    });

    this.setData({
      works: works
    });
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  }
})