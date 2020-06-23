##SuperMall
仿蘑菇街商城Vue项目
演示地址
http://47.93.151.130:8000/

项目简介
###使用vue框架开发的一个手机端商城项目demo，拥有首页，分类，商品详情，购物车，个人五个页面。

###主要实现功能
 导航栏吸顶效果
 高亮显示选中导航
 根据导航动态展示不同商品
 添加商品到购物车
 监听跳转顶部按钮
 懒加载
 无限下拉方案
 登录注册
 支付
 其他


##项目部署
克隆本项目代码：
git clone https://github.com/liyuhang01/supermall.git
安装项目依赖
npm install
修改src/network/request.js 文件中的数据接口baseURL
  const instance = axios.create({
    baseURL: "修改为你的数据接口",
    timeout: 5000
  })
###本地预览
npm run serve
###打包文件
npm run build


##致谢：
coderwhy提供项目。
