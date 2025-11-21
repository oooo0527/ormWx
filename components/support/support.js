// components/support/support.js
Component({
  properties: {

  },

  data: {
    supportList: [],
    yearGroups: [] // 按年份分组的数据
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.loadSupportList();
    }
  },

  methods: {
    // 加载应援列表
    loadSupportList: function () {
      // 从云函数获取数据
      wx.cloud.callFunction({
        name: 'fanVoice',
        data: {
          action: 'getSupportImages'
        }
      }).then(res => {
        if (res.result.success) {
          const supportList = res.result.data;
          // 按年份分组
          const yearGroups = this.groupByYear(supportList);

          this.setData({
            supportList: supportList,
            yearGroups: yearGroups
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      }).catch(err => {
        console.error('获取应援列表失败', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      });
    },

    // 按年份分组
    groupByYear: function (list) {
      const groups = {};

      // 按年份分组
      list.forEach(item => {
        // 从tiime字段提取年份（假设格式为YYYYMM）
        const year = item.tiime ? item.tiime.substring(0, 4) : '未知';

        if (!groups[year]) {
          groups[year] = [];
        }
        groups[year].push(item);
      });

      // 转换为数组格式并按年份倒序排列
      const yearGroups = Object.keys(groups).map(year => ({
        year: year,
        list: groups[year],
        expanded: true // 默认展开
      })).sort((a, b) => b.year - a.year);

      return yearGroups;
    },

    // 切换年份展开/折叠状态
    toggleYear: function (e) {
      const year = e.currentTarget.dataset.year;
      const yearGroups = this.data.yearGroups.map(group => {
        if (group.year === year) {
          return {
            ...group,
            expanded: !group.expanded
          };
        }
        return group;
      });

      this.setData({
        yearGroups: yearGroups
      });
    },

    // 跳转到详情页
    goToDetail: function (e) {
      const id = e.currentTarget.dataset.id;

      // 在当前组件的数据中查找对应的详情数据
      let detailData = null;
      for (let group of this.data.yearGroups) {
        for (let item of group.list) {
          if (item.id === id) {
            detailData = item;
            break;
          }
        }
        if (detailData) break;
      }

      // 跳转到详情页并传递数据
      wx.navigateTo({
        url: '/pages/support-detail/detail?id=' + id,
        success: function (res) {
          // 通过事件通道传递单条数据
          res.eventChannel.emit('acceptDataFromOpenerPage', detailData);
        }
      });
    },
  }
})