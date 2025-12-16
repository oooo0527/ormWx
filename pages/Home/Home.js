Page({
  data: {
    selectedStar: null,
    nameList: ['ORM', 'KORN', 'NAPAT'],
    // 菜单信息
    menuList: [
      {
        name: '时间线',
        url: '/packHome/growthTimeline/growthTimeline',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/时.jpg'
      },
      {
        name: '妈粉',
        url: '/packHome/mami/mami',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/妈.jpg'
      },
      {
        name: '梦女',
        url: '/packHome/dream/dream',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/梦.jpg'
      }, {
        name: '人缘',
        url: '/packHome/ormHome/ormHome',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/缘.jpg'
      }, {
        name: 'behind',
        url: '/packHome/behind/behind',
        icon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/后.jpg'
      }
    ],
    contentList: [{
      name: '足',
      url: '/packHome/footPrints/footPrints',
      image: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpg"
    },
    {
      name: '语',
      url: '/packHome/rambling/rambling',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpgg'
    }, {
      name: '高',
      url: '/packHome/highEmotion/highEmotion',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpg'
    },
    {
      name: 'gu',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/人缘1.jpgg'
    }],
    musicList: [{
      title: "上班必听",
      des: '你想象不到的音乐天才',
      url: '/packHome/musicPlayer/musicPlayer',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/8a4a2aff10012ed22625321f6898bb84.jpg'
    }, {
      name: '争气',
      title: "争气",
      des: '从这里开始了解陈奥',
      url: '/packHome/Remarkable/Remarkable',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/925db0f17c54d003a63bdfb90bfdd0c1.jpg'
    },
    {
      title: "NAPAT",
      des: 'NAPAT',
      url: '/packHome/dream/dream',
      image: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/Home/9a58f9ad40d364eb6022ccd8b78cbb82.jpg'
    }],
    // 日历相关数据
    selectedDate: new Date().toISOString().slice(0, 7), // 当前年月
    selectedYear: new Date().getFullYear(),
    selectedMonth: new Date().getMonth() + 1,
    calendarDays: [],
    stars: [], // 星空背景星星
    showEventDetailModal: false, // 活动详情弹窗显示状态
    selectedEvent: {}, // 选中的活动

    // 事件数据将从云函数获取
    events: []
  },
  onLoad: function (options) {
    // 获取用户信息
    const app = getApp();
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: '/pages/index/index'
      });

    }

    // 从云函数获取events数据
    this.loadEventsFromCloud();

    // 初始化日历和星空背景
    this.initStars();
    this.initCalendar();
  },



  onShow: function () {

  },
  //跳转
  navigateToPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  },



  // 关闭公告
  closeAnnouncement: function () {
    this.setData({
      'announcement.show': false
    });
  },

  // 初始化星空背景
  initStars: function () {
    const stars = [];
    // 创建50个随机位置的星星
    for (let i = 0; i < 50; i++) {
      stars.push({
        id: i,
        x: Math.random() * 100, // 百分比位置
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2 // 0.2-1透明度
      });
    }
    this.setData({
      stars: stars
    });
  },

  // 初始化日历
  initCalendar: function () {
    this.generateCalendar(this.data.selectedYear, this.data.selectedMonth);
  },

  // 生成日历数据
  generateCalendar: function (year, month) {
    const today = new Date();
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

    // 获取当月第一天是周几 (0-6, 0表示周日)
    const firstDay = new Date(year, month - 1, 1).getDay();
    // 获取当月总天数
    const daysInMonth = new Date(year, month, 0).getDate();

    // 创建日历数组
    const calendarDays = [];

    // 添加空白日期（上个月）
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({
        day: '',
        date: '',
        isToday: false,
        hasEvent: false,
        isSelected: false,
        event: null
      });
    }

    // 添加当月日期
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const isToday = isCurrentMonth && i === today.getDate();

      // 查找当天是否有活动
      const event = this.getEventOnDate(dateStr);
      const hasEvent = !!event;

      calendarDays.push({
        day: i,
        date: dateStr,
        isToday: isToday,
        hasEvent: hasEvent,
        isSelected: false,
        event: event
      });
    }

    // 只添加足够的空日期以完成最后一周，避免多余的空行
    const daysNeeded = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 0; i < daysNeeded; i++) {
      calendarDays.push({
        day: '',
        date: '',
        isToday: false,
        hasEvent: false,
        isSelected: false,
        event: null
      });
    }

    this.setData({
      calendarDays: calendarDays
    });
  },

  // 获取指定日期的活动
  getEventOnDate: function (date) {
    return this.data.events.find(event => event.date === date) || null;
  },

  // 选择日期
  selectDay: function (e) {
    const selectedDate = e.currentTarget.dataset.date;
    const event = e.currentTarget.dataset.event;
    if (!selectedDate) return;

    // 更新选中状态
    const updatedDays = this.data.calendarDays.map(day => {
      return {
        ...day,
        isSelected: day.date === selectedDate
      };
    });

    this.setData({
      calendarDays: updatedDays
    });

    // 如果当天有活动，显示活动详情弹窗
    if (event) {
      this.setData({
        showEventDetailModal: true,
        selectedEvent: {
          ...event,
          date: selectedDate
        }
      });
    }

    console.log('Selected date:', selectedDate);
  },

  // 日期选择器变化
  bindDateChange: function (e) {
    const selectedDate = e.detail.value; // 格式: YYYY-MM
    const [year, month] = selectedDate.split('-').map(Number);

    this.setData({
      selectedDate: selectedDate,
      selectedYear: year,
      selectedMonth: month
    });

    // 重新生成日历
    this.generateCalendar(year, month);
  },

  // 关闭活动详情弹窗
  closeEventDetailModal: function () {
    this.setData({
      showEventDetailModal: false,
      selectedEvent: {}
    });
  },

  // 从云函数加载events数据
  loadEventsFromCloud: function () {
    wx.cloud.callFunction({
      name: 'events',
      data: {},
      success: res => {
        if (res.result.success) {
          console.log('获取events数据成功:', res.result.data);
          this.setData({
            events: res.result.data
          });
          // 重新生成日历以反映新的events数据
          this.initCalendar();
        } else {
          console.error('获取events数据失败:', res.result.message);
          // 使用默认数据
          this.setDefaultEvents();
        }
      },
      fail: err => {
        console.error('调用云函数失败:', err);
        // 使用默认数据
        this.setDefaultEvents();
      }
    });
  },

  // 设置默认events数据
  setDefaultEvents: function () {
    const defaultEvents = [
      {
        date: '2023-04-05',
        title: '广告拍摄',
        description: '参与某知名品牌广告拍摄，地点在曼谷市中心摄影棚。'
      },
      {
        date: '2023-04-12',
        title: '粉丝见面会',
        description: '在Central World商场举办粉丝见面会，与粉丝互动交流。'
      },
      {
        date: '2023-04-18',
        title: '电视剧开机',
        description: '新电视剧《星辰之恋》正式开机，担任女主角。'
      },
      {
        date: '2023-04-26',
        title: '杂志封面拍摄',
        description: '为知名时尚杂志拍摄封面，造型师将打造全新形象。'
      }
    ];

    this.setData({
      events: defaultEvents
    });

    // 重新生成日历以反映默认events数据
    this.initCalendar();
  }
})