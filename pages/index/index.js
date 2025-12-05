
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
    fullText: ['萨瓦迪카', 'สวัสดี~', '人生只有三万天', 'ชีวิตมีเพียง 30,000 วัน', '希望所有不好的事情尽快过去', 'ขอให้เรื่องร้ายๆ ผ่านไปเร็วๆ', 'orm希望你能勇敢地做自己', 'orm หวังว่าคุณจะเป็นตัวของตัวเองได้อย่างกล้าหาญ', '祝大家每天都开心，幸福，平静，舒心', 'ขอให้ทุกคนมีความสุข ความยินดี ความสงบสุข และความสบายใจในทุกๆ วัน', '我爱你们~  i love you~'],
    displayedText: [],
    textIndex: 0,
    timer: null,
    // 时间相关数据
    currentTime: new Date(),
    hours: 0, // 将在onLoad中初始化为当前小时
    minutes: 0, // 将在onLoad中初始化为当前分钟
    hourDeg: 0, // 将在onLoad中初始化
    minuteDeg: 0, // 将在onLoad中初始化
    clockCenter: { x: 0, y: 0 }, // 表盘中心坐标
    isDragging: false, // 是否正在拖拽
    showIcon: false,


  },




  onLoad: function () {
    // 页面加载时的逻辑
    // 获取当前时间并设置小时和分钟
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 更新数据
    this.setData({
      hours: hours,
      minutes: minutes
    });

    // 计算指针角度
    this.calculateHandAngles();
    this.initVoicePlayer()
    // 设置新的音频源
    this.voicePlayer.src = 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/陈奥三万天音频.mp3'
  },
  onReady: function () {
    // 页面渲染完成后获取表盘中心位置
    const that = this;
    // 延迟一段时间确保元素已经渲染
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('.clock-face')
        .boundingClientRect(function (rect) {
          if (rect) {
            that.setData({
              clockCenter: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
              }
            });
          } else {
            // 如果无法获取clock-face元素，尝试使用默认值
            wx.getSystemInfo({
              success: function (res) {
                that.setData({
                  clockCenter: {
                    x: res.windowWidth / 2,
                    y: 160 + 20 // 大概在页面顶部的位置
                  }
                });
              }
            });
          }
        })
        .exec();
    }, 500); // 延迟500ms确保渲染完成
  },

  // 计算时针和分针的角度
  calculateHandAngles: function () {
    // 时针角度：每小时30度 + 每分钟0.5度
    const hourDeg = (this.data.hours % 12) * 30 + this.data.minutes * 0.5;
    // 分针角度：每分钟6度
    const minuteDeg = this.data.minutes * 6;

    this.setData({
      hourDeg: hourDeg + 180,
      minuteDeg: minuteDeg + 180
    });
  },

  // 触摸开始事件
  onTouchStart: function (e) {
    this.setData({
      isDragging: true
    });

    // 确保表盘中心点已设置
    if (this.data.clockCenter.x === 0 && this.data.clockCenter.y === 0) {
      const that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clockCenter: {
              x: res.windowWidth / 2,
              y: 180 // 大概在页面顶部的位置
            }
          });
        }
      });
    }
  },

  // 触摸移动事件
  onTouchMove: function (e) {
    if (!this.data.isDragging) return;

    const touch = e.touches[0];
    const centerX = this.data.clockCenter.x;
    const centerY = this.data.clockCenter.y;

    // 计算触摸点与中心点的相对位置
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    // 计算角度（以12点为0度，顺时针增加）
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    // 调整到0-360度范围，12点为0度
    angle = (angle + 90 + 360) % 360;

    // 将角度转换为时间（0-360度 对应 00:00-23:59）
    // 360度 = 24小时 = 1440分钟
    const totalMinutes = Math.round((angle / 360) * 1440);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    // 更新时间和指针角度
    this.setData({
      hours: hours,
      minutes: minutes
    });
    if (hours == 5 && minutes == 27) {
      this.setData({
        showIcon: true
      });
    }

    // 重新计算指针角度
    this.calculateHandAngles();
  },

  // 触摸结束事件
  onTouchEnd: function (e) {
    this.setData({
      isDragging: false
    });
  },
  // 初始化语音播放器
  initVoicePlayer: function () {
    // 创建内部音频上下文
    this.voicePlayer = wx.createInnerAudioContext();

    this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
  },
  getUserProfile: function () {
    wx.showLoading({
      title: '登录中...',
    });

    // 调用wx.login获取临时登录凭证code
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        console.log('wx.login成功', res);
        if (res.userInfo) {
          console.log('wx.login成功', res.userInfo);
          // 调用云函数进行登录验证
          wx.cloud.callFunction({
            name: 'user',
            data: {
              action: 'login',
              userInfo: {
                ...res.userInfo,
              }
            },
            success: res => {
              wx.hideLoading();
              console.log('云函数调用成功', res);

              if (res.result && res.result.success) {
                // 登录成功，存储用户信息
                const userInfo = res.result.data;
                getApp().globalData.userInfo = userInfo;
                getApp().globalData.isLogin = true;
                console.log('用户信息', userInfo);

                // 存储到本地
                wx.setStorageSync('userInfo', userInfo);

                // 检查用户是否已经设置了昵称，如果没有则跳转到登录页面完善信息
                if (!userInfo.nickname || userInfo.nickname.trim() === '' || userInfo.nickname.trim() == '微信用户') {
                  wx.navigateTo({
                    url: '/pages/login/login'
                  });
                } else {
                  // 跳转到首页
                  wx.switchTab({
                    url: '/pages/Home/Home'
                  });
                }
              } else {
                // 登录失败
                wx.showToast({
                  title: res.result ? res.result.message : '登录失败',
                  icon: 'none',
                  duration: 3000
                });
              }
            },
            fail: err => {
              wx.hideLoading();
              console.error('云函数调用失败', err);
              // 显示更详细的错误信息
              let errMsg = '登录失败，请检查网络';
              if (err.errMsg) {
                errMsg = err.errMsg;
              } else if (err.message) {
                errMsg = err.message;
              }
              wx.showToast({
                title: errMsg,
                icon: 'none',
                duration: 3000
              });
            }
          });
        } else {
          wx.hideLoading();
          console.log('登录失败！' + res.errMsg);
          wx.showToast({
            title: '登录失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('wx.login调用失败', err);
        wx.showToast({
          title: '登录失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  switchZindex: function () {

    console.log('switchZindex function called');
    // 监听音频结束
    this.voicePlayer.onEnded(() => {
      console.log('音频结束');
      this.voicePlayer.stop();
      // wx.switchTab({
      //   url: '/pages/Home/Home'
      // });
      // this.setData({
      //   showNumberContainer: true
      // });
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