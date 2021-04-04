const slack_app_token =
""


function postDM() {
  const message = "あ";
  //【処理1】DMを開き、チャンネルIDを取得する
  const member_id = ; //メンバーIDを指定
  const channel_id = getChannelID_(member_id);

  //【処理2】指定の[チャンネルID]にDMを送信する
  const message_options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      token: slack_app_token,
      channel: channel_id,
      text: message,
    },
  };

  const message_url = "https://slack.com/api/chat.postMessage";
  UrlFetchApp.fetch(message_url, message_options);
}

/**
 * メンバーIDを受け取りチャンネルIDを返す
 *
 * @param {string} メンバーID
 * @return {string} チャンネルID
 */


function getChannelID_(member_id) {
  const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    payload: {
      token: slack_app_token,
      users: member_id,
    },
  };

  //必要scope = im:write
  const url = "https://slack.com/api/conversations.open";
  const response = UrlFetchApp.fetch(url, options);
  const obj = JSON.parse(response);
  console.log(obj);

  return obj.channel.id;
}

function doPost(e) {
    var REQUEST_TYPE_URL_VERIFICATION = 'url_verification'
    var REQUEST_TYPE_EVENT_CALLBACK = 'event_callback'
  ​
    var request = normalizeRequest_(e)
    var requestType = request.type
    //  report(request)
    if (requestType === REQUEST_TYPE_URL_VERIFICATION) {
      var challenge = request.challenge
      return createTextOutput_(challenge)
    } else if (requestType === REQUEST_TYPE_EVENT_CALLBACK && isValidEvent(request.event)) {
      var event = request.event;
      var emojis = getEmojiList();
      var blackList = getBlackList();
      emojis = Object.keys(emojis);
      emojis = [...defaultEmojis, ...emojis].filter(x => !blackList.includes(x))
      while (Math.random() < 0.4) {
        addReaction(event, emojis[Math.floor(Math.random() * emojis.length)])
      }
    }
}



