

function postSlack(text, debug = false) {
    var url = "https://hooks.slack.com/services/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";
    if (debug) {
      url = "https://hooks.slack.com/services/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";
    }
    var options:GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      "method": "post",
      "headers": { "Content-type": "application/json" },
      "payload": '{"text":"' + text + '"}'
    };
   
    UrlFetchApp.fetch(url, options);
  }
  ​
  function getEmojiList() {
    var url = "https://slack.com/api/emoji.list?token=xoxp-322693979316-350576614951-1557164393109-4ae04da9d5a416658ac8263380548810";
    var options = {
      "method": "GET",
      "headers": { "Content-type": "application/x-www-form-urlencoded" },
    }
    var res = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(res.getContentText());
    if (data.ok) {
      return data.emoji
    } else {
      report("Error!: Random Emoji App stopped while requesting emoji list. Response is not OK.", res);
      throw new Error("Error occured at getEmojiList");
    }
  }
  ​
  function addReaction(message, emoji) {
    var url = "https://slack.com/api/reactions.add";
    var botToken = "xoxb-322693979316-1584065361792-tA3qewzO8cAwx3Jc9btKi3T7"
    var options = {
      "method": "POST",
      "headers": {
        "Content-type": "application/json",
        "Authorization": "Bearer " + botToken
      },
      "payload": JSON.stringify({
        name: emoji,
        channel: message.channel,
        timestamp: message.ts
      })
    }
    var res = UrlFetchApp.fetch(url, options);
    var data = JSON.parse(res.getContentText());
    if (data.ok) {
    } else {
      report("Error!: Random Emoji App stopped while adding emoji. Response is not OK. Reason: " + data.error, "data: ", message);
      throw new Error("Error occured at addReaction");
    }
  }
  ​
  function test() {
    //  var emojis = getEmojiList();
    //  emojis = Object.keys(emojis)
    //  //    addReaction(event, emojis[Math.floor(Math.random() * emojis.length)])
    //  var n =0
    //  var v = 0
    //  while(n++<100){v+=Math.random()}
  ​
    //  report(["abc"].includes("abc"))
    //  report("log",{1:"abc",2:"cdf"})
    // Logger.log(getBlackList())
    // report(UrlFetchApp.fetch("http://google.com").getAllHeaders())
    // Logger.log(JSON.stringify({a:1,b:2}, null, "\t"))
  }
  ​
  ​
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
  ​
  function createTextOutput_(text) {
    return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT)
  }
  ​
  function normalizeRequest_(e) {
    //  report(e)
    var postData = e.postData
    var request = postData.contents || postData.getDataAsString()
    return JSON.parse(request)
  }
  ​
  function report(...logObjects) {
  ​
    var logtext = ""
    for (var logObject of logObjects) {
      // if(logObject instanceof Object){
      //   for (var k of Object.entries(logObject)){
      //     logtext += k[0]+":\n\t"+JSON.stringify(k[1])+"\n\n"
      //   }
      // }else{
      //   logtext += logObject + "\n\n"
      // }
  ​
      logtext += JSON.stringify(logObject, null, "\t")
    }
  ​
    MailApp.sendEmail("yukikaze.0511@gmail.com", "Slack Random Emoji Report", logtext)
  }
  ​
  function isValidEvent(event) {
    return event.channel === "CCZ4WS3DK" && !event.hidden;
  }
  ​
  function getBlackList() {
    //  /reacji-channeler list
    var text = `
    You've got the following reacji set up to post to channels:
    :asopasomaso: posts to #times_yuta_tamura
    :カニ: posts to #times_sawaya_kazuma
    :のーみそバクハツ: posts to #_ns_all
    :fastparrot: posts to #パロットの集い
    :ツバル国旗: posts to #times_subaru_kimura
    :go_to_yasufumi: posts to #times_yasufumi_nakata
    :infinitenky: posts to #times_yushi_nakaya
    :jobs: posts to 
    :kanashiminooka: posts to #悲しみの大地
    :kininaruki: posts to #気になる森
    :majibro: posts to 
    :minou: posts to #times_yuki_minoh
    :nya-n: posts to #ねこ天国
    :parrot: posts to #パロットの集い
    :羊: posts to #times_yusuke_takahashi
    :superまじんこ: posts to #私立まじんこ学園高等部
    :tatsuki_ito: posts to #times_tatsuki_ito
    :ultrafastparrot: posts to #パロットの集い
    :yuki: posts to #times_yuki_minoh
    :yushi: posts to #times_yushi_nakaya
    :yusuke_takahashi: posts to #times_yusuke_takahashi
    :_ap_bussinessへ__ビジネス関連: posts to #_ap_business
    :_ap_financeへ__ファイナンス関連: posts to #_ap_finance
    :_cgs_allへ__認知科学_心理学: posts to #_cgs_all
    :_cs_allへ__計算機科学: posts to #_cs_all
    :_cs_iotへ__iot: posts to #_cs_iot
    :_cs_quantymへ__量子アニーリング関連: posts to #_cs_quantum
    :_dev_allへ__開発全般の話題: posts to #_dev_all
    :_dev_questionへ_開発全般の質問: posts to #_dev_questions
    :_ml_statへ__機械学習_統計: posts to #_ml_stat
    :_ns_allへ__脳_神経科学: posts to #_ns_all
    :_ph_allへ__哲学: posts to #_ph_all
    :_z_docsへ__ドキュメント: posts to #z_docs
    :きもちぃ: posts to #きもちぃ沼
    :まじんこ: posts to #私立まじんこ学園高等部
    :キョチン高野: posts to #times_seiya_takano
    :中尾片山研: posts to #lab_naoya_katayama
    :卍tk: posts to #times_tk_卍
    :情物のjobs: posts to 
    :高の原親方: posts to #times_seiya_takano
    `
  ​
    return text.match(/:(.*):/g).map(x => x.slice(1, -1))
  ​
  }
  ​
  var defaultEmojis = [
    "rolling_on_the_floor_laughing",
    "joy",
    "heart",
    "thinking_face",
    "yum",
    "+1",
    "sob",
    "star-struck",
    "face_with_monocle",
    "grin",
    "heart_eyes",
    "hugging_face",
    "innocent",
    "kissing",
    "kissing_heart",
    "ok_hand",
    "sunglasses",
    "white_check_mark",
    "eyes",
    "raised_hands",
    "pray",
    "heavy_plus_sign",
    "clap",
    "bulb",
    "dart",
    "wave",
    "thumbsup",
    "tada",
    "one",
    "two",
    "three",
    "mega",
    "white_circle",
    "large_blue_circle",
    "red_circle",
    "grinning",
    "smiley",
    "smile",
    "sweat_smile",
    "laughing",
    "wink",
    "blush",
    "kissing_smiling_eyes",
    "kissing_closed_eyes",
    "relaxed",
    "slightly_smiling_face",
    "face_with_raised_eyebrow",
    "neutral_face",
    "expressionless",
    "no_mouth",
    "face_with_rolling_eyes",
    "smirk",
    "persevere",
    "disappointed_relieved",
    "open_mouth",
    "zipper_mouth_face",
    "hushed",
    "sleepy",
    "tired_face",
    "sleeping",
    "relieved",
    "stuck_out_tongue",
    "stuck_out_tongue_winking_eye",
    "stuck_out_tongue_closed_eyes",
    "drooling_face",
    "unamused",
    "sweat",
    "pensive",
    "confused",
    "upside_down_face",
    "money_mouth_face",
    "astonished",
    "white_frowning_face",
    "slightly_frowning_face",
    "confounded",
    "disappointed",
    "worried",
    "triumph",
    "cry",
    "frowning",
    "anguished",
    "fearful",
    "weary",
    "exploding_head",
    "grimacing",
    "cold_sweat",
    "scream",
    "flushed",
    "zany_face",
    "dizzy_face",
    "rage",
    "angry",
    "face_with_symbols_on_mouth",
    "mask",
    "face_with_thermometer",
    "face_with_head_bandage",
    "nauseated_face",
    "face_vomiting",
    "sneezing_face",
    "face_with_cowboy_hat",
    "clown_face",
    "lying_face",
    "shushing_face",
    "face_with_hand_over_mouth",
    "nerd_face",
    "smiling_imp",
    "imp",
    "japanese_ogre",
    "japanese_goblin",
    "skull",
    "skull_and_crossbones",
    "ghost",
    "alien",
    "space_invader",
    "robot_face",
    "hankey",
    "smiley_cat",
    "smile_cat",
    "joy_cat",
    "heart_eyes_cat",
    ":hand:",
    "smirk_cat",
    "kissing_cat",
    "scream_cat",
    "crying_cat_face",
    "pouting_cat",
    "see_no_evil",
    "hear_no_evil",
    "speak_no_evil",
    "baby",
    "child",
    "boy",
    "girl",
    "adult",
    "man",
    "woman",
    "older_adult",
    "older_man",
    "older_woman",
    "male-doctor",
    "female-doctor",
    "male-student",
    "female-student",
    "male-teacher",
    "female-teacher",
    "male-judge",
    "female-judge",
    "male-farmer",
    "female-farmer",
    "male-cook",
    "female-cook",
    "male-mechanic",
    "female-mechanic",
    "male-factory-worker",
    "female-factory-worker",
    "male-office-worker",
    "female-office-worker",
    "male-scientist",
    "female-scientist",
    "male-technologist",
    "female-technologist",
    "male-singer",
    "female-singer",
    "male-artist",
    "female-artist",
    "male-pilot",
    "female-pilot",
    "male-astronaut",
    "female-astronaut",
    "male-firefighter",
    "female-firefighter",
    "male-police-officer",
    "female-police-officer",
    "male-detective",
    "female-detective",
    "male-guard",
    "female-guard",
    "male-construction-worker",
    "female-construction-worker",
    "prince",
    "princess",
    "man-wearing-turban",
    "woman-wearing-turban",
    "man_with_gua_pi_mao",
    "person_with_headscarf",
    "bearded_person",
    "blond-haired-man",
    "blond-haired-woman",
    "man_in_tuxedo",
    "bride_with_veil",
    "pregnant_woman",
    "breast-feeding",
    "angel",
    "santa",
    "mrs_claus",
    "female_mage",
    "male_mage",
    "female_fairy",
    "male_fairy",
    "female_vampire",
    "male_vampire",
    "mermaid",
    "merman",
    "female_elf",
    "male_elf",
    "female_genie",
    "male_genie",
    "female_zombie",
    "male_zombie",
    "man-frowning",
    "woman-frowning",
    "man-pouting",
    "woman-pouting",
    "man-gesturing-no",
    "woman-gesturing-no",
    "man-gesturing-ok",
    "woman-gesturing-ok",
    "man-tipping-hand",
    "woman-tipping-hand",
    "man-raising-hand",
    "woman-raising-hand",
    "man-bowing",
    "woman-bowing",
    "man-facepalming",
    "woman-facepalming",
    "man-shrugging",
    "woman-shrugging",
    "man-getting-massage",
    "woman-getting-massage",
    "man-getting-haircut",
    "woman-getting-haircut",
    "man-walking",
    "woman-walking",
    "man-running",
    "woman-running",
    "dancer",
    "man_dancing"...