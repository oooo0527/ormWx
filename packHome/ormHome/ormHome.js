Page({
  data: {
    // 页面数据
    showPopup: false,  // 控制弹窗显示
    popupOptions: [],  // 弹窗选项
    popupColor: '',    // 弹窗主题色
    selectedUrl: ''    // 选中的跳转链接
  },

  onLoad: function (options) {
    // 页面加载时执行
  },

  onShow: function () {
    // 页面显示时执行
  },

  // 导航到指定页面 - 修改为弹窗功能
  navigateToPage: function (e) {
    const url = e.currentTarget.dataset.url;
    const colorClass = e.currentTarget.dataset.color || 'red';

    if (url) {
      // 根据点击的菜单项设置弹窗选项和主题色
      let options = [];

      // 根据不同的菜单项设置不同的选项
      if (url.includes('page1')) {
        options = [
          { text: '家庭故事', url: '/packHome/ormHomeDetail/ormHomeDetail?type=family&section=story' },
          { text: '温馨时刻', url: '/packHome/ormHomeDetail/ormHomeDetail?type=family&section=moments' },
          { text: '亲情点滴', url: '/packHome/ormHomeDetail/ormHomeDetail?type=family&section=details' }
        ];
      } else if (url.includes('page2')) {
        options = [
          { text: '真心换真心', auth: 'gina', des: '那个一直爱我得大姐姐', url: '/packHome/ormHomeDetail/ormHomeDetail?type=friendship&section=years' },
          { text: '相爱相杀', auth: 'prigkhing', des: '那个和我同频得搞笑温暖炸妹', url: '/packHome/ormHomeDetail/ormHomeDetail?type=friendship&section=stories' },
          { text: '友谊长存', auth: 'kate', des: '那个超越剧组同事得她', url: '/packHome/ormHomeDetail/ormHomeDetail?type=friendship&section=eternal' }
        ];
      } else if (url.includes('page3')) {
        options = [
          { text: '媒体报道', url: '/packHome/ormHomeDetail/ormHomeDetail?type=media&section=reports' },
          { text: '专访记录', url: '/packHome/ormHomeDetail/ormHomeDetail?type=media&section=interviews' },
          { text: '形象展示', url: '/packHome/ormHomeDetail/ormHomeDetail?type=media&section=showcase' }
        ];
      } else if (url.includes('page4')) {
        options = [
          { text: '粉丝互动', url: '/packHome/ormHomeDetail/ormHomeDetail?type=fans&section=interactions' },
          { text: '应援活动', url: '/packHome/ormHomeDetail/ormHomeDetail?type=fans&section=activities' },
          { text: '感谢信件', url: '/packHome/ormHomeDetail/ormHomeDetail?type=fans&section=letters' }
        ];
      } else if (url.includes('page5')) {
        options = [
          { text: 'bam', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=guide' },
          { text: 'gina', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=basic' },
          { text: '进阶', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=advanced' },
          { text: '进阶', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=advanced' },
          { text: '进阶', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=advanced' },
          { text: '进阶', url: '/packHome/ormHomeDetail/ormHomeDetail?type=beginner&section=advanced' }

        ];
      } else if (url.includes('page6')) {
        options = [
          { text: '价值观', url: '/packHome/ormHomeDetail/ormHomeDetail?type=values&section=beliefs' },
          { text: '人生观', url: '/packHome/ormHomeDetail/ormHomeDetail?type=values&section=life' },
          { text: '世界观', url: '/packHome/ormHomeDetail/ormHomeDetail?type=values&section=world' }
        ];
      } else if (url.includes('page7')) {
        options = [
          { text: '表演技巧', url: '/packHome/ormHomeDetail/ormHomeDetail?type=acting&section=skills' },
          { text: '角色塑造', url: '/packHome/ormHomeDetail/ormHomeDetail?type=acting&section=creation' },
          { text: '舞台表现', url: '/packHome/ormHomeDetail/ormHomeDetail?type=acting&section=performance' }
        ];
      } else if (url.includes('page8')) {
        options = [
          { text: '事业发展', url: '/packHome/ormHomeDetail/ormHomeDetail?type=career&section=development' },
          { text: '成就回顾', url: '/packHome/ormHomeDetail/ormHomeDetail?type=career&section=achievements' },
          { text: '未来规划', url: '/packHome/ormHomeDetail/ormHomeDetail?type=career&section=future' }
        ];
      } else {
        // 默认选项
        options = [
          { text: '详细内容', url: '/packHome/ormHomeDetail/ormHomeDetail' },
          { text: '相关内容', url: '/packHome/ormHomeDetail/ormHomeDetail' },
          { text: '更多信息', url: '/packHome/ormHomeDetail/ormHomeDetail' }
        ];
      }

      // 显示弹窗
      this.setData({
        showPopup: true,
        popupOptions: options,
        popupColor: colorClass
      });
    }
  },

  // 选择弹窗选项并跳转
  selectPopupOption: function (e) {
    const index = e.currentTarget.dataset.index;
    const option = this.data.popupOptions[index];

    if (option && option.url) {
      // 关闭弹窗并跳转
      this.setData({
        showPopup: false
      });

      wx.navigateTo({
        url: option.url
      });
    }
  },

  // 关闭弹窗
  closePopup: function () {
    this.setData({
      showPopup: false
    });
  },

  // 防止事件冒泡
  preventTap: function () {
    // 空函数，用于阻止事件冒泡
  },

  // 菜单触摸开始事件
  onTouchStart: function (e) {
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    console.log('触摸菜单项:', index);

    // 暂停动画效果
    const query = wx.createSelectorQuery();
    query.select('.menu-item').boundingClientRect();
    query.exec((res) => {
      console.log('暂停菜单动画');
    });
  },

  // 菜单触摸结束事件
  onTouchEnd: function (e) {
    const dataset = e.currentTarget.dataset;
    const index = dataset.index;
    console.log('释放菜单项:', index);

    // 恢复动画效果
    setTimeout(() => {
      console.log('恢复菜单动画');
    }, 300);
  }
});