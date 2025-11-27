Page({
  data: {

  },

  onLoad: function (options) {

  },

  // 测试初始化音乐数据库
  testInitMusicDB: function () {
    wx.cloud.callFunction({
      name: 'initDatabase',
      data: {
        action: 'initMusicCollection'
      }
    }).then(res => {
      console.log('初始化音乐数据库结果:', res);
      if (res.result.success) {
        wx.showToast({
          title: '音乐数据库初始化成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '初始化失败: ' + res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  },

  // 测试获取音乐列表
  testGetMusicList: function () {
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getMusicList'
      }
    }).then(res => {
      console.log('获取音乐列表结果:', res);
      if (res.result.success) {
        wx.showToast({
          title: '获取音乐列表成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '获取失败: ' + res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  }
})