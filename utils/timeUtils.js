// utils/timeUtils.js
// 时间处理工具函数

/**
 * 获取当前时间 HH:mm:ss 格式
 */
function getCurrentTime() {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');    // 已经是本地时间
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${hour}:${minute}:${second}`;
}

/**
 * 获取当前日期 YYYY-MM-DD 格式
 */
function getCurrentDate() {
  const now = new Date();
  // 获取本地时间的各个部分
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = {
  getCurrentTime,
  getCurrentDate
};