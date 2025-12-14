Page({
  data: {
    innerAudioContext: null,
    showBg: true,
    voiceMap: [
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你好.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你是我的女朋友.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 内个菠萝.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 再见.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 呜呜呜.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 对吧.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 对对对.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我叫Orm.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你，你爱我吗？.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你哒~.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 早安.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 明天见！.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 谢谢.mp3",

    ],
    // Kornnaphat Sethratanapong (Orm) 的成长时间线数据
    timelineData: [
      {
        id: 1,
        year: "1999",
        month: "5月",
        title: "出生",
        description: "出生于泰国曼谷，本名珙恩娜帕·瑟塔拉塔那彭（Kornnaphat Sethratanapong）",
        image: ""
      },
      {
        id: 2,
        year: "2016",
        month: "5月",
        title: "获得亚军",
        description: "参加泰国选美比赛Miss Teen Thailand 2016获得亚军",
        image: ""
      },
      {
        id: 3,
        year: "2017",
        month: "7月",
        title: "正式出道",
        description: "主演校园爱情剧《梦中注定我爱你》，正式以演员身份出道",
        image: ""
      },
      {
        id: 4,
        year: "2018",
        month: "3月",
        title: "主演电视剧",
        description: "主演青春校园剧《一年生2》，饰演学妹Cherry，获得更多关注",
        image: ""
      },
      {
        id: 5,
        year: "2019",
        month: "1月",
        title: "主演电影",
        description: "首次主演电影《Friend Zone》，票房大卖成为当年泰国最卖座的泰语电影之一",
        image: ""
      },
      {
        id: 6,
        year: "2019",
        month: "6月",
        title: "签约泰国3台",
        description: "正式签约泰国第3电视台，成为旗下艺人",
        image: ""
      },
      {
        id: 7,
        year: "2020",
        month: "12月",
        title: "大学毕业",
        description: "从诗纳卡宁威洛大学国际经济学专业毕业",
        image: ""
      },
      {
        id: 8,
        year: "2021",
        month: "6月",
        title: "主演《流星花园》",
        description: "主演泰版《流星花园》饰演女主角Gorya，该剧在中国及东南亚地区大受欢迎",
        image: ""
      },
      {
        id: 9,
        year: "2022",
        month: "2月",
        title: "主演《新爱的激流》",
        description: "主演都市情感剧《新爱的激流》，演技备受好评",
        image: ""
      },
      {
        id: 10,
        year: "2023",
        month: "1月",
        title: "主演《天生一对2》",
        description: "参演古装穿越剧《天生一对2：命中注定》，饰演现代女孩Emma",
        image: ""
      }
    ],
    stars: [], // 用于存储星空背景中的星星位置
    showDetailModal: false, // 是否显示详情弹窗
    currentDetailIndex: -1, // 当前显示详情的时间点索引
    showBlessingModal: false, // 是否显示祝福输入弹窗
    blessingText: '', // 祝福文本
    blessingItems: [] // 祝福项
  },

  onLoad: function () {
    this.initStars(); // 初始化星空背景
    // 创建音频上下文
    this.innerAudioContext = wx.createInnerAudioContext();
  },

  onUnload: function () {
    // 页面卸载时停止并销毁音频
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
      this.innerAudioContext.destroy();
    }
  },

  // 初始化星空背景
  initStars: function () {
    const stars = [];
    // 创建100个随机位置的星星
    for (let i = 0; i < 100; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100, // 百分比位置
        y: Math.random() * 100,
        size: Math.random() * 2 + 1, // 1-3px大小
        opacity: Math.random() * 0.8 + 0.2 // 0.2-1透明度
      });
    }
    this.setData({
      stars: stars
    });
  },

  // 点击时间线内容事件
  onTapTimelineContent: function (e) {
    const index = e.currentTarget.dataset.index;

    this.setData({
      showDetailModal: true,
      currentDetailIndex: index
    });
  },

  // 点击时间线标记事件
  onTapTimelineMarker: function (e) {
    const index = e.currentTarget.dataset.index;
    // 从voiceMap中随机选择一个音频文件
    const randomIndex = Math.floor(Math.random() * this.data.voiceMap.length);
    const audioSrc = this.data.voiceMap[randomIndex];

    // 设置音频源并播放
    this.innerAudioContext.src = audioSrc;
    this.innerAudioContext.play();

    wx.showToast({
      title: '播放语音中...',
      icon: 'none'
    });
  },

  // 关闭时间点详情
  onCloseDetail: function () {
    this.setData({
      showDetailModal: false,
      currentDetailIndex: -1
    });
  },

  // 滚动到底部事件
  onScrollToLower: function () {
    this.setData({
      showBlessingModal: true
    });
  },

  // 关闭祝福弹窗
  onCloseBlessingModal: function () {
    this.setData({
      showBlessingModal: false,
      blessingText: ''
    });
  },

  // 祝福输入事件
  onBlessingInput: function (e) {
    this.setData({
      blessingText: e.detail.value
    });
  },

  // 提交祝福
  onSubmitBlessing: function () {
    if (!this.data.blessingText.trim()) {
      wx.showToast({
        title: '请输入祝福内容',
        icon: 'none'
      });
      return;
    }

    // 生成多个祝福项
    const blessingItems = [];
    const windowHeight = wx.getSystemInfoSync().windowHeight;
    const windowWidth = wx.getSystemInfoSync().windowWidth;

    // 生成20个祝福项
    for (let i = 0; i < 100; i++) {
      blessingItems.push({
        id: i,
        text: this.data.blessingText,
        top: Math.random() * (windowHeight),
        left: Math.random() * (windowWidth),
        show: false, // 初始不显示
        animationClass: Math.random() > 0.3 ? 'floating' : 'pulsing' // 随机添加动画类
      });
    }

    this.setData({
      blessingItems: blessingItems,
      showBlessingModal: false,
      blessingText: '',
      showBg: false
    });

    // 逐个显示祝福弹窗
    this.showBlessingItemsOneByOne(0);

    wx.showToast({
      title: '祝福已发送！',
      icon: 'success'
    });
  },

  // 逐个显示祝福弹窗
  showBlessingItemsOneByOne: function (index) {
    const that = this;
    if (index >= this.data.blessingItems.length) {
      return;
    }
    // 更新当前项为显示状态
    const blessingItems = this.data.blessingItems;
    blessingItems[index].show = true;
    this.setData({
      blessingItems: blessingItems
    });

    // 递归调用，延迟显示下一个
    setTimeout(function () {
      that.showBlessingItemsOneByOne(index + 1);
    }, 100); // 每150毫秒显示一个
  }
})