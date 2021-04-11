```plantuml
title 概念図

class SpreadSheet
class Slack
class MurakamiModule

MurakamiModule -- Slack




class trigger

package YukiModule{
    class TFIDF
    class Ranking
    class SheetManager
    class SetDataUtils
}

SetDataUtils -- MurakamiModule
SetDataUtils -- SpreadSheet


trigger -- Ranking
TFIDF -- MurakamiModule
TFIDF -- Ranking
MurakamiModule -- Ranking
SheetManager -up- SpreadSheet
SheetManager - TFIDF
```


```plantuml
title 仕様図
class DF
class TF
class TFIDF{
    newText()
}

class Ranking{
    thresholds
    rankLimit
    update()
    get(): Result
}

class Result{
    word
    timesList
}


TFIDF -> TF
DF -> TF
TFIDF -> DF
Ranking -> TFIDF

abstract class IndexedMatrix {
    columns
    rows
    column()
    row()
}

IndexedMatrix --|> ManagedIndex
TFIDF --|> IndexedMatrix
TF --|> IndexedMatrix
Ranking --|> IndexedMatrix

abstract class ManagedIndex{
    manager
    setManager()
    {abstract}parser()
    getNumber()
}

ManagedIndex --> SheetManager

ManagedIndex --|> SheetData


MurakamiModule ---> Ranking
MurakamiModule ---> TFIDF
trigger --> Ranking

Interface SheetData{
    area
    update()
    load()
}
```




```plantuml
title 実装図
class DF
class TF
class TFIDF{
    newText()
}

class Ranking{
    thresholds
    rankLimit
    update()
    get(): Result
}

class Result{
    word
    timesList
}


TFIDF -> TF
DF -> TF
TFIDF -> DF
Ranking -> TFIDF

abstract class IndexedMatrix {
    columns
    rows
    column()
    row()
}

IndexedMatrix --|> ManagedIndex
TFIDF --|> IndexedMatrix
TF --|> IndexedMatrix
Ranking --|> IndexedMatrix

abstract class ManagedIndex{
    manager
    setManager()
    {abstract}parser()
    getNumber()
}

class SheetManager

class TimesIndex
class WordIndex

TimesIndex -up-|> ManagedIndex
WordIndex -up-|> ManagedIndex
ManagedIndex -up-|> SheetData

ManagedIndex -up-|> Array
ManagedIndex --> SheetManager

class Client{
}

Client ---> Ranking
Client ---> TFIDF

Interface SheetData{
    area
    update()
    load()
}
```