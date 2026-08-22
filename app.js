// カルカソンヌ基本セット用 タイル一覧（代表的な種類）
// ※枚数は調整しやすいようにコメント付きで記載
let tiles = [
  // 都市タイル系
  { id: "C1", name: "都市のみ（小都市）", max: 2, count: 2 },
  { id: "C2", name: "都市のみ（大都市）", max: 1, count: 1 },
  { id: "C3", name: "都市＋草原（1辺都市）", max: 5, count: 5 },
  { id: "C4", name: "都市＋草原（2辺都市）", max: 3, count: 3 },
  { id: "C5", name: "都市＋草原（3辺都市）", max: 2, count: 2 },
  { id: "C6", name: "都市＋草原（4辺都市・中央都市）", max: 1, count: 1 },

  // 都市＋道
  { id: "CR1", name: "都市＋直線道路", max: 4, count: 4 },
  { id: "CR2", name: "都市＋曲がり道路", max: 3, count: 3 },
  { id: "CR3", name: "都市＋T字路", max: 3, count: 3 },

  // 修道院
  { id: "M1", name: "修道院＋草原", max: 4, count: 4 },
  { id: "M2", name: "修道院＋道路", max: 2, count: 2 },

  // 道路のみ
  { id: "R1", name: "直線道路（両端草原）", max: 8, count: 8 },
  { id: "R2", name: "曲がり道路（カーブ）", max: 9, count: 9 },
  { id: "R3", name: "三叉路（T字路）", max: 4, count: 4 },
  { id: "R4", name: "四叉路（十字路）", max: 1, count: 1 },

  // 特殊タイル（スタートタイルなど）
  { id: "S1", name: "スタートタイル（都市＋道路＋草原）", max: 1, count: 1 },

  // 草原のみ（何もないタイル）
  { id: "F1", name: "草原のみ（何もなし）", max: 4, count: 4 }
];

// LocalStorageから読み込み
const saved = localStorage.getItem("carcassonne_tiles");
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    // 保存済みデータの形式が同じなら上書き
    if (Array.isArray(parsed)) {
      tiles = parsed;
    }
  } catch (e) {
    console.warn("保存データの読み込みに失敗しました", e);
  }
}

// Undo用履歴
let history = [];

// DOM取得
const tilesDiv = document.getElementById("tiles");
const totalCountSpan = document.getElementById("totalCount");
const totalMaxSpan = document.getElementById("totalMax");

// 描画
function render() {
  tilesDiv.innerHTML = "";

  let totalCount = 0;
  let totalMax = 0;

  tiles.forEach(tile => {
    totalCount += tile.count;
    totalMax += tile.max;

    const div = document.createElement("div");
    div.className = "tile";
    if (tile.count === 0) {
      div.classList.add("disabled");
    }

    div.innerHTML = `
      <div class="tile-name">${tile.name}</div>
      <div class="tile-count">${tile.count}</div>
      <div class="tile-max">初期枚数：${tile.max}</div>
    `;

    // タップで残数を1減らす
    div.onclick = () => {
      if (tile.count > 0) {
        history.push({ id: tile.id });
        tile.count--;
        save();
        render();
      }
    };

    tilesDiv.appendChild(div);
  });

  totalCountSpan.textContent = totalCount;
  totalMaxSpan.textContent = totalMax;
}

// 保存
function save() {
  localStorage.setItem("carcassonne_tiles", JSON.stringify(tiles));
}

// Undo
document.getElementById("undo").onclick = () => {
  const last = history.pop();
  if (!last) return;
  const tile = tiles.find(t => t.id === last.id);
  if (!tile) return;
  tile.count++;
  save();
  render();
};

// リセット
document.getElementById("reset").onclick = () => {
  tiles.forEach(t => t.count = t.max);
  history = [];
  save();
  render();
};

// 初期描画
render();
