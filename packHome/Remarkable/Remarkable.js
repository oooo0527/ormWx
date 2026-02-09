// 高端荣耀殿堂页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 奖项数据
    awardsData: [],

    // 品牌代言数据
    brandsData: [],

    // 提名数据
    nominationsData: [],

    // 统计数据
    statsData: {
      awards: 0,
      brands: 0,
      nominations: 0
    },
    selectIdx: 0,

    // 加载状态
    loading: true,

    // 错误信息
    error: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时获取所有数据并按type分类
    this.loadAwardsData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面加载完成后的初始化动画
    // 数据加载逻辑已在loadAwardsData中处理
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时的动画效果
    this.animateElements();
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
  anmotionClass(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      selectIdx: index
    })


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 下拉刷新时重新加载数据
    this.loadAwardsData();

    // 停止下拉刷新动画
    wx.stopPullDownRefresh();
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

  },


  /**
   * 初始化页面动画
   */
  initPageAnimations() {
    // 延迟显示各个区块，创建逐次出现的效果
    setTimeout(() => {
      this.animateSection('heroSectionAnimation');
    }, 100);

    setTimeout(() => {
      this.animateSection('awardsSectionAnimation');
    }, 300);

    setTimeout(() => {
      this.animateSection('endorsementsSectionAnimation');
    }, 500);

    setTimeout(() => {
      this.animateSection('statsSectionAnimation');
    }, 700);

    setTimeout(() => {
      this.animateSection('signatureSectionAnimation');
    }, 900);
  },

  /**
   * 动画显示区块
   */
  animateSection(animationName) {
    const animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease'
    });

    animation.opacity(0).translateY(50).step();
    animation.opacity(1).translateY(0).step();

    this.setData({
      [animationName]: animation.export()
    });
  },

  /**
   * 元素动画效果
   */
  animateElements() {
    // 为奖项卡片添加交错动画
    const awardsData = this.data.awardsData;
    awardsData.forEach((_, index) => {
      setTimeout(() => {
        const animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        });

        animation.opacity(0).scale(0.8).step();
        animation.opacity(1).scale(1).step();

        this.setData({
          [`awardCardAnimation${index}`]: animation.export()
        });
      }, index * 100);
    });

    // 为品牌卡片添加交错动画
    const brandsData = this.data.brandsData;
    brandsData.forEach((_, index) => {
      setTimeout(() => {
        const animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        });

        animation.opacity(0).scale(0.8).step();
        animation.opacity(1).scale(1).step();

        this.setData({
          [`brandCardAnimation${index}`]: animation.export()
        });
      }, index * 100 + 200);
    });

    // 为提名卡片添加交错动画
    const nominationsData = this.data.nominationsData;
    nominationsData.forEach((_, index) => {
      setTimeout(() => {
        const animation = wx.createAnimation({
          duration: 500,
          timingFunction: 'ease'
        });

        animation.opacity(0).scale(0.8).step();
        animation.opacity(1).scale(1).step();

        this.setData({
          [`nominationCardAnimation${index}`]: animation.export()
        });
      }, index * 100 + 400);
    });
  },

  /**
   * 从云函数获取所有数据并按type分类
   */
  loadAwardsData: function () {
    this.setData({
      loading: true,
      error: null
    });

    wx.cloud.callFunction({
      name: 'rewordList',
      data: {
        action: 'getList'
      },
      success: res => {
        console.log('获取所有数据成功：', res.result);

        if (res.result.success) {
          // 将数据按type分类
          const allData = res.result.data;

          // type=1: 获奖
          const awardsData = allData
            .filter(item => item.type === '1')

          // type=2: 品牌
          const brandsData = allData
            .filter(item => item.type === '2')

          // type=3: 提名
          const nominationsData = allData
            .filter(item => item.type === '3')

          console.log(awardsData, brandsData, nominationsData, 'nominationsData')
          // 统计数据
          const statsData = {
            awards: awardsData.length,
            brands: brandsData.length,
            nominations: nominationsData.length
          };

          this.setData({
            awardsData,
            brandsData,
            nominationsData,
            statsData,
            loading: false
          });

          // 数据加载完成后执行动画
          this.initPageAnimations();
        } else {
          console.error('获取数据失败：', res.result.message);
          this.setData({
            error: res.result.message || '获取数据失败',
            loading: false
          });
        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);
        this.setData({
          error: '网络错误，请稍后重试',
          loading: false
        });
      }
    });
  }

})