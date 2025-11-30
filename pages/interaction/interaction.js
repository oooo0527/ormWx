

Page({
  data: {
    currentSlide: 0,
    selectedWork: null,

    works: [], // 将原来硬编码的数据移除，改为从云端获取

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
    swipeDirection: 0, // -1: 左滑, 1: 右滑
    pageSize: 5,             // 每页数据条数
    currentPage: 0,           // 当前页码（从0开始方便计算skip）
    hasMore: true,            // 是否还有更多数据
    loadMore: false,          // "正在加载"状态
    loadAll: false,        // "已加载全部"状态

    // 热门互动留言
    hotInteractions: [],
    searchList: [],
    searchValue: '',
    searchFlag: false,
    userInfo: {},

  },

  onLoad: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    });
    // 加载互动留言数据
    this.loadInteractions();
    // 加载热门互动留言数据
    this.loadHotInteractions();

  },

  // 加载互动留言数据
  loadInteractions: function () {
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: 10 // 限制获取10条数据
      },
      success: res => {
        console.log('获取互动留言成功：', res.result.data);
        if (res.result && res.result.success && res.result.data.length > 0) {
          // 将云端数据转换为页面所需格式
          const works = res.result.data.map((item, index) => {
            return {
              id: item._id,
              title: item.title,
              role: "用户互动",
              type: "互动",
              cover: item.images && item.images.length > 0 ? item.images[0] : "", // 使用第一张图片作为封面
              updateTime: item.updateTime || '',
              description: item.content,
              likes: 0,
              isLiked: false,
              comments: item.comments || [],
              creator: item.userInfo.userInfo && item.userInfo.userInfo.nickname ? item.userInfo.userInfo.nickname : (item.creator || '匿名用户'), // 使用用户信息中的昵称
            }
          });

          this.setData({
            works: works
          }, () => {
            // 数据更新后重新初始化轮播图
            this.init3DCarousel();
          });
        } else {
          console.error('获取互动留言失败：', res.result.message);
          // 如果获取失败，仍然初始化轮播图
          this.init3DCarousel();
        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);
        // 如果调用失败，仍然初始化轮播图
        this.init3DCarousel();
      }
    });
  },

  // 加载热门互动留言数据
  loadHotInteractions: function () {
    const { currentPage, pageSize, hotInteractions } = this.data;
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: pageSize, // 限制获取10条数据
        skip: currentPage * pageSize
      },
      success: res => {
        console.log('获取热门互动留言成功：', res.result.data);
        if (res.result && res.result.success && res.result.data.length > 0) {
          // 处理热门互动留言数据
          const hotInteractions = res.result.data.slice(0, 10).map(item => {
            return {
              id: item._id,
              title: item.title,
              content: item.content,
              creator: item.userInfo.userInfo && item.userInfo.userInfo.nickname ? item.userInfo.userInfo.nickname : (item.creator || '匿名用户'), // 使用用户信息中的昵称
              updateTime: item.updateTime || '',
              commentsCount: (item.comments || []).length
            }
          });
          // 判断是否还有更多数据
          if (res.result.data.length < this.data.pageSize) {
            this.setData({
              hasMore: false,
              loadAll: true,    // 全部加载完毕
              loadMore: false
            });
          } else {
            this.setData({
              hasMore: true,
              loadMore: false
            });
          }

          this.setData({
            hotInteractions: this.data.hotInteractions.concat(hotInteractions)
          });
        } else {
          console.error('获取热门互动留言失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('调用获取热门互动留言云函数失败：', err);
      }
    });
  },
  onPullDownRefresh: function () {
    // 重置状态
    this.setData({
      hotInteractions: [],
      currentPage: 0,
      hasMore: true,
      loadAll: false
    });

    // 重新加载数据
    this.loadHotInteractions().then(() => {
      wx.stopPullDownRefresh(); // 停止下拉刷新动画
    });
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

    // 如果点击的是第一张卡片（当前显示的卡片），则显示详情
    if (index === 0) {
      this.showWorkDetail();
      return;
    }

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

  //fenye 
  onReachBottom: function () {
    // 如果还有更多数据且不在加载中，则加载下一页
    if (this.data.hasMore && !this.data.loadMore) {
      this.setData({
        loadMore: true
      });
      this.data.currentPage++; // 页码增加[citation:5]
      this.loadHotInteractions();
    }
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
  },

  // 显示作品详情
  showWorkDetail: function () {
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.works[this.data.currentSlide],
        });
      }
    });
  },

  selectHotInteraction: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.hotInteractions[index],
        });
      }
    });
  },
  selectSearchResult: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.searchList[index],
        });
      }
    });
  },



  // 轮播图切换事件
  onSwiperChange: function (e) {
    const current = e.detail.current;
    this.setData({
      currentSlide: current,
      selectedWork: this.data.works[current]
    });
  },

  // 轮播图图片点击事件
  onSwiperImageTap: function (e) {
    // 可以在这里添加点击图片的处理逻辑
    console.log("点击了轮播图图片");
  },
  onConfirm: function (e) {
    this.setData({
      searchFlag: true
    });

    console.log("点击了确定按钮");

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: 20, // 限制获取10条数据
        searchValue: this.data.searchValue || ""

      },
      success: res => {
        if (res.result && res.result.success && res.result.data.length > 0) {
          const searchList = res.result.data.slice(0, 10).map(item => {
            return {
              id: item._id,
              title: item.title,
              content: item.content,
              creator: item.userInfo.userInfo && item.userInfo.userInfo.nickname ? item.userInfo.userInfo.nickname : (item.creator || '匿名用户'), // 使用用户信息中的昵称
              updateTime: item.updateTime || '',
              commentsCount: (item.comments || []).length
            }
          });


          this.setData({
            searchList: searchList
          });
        } else {
          console.error('搜索互动留言失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('调用搜索互动留言云函数失败：', err);
      }
    });
  },
  onInput: function (e) {
    console.log("输入框内容:", e.detail.value);
    this.setData({
      searchValue: e.detail.value
    });

  },


  // 导航到发布页面
  navigateToPublish: function () {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    this.loadInteractions();
    this.loadHotInteractions();
    wx.stopPullDownRefresh();
  }
});
