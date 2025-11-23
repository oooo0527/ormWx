Page({
  data: {
    isLogin: false,
    userInfo: null,
    currentBackground: 0, // 当前背景索引
    backgrounds: [  // 背景数组
      'linear-gradient(135deg, #000000 0%, #333333 100%)', // 黑白渐变
      'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)', // 白灰渐变
      'linear-gradient(135deg, #333333 0%, #000000 100%)', // 灰黑渐变
      'linear-gradient(135deg, #ffffff 0%, #666666 100%)', // 白银渐变
      'linear-gradient(135deg, #666666 0%, #000000 100%)'  // 银黑渐变
    ]
  },
  // 初始化语音播放器
  initVoicePlayer: function () {
    // 创建内部音频上下文
    this.voicePlayer = wx.createInnerAudioContext();

    this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
  },
  onLoad: function () {
    this.initVoicePlayer()
    // 设置新的音频源
    this.voicePlayer.src = 'packageC/vedio/等左左买饼干 - 你好.mp3';
    // 播放音频
    this.voicePlayer.play();
    // 页面加载时检查登录状态
    this.checkLoginStatus();

    // 从本地存储获取背景设置
    const savedBackground = wx.getStorageSync('selectedBackground');
    if (savedBackground !== undefined && savedBackground !== null) {
      this.setData({
        currentBackground: savedBackground
      });
    }
  },

  onShow: function () {
    // 页面显示时检查登录状态
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        isLogin: true,
        userInfo: userInfo
      });
    } else {
      this.setData({
        isLogin: false,
        userInfo: null
      });
    }
  },

  // 跳转到登录页面
  goToLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  // 跳转到明星档案页面
  goToStarArchive: function () {
    wx.switchTab({
      url: '/pages/starArchive/starArchive'
    });
  },

  // 背景变化回调
  onBackgroundChange: function (settings) {
    // 由于使用了全局背景组件，这里不需要额外处理
  }
})