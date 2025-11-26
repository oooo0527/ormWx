Page({
  data: {
    // 公告信息
    announcement: {
      show: true,
      text: '欢迎来到煎蛋卷加油站！最新活动正在进行中，欢迎大家参与... ',
      type: 'info' // info, warning, success, error
    },
    scrollAnimation: null,

    musicList: [{
      name: 'mami',
      url: '/packHome/musicPlayer/musicPlayer',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
    }, {
      name: 'KORN',
      url: '/packHome/dream/dream',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
    },
    {
      name: 'NAPAT',
      url: '/packHome/dream/dream',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
    }]
    ,
    selectedStar: null,
    nameList: ['ORM', 'KORN', 'NAPAT'],
    // 菜单信息
    menuList: [
      {
        name: 'mami',
        url: '/packHome/growthTimeline/growthTimeline',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
      },
      {
        name: '菜单2',
        url: '/packHome/dream/dream',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
      },
      {
        name: '梦女',
        url: '/packHome/dream/dream',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
      }, {
        name: '梦女',
        url: '/packHome/interaction/interaction',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/be8d30d68a86ef11752dfff29fd7af38.jpg'
      }, {
        name: '梦女',
        url: '/packHome/support/support',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
      }
    ],
    contentList: [{
      name: 'dior',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    },
    {
      name: 'gucci',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    }, {
      name: 'dior',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    },
    {
      name: 'gucci',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    }]
  },


  onLoad: function (options) {
    // 页面加载时的逻辑
    this.startScrollAnimation();
  },

  // 开始滚动动画
  startScrollAnimation: function () {
    const text = this.data.announcement.text;
    const query = wx.createSelectorQuery();
    query.select('.announcement-scroll-container').boundingClientRect();
    query.select('.announcement-scroll-content').boundingClientRect();

    query.exec((res) => {
      if (res[0] && res[1]) {
        const containerWidth = res[0].width;
        const contentWidth = res[1].width;

        // 如果内容宽度大于容器宽度，则开始滚动
        if (contentWidth > containerWidth) {
          this.animateScroll(contentWidth, containerWidth);
        }
      }
    });
  },

  // 执行滚动动画
  animateScroll: function (contentWidth, containerWidth) {
    const animation = wx.createAnimation({
      duration: (contentWidth + containerWidth) * 20, // 根据内容长度调整速度，加快滚动
      timingFunction: 'linear'
    });

    // 初始位置在容器右侧
    animation.translateX(containerWidth).step({ duration: 0 });

    // 滚动到左侧，使内容完全离开容器
    animation.translateX(-contentWidth).step();

    this.setData({
      scrollAnimation: animation.export()
    });

    // 动画结束后重新开始
    setTimeout(() => {
      this.animateScroll(contentWidth, containerWidth);
    }, (contentWidth + containerWidth) * 20);
  },

  onShow: function () {
    // 页面显示时的逻辑
    this.startScrollAnimation();
  },
  //跳转
  navigateToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },





  // 关闭公告
  closeAnnouncement: function () {
    this.setData({
      'announcement.show': false
    });
  }
})