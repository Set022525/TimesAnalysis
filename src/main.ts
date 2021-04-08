const properties = PropertiesService.getScriptProperties();
const slack_app_token = properties.getProperty("SLACKAPPTOKEN") as string;
let user;

var ss = SpreadsheetApp.getActiveSpreadsheet();
var sh = ss.getActiveSheet();

function getSlack() {
  // チャンネルリストを取得
  const token = "slack_app_token";
  const get_list_url = "https://slack.com/api/conversations.list?token=" + token + "";
  var response = UrlFetchApp.fetch(get_list_url);
  var json = response.getContentText();
  var data = JSON.parse(json);

  // 対象となるチャンネル名から対応するチャンネルIDを探し出す
    let channel_name = sh.getRange(1,2).getValue();

    for (var i=0; i<data.length; i++) {
      if (data.channels[i].name == channel_name) {
        var channel_id = data.channels[i].id;
        break;
      }
    }

    // 取得したチャンネルIDをもとにチャンネル内のすべてのメッセージを取得
    const get_message_url = "https://slack.com/api/admin.conversations.getConversationPrefs?token="+token+"&channel="+channel_id+"";
    var response = UrlFetchApp.fetch(get_message_url);
    var json = response.getContentText();
    var data = JSON.parse(json);
  return data
}


function normalizeRequest_(e: GoogleAppsScript.Events.DoPost) {
  //  report(e)
  let postData = e.postData;

  let request = postData.contents;
  return JSON.parse(request);
}

function createTextOutput_(text: string) {
  return ContentService.createTextOutput(text).setMimeType(
    ContentService.MimeType.TEXT
  );
}

function isValidEvent(event) {
  return !event.hidden;
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const REQUEST_TYPE_URL_VERIFICATION = "url_verification";
  const REQUEST_TYPE_EVENT_CALLBACK = "event_callback";

  let request = normalizeRequest_(e);
  const requestType = request.type;

  if (requestType === REQUEST_TYPE_URL_VERIFICATION) {
    let challenge = request.challenge;
    return createTextOutput_(challenge);
  } else if (
    requestType === REQUEST_TYPE_EVENT_CALLBACK &&
    isValidEvent(request.event)
  ) {
    let event = request.event;
    let user = event.user as string;
    postDM(user)
    // 
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

function postDM(member_id: string) {
  const message = "あ";
  //【処理1】DMを開き、チャンネルIDを取得する
  // const member_id = user; //メンバーIDを指定

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
