const properties = PropertiesService.getScriptProperties();
const slack_app_token = properties.getProperty("SLACKAPPTOKEN") as string;

// function postDM() {
//   const message = "あ";
//   //【処理1】DMを開き、チャンネルIDを取得する
//   const member_id = ; //メンバーIDを指定
//   const channel_id = getChannelID_(member_id);

//   //【処理2】指定の[チャンネルID]にDMを送信する
//   const message_options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
//     method: "post",
//     contentType: "application/x-www-form-urlencoded",
//     payload: {
//       token: slack_app_token,
//       channel: channel_id,
//       text: message,
//     },
//   };

//   const message_url = "https://slack.com/api/chat.postMessage";
//   UrlFetchApp.fetch(message_url, message_options);
// }

// /**
//  * メンバーIDを受け取りチャンネルIDを返す
//  *
//  * @param {string} メンバーID
//  * @return {string} チャンネルID
//  */

// function getChannelID_(member_id) {
//   const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
//     method: "post",
//     contentType: "application/x-www-form-urlencoded",
//     payload: {
//       token: slack_app_token,
//       users: member_id,
//     },
//   };

//   //必要scope = im:write
//   const url = "https://slack.com/api/conversations.open";
//   const response = UrlFetchApp.fetch(url, options);
//   const obj = JSON.parse(response);
//   console.log(obj);

//   return obj.channel.id;
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

    let param: GoogleAppsScript.Mail.MailAdvancedParameters;
    param.to = "yukikaze.0511@gmail.com";
    param.body = user;

    MailApp.sendEmail(param);
  }
}
