

Page({
  data: {
    currentSlide: 0,
    selectedWork: null,
    // 自定义loading相关数据
    showCustomLoading: false,

    works: [], // 将原来硬编码的数据移除，改为从云端获取

    // 只显示前3张卡片
    displayWorks: [],

    // 3D效果相关数据
    cardTransforms: [],
    cardZIndexes: [],
    cardOpacities: [],

    // 动画状态
    isAnimating: false,

    // 触摸相关数据
    touchStartX: 0,
    touchEndX: 0,
    isSwiping: false,
    swipeDirection: 0, // -1: 左滑, 1: 右滑
    pageSize: 20,             // 每页数据条数
    currentPage: 0,           // 当前页码（从0开始方便计算skip）
    hasMore: true,            // 是否还有更多数据
    loadMore: false,          // "正在加载"状态
    loadAll: false,        // "已加载全部"状态

    // 热门互动留言
    hotInteractions: [],
    searchList: [],
    searchValue: '',
    searchFlag: false,
    isFixed: false,
    date: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    showShawBg: true

  },
  // 显示自定义loading
  showCustomLoading: function () {

    this.setData({
      showCustomLoading: true,

    });
  },

  // 隐藏自定义loading
  hideCustomLoading: function () {
    this.setData({
      showCustomLoading: false
    });
  },

  getDateString: function (dateValue) {
    // 如果 dateValue 是对象且包含 createdAt 属性，则使用该时间戳
    if (dateValue && typeof dateValue === 'object' && dateValue.createdAt) {
      const date = new Date(dateValue.createdAt);
      return date.getTime(); // 返回时间戳
    }
    // 如果 dateValue 是时间戳数字
    else if (typeof dateValue === 'number') {
      const date = new Date(dateValue);
      return date.getTime(); // 返回时间戳
    }
    // 如果 dateValue 是日期字符串（如 "2025-01-14"），则转换为当天的23:59:59时间戳
    else if (typeof dateValue === 'string') {
      // 尝试解析日期字符串
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) { // 检查是否为有效日期
        // 设置为当天的23:59:59
        date.setHours(23, 59, 59, 999);
        return date.getTime();
      } else {
        // 如果不是有效的日期字符串，按原方式处理
        const fallbackDate = new Date(dateValue);
        return fallbackDate.getTime();
      }
    }
    // 默认返回当前时间戳
    else {
      return new Date().getTime();
    }
  },

  formatDateTime: function (timestamp) {
    // 如果时间戳不存在，返回空字符串
    if (!timestamp) {
      return '';
    }

    // 如果是时间戳数字，创建日期对象
    const date = new Date(timestamp);

    // 格式化为年月日时分秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  onLoad: function () {

    this.setData({
      works: [],
      displayWorks: [],
      hotInteractions: [],
      searchList: [],
      searchValue: '',
      searchFlag: false,
      currentPage: 0,
      hasMore: true,
      loadAll: false,
      pageSize: 20,

    });
    this.loadInteractions();
    this.loadHotInteractions();

  },
  hideShawBg: function () {
    this.setData({
      showShawBg: false
    });
  },
  onScroll: function (e) {
    const scrollTop = e && e.detail ? e.detail.scrollTop : 0; // 获取滚动距离，scroll-view需要通过detail获取
    console.log('Scroll Top:', scrollTop, e);

    // 判断是否需要吸顶：滚动距离 > 10px
    if (scrollTop > 10) {
      if (!this.data.isFixed) {
        this.setData({ isFixed: true });
      }
    } else {
      if (this.data.isFixed) {
        this.setData({ isFixed: false });
      }
    }
  },
  bindDateChange: function (e) {
    this.showCustomLoading();
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      hotInteractions: [],
      currentPage: 0,
      hasMore: true,
      loadAll: false,
      pageSize: 20,

    })
    // 加载热门互动留言数据
    this.loadHotInteractions();
  },
  onShow: function () {
  },

  // 加载互动留言数据
  loadInteractions: function () {
    // this.showCustomLoading();
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: 10, // 限制获取10条数据
        checked: '2'
      },
      success: res => {
        console.log('获取互动留言成功：', res.result.data);
        if (res.result && res.result.success && res.result.data.length > 0) {

          this.setData({
            displayWorks: res.result.data,
            works: res.result.data
          },);
        } else {
          console.error('获取互动留言失败：', res.result.message);

        }
      },
      fail: err => {
        console.error('调用云函数失败：', err);


      }

    });
    // this.hideCustomLoading();
  },

  // 加载热门互动留言数据
  loadHotInteractions: function () {
    // this.showCustomLoading();
    const { currentPage, pageSize, hotInteractions } = this.data;
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: pageSize, // 限制获取10条数据
        status: '1',
        skip: currentPage * pageSize,
        createdAt: this.getDateString(this.data.date),
      },
      success: res => {
        console.log('获取热门互动留言成功：', currentPage, pageSize, res.result.data);
        if (res.result && res.result.success && res.result.data.length > 0) {
          // 处理热门互动留言数据

          // 判断是否还有更多数据
          if (res.result.data.length < this.data.pageSize) {
            this.setData({
              hasMore: false,
              loadAll: true,    // 全部加载完毕
              loadMore: false
            });
          } else {
            this.setData({
              hasMore: true,
              loadMore: false
            });
          }
          const hotInteractions2 = [...res.result.data]
          if (currentPage === 0) {
            this.setData({
              hotInteractions: hotInteractions2
            });
          } else {
            this.setData({
              hotInteractions: this.data.hotInteractions.concat(hotInteractions2)
            });
          }

          console.log('Updated hotInteractions:', this.data.hotInteractions);
        } else {
          console.error('获取热门互动留言失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('调用获取热门互动留言云函数失败：', err);
      }
    });
    this.hideCustomLoading();
  },
  // 选择卡片
  selectCard: function (e) {

    const index = e.currentTarget.dataset.index;


    // 将显示的卡片索引转换为实际的作品索引
    const displayWorks = this.data.displayWorks;
    const works = this.data.works;

    // 找到对应的实际索引
    const actualIndex = works.findIndex(work => work.id === displayWorks[index].id);

    this.setData({
      currentSlide: actualIndex
    });
    this.showWorkDetail();

  },

  //fenye 
  onReachBottom: function () {
    // 如果还有更多数据且不在加载中，则加载下一页
    if (this.data.hasMore && !this.data.loadMore) {
      this.setData({
        loadMore: true
      });
      this.data.currentPage++; // 页码增加[citation:5]
      this.loadHotInteractions();
    }
  },


  //跳转热门留言
  showHistories: function () {
    wx.navigateTo({
      url: '/packageA/hot/hot',
    });
  },

  // 显示作品详情
  showWorkDetail: function () {
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.works[this.data.currentSlide],
        });
      }
    });
  },

  selectHotInteraction: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.hotInteractions[index],
        });
      }
    });
  },
  selectSearchResult: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/interactionDetail/interactionDetail',
      success: (res) => {
        // 通过事件通道向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          works: this.data.searchList[index],
        });
      }
    });
  },



  // 轮播图切换事件
  onSwiperChange: function (e) {
    const current = e.detail.current;
    this.setData({
      currentSlide: current,
      selectedWork: this.data.works[current]
    });
  },

  // 轮播图图片点击事件
  onSwiperImageTap: function (e) {
    // 可以在这里添加点击图片的处理逻辑
    console.log("点击了轮播图图片");
  },
  onConfirm: function (e) {
    this.setData({
      searchFlag: true
    });

    console.log("点击了确定按钮");

    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getList',
        limit: 20, // 限制获取10条数据
        status: '1',
        searchValue: this.data.searchValue || ""

      },
      success: res => {
        if (res.result && res.result.success && res.result.data.length > 0) {
          const searchList = res.result.data.slice(0, 10).map(item => {
            return {
              id: item._id,
              title: item.title,
              content: item.content,
              updateTime: item.updateTime || '',
              commentsCount: (item.comments || []).length,
              createdAt: this.formatDateTime(item.createdAt) || '',
            }
          });


          this.setData({
            searchList: searchList
          });
        } else {
          console.error('搜索互动留言失败：', res.result.message);
        }
      },
      fail: err => {
        console.error('调用搜索互动留言云函数失败：', err);
      }
    });
  },
  onInput: function (e) {
    console.log("输入框内容:", e.detail.value);
    this.setData({
      searchValue: e.detail.value
    });

  },



  // 下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      works: [],
      displayWorks: [],
      hotInteractions: [],
      searchList: [],
      searchValue: '',
      searchFlag: false,
      currentPage: 0,
      hasMore: true,
      loadAll: false,
      pageSize: 20,


    });
    this.loadInteractions();
    this.loadHotInteractions();
    // wx.stopPullDownRefresh();
  }
});
