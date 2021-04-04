function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function saveData(matrix) {}

function tfidf(tf: number, rate: number) {
  return tf * Math.log2(1 / rate);
}

function getWordList() {
  return ["abc"];
}

type keyword = string;
type timesName = string;
type wordCount = number;

class TFIDF extends Map<keyword, Map<timesName, wordCount>> {
  constructor(...args: any) {
    super(...args);
  }

  times(channelName: string) {
    return (keyword: string) => this.get(keyword).get(channelName);
  }
}

function testTFIDF() {
  new TFIDF([[1, [[3, 4]]]]);
}

// script は300秒まで
//

function testGetSheet() {
  console.log(getSheet().getName());
}
