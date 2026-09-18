# 穿越历史 · 3D互动历史馆

一个无需构建工具即可运行的 Three.js 中国历史 3D 互动网页。

## 功能

- 中国古代历史时间轴：夏、商、西周、春秋战国、秦、汉、三国两晋南北朝、隋、唐、宋、元、明、清
- 秦朝 3D 互动示意场景
- 咸阳宫、长城、秦始皇、兵马俑、驰道等可点击对象
- 汉、唐、宋、明、清基础 3D 城市/宫殿场景
- 历史知识卡片
- 历史问答
- 教师课堂模式按钮
- PC / 手机自适应
- GitHub Pages 可直接部署

## 本地运行

直接双击 `index.html` 在部分浏览器中可能受到 ES Module 跨域限制。

推荐使用 VS Code + Live Server，或任何静态 HTTP 服务器。

例如：

```bash
python -m http.server 8000
```

然后打开：

http://localhost:8000

## GitHub Pages

1. 把整个项目上传到 GitHub 仓库。
2. 进入仓库 Settings → Pages。
3. Source 选择 GitHub Actions 或 Deploy from a branch。
4. 如果选择 branch，选择 `main` + `/root`。
5. 保存后等待 GitHub Pages 构建。

## 下一阶段可以继续加入

- 可漫游的秦咸阳城
- 兵马俑阵列近距离探索
- 长城关隘
- 汉长安城
- 唐长安城
- 宋代汴京商业街
- 明北京城 / 紫禁城
- 清代紫禁城
- 历史人物 3D 模型
- 文物 3D 展柜
- 时间旅行过场动画
- 学生账号与闯关积分
- 教师控制台
- 每课知识点与课堂任务
