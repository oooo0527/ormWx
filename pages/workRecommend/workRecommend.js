Page({
  data: {
    currentSlide: 0,
    carouselOffset: 0,
    cardWidth: 500, // 每张卡片的宽度(rpx)
    cardSpacing: 20, // 卡片间距(rpx)
    selectedWork: null,
    currentWorkIndex:0,
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        type: "电影",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg",
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
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg",
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
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg",
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
        cover:"cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      }
    ]
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
    this.setData({
      selectedWork: this.data.works[0] // 默认选中第一个作品
    });
  },
  onSwiperChange: function (e) {
    this.setData({
      currentWorkIndex: e.detail.current
    });
  },

  onShow: function () {
    // 页面显示时的逻辑
  },

  // 上一张
  prevSlide: function () {
    if (this.data.currentSlide > 0) {
      const newSlide = this.data.currentSlide - 1;
      const offset = -newSlide * (this.data.cardWidth + this.data.cardSpacing);

      this.setData({
        currentSlide: newSlide,
        carouselOffset: offset,
        selectedWork: this.data.works[newSlide]
      });
    }
  },

  // 下一张
  nextSlide: function () {
    if (this.data.currentSlide < this.data.works.length - 1) {
      const newSlide = this.data.currentSlide + 1;
      const offset = -newSlide * (this.data.cardWidth + this.data.cardSpacing);

      this.setData({
        currentSlide: newSlide,
        carouselOffset: offset,
        selectedWork: this.data.works[newSlide]
      });
    }
  },

  // 跳转到指定幻灯片
  goToSlide: function (e) {
    const index = e.currentTarget.dataset.index;
    const offset = -index * (this.data.cardWidth + this.data.cardSpacing);

    this.setData({
      currentSlide: index,
      carouselOffset: offset,
      selectedWork: this.data.works[index]
    });
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

    // 更新选中的作品数据
    const selectedWork = works.find(work => work.id === id);

    this.setData({
      works: works,
      selectedWork: selectedWork
    });
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  }
})