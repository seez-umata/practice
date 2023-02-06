// 参照ファイルを定義
const sampleFileUrl = "./json/sample.json",
  birthdayFileUrl = "./json/niji_birth.json",
  colorFileUrl = "./json/niji_color.json";

// fetch API 用設定
const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    mode: "cors",
    cache: "no-cache"
  }
};

// STEP 2
async function sampleFetch() {
  const response = await fetch(sampleFileUrl, options);
  const json = await response.json();
  console.log(json);
}
sampleFetch();

// STEP 3, 4
// 出力用テンプレート
let template = (name, birthday, color) => `
  <li>
    <img src="https://cdn.wikiwiki.jp/to/w/nijisanji/${name}/::ref/face.png" width="20" height="20"><span style="color:${color}">${name}</span>の誕生日は${birthday}です
  </li>
`;

async function singleFetch(fileUrl) {
  const response = await fetch(fileUrl, options);
  return response.json();
}

async function parallelFetch(target) {
  await Promise.all([
    (async () => await singleFetch(birthdayFileUrl))(),
    (async () => await singleFetch(colorFileUrl))()
  ]).then((arr) => {
    for (let i = 0; i < arr[0].length; i++) {
      let tmpMergedData = { ...arr[0][i], ...arr[1][i] };
      target.innerHTML += template(
        tmpMergedData.name,
        tmpMergedData.birth,
        tmpMergedData.color
      );
    }
  });
}

// STEP 3
const listGenerator = document.getElementById("listGenerator");
const generatedList = document.getElementById("generatedList");
listGenerator.addEventListener("click", () => {
  listGenerator.setAttribute("disabled", "disabled");
  parallelFetch(generatedList);
});

// STEP 4
const initialList = document.getElementById("initialList");
window.addEventListener("DOMContentLoaded", () => {
  parallelFetch(initialList);
});
