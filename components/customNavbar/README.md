# 自定义导航栏组件使用说明

## 概述
本组件提供了一个可自定义的导航栏，用于替代微信小程序默认的导航栏。Home页面除外，它继续使用默认导航栏。

## 使用方法

### 1. 在页面JSON配置中引入组件
```json
{
  "navigationStyle": "custom",
  "usingComponents": {
    "custom-navbar": "/components/customNavbar/customNavbar"
  }
}
```

### 2. 在页面WXML中使用组件
```xml
<custom-navbar 
  title="页面标题" 
  backgroundColor="#f48eb5" 
  textColor="#ffffff"
  showBack="{{true}}"
  showHome="{{false}}">
</custom-navbar>
```

### 3. 为页面内容添加顶部边距
由于自定义导航栏是固定定位，需要为页面内容添加顶部边距：
```xml
<view class="container" style="margin-top: 88rpx;">
  <!-- 页面内容 -->
</view>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| title | String | 明星互动平台 | 导航栏标题 |
| backgroundColor | String | #f48eb5 | 导航栏背景色 |
| textColor | String | #ffffff | 标题文字颜色 |
| showBack | Boolean | true | 是否显示返回按钮 |
| showHome | Boolean | true | 是否显示首页按钮 |

## 注意事项

1. Home页面已配置为使用默认导航栏，无需添加自定义导航栏组件
2. 其他所有页面都需要添加自定义导航栏组件
3. 使用自定义导航栏的页面需要在JSON配置中设置 `"navigationStyle": "custom"`
4. 页面内容需要添加 `margin-top: 88rpx` 样式以避免被导航栏遮挡