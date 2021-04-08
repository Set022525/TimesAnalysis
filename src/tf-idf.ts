function testSuite() {
  testWordIndex();
  testTimesIndex();
  testSheetManager();
}

function tfidf(tf: number, rate: number) {
  return tf * Math.log2(1 / rate);
}

interface SheetData {
  area: string;
  load: () => void;
  update: (data: any) => void;
}

type UpdateConfig = {
  values: any[];
  area: string;
};

type DataRect = {
  row: number;
  column: number;
  numRows: number;
  numColumns: number;
};

class SheetManager {
  private book: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private updates: UpdateConfig[];
  constructor() {
    this.book = SpreadsheetApp.getActiveSpreadsheet();
    this.updates = [];
  }

  getRect(a1notation: string) {
    const range = this.book.getRange(a1notation);
    return {
      sheet: range.getSheet().getName(),
      rect: {
        row: range.getRow(),
        column: range.getColumn(),
        numRows: range.getLastRow(),
        numColumns: range.getLastColumn(),
      },
    };
  }

  getA1(sheetName: string, rect: DataRect) {
    const list = Object.keys(rect).map((key) => rect[key]) as [
      number,
      number,
      number,
      number
    ];
    return this.book
      .getSheetByName(sheetName)
      .getRange(...list)
      .getA1Notation();
  }

  setUpdate(config: UpdateConfig) {
    this.updates.push(config);
    return this;
  }
  doUpdate() {
    if (!this.updates.length) {
      return;
    }
    const notations = this.updates.map((x) => x.area);
    const ranges = this.book.getRangeList(notations).getRanges();
    let i = 0;
    for (const range of ranges) {
      range.setValues(this.updates[i++].values);
    }
    return this;
  }

  load(area: string) {
    this.doUpdate();
    const range = this.book.getRange(area);
    const sheet = range.getSheet();
    const rect = this.getRect(area).rect;
    // console.log(JSON.stringify(rect, null, 2));
    rect.numRows =
      Math.min(rect.row + rect.numRows - 1, Math.max(1, sheet.getLastRow())) +
      1;
    rect.numRows -= rect.row;
    // console.log(JSON.stringify(rect, null, 2));
    const a1Notation = this.getA1(sheet.getName(), rect);
    return sheet.getRange(a1Notation).getValues();
  }
}

abstract class ManagedIndex<TBase> extends Array<TBase> implements SheetData {
  abstract readonly area: string;
  abstract readonly depth: 1 | 2;
  protected manager: SheetManager;

  constructor(...data: TBase[]) {
    super(...data);
    Object.setPrototypeOf(this, ManagedIndex.prototype);
  }

  update(data: TBase[]) {
    const rangeInfo = this.manager.getRect(this.area);

    rangeInfo.rect.row = rangeInfo.rect.row + rangeInfo.rect.numRows;
    rangeInfo.rect.numRows = data.length;

    switch (this.depth) {
      case 1:
        this.manager.setUpdate({
          area: this.manager.getA1(rangeInfo.sheet, rangeInfo.rect),
          values: data.map((x) => [x]),
        });
        break;
      case 2:
        this.manager.setUpdate({
          area: this.manager.getA1(rangeInfo.sheet, rangeInfo.rect),
          values: data.map((x) => [x]),
        });
        break;
      default:
        break;
    }

    this.push(...data);
  }

  load() {
    const wrapped = this.manager.load(this.area);
    switch (this.depth) {
      case 1:
        for (let [member] of wrapped) {
          if (!member) {
            continue;
          }
          this.push(member);
        }
        break;
      case 2:
        this.push(...(wrapped as any[]));
      default:
        break;
    }

    return this;
  }

  setManager(manager: SheetManager) {
    this.manager = manager;
  }

}

class WordIndex extends ManagedIndex<string> {
  readonly area = "'index'!A:A";
  readonly depth = 1;
  getNumber(key: string) {
    return this.findIndex((k) => k === key);
  }
  // parser = ManagedIndex.wrappedArrayParser;
}

class TimesIndex extends ManagedIndex<string> {
  readonly area = "'index'!B:B";
  readonly depth = 1;
  getNumber(key: string) {
    return this.findIndex((k) => k === key);
  }
}

function testWordIndex() {
  const test = new WordIndex();
  console.log("init", test);
  const manager = new SheetManager();
  test.setManager(manager);
  console.log("load", test.load());
  test.update(["abc", "def"]);
  console.log("update", test);
}

function testTimesIndex() {
  const test = new TimesIndex();
  console.log("init", test);
  const manager = new SheetManager();
  test.setManager(manager);
  console.log("load", test.load());
  test.update(["abc", "def"]);
  console.log("update", test);
}

function testSheetManager() {
  const test = new SheetManager();
  console.log("init", test);

  const words = new WordIndex();
  words.setManager(test);
  words.load();
console.log("load", test, words);
  words.update(["abc", "def"]);
  console.log("update", test);
  console.log("doUpdate", test.doUpdate());
}
