// 测试评论通知功能的脚本
console.log("开始测试评论通知功能...");

// 模拟用户发表评论
const testComment = {
  content: "这是一条测试评论",
  interactionId: "test_interaction_id",
  userInfo: {
    nickname: "测试用户",
    avatar: "/images/default-avatar.png"
  }
};

console.log("模拟发表评论:", testComment);

// 调用云函数添加评论
wx.cloud.callFunction({
  name: 'fanVoice',
  data: {
    action: 'addComment',
    content: testComment.content,
    interactionId: testComment.interactionId,
    userInfo: testComment.userInfo
  },
  success: res => {
    console.log("添加评论成功:", res);

    // 验证评论是否存储到了comments集合
    wx.cloud.callFunction({
      name: 'fanVoice',
      data: {
        action: 'getUserComments',
        skip: 0,
        limit: 10
      },
      success: res => {
        console.log("获取评论通知结果:", res);
        if (res.result && res.result.success && res.result.data.length > 0) {
          console.log("评论通知功能测试成功！");
          console.log("通知内容:", res.result.data[0].notes);
        } else {
          console.log("未能获取到评论通知");
        }
      },
      fail: err => {
        console.error("获取评论通知失败:", err);
      }
    });
  },
  fail: err => {
    console.error("添加评论失败:", err);
  }
});