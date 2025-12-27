Page({
  data: {
    innerAudioContext: null,
    showBg: true,
    allBlessings: [
      "Orm, 祝你星途璀璨！",
      "愿你永远闪闪发光！",
      "期待你的每一部新作品！",
      "恭喜获奖，实至名归！",
      "演技越来越棒了！",
      "要一直走花路呀！",
      "祝你健康快乐每一天！",
      "新剧大爆，收视长虹！",
      "恭喜毕业，前程似锦！",
      "生日快乐，永远美丽！",
      "愿你被世界温柔以待。",
      "加油，你是最棒的！",
      "未来请继续闪耀吧！",
      "祝品牌KeepSilent大卖！",
      "祝活动圆满成功！",
      "愿你心想事成。",
      "注意休息，别太累。",
      "笑容永远这么治愈！",
      "祝杂志销量夺冠！",
      "国际舞台等你征服！",
      "愿你永远保持初心。",
      "你是我们的骄傲！",
      "祝试镜顺利通过！",
      "期待下一次见面！",
      "愿你平安顺遂。",
      "祝演唱会爆满！",
      "新歌一定很好听！",
      "祝粉丝破百万！",
      "愿你每天都有好事发生。",
      "演技封神，再拿大奖！",
      "祝旅途愉快平安！",
      "吃好睡好，身体第一。",
      "愿快乐常伴你左右。",
      "祝时尚资源越来越好！",
      "你是最独特的存在！",
      "祝直播人气爆棚！",
      "愿努力都有回报。",
      "恭喜超话成立！",
      "祝中站越办越好！",
      "愿你勇敢做自己。",
      "祝拍摄顺利杀青！",
      "票房大卖！",
      "专辑大卖！",
      "愿你收获更多爱。",
      "祝代言接到手软！",
      "红毯造型永远惊艳！",
      "愿世界看到你的好。",
      "祝家庭幸福美满。",
      "愿你永远自由自在。",
      "祝比赛取得好成绩！",
      "愿善良不被辜负。",
      "祝新角色深入人心！",
      "愿你拥有无限可能。",
      "祝活动玩得开心！",
      "愿每个梦想都开花。",
      "祝采访对答如流！",
      "愿你被好运环绕。",
      "祝公益行动顺利！",
      "愿你内心永远强大。",
      "祝写真集热卖！",
      "愿每一天都有阳光。",
      "祝合作愉快愉快！",
      "愿你永远相信奇迹。",
      "祝新技能get成功！",
      "愿时光善待美人。",
      "祝游戏直播超神！",
      "愿你永远热情洋溢。",
      "祝晚会表演完美！",
      "愿你的努力被看见。",
      "祝探班活动热闹！",
      "愿你拥有甜蜜爱情。",
      "祝航班永远准点！",
      "愿你的选择都正确。",
      "祝庆功宴热闹！",
      "愿你永远充满好奇。",
      "祝新工作室顺利！",
      "愿你的真诚被珍惜。",
      "祝红毯艳压群芳！",
      "愿你永远不惧挑战。",
      "祝翻唱歌曲出圈！",
      "愿你的善良有回声。",
      "祝健身计划成功！",
      "愿你永远心怀希望。",
      "祝拍摄天气晴好！",
      "愿你的才华不被埋没。",
      "祝新发型获好评！",
      "愿你永远有人陪伴。",
      "祝获奖感言感人！",
      "愿你的付出值得。",
      "祝海边度假放松！",
      "愿你永远优雅从容。",
      "祝宠物健康可爱！",
      "愿你的道路越走越宽。",
      "祝新CP热度超高！",
      "愿你永远被粉丝热爱。",
      "祝打破新纪录！",
      "愿你的笑容治愈一切。",
      "祝未来一片光明！",
      "愿你成为想成为的人。",
      "Orm Kornnaphat，永远支持你！"
    ],
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
        year: "2002",
        month: "5月",
        title: "出生",
        description: "2002年5月27日出生于泰国曼谷，本名珙恩娜帕·瑟塔拉塔那彭（Kornnaphat Sethratanapong）",
        image: ""
      },
      {
        id: 2,
        year: "2019",
        month: "5月",
        title: "演艺起点",
        description: "2019年5月7日，在《酒店之星》面试通过，拿到人生中第一个电视剧角色。",
        image: ""
      },
      {
        id: 3,
        year: "2019",
        month: "7月",
        title: "正式签约",
        description: "2019年7月12日，签约泰国第3电视台，成为旗下艺人。",
        image: ""
      },
      {
        id: 4,
        year: "2019",
        month: "11月",
        title: "作品首播",
        description: "2019年11月29日，参演的公益短片《心灵英雄》播出。",
        image: ""
      },
      {
        id: 5,
        year: "2023",
        month: "8月",
        title: "首获演员奖",
        description: "2023年8月7日，凭借《医爱之名》中Riri一角，获得STAR POP AWARDS 2023人气新星女演员奖。",
        image: ""
      },
      {
        id: 6,
        year: "2024",
        month: "1月",
        title: "超话成立",
        description: "2024年1月7日，OrmKornnaphat新浪微博超话成立。",
        image: ""
      },
      {
        id: 7,
        year: "2024",
        month: "6月",
        title: "主演剧集播出",
        description: "2024年6月24日，主演的Girls' Love剧集《我们的秘密》播出。",
        image: ""
      },
      {
        id: 8,
        year: "2024",
        month: "8月",
        title: "个人中站成立",
        description: "2024年8月3日，Orm个人中国粉丝站宣布成立。",
        image: ""
      },
      {
        id: 9,
        year: "2024",
        month: "10月",
        title: "入选影响力人物",
        description: "2024年10月8日，入选HOWE AWARDS 2024“50位最具影响力的人物”。",
        image: ""
      },
      {
        id: 10,
        year: "2024",
        month: "11月",
        title: "推出个人品牌",
        description: "2024年11月8日，推出个人品牌KeepSilent。",
        image: ""
      },
      {
        id: 11,
        year: "2024",
        month: "12月",
        title: "大学毕业",
        description: "2024年12月2日，在诗纳卡琳威洛大学毕业典礼上，作为毕业生代表宣誓。",
        image: ""
      },
      {
        id: 12,
        year: "2024",
        month: "12月",
        title: "获奖与提名",
        description: "2024年12月1日，在Y ENTERTAIN AWARDS 2024中，凭借《我们的秘密》Earn一角获得“年度最佳Girls' Love主演”奖项提名。",
        image: ""
      },
      {
        id: 13,
        year: "2024",
        month: "12月",
        title: "新作上线",
        description: "2024年12月13日，主演短剧《凌晨三点》在YouTube平台首播。",
        image: ""
      },
      {
        id: 14,
        year: "2025",
        month: "1月",
        title: "杂志封面",
        description: "2025年1月11日，作为封面人物登上泰国版《ELLE》杂志开年刊。",
        image: ""
      },
      {
        id: 15,
        year: "2025",
        month: "4月",
        title: "作品获国际奖",
        description: "2025年4月21日，主演作品《ยังรักกัน. Still Love》在ARFF BARCELONA 2025中获得“全球年度最佳作品奖”。",
        image: ""
      },
      {
        id: 16,
        year: "2025",
        month: "5月",
        title: "登封ELLE八十周年刊",
        description: "2025年5月31日，由宝格丽推封，成为泰国版《ELLE》杂志八十周年刊封面人物。",
        image: ""
      },
      {
        id: 17,
        year: "2025",
        month: "6月",
        title: "登封GQ",
        description: "2025年6月27日，由欧米茄推封，成为泰国版《GQ》杂志6月刊封面人物。",
        image: ""
      }
    ],
    stars: [], // 用于存储星空背景中的星星位置
    showDetailModal: false, // 是否显示详情弹窗
    currentDetailIndex: -1, // 当前显示详情的时间点索引
    showBlessingModal: false, // 是否显示祝福输入弹窗
    blessingText: '', // 祝福文本
    blessingItems: [], // 祝福项
    showHeartExplosion: false, // 是否显示心脏爆炸特效
    showBlessingRain: false, // 是否显示祝福雨
    heartParticles: [] // 心脏粒子
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

    // 清除定时器
    if (this.blessingInterval) {
      clearInterval(this.blessingInterval);
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
    // 首先播放心脏爆炸特效
    this.playHeartExplosion();
  },

  // 播放心脏爆炸特效
  playHeartExplosion: function () {
    // 设置背景隐藏
    this.setData({
      showBg: false
    });
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.windowWidth;
    const screenHeight = systemInfo.windowHeight;

    // 创建心脏粒子
    const heartParticles = [];


    for (let i = 0; i < this.data.allBlessings.length; i++) {
      // 随机角度
      const angle = Math.random() * Math.PI * 2;
      // 随机距离
      const distance = 100 + Math.random() * 300;

      // 计算终点坐标
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      // 随机选择渐变色主题
      const gradientThemes = [
        'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
        'linear-gradient(135deg, #4ecdc4, #88d8b0)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)',
        'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
        'linear-gradient(135deg, #ffecd2, #fcb69f)',
        'linear-gradient(135deg, #84fab0, #8fd3f4)',
        'linear-gradient(135deg, #d4fc79, #96e6a1)',
        'linear-gradient(135deg, #a6c0fe, #f68084)'
      ];

      heartParticles.push({
        id: i,
        startX: 0,
        startY: 0,
        endX: endX,
        endY: endY,
        duration: 3000 + Math.random() * 3000, // 1.5-3秒
        delay: Math.random() * 2000, // 最多延迟0.5秒
        gradient: gradientThemes[Math.floor(Math.random() * gradientThemes.length)],
        show: true,
        text: this.data.allBlessings[i]
      });
    }

    // 显示心脏爆炸特效
    this.setData({
      showHeartExplosion: true,
      heartParticles: heartParticles,
      showBlessingModal: false,
      blessingText: ''
    });

  },
})