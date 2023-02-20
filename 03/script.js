const inputArea = document.getElementById("input-name");
const searchButton = document.getElementById("search");
const profileArea = document.getElementById("profile");

// MediaWiki API
let endpoint = "https://ja.wikipedia.org/w/api.php";

// CORSでJSON要求プリフライトがリジェクトされるため、
// headersは記述せず単純なオプションを設定する
const options = {
  method: "GET"
};

const searchWikipedia = async (inputName, option) => {
  const encodedName = encodeURI(inputName);

  const response = endpointSettings => fetch(endpointSettings, option)
    .then(response => {
      return response.json();
    });

  // 該当ページのIDを取得
  endpoint = `${endpoint}?action=query&format=json&origin=*&titles=${encodedName}`;
  let initialResult = await response(endpoint);
  initialResult = initialResult.query.pages;

  const id = Object.keys(initialResult)[0];

  // 名前（タイトル）の取得
  const nameEndpoint = `${endpoint}&prop=info&inprop=displaytitle`;
  let nameResult = await response(nameEndpoint);
  nameResult = nameResult.query.pages;

  const name = nameResult[id].displaytitle;

  // 画像の取得
  const imageEndpoint = `${endpoint}&prop=pageimages&piprop=original`;
  let imageResult = await response(imageEndpoint);
  imageResult = imageResult.query.pages;

  let imageUrl = "";
  if (imageResult[id].original) {
    imageUrl = imageResult[id].original.source;
  } else {
    imageUrl = "http://placehold.jp/0/3d4070/3d4070/180x180.png";
  }

  // 生年月日の取得
  const birthEndpoint = `${endpoint}&prop=revisions&rvprop=content`;
  let birthResult = await response(birthEndpoint);
  birthResult = birthResult.query.pages;

  const content = birthResult[id].revisions[0]["*"];
  let birthday = "";
  content.split("\n").forEach(el => {
    if (el.includes("生誕")) {
      birthday = el.split("生誕")[1];
    } else if (el.includes("生年月日")) {
      birthday = el.split("生年月日")[1];
    }
  });
  birthday = birthday.replace(/[\[\]\= ]/g, "");

  // 本文テキストの取得
  const textEndpoint = `${endpoint}&prop=extracts&explaintext=|`;
  let textResult = await response(textEndpoint);
  textResult = textResult.query.pages;

  const text = textResult[id].extract;

  // 表示エリアをリセットしたうえで取得した内容を表示
  profileArea.innerHTML = "";
  profileArea.innerHTML = `
    <h2>${name}</h2>
    <div>生年月日：${birthday}</div>
    <img src="${imageUrl}" width="180" alt="" />
    <p>${text}</p>
  `;
};

searchButton.addEventListener("click", () => {
  searchWikipedia(inputArea.value, options);
});
