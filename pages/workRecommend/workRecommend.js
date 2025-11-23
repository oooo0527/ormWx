Page({
  data: {
    currentSlide: 0,
    selectedWork: null,
    works: [
      {
        id: 1,
        title: "我家妹妹不准嫁",
        role: "小翁",
        type: "电影",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
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
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/24c44a6355707a277309865e62c1b5cb.jpg",
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
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/329c3f47da4836e2c4ef41bf97540833.jpg",
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
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      },
      {
        id: 5,
        title: "Potion of Love1",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/443aaee45d2852f42a20789b76793ea0.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      },
      {
        id: 6,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/46022d31c72eb3e3cc17126fdc53d9f9.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      },
      {
        id: 7,
        title: "Potion of Love",
        role: "Pun",
        type: "电视剧",
        cover: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/4fe790c8959fd90505b3fbadefe51ecb.jpg",
        year: "2023",
        description: "Orm首次担任第一女主角的作品",
        likes: 0,
        isLiked: false
      }
    ],

    // 只显示前3张卡片
    displayWorks: [],

    // 3D效果相关数据
    cardTransforms: [],
    cardZIndexes: [],
    cardOpacities: [],

    // 动画状态
    isAnimating: false,

    // 触摸相关数据
    touchStartX: 0,
    touchEndX: 0,
    isSwiping: false,
    swipeDirection: 0 // -1: 左滑, 1: 右滑
  },

  onLoad: function () {
    this.init3DCarousel();
  },

  // 初始化3D轮播图
  init3DCarousel: function () {
    this.updateDisplayWorks();
    this.update3DCarousel();
  },

  // 更新显示的卡片（只显示前3张）
  updateDisplayWorks: function () {
    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const total = works.length;

    // 计算要显示的3张卡片索引
    const displayIndices = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % total;
      displayIndices.push(index);
    }

    // 构建显示的卡片数组
    const displayWorks = displayIndices.map(index => works[index]);

    this.setData({
      displayWorks: displayWorks
    });
  },

  // 更新3D轮播图显示 - 实现左右堆叠效果
  update3DCarousel: function () {
    const works = this.data.works;
    const displayWorks = this.data.displayWorks;
    const currentSlide = this.data.currentSlide;
    const total = works.length;

    // 初始化变换数组（只针对显示的3张卡片）
    const transforms = new Array(3).fill('');
    const zIndexes = new Array(3).fill(0);
    const opacities = new Array(3).fill(0.5);

    // 计算每张显示卡片的位置和变换，实现左右堆叠效果
    for (let i = 0; i < 3; i++) {
      // 计算相对位置 (0, 1, 2)
      const relativeIndex = i;

      // 根据相对位置设置变换效果
      if (relativeIndex === 0) {
        // 当前卡片 - 最前面，居中显示
        transforms[i] = 'translateX(0) translateY(0) translateZ(0) scale(1)';
        zIndexes[i] = 100;
        opacities[i] = 1;
      } else if (relativeIndex === 1) {
        // 第二张卡片 - 左侧堆叠
        transforms[i] = 'translateX(-180rpx) translateY(20rpx) translateZ(-100rpx) scale(0.9) rotate(-30deg)';
        zIndexes[i] = 99;
        opacities[i] = 0.9;
      } else if (relativeIndex === 2) {
        // 第三张卡片 - 右侧堆叠
        transforms[i] = 'translateX(180rpx) translateY(20rpx) translateZ(-100rpx) scale(0.9) rotate(30deg)';
        zIndexes[i] = 99;
        opacities[i] = 0.9;
      }
    }

    this.setData({
      cardTransforms: transforms,
      cardZIndexes: zIndexes,
      cardOpacities: opacities,
      selectedWork: works[currentSlide]
    });
  },

  // 上一张 - 向右滑出
  prevSlide: function () {
    if (this.data.isAnimating) return;

    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const newSlide = (currentSlide + 1 + works.length) % works.length;

    this.animateSlide(1); // 向右滑出

    setTimeout(() => {
      this.setData({
        currentSlide: newSlide,
        isAnimating: false
      });

      this.updateDisplayWorks();
      this.update3DCarousel();
    }, 200);
  },

  // 下一张 - 向左滑出
  nextSlide: function () {
    if (this.data.isAnimating) return;

    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const newSlide = (currentSlide + 1) % works.length;

    this.animateSlide(-1); // 向左滑出

    setTimeout(() => {
      this.setData({
        currentSlide: newSlide,
        isAnimating: false
      });

      this.updateDisplayWorks();
      this.update3DCarousel();
    }, 200);
  },

  // 执行滑出动画 - 实现旋转补位效果
  animateSlide: function (direction) {
    this.setData({
      isAnimating: true
    });

    const transforms = [...this.data.cardTransforms];

    // 当前卡片滑出屏幕
    if (direction > 0) {
      // 向右滑出
      transforms[0] = 'translateX(1000rpx) translateY(0) translateZ(0) scale(0.8)';
    } else {
      // 向左滑出
      transforms[0] = 'translateX(-1000rpx) translateY(0) translateZ(0) scale(0.8)';
    }

    // 更新其他卡片位置，实现旋转补位效果
    if (transforms.length > 1) {
      // 第二张卡片移动到最前面
      transforms[1] = 'translateX(0) translateY(0) translateZ(0) scale(1) rotateY(0deg)';
    }
    if (transforms.length > 2) {
      // 第三张卡片根据滑动方向决定旋转方向
      if (direction > 0) {
        // 向右滑出，第三张卡片旋转到左侧堆叠位置
        transforms[2] = 'translateX(-120rpx) translateY(20rpx) translateZ(-100rpx) scale(0.9) rotateY(-10deg)';
      } else {
        // 向左滑出，第三张卡片旋转到右侧堆叠位置
        transforms[2] = 'translateX(120rpx) translateY(20rpx) translateZ(-100rpx) scale(0.9) rotateY(10deg)';
      }
    }

    this.setData({
      cardTransforms: transforms
    });
  },

  // 选择指定幻灯片
  selectSlide: function (e) {
    if (this.data.isAnimating) return;

    const index = e.currentTarget.dataset.index;

    this.setData({
      currentSlide: index
    });

    this.updateDisplayWorks();
    this.update3DCarousel();
  },

  // 选择卡片
  selectCard: function (e) {
    if (this.data.isAnimating) return;

    const index = e.currentTarget.dataset.index;

    // 将显示的卡片索引转换为实际的作品索引
    const displayWorks = this.data.displayWorks;
    const works = this.data.works;

    // 找到对应的实际索引
    const actualIndex = works.findIndex(work => work.id === displayWorks[index].id);

    this.setData({
      currentSlide: actualIndex
    });

    this.updateDisplayWorks();
    this.update3DCarousel();
  },

  // 点赞功能
  toggleLike: function (e) {
    const works = this.data.works;
    const currentSlide = this.data.currentSlide;
    const work = works[currentSlide];

    // 更新点赞状态
    work.isLiked = !work.isLiked;
    work.likes += work.isLiked ? 1 : -1;

    // 更新数据
    const newWorks = [...works];
    newWorks[currentSlide] = work;

    this.setData({
      works: newWorks,
      selectedWork: work
    });
  },

  // 触摸开始
  touchStart: function (e) {
    if (this.data.isAnimating) return;

    this.setData({
      touchStartX: e.touches[0].clientX,
      isSwiping: true
    });
  },

  // 触摸移动
  touchMove: function (e) {
    if (!this.data.isSwiping || this.data.isAnimating) return;

    const touchStartX = this.data.touchStartX;
    const touchCurrentX = e.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;

    // 更新卡片的位置，提供滑动反馈
    const transforms = [...this.data.cardTransforms];

    // 只移动当前卡片
    if (transforms.length > 0) {
      transforms[0] = `translateX(${deltaX * 2}rpx) translateY(0) translateZ(0) scale(1)`;
    }

    this.setData({
      cardTransforms: transforms,
      swipeDirection: deltaX > 0 ? 1 : -1
    });
  },

  // 触摸结束
  touchEnd: function (e) {
    if (!this.data.isSwiping || this.data.isAnimating) return;

    const touchStartX = this.data.touchStartX;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    this.setData({
      touchStartX: 0,
      touchEndX: touchEndX,
      isSwiping: false
    });

    // 判断滑动方向并切换图片
    if (Math.abs(deltaX) > 50) { // 滑动距离超过50px才触发切换
      if (deltaX > 0) {
        // 向右滑动，显示上一张
        this.prevSlide();
      } else {
        // 向左滑动，显示下一张
        this.nextSlide();
      }
    } else {
      // 滑动距离不够，恢复原位
      this.update3DCarousel();
    }
  }
});