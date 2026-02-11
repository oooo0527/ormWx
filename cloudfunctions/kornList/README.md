# KornList 云函数数据库结构说明

## 数据库集合设计

### 1. KornList 集合（剧集列表）
存储电视剧的基本信息和剧集列表

```javascript
{
  "_id": "剧集唯一标识",
  "dramaId": 1,                    // 剧集ID
  "title": "《绘梦婚礼》",          // 剧集标题
  "heroineName": "Neen",           // 女主角姓名
  "coverImage": "/assets/cover.jpg", // 封面图片路径
  "description": "改编自同名畅销小说的影集", // 剧情简介
  "totalEpisodes": 12,             // 总集数
  "status": "拍摄中",              // 播放状态
  "releaseDate": "2026年5月27日",   // 首播日期
  "genre": ["爱情", "剧情"],        // 类型标签
  "episodes": [                    // 剧集列表
    {
      "id": "episode_id_1",
      "episodeNumber": 1,
      "title": "初遇",
      "publishDate": "2026-05-27",
      "thumbnail": "/assets/thumb1.jpg",
      "description": "剧情简介"
    }
    // ... 更多剧集
  ]
}
```

### 2. kornListPage 集合（剧集详情）
存储每个剧集的详细内容

```javascript
{
  "_id": "episode_id_1",           // 与KornList中episodes.id对应
  "episodeNumber": 1,              // 集数
  "title": "初遇",                 // 剧集标题
  "contentBlocks": [               // 内容块数组
    {
      "type": "text",              // 内容类型：text/image/dialogue/thought
      "content": "剧情正文内容..."
    },
    {
      "type": "image",
      "src": "/assets/story_img1.jpg",
      "caption": "图片说明"
    },
    {
      "type": "dialogue",
      "dialogues": [
        {
          "speaker": "角色名",
          "text": "对话内容"
        }
      ]
    },
    {
      "type": "thought",
      "content": "内心独白内容"
    }
  ],
  "mood": "紧张又期待",            // 心情状态
  "moodEmoji": "😊",               // 心情表情
  "emotions": ["紧张", "好奇", "期待"], // 情感标签
  "publishDate": "2026-05-27"      // 发布日期
}
```

## 云函数接口说明

### 1. getEpisodes - 获取剧集列表
**请求参数：**
```javascript
{
  "action": "getEpisodes",
  "dramaId": 1  // 可选，默认为1
}
```

**返回数据：**
```javascript
{
  "success": true,
  "data": {
    "currentDrama": { /* 电视剧基本信息 */ },
    "episodes": [ /* 剧集列表 */ ]
  }
}
```

### 2. getEpisodeDetail - 获取剧集详情
**请求参数：**
```javascript
{
  "action": "getEpisodeDetail",
  "episodeId": "episode_id_1"
}
```

**返回数据：**
```javascript
{
  "success": true,
  "data": { /* 完整的剧集详情数据 */ }
}
```

### 3. getAllDramas - 获取所有电视剧
**请求参数：**
```javascript
{
  "action": "getAllDramas"
}
```

**返回数据：**
```javascript
{
  "success": true,
  "data": [ /* 电视剧列表摘要 */ ]
}
```

## 页面数据传递流程

1. **kornList页面** → 调用`getEpisodes`获取剧集列表
2. **用户点击剧集** → 调用`getEpisodeDetail`获取详细数据
3. **跳转到kornnaphat** → 通过URL参数传递完整剧集数据
4. **kornnaphat页面** → 解析接收的数据并渲染页面

## 使用示例

### 在kornList页面调用：
```javascript
// 获取剧集列表
const result = await wx.cloud.callFunction({
  name: 'kornList',
  data: {
    action: 'getEpisodes',
    dramaId: 1
  }
});

// 获取剧集详情
const detailResult = await wx.cloud.callFunction({
  name: 'kornList',
  data: {
    action: 'getEpisodeDetail',
    episodeId: 'episode_id_1'
  }
});
```

### 数据传递到kornnaphat：
```javascript
wx.navigateTo({
  url: `/packageA/kornnaphat/kornnaphat?episodeData=${encodeURIComponent(JSON.stringify(episodeData))}`
});
```