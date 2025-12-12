Page({
  data: {


    selectedStar: null,
    nameList: ['ORM', 'KORN', 'NAPAT'],
    // 菜单信息
    menuList: [
      {
        name: '时间线',
        url: '/packHome/growthTimeline/growthTimeline',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
      },
      {
        name: '妈粉',
        url: '/packHome/mami/mami',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
      },
      {
        name: '梦女',
        url: '/packHome/dream/dream',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
      }, {
        name: '人缘',
        url: '/packHome/ormHome/ormHome',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/be8d30d68a86ef11752dfff29fd7af38.jpg'
      }, {
        name: '粉丝',
        url: '/packHome/support/support',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
      }
    ],
    contentList: [{
      name: '足迹',
      url: '/packHome/footPrints/footPrints',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    },
    {
      name: '语录',
      url: '/packHome/remark/remark',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    }, {
      name: '高情商',
      url: '/packHome/highEmotion/highEmotion',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    },
    {
      name: 'gucci',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/d0f92161e2ed52200dfb1c600e65c239.jpg'
    }],
    musicList: [{
      title: "上班必听",
      des: '你想象不到的音乐天才',
      url: '/packHome/musicPlayer/musicPlayer',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
    }, {
      name: '争气',
      title: "争气",
      des: '从这里开始了解陈奥',
      url: '/packHome/Remarkable/Remarkable',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
    },
    {
      title: "NAPAT",
      des: 'NAPAT',
      url: '/packHome/dream/dream',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
    }]
  },
  onLoad: function (options) {
    // 获取用户信息
    const app = getApp();
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/index/index'
      });

    }
    // this.setData({
    //   menuList: app.globalData.menuList,
    //   contentList: app.globalData.contentList,
    //   musicList: app.globalData.musicList
    // });


  },





  onShow: function () {

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