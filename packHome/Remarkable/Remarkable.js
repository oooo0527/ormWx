// 高端荣耀殿堂页面
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 奖项数据
    awardsData: [
      {
        id: 1,
        name: '最佳男艺人奖',
        category: '音乐类',
        year: '2025',
        description: '凭借专辑《星辰大海》获得年度最佳男艺人殊荣',
        trophyIcon: '/images/trophy-gold.png'
      },
      {
        id: 2,
        name: '最受欢迎偶像奖',
        category: '娱乐类',
        year: '2024',
        description: '在社交媒体上拥有超过千万粉丝，影响力巨大',
        trophyIcon: '/images/trophy-silver.png'
      },
      {
        id: 3,
        name: '时尚先锋奖',
        category: '时尚类',
        year: '2024',
        description: '引领亚洲时尚潮流，多次登上国际时装周',
        trophyIcon: '/images/trophy-bronze.png'
      },
      {
        id: 4,
        name: '慈善贡献奖',
        category: '公益类',
        year: '2023',
        description: '积极参与慈善事业，捐赠金额超过千万',
        trophyIcon: '/images/trophy-diamond.png'
      }
    ],

    // 品牌代言数据
    brandsData: [
      {
        id: 1,
        name: 'Louis Vuitton',
        category: '奢侈品',
        logo: '/images/lv-logo.png'
      },
      {
        id: 2,
        name: 'Chanel',
        category: '奢侈品',
        logo: '/images/chanel-logo.png'
      },
      {
        id: 3,
        name: 'Gucci',
        category: '奢侈品',
        logo: '/images/gucci-logo.png'
      },
      {
        id: 4,
        name: 'Dior',
        category: '奢侈品',
        logo: '/images/dior-logo.png'
      },
      {
        id: 5,
        name: 'Rolex',
        category: '腕表',
        logo: '/images/rolex-logo.png'
      },
      {
        id: 6,
        name: 'BMW',
        category: '汽车',
        logo: '/images/bmw-logo.png'
      }
    ],

    // 统计数据
    statsData: {
      awards: 25,
      brands: 18,
      years: 8
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 页面加载完成后的初始化动画
    this.initPageAnimations();
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

  },

  /**
   * 奖项卡片点击事件
   */
  onAwardCardTap(e) {
    const awardId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `查看奖项详情 ${awardId}`,
      icon: 'none'
    });

    // 添加点击动画效果
    const query = wx.createSelectorQuery();
    query.select(`.award-card[data-id="${awardId}"]`).boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
      }
    });
  },

  /**
   * 品牌卡片点击事件
   */
  onBrandCardTap(e) {
    const brandId = e.currentTarget.dataset.id;
    wx.showToast({
      title: `查看品牌详情 ${brandId}`,
      icon: 'none'
    });

    // 添加点击动画效果
    const query = wx.createSelectorQuery();
    query.select(`.brand-card[data-id="${brandId}"]`).boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        wx.createAnimation({
          duration: 300,
          timingFunction: 'ease'
        });
      }
    });
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
  }
})