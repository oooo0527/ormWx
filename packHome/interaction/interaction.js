
Page({
  properties: {

  },

  data: {
    voices: [],
    columns: [[], []], // 瀑布流两列
    columnHeights: [0, 0] // 两列的高度
  },

  onLoad: function () {
    this.loadVoices();
  },


  // 加载心声列表
  loadVoices: function () {
    // 模拟从接口获取数据，包含图片和纯文字内容
    const voices = [
      {
        id: 1,
        content: "ORM：我想拥有隐形的能力，这样我就可以偷偷出去玩而不被人发现（笑）。",
        context: "ELLE杂志采访中关于超能力的提问",
        type: "幽默自白",
        category: "interaction",
        userId: "user1",
        likes: [],
        comments: [],
        createTime: "2025-01-15 10:30",
        updateTime: "2025-01-15 10:30",
        hasImage: false,
        imageOnly: false,
        avatar: "/images/default_avatar.png"
      },
      {
        id: 2,
        content: "我是一个特别容易入睡的人...在片场，有三个发型师围着我忙...我却能在这样的环境里睡着。所以有很多'数字足迹'（笑），因为大家会偷拍我睡觉。",
        context: "ELLE杂志采访中分享的片场趣事",
        type: "可爱日常",
        category: "interaction",
        userId: "user2",
        likes: [],
        comments: [],
        createTime: "2025-01-10 14:20",
        updateTime: "2025-01-10 14:20",
        hasImage: false,
        imageOnly: false,
        avatar: "/images/default_avatar.png"
      },
      {
        id: 3,
        content: "Orm最新活动现场美照分享",
        type: "活动照片",
        category: "interaction",
        userId: "user3",
        likes: [],
        comments: [],
        createTime: "2025-01-12 16:45",
        updateTime: "2025-01-12 16:45",
        hasImage: true,
        imageOnly: false,
        images: [
          "/images/default_avatar.png",
          "/images/default_avatar.png"
        ],
        avatar: "/images/default_avatar.png"
      },
      {
        id: 4,
        content: "",
        type: "精彩瞬间",
        category: "interaction",
        userId: "user4",
        likes: [],
        comments: [],
        createTime: "2025-01-18 09:30",
        updateTime: "2025-01-18 09:30",
        hasImage: false,
        imageOnly: true,
        mainImage: "/images/default_avatar.png",
        avatar: "/images/default_avatar.png"
      },
      {
        id: 5,
        content: "Orm在新剧中的表现真是太棒了！演技越来越精湛，期待后续剧情发展。",
        context: "粉丝评论",
        type: "观剧感受",
        category: "interaction",
        userId: "user5",
        likes: [],
        comments: [],
        createTime: "2025-01-20 20:15",
        updateTime: "2025-01-20 20:15",
        hasImage: false,
        imageOnly: false,
        avatar: "/images/default_avatar.png"
      },
      {
        id: 6,
        content: "Orm粉丝见面会精彩瞬间",
        type: "粉丝活动",
        category: "interaction",
        userId: "user6",
        likes: [],
        comments: [],
        createTime: "2025-01-22 14:20",
        updateTime: "2025-01-22 14:20",
        hasImage: true,
        imageOnly: false,
        images: [
          "/images/default_avatar.png",
          "/images/default_avatar.png",
          "/images/default_avatar.png"
        ],
        avatar: "/images/default_avatar.png"
      },
      {
        id: 7,
        content: "",
        type: "签名会照片",
        category: "interaction",
        userId: "user7",
        likes: [],
        comments: [],
        createTime: "2025-01-25 11:30",
        updateTime: "2025-01-25 11:30",
        hasImage: false,
        imageOnly: true,
        mainImage: "/images/default_avatar.png",
        avatar: "/images/default_avatar.png"
      },
      {
        id: 8,
        content: "大家一起在评论区聊聊Orm最近的作品吧！",
        context: "互动话题",
        type: "互动讨论",
        category: "interaction",
        userId: "user8",
        likes: [],
        comments: [],
        createTime: "2025-01-28 18:45",
        updateTime: "2025-01-28 18:45",
        hasImage: false,
        imageOnly: false,
        avatar: "/images/default_avatar.png"
      }
    ];

    this.setData({
      voices: voices
    });

    // 初始化瀑布流布局
    this.initWaterfall(voices);
  },

  // 初始化瀑布流布局
  initWaterfall: function (voices) {
    // 重置列数据
    const columns = [[], []];
    const columnHeights = [0, 0];

    voices.forEach((voice, index) => {
      // 计算内容高度（简化计算）
      let itemHeight = 100; // 基础高度

      if (voice.content) {
        // 根据文字长度估算高度
        itemHeight += Math.ceil(voice.content.length / 20) * 30;
      }

      if (voice.context) {
        itemHeight += 60;
      }

      if (voice.hasImage) {
        itemHeight += voice.images.length * 150;
      }

      if (voice.imageOnly) {
        itemHeight += 200;
      }

      itemHeight += 80; // 操作栏高度

      // 找到较短的列插入
      const minHeightIndex = columnHeights[0] <= columnHeights[1] ? 0 : 1;
      columns[minHeightIndex].push(voice);
      columnHeights[minHeightIndex] += itemHeight;

      console.log(`项目 ${index} 插入到列 ${minHeightIndex}`);
    });

    console.log('瀑布流列数据:', columns);
    console.log('列高度:', columnHeights);

    this.setData({
      columns: columns
    });
  },

  // 点赞心声
  likeVoice: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '请先登录以使用点赞功能',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 评论心声
  commentVoice: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '请先登录以使用评论功能',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 预览图片
  previewImage: function (e) {
    const images = e.currentTarget.dataset.images;
    const current = e.currentTarget.dataset.current;

    wx.previewImage({
      current: current,
      urls: images
    });
  }

})