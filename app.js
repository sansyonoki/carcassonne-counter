// タイルの初期データ（例：3種類）
let tiles = [
  { id: "A", name: "都市＋道", max: 3, count: 3 },
  { id: "B", name: "草原＋道", max: 5, count: 5 },
  { id: "C", name: "修道院", max: 2, count: 2 }
];

// LocalStorageから読み込み
const saved = localStorage.getItem("carcassonne");
if (saved) tiles = JSON.parse(saved);

// 直前の操作を保存（Undo用）
let history = [];

// タイルを表示
const tilesDiv = document.getElementById("tiles");
function render() {
  tilesDiv.innerHTML = "";
  tiles.forEach(tile => {
    const div = document.createElement("div");
    div.className = "tile";
    div.innerHTML = `
      <div>${tile.name}</div>
      <div class="count">${tile.count}</div>
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
}

// 保存
function save() {
  localStorage.setItem("carcassonne", JSON.stringify(tiles));
}

// Undo
document.getElementById("undo").onclick = () => {
  const last = history.pop();
  if (!last) return;
  const tile = tiles.find(t => t.id === last.id);
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

render();
