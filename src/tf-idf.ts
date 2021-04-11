function testSuite() {
  testWordIndex();
  testTimesIndex();
  testSheetManager();
  testTFIDF();
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
    const result = {
      sheet: range.getSheet().getName(),
      rect: {
        row: range.getRow(),
        column: range.getColumn(),
        numRows: 0,
        numColumns: 0,
      },
    };
    const values = range.getValues();

    // assert dimensionDirection: rows first
    let row = 0;
    for (const val of values.reverse()) {
      let column = val.reverse().findIndex((v) => v);

      if (column > -1) {
        console.log("This is true: ", val[column]);
        [result.rect.numRows, result.rect.numColumns] = [
          values.length - row,
          val.length - column,
        ];
        break;
      }
      row++;
    }
    return result;
  }

  getA1(sheetName: string, rect: DataRect) {
    return this.book
      .getSheetByName(sheetName)
      .getRange(rect.row, rect.column, rect.numRows, rect.numColumns)
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
    this.updates = [];
    return this;
  }

  load(area: string) {
    this.doUpdate();
    const range = this.book.getRange(area);
    const sheet = range.getSheet();
    const rect = this.getRect(area).rect;
    console.log(JSON.stringify(rect, null, 2));
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
    Object.setPrototypeOf(this, new.target.prototype);
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
    return this;
  }

  getNumber(key: TBase) {
    return this.findIndex((k) => k === key);
  }
}

class WordIndex extends ManagedIndex<string> {
  readonly area = "'index'!A:A";
  readonly depth = 1;

  // parser = ManagedIndex.wrappedArrayParser;
}

class TimesIndex extends ManagedIndex<string> {
  readonly area = "'index'!B:B";
  readonly depth = 1;
}

abstract class IndexedMatrix extends ManagedIndex<ManagedIndex<string>> {
  protected columns: ManagedIndex<string>;
  protected rows: ManagedIndex<string>;
  readonly area: string;
  readonly depth = 2;
  constructor(columns: ManagedIndex<string>, rows: ManagedIndex<string>) {
    super();
    // Object.setPrototypeOf(this, IndexedMatrix)
    this.columns = columns;
    this.rows = rows;
  }
  column(columnName: string) {
    const i = this.columns.getNumber(columnName);
    // const areaData = this.manager.getRect(`'${this.area}'!A:A`);
    // areaData.rect.numColumns = 1;
    // areaData.rect.column = i + 1;
    // const matrixContext = this;
    const notation = this.manager.getA1(this.area, {
      row: 1,
      column: i + 1,
      numColumns: 1,
      numRows: this.rows.length,
    });
    const constructor = class ManagedColumn extends ManagedIndex<number> {
      readonly area = notation;
      readonly depth = 1;
    };
    const result = new constructor();
    return result;
  }
  row() {}
}

class TFIDF extends IndexedMatrix {
  readonly area = "TFIDF";
}

function testWordIndex() {
  console.log("===testWordIndex===");

  const test = new WordIndex();
  console.log("init", test);
  const manager = new SheetManager();
  test.setManager(manager);
  console.log("load", test.load());
  test.update(["abc", "def"]);
  console.log("update", test);

  console.log("===testWordIndex===");
}

function testTimesIndex() {
  console.log("===testTimesIndex===");

  const test = new TimesIndex();
  console.log("init", test);
  const manager = new SheetManager();
  test.setManager(manager);
  console.log("load", test.load());
  test.update(["abc", "def"]);
  console.log("update", test);

  console.log("===testTimesIndex===");
}

function testSheetManager() {
  console.log("=== testSheetManager ===");

  const test = new SheetManager();
  console.log("init", test);

  const words = new WordIndex();
  words.setManager(test);
  words.load();
  console.log("load", test, words);
  words.update(["abc", "def"]);
  console.log("update", test);
  console.log("doUpdate", test.doUpdate());

  console.log("=== testSheetManager ===");
}

function testTFIDF() {
  console.log("=== testTFIDF ===");
  const manager = new SheetManager();

  const test = new TFIDF(
    new TimesIndex().setManager(manager).load(),
    new WordIndex().setManager(manager).load()
  );
  console.log("init", test);
  test.setManager(manager);
  console.log("column", test.column("testTimes2"));
  // test.update(["abc", "def"]);
  // console.log("update", test);

  console.log("=== testTFIDF ===");
}
