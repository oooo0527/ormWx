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
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
    selectedHourIndex: new Date().getHours(), // 选中的小时索引
    selectedMinuteIndex: new Date().getMinutes(), // 选中的分钟索引
    showTimePicker: false, // 控制时间选择器显示
    hoursArray: [], // 小时数组
    minutesArray: [] // 分钟数组
  },

  onLoad: function (options) {
    // 页面加载时的逻辑
    // 初始化小时和分钟数组
    this.initTimeArrays();
    // 启动时间更新定时器
    this.updateTime();
    this.startClock();
  },

  // 初始化时间数组
  initTimeArrays: function () {
    // 初始化小时数组(0-23)
    let hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }

    // 初始化分钟数组(0-59)
    let minutes = [];
    for (let i = 0; i < 60; i++) {
      minutes.push(i);
    }

    this.setData({
      hoursArray: hours,
      minutesArray: minutes
    });
  },

  // 更新时间显示
  updateTime: function () {
    const now = new Date();
    this.setData({
      currentTime: now,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      selectedHourIndex: now.getHours(),
      selectedMinuteIndex: now.getMinutes()
    });
  },

  // 启动时钟
  startClock: function () {
    setInterval(() => {
      // 更新时间显示
      this.updateTime();
    }, 1000);
  },

  // 切换时间选择器显示
  toggleTimePicker: function () {
    this.setData({
      showTimePicker: !this.data.showTimePicker
    });
  },

  // 时间选择器变化事件
  onTimeChange: function (e) {
    const value = e.detail.value;
    const selectedHour = value[0];
    const selectedMinute = value[1];

    this.setData({
      hours: selectedHour,
      minutes: selectedMinute,
      selectedHourIndex: selectedHour,
      selectedMinuteIndex: selectedMinute
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