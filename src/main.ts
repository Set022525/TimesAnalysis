const properties = PropertiesService.getScriptProperties();
const slack_app_token = properties.getProperty("SLACKAPPTOKEN") as string;
let user;


var ss = SpreadsheetApp.getActiveSpreadsheet();
var sh = ss.getActiveSheet();

function getSlack() {

  // チャンネルリストを取得
  var token = "取得したトークン";
  var url = "https://slack.com/api/channels.list?token="+token+"";
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);


  console.log(response,json,data)
// 対象となるチャンネル名から対応するチャンネルIDを探し出す
//   var channel_name = sh.getRange(1,2).getValue();
//   for (var i=0; i<data.channels.length; i++) {
//     if (data.channels[i].name == channel_name) {
//       var channel_id = data.channels[i].id;
//       break;
//     }
//   }

//   // 取得したチャンネルIDをもとにチャンネル内のすべてのメッセージを取得
//   var url = "https://slack.com/api/channels.history?token="+token+"&channel="+channel_id+"";
//   var response = UrlFetchApp.fetch(url);
//   var json = response.getContentText();
//   var data = JSON.parse(json);

//   // スプレッドシートに取り込む

//   // 最終行取得
//   var lr = sh.getLastRow();
//   // 初期化
//   if (lr > 2) sh.getRange(3,1,lr-2,sh.getLastColumn()).clear();
//   // 出てきそうな項目名を予め列挙しておく(この辺は必要に応じて加減すればよいでしょう）
//   var item = [
//     "file",
//     "text",
//     "type",
//     "user",
//     "ts"
//   ];
//   // 2次元配列化
//   var ary = [];
//   var ary2 = [];
//   for (var i=0; i<data.messages.length; i++) {
//     for (var j=0; j<item.length; j++) {
//       ary.push(data.messages[i][item[j]]);
//       // もしundefinedなら空欄に直す
//       if (!ary[j]) {
//         ary[j] = "";
//       }
//     }
//     ary2.push(ary);
//     ary = [];
//   }
//   // スプレッドシートに転記
//   sh.getRange(3,1,ary2.length,item.length).setValues(ary2);
}








// let ss = SpreadsheetApp.getActiveSpreadsheet();
// let sh = ss.getActiveSheet();

// function getChannelHistory() {

//   var token = slack_app_token;
//   var url = "https://slack.com/api/conversations.history="+token+"";
//   var response = UrlFetchApp.fetch(url);
//   var json = response.getContentText();
//   var data = JSON.parse(json);

//   var channel_name = sh.getRange(1,2).getValue();
//   for (var i=0; i<data.channels.length; i++) {
//     if (data.channels[i].name == channel_name) {
//       var channel_id = data.channels[i].id;
//       break;
//     }
//   }
//   let options = 
//   var url = "https://slack.com/api/channels.history?token="+token+"&channel="+channel_id+"";
//   var response = UrlFetchApp.fetch(url,options);
//   var json = response.getContentText();
//   var data = JSON.parse(json);
//   return data
// }

function normalizeRequest_(e) {
  //  report(e)
  let postData = e.postData;
  let request = postData.contents || postData.getDataAsString();
  return JSON.parse(request);
}

function createTextOutput_(text) {
  return ContentService.createTextOutput(text).setMimeType(
    ContentService.MimeType.TEXT
  );
}

function isValidEvent(event) {
  return !event.hidden;
}

function doPost(e) {
  try {
    let REQUEST_TYPE_URL_VERIFICATION = "url_verification";
    let REQUEST_TYPE_EVENT_CALLBACK = "event_callback";
    let request = normalizeRequest_(e);
    let requestType = request.type;
    //  report(request)
    if (requestType === REQUEST_TYPE_URL_VERIFICATION) {
      let challenge = request.challenge;
      return createTextOutput_(challenge);
    } else if (
      requestType === REQUEST_TYPE_EVENT_CALLBACK &&
      isValidEvent(request.event)
    ) {
      let event = request.event;
      let user = event.user;

      let param: GoogleAppsScript.Mail.MailAdvancedParameters = {
        to: "yukikaze.0511@gmail.com",
        body: user,
        subject: "test",
      };

      MailApp.sendEmail(param);
    }
  } catch (e) {
    report("Error", e?.message);
  }
}

function report(...data: any) {
  let param: GoogleAppsScript.Mail.MailAdvancedParameters = {
    to: "yukikaze.0511@gmail.com",
    body: JSON.stringify(data, null, 2),
    subject: "report",
  };

  MailApp.sendEmail(param);
}

function testReport() {
  console.log(report(1, 2, 3, ["abc"], { def: 4 }));
}

function postDM() {
  
  const message = "あ";
  //【処理1】DMを開き、チャンネルIDを取得する
  const member_id = user; //メンバーIDを指定
  
  //【処理2】指定の[チャンネルID]にDMを送信する
  const message_options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      token: slack_app_token,
      channel: member_id,
      text: message,
    },
  };

  const message_url = "https://slack.com/api/chat.postMessage";
  UrlFetchApp.fetch(message_url, message_options);
}

