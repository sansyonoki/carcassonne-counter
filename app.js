let tiles = [
  { id: "C_full", name: "完全都市（四辺都市）", max: 1, count: 1, img: "img/C_full.png" },
  { id: "C_3sides", name: "都市（3辺）", max: 3, count: 3, img: "img/C_3sides.png" },
  { id: "C_2sides", name: "都市（2辺）", max: 3, count: 3, img: "img/C_2sides.png" },
  { id: "C_1side", name: "都市（1辺）", max: 5, count: 5, img: "img/C_1side.png" },
  { id: "C_flag1", name: "都市＋旗（1辺）", max: 2, count: 2, img: "img/C_flag1.png" },
  { id: "C_small", name: "都市＋草原（小都市）", max: 3, count: 3, img: "img/C_small.png" },
  { id: "C_large", name: "都市＋草原（大都市）", max: 2, count: 2, img: "img/C_large.png" },

  { id: "CR_straight", name: "都市＋直線道路", max: 3, count: 3, img: "img/CR_straight.png" },
  { id: "CR_curve", name: "都市＋曲がり道路", max: 3, count: 3, img: "img/CR_curve.png" },
  { id: "CR_T", name: "都市＋T字路", max: 3, count: 3, img: "img/CR_T.png" },
  { id: "CR_cross", name: "都市＋十字路", max: 1, count: 1, img: "img/CR_cross.png" },

  { id: "C_monastery", name: "都市＋修道院", max: 2, count: 2, img: "img/C_monastery.png" },

  { id: "R_straight", name: "直線道路", max: 8, count: 8, img: "img/R_straight.png" },
  { id: "R_curve", name: "曲がり道路", max: 9, count: 9, img: "img/R_curve.png" },
  { id: "R_T", name: "三叉路（T字路）", max: 4, count: 4, img: "img/R_T.png" },
  { id: "R_cross", name: "四叉路（十字路）", max: 1, count: 1, img: "img/R_cross.png" },

  { id: "M_plain", name: "修道院（草原）", max: 4, count: 4, img: "img/M_plain.png" },
  { id: "M_road", name: "修道院＋道路", max: 2, count: 2, img: "img/M_road.png" },

  { id: "F_plain", name: "草原のみ", max: 4, count: 4, img: "img/F_plain.png" },

  { id: "S_start", name: "スタートタイル", max: 1, count: 1, img: "img/S_start.png" }
];

　const DATA_VERSION = 2;

// LocalStorage 読み込み
const saved = localStorage.getItem("carcassonne_tiles");
if (saved) {
  try {
    const parsed = JSON.parse(saved);

    // version が一致している場合のみ読み込む
    if (parsed.version === DATA_VERSION && Array.isArray(parsed.tiles)) {
      tiles = parsed.tiles;
    } else {
      // 古いデータは破棄
      localStorage.removeItem("carcassonne_tiles");
    }
  } catch (e) {
    console.warn("保存データの読み込みに失敗しました", e);
  }
}

let history = [];

const tilesDiv = document.getElementById("tiles");
const totalCountSpan = document.getElementById("totalCount");
const totalMaxSpan = document.getElementById("totalMax");

function render() {
  tilesDiv.innerHTML = "";

  let totalCount = 0;
  let totalMax = 0;

  tiles.forEach(tile => {
    totalCount += tile.count;
    totalMax += tile.max;

    const div = document.createElement("div");
    div.className = "tile";
    if (tile.count === 0) div.classList.add("disabled");

    div.innerHTML = `
      <img src="${tile.img}" alt="${tile.name}">
      <div class="tile-name">${tile.name}</div>
      <div class="tile-count">${tile.count}</div>
      <div class="tile-max">初期枚数：${tile.max}</div>
    `;

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

function save() {
  localStorage.setItem("carcassonne_tiles", JSON.stringify(tiles));
}

document.getElementById("undo").onclick = () => {
  const last = history.pop();
  if (!last) return;
  const tile = tiles.find(t => t.id === last.id);
  tile.count++;
  save();
  render();
};

document.getElementById("reset").onclick = () => {
  tiles.forEach(t => t.count = t.max);
  history = [];
  save();
  render();
};

render();
