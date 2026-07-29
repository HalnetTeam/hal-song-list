# Haru Song List

一个面向虚拟主播的精美静态歌单展示页。网站从根目录中的 `songs.txt`
读取歌曲，无需数据库、后端服务、第三方框架或构建流程，可直接部署到
GitHub Pages。

> 这是歌单展示与检索页面，不包含点歌、播放或用户提交功能。

启用 GitHub Pages 后，站点地址为：
[halnetteam.github.io/hal-song-list](https://halnetteam.github.io/hal-song-list/)

## 功能

- 从纯文本文件自动读取并展示歌曲
- 按歌名、歌手或全部字段实时检索
- 支持按歌名、歌手和录入顺序排列
- 自动统计歌曲和歌手数量
- 适配桌面端、平板和手机
- 包含加载状态、空结果和读取错误提示
- 粉、白、蓝主题，带有轻量动画和唱片装饰
- 无依赖、无构建，推送后即可部署

## 项目结构

```text
hal-song-list/
├─ index.html       # 页面结构与展示文案
├─ style.css        # 主题、布局、动画和响应式样式
├─ script.js        # 歌单读取、解析、搜索和排序
├─ songs.txt        # 歌单数据
├─ preview.py       # 自动选择端口的本地预览服务器
├─ preview.cmd      # Windows 一键预览入口
├─ .nojekyll        # 告诉 GitHub Pages 跳过 Jekyll 处理
├─ .gitignore
├─ LICENSE
└─ README.md
```

## 编辑歌单

使用 UTF-8 编码编辑根目录下的 `songs.txt`，每行填写一首歌曲：

```text
歌名 - 歌手名
アイドル - YOASOBI
告白气球 - 周杰伦
```

支持以下分隔符：

- 半角连字符：`歌名 - 歌手`
- 全角或长连字符：`歌名 — 歌手`、`歌名 – 歌手`
- 竖线：`歌名 | 歌手`
- Tab 制表符

其他规则：

- 空行会被自动忽略。
- 以 `#` 或 `//` 开头的行会被视为注释。
- 没有识别到分隔符时，整行会作为歌名，歌手显示为“未标注歌手”。
- 歌曲的默认展示顺序与 `songs.txt` 中的顺序一致。

修改完成后提交并推送即可，不需要修改 HTML 或 JavaScript。页面读取
`songs.txt` 时会附加时间参数，以避免旧歌单被浏览器缓存。

## 本地预览

浏览器不允许通过 `file://` 页面直接读取旁边的 `songs.txt`，因此不能直接
双击 `index.html` 预览。

### Windows

双击 `preview.cmd`。脚本会：

1. 自动选择一个可用的本地端口；
2. 在项目目录启动静态服务器；
3. 自动使用默认浏览器打开页面。

预览期间请保持命令窗口开启。按 `Ctrl+C` 或关闭窗口即可停止服务器。

### 其他系统

安装 Python 3 后，在仓库目录运行：

```bash
python3 preview.py
```

终端会显示本地访问地址，并尝试自动打开浏览器。

## 部署到 GitHub Pages

1. 将代码推送到仓库的 `main` 分支。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 下，将 Source 设为
   **Deploy from a branch**。
4. Branch 选择 `main`，目录选择 `/ (root)`。
5. 点击 **Save**，等待 GitHub Pages 完成第一次部署。

之后每次向 `main` 推送歌单或页面修改，GitHub Pages 都会自动更新。

如果部署后无法读取歌单，请确认：

- 文件名严格为小写 `songs.txt`；
- `songs.txt` 与 `index.html` 位于同一级目录；
- Pages 使用的是 `main` 分支和 `/ (root)` 目录；
- 仓库 Actions 页面中的 Pages 部署任务已成功完成。

## 个性化

- 修改名称、标题、介绍和页脚：编辑 `index.html`
- 修改配色、字体、卡片和动画：编辑 `style.css`
- 修改读取、搜索或排序行为：编辑 `script.js`
- 更新歌曲：只编辑 `songs.txt`

页面使用相对路径引用资源，因此既支持个人主页仓库，也支持
`/hal-song-list/` 这样的项目主页路径。

## 技术说明

项目仅使用 HTML、CSS 和原生 JavaScript。在线字体加载失败时会自动回退到
系统字体，不影响歌单读取和搜索。为获得完整的视觉效果，建议使用近期版本的
Chrome、Edge、Firefox 或 Safari。

## License

本项目采用 [MIT License](./LICENSE)。
