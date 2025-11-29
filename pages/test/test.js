Page({
  data: {
    numberList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    selectedNumber: 0,
    fullText: "欢迎来到微信小程序开发世界！在这里你可以学习到很多有趣的知识和技能。",
    displayedText: "",
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
  },

  onLoad: function (options) {
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

    // 重新计算指针角度
    this.calculateHandAngles();
  },

  // 触摸结束事件
  onTouchEnd: function (e) {
    this.setData({
      isDragging: false
    });
  },

  // 增加数字的方法
  incrementNumber: function (e) {
    const index = e.currentTarget.dataset.index;
    const numberList = this.data.numberList;

    // 增加对应索引的数字
    numberList[index] = numberList[index] + 1;

    // 更新数据
    this.setData({
      numberList: numberList,
      selectedNumber: numberList[index]
    });
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
      const displayedText = fullText.substring(0, currentIndex + 1);
      this.setData({
        displayedText: displayedText,
        textIndex: currentIndex + 1
      });
    }, 200); // 每200毫秒显示一个字符

    // 保存定时器引用
    this.setData({
      timer: timer
    });
  },

  // 页面卸载时清除定时器
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  }
})