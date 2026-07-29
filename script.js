const SONGS_FILE = "./songs.txt";
const CARD_COLORS = ["#f172aa", "#6aa9ed", "#9580df", "#ed956f", "#61b9af"];

const state = {
  songs: [],
  query: "",
  scope: "all",
  sort: "default",
};

const elements = {
  grid: document.querySelector("#song-grid"),
  empty: document.querySelector("#empty-state"),
  search: document.querySelector("#search-input"),
  tabs: [...document.querySelectorAll(".scope-tab")],
  sort: document.querySelector("#sort-select"),
  results: document.querySelector("#results-copy"),
  clear: document.querySelector("#clear-search"),
  emptyClear: document.querySelector("#empty-clear"),
  songCount: document.querySelector("#song-count"),
  artistCount: document.querySelector("#artist-count"),
};

function parseSongs(text) {
  return text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && !line.startsWith("//"))
    .map((line, index) => {
      const match = line.match(/^(.+?)\s*(?:\t|\||—|–|－| - )\s*(.+)$/);

      if (!match) {
        return { title: line, artist: "未标注歌手", originalIndex: index };
      }

      return {
        title: match[1].trim(),
        artist: match[2].trim(),
        originalIndex: index,
      };
    })
    .filter((song) => song.title);
}

function normalize(value) {
  return value.toLocaleLowerCase("zh-CN").replace(/\s+/g, "");
}

function getVisibleSongs() {
  const query = normalize(state.query);

  const filtered = state.songs.filter((song) => {
    if (!query) return true;
    if (state.scope === "title") return normalize(song.title).includes(query);
    if (state.scope === "artist") return normalize(song.artist).includes(query);

    return (
      normalize(song.title).includes(query) ||
      normalize(song.artist).includes(query)
    );
  });

  if (state.sort === "title") {
    return [...filtered].sort((a, b) =>
      a.title.localeCompare(b.title, "zh-CN", { numeric: true }),
    );
  }

  if (state.sort === "artist") {
    return [...filtered].sort(
      (a, b) =>
        a.artist.localeCompare(b.artist, "zh-CN", { numeric: true }) ||
        a.title.localeCompare(b.title, "zh-CN", { numeric: true }),
    );
  }

  return [...filtered].sort((a, b) => a.originalIndex - b.originalIndex);
}

function appendHighlightedText(container, text, query) {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) {
    container.textContent = text;
    return;
  }

  const index = text.toLocaleLowerCase("zh-CN").indexOf(
    cleanedQuery.toLocaleLowerCase("zh-CN"),
  );

  if (index === -1) {
    container.textContent = text;
    return;
  }

  container.append(document.createTextNode(text.slice(0, index)));
  const mark = document.createElement("mark");
  mark.textContent = text.slice(index, index + cleanedQuery.length);
  container.append(mark);
  container.append(document.createTextNode(text.slice(index + cleanedQuery.length)));
}

function createSongCard(song, index) {
  const card = document.createElement("article");
  card.className = "song-card";
  card.dataset.songIndex = song.originalIndex;
  card.style.setProperty("--card-color", CARD_COLORS[index % CARD_COLORS.length]);
  card.style.animationDelay = `${Math.min(index, 12) * 28}ms`;

  const number = document.createElement("span");
  number.className = "song-card__number";
  number.textContent = String(index + 1).padStart(2, "0");

  const icon = document.createElement("span");
  icon.className = "song-card__icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = index % 3 === 0 ? "♫" : index % 3 === 1 ? "♪" : "♬";

  const copy = document.createElement("div");
  copy.className = "song-card__copy";

  const title = document.createElement("h3");
  const artist = document.createElement("p");
  appendHighlightedText(
    title,
    song.title,
    state.scope === "artist" ? "" : state.query,
  );
  appendHighlightedText(
    artist,
    song.artist,
    state.scope === "title" ? "" : state.query,
  );

  copy.append(title, artist);
  card.append(number, icon, copy);
  return card;
}

function renderSongs() {
  const songs = getVisibleSongs();
  elements.grid.replaceChildren(
    ...songs.map((song, index) => createSongCard(song, index)),
  );
  elements.grid.hidden = songs.length === 0;
  elements.grid.setAttribute("aria-busy", "false");
  elements.empty.hidden = songs.length !== 0;
  elements.clear.hidden = !state.query;

  if (state.query) {
    elements.results.innerHTML = `找到 <strong>${songs.length}</strong> 首相关歌曲`;
  } else {
    elements.results.innerHTML = `共收录 <strong>${songs.length}</strong> 首歌曲`;
  }
}

function clearSearch() {
  state.query = "";
  elements.search.value = "";
  renderSongs();
  elements.search.focus();
}

function showLoadError(error) {
  console.error(error);
  elements.grid.hidden = true;
  elements.empty.hidden = false;
  const isLocalFile = window.location.protocol === "file:";

  elements.empty.querySelector("h3").textContent = isLocalFile
    ? "本地预览需要启动网页服务器"
    : "歌单暂时没有加载成功";
  elements.empty.querySelector("p").textContent = isLocalFile
    ? "请不要直接双击 index.html。运行根目录下的 preview.cmd，或部署到 GitHub Pages 后访问。"
    : "请确认 songs.txt 与 index.html 位于同一目录，并检查文件名的大小写。";
  elements.emptyClear.hidden = true;
  elements.results.textContent = isLocalFile
    ? "浏览器不允许 file:// 页面直接读取 songs.txt"
    : "无法读取 songs.txt";
}

async function loadSongs() {
  try {
    const response = await fetch(`${SONGS_FILE}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    state.songs = parseSongs(await response.text());
    if (!state.songs.length) throw new Error("songs.txt 中没有可用歌曲");

    elements.songCount.textContent = state.songs.length;
    elements.artistCount.textContent = new Set(
      state.songs.map((song) => normalize(song.artist)),
    ).size;
    renderSongs();
  } catch (error) {
    showLoadError(error);
  }
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderSongs();
});

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    state.scope = tab.dataset.scope;
    elements.tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    renderSongs();
  });
});

elements.sort.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderSongs();
});

elements.clear.addEventListener("click", clearSearch);
elements.emptyClear.addEventListener("click", clearSearch);

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    elements.search.focus();
  }

  if (event.key === "Escape" && document.activeElement === elements.search) {
    clearSearch();
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
loadSongs();
