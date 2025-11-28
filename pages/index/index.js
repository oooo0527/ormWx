Page({
  data: {
    currentDate: '',
    // 图标数组
    icons: [
      '/images/icon_star.png',
      '/images/icon_data.png',
      '/images/icon_work.png',
      '/images/icon_fan.png',
      '/images/icon_my.png'
    ],
    showNumberContainer: false,
    // 当前显示的图标索引
    currentIconIndex: 0,
    // 当前显示的图标
    currentIcon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/lip.png',
    // 用于显示的图片数组
    displayImages: [
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/orm.png'
    ],
    displayImage1: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/login-bg.jpg',
    showHome: true,
    // 当前显示的图片索引
    currentDisplayIndex: 0,
    // 当前显示的图片
    displayImage: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/lip.png',
    displayImage2: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/under.png',
    // 图标位置
    iconLeft: 150,
    iconTop: '100vh',
    // 拖动相关数据
    startPoint: null,
    numberList: [2, 5, 7, 0],
    // 四个数字框的值，初始为0
    numbers: [0, 0, 0, 0],
    Clickindex: 0,
    fullText: ['萨瓦迪卡', 'สวัสดี~', '人生只有三万天', 'ชีวิตมีเพียง 30,000 วัน', '希望所有不好的事情尽快过去', 'ขอให้เรื่องร้ายๆ ผ่านไปเร็วๆ', 'orm希望你能勇敢地做自己', 'orm หวังว่าคุณจะเป็นตัวของตัวเองได้อย่างกล้าหาญ', '祝大家每天都开心，幸福，平静，舒心', 'ขอให้ทุกคนมีความสุข ความยินดี ความสงบสุข และความสบายใจในทุกๆ วัน', '我爱你们~  i love you~'],
    displayedText: [],
    textIndex: 0,
    timer: null,
    hoursArray: [], // 小时数组
    minutesArray: [], // 分钟数组
    selectedHourIndex: new Date().getHours(), // 选中的小时索引
    selectedMinuteIndex: new Date().getMinutes(), // 选中的分钟索引

  },
  // 初始化时间数组
  initTimeArrays: function () {
    // 初始化小时数组(0-23)
    let hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      hours.push(i);
    }

    // 初始化分钟数组(0-59)
    let minutes = [];
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        i = '0' + i;
      }
      minutes.push(i);
    }

    this.setData({
      hoursArray: hours,
      minutesArray: minutes
    });
  },

  // 时间选择器变化事件
  onTimeChange: function (e) {
    console.log(e, 'TimePicker:', e.detail.value);
    const value = e.detail.value;
    const selectedHour = value[0];
    const selectedMinute = value[1];
    console.log('Selected Time:', selectedHour, ':', selectedMinute);
    if (selectedHour == 5 && selectedMinute == 27) {
      wx.switchTab({
        url: '/pages/Home/Home'
      });
    }
    this.setData({
      selectedHourIndex: selectedHour,
      selectedMinuteIndex: selectedMinute
    });
  },

  onLoad: function () {
    this.initTimeArrays()
    this.initVoicePlayer()
    // 设置新的音频源
    this.voicePlayer.src = 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/陈奥三万天音频.mp3'
  },
  // 初始化语音播放器
  initVoicePlayer: function () {
    // 创建内部音频上下文
    this.voicePlayer = wx.createInnerAudioContext();

    this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
  },

  onShow: function () {

  },
  switchZindex: function () {

    // 监听音频结束
    this.voicePlayer.onEnded(() => {
      console.log('音频结束');
      this.voicePlayer.stop();
      this.setData({
        showNumberContainer: true
      });
    });


  },

  // 页面卸载时清除定时器
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },
  // 开始文字逐字显示
  startTextDisplay: function () {
    // 清除之前的定时器
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }

    // 重置文本显示状态
    this.setData({
      displayedText: "",
      textIndex: 0
    });

    // 启动定时器，逐字显示文本
    const timer = setInterval(() => {
      const currentIndex = this.data.textIndex;
      const fullText = this.data.fullText;

      // 如果已经显示完所有文字，则清除定时器
      if (currentIndex >= fullText.length) {
        clearInterval(timer);
        this.setData({
          timer: null
        });
        return;
      }

      // 更新显示的文本
      const displayedText = fullText[currentIndex + 1];
      this.setData({
        displayedText: [...this.data.displayedText, displayedText],
        textIndex: currentIndex + 1
      });
    }, 1200); // 每200毫秒显示一个字符

    // 保存定时器引用
    this.setData({
      timer: timer
    });
  },

  // 触摸开始事件
  onTouchStart: function (e) {
    const touch = e.touches[0];
    this.setData({
      startPoint: {
        x: touch.clientX,
        y: touch.clientY,
        left: this.data.iconLeft,
        top: this.data.iconTop
      }
    });
  },

  // 触摸移动事件
  onTouchMove: function (e) {
    if (!this.data.startPoint) return;

    const touch = e.touches[0];
    const startPoint = this.data.startPoint;

    // 计算移动距离
    const deltaX = touch.clientX - startPoint.x;
    const deltaY = touch.clientY - startPoint.y;

    // 更新图标位置
    this.setData({
      iconLeft: startPoint.left + deltaX,
      iconTop: startPoint.top + deltaY
    });
  },

  // 触摸结束事件
  onTouchEnd: function (e) {
    this.setData({
      startPoint: null
    });
  },

  // 长按切换显示图片
  switchDisplayImage: function () {
    // 切换显示图片
    const nextDisplayIndex = (this.data.currentDisplayIndex + 1) % this.data.displayImages.length;
    const nextDisplayImage = this.data.displayImages[nextDisplayIndex];

    // 更新数据
    this.setData({
      currentDisplayIndex: nextDisplayIndex,
      displayImage: nextDisplayImage,
      showHome: false,
      displayImage1: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/have-to.jpg',
    });
    this.startTextDisplay()
    this.voicePlayer.play();

    // // 显示提示
    // wx.showToast({
    //   title: '图片已切换',
    //   icon: 'success',
    //   duration: 1000
    // });
  },

  // 数字框点击增加事件
  incrementNumber: function (e) {

    const Clickindex = this.data.Clickindex;
    const numbers = this.data.numbers;
    numbers[Clickindex] = e.currentTarget.dataset.index;
    this.setData({
      numbers: numbers,
      Clickindex: Clickindex + 1
    });
    if (numbers[0] == 0 && numbers[1] == 5 && numbers[2] == 2 && numbers[3] == 7) {
      wx.switchTab({
        url: '/pages/Home/Home'
      });
    }
    else {
      if (this.data.Clickindex >= 4) {
        wx.showToast({
          title: '这密码很难吗？',
          duration: 1000
        });
        this.setData({
          Clickindex: 0
        });
      }
    }

  }
});