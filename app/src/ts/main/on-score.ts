import { openSqlite } from './sqlite3'
import { Event } from 'electron'

export interface ScoreNote {
  sec: number // music time
  type: 1 | 2 | 3 // 1: tap / flip 2: hold 3: hold + move
  finishPos: 1 | 2 | 3 | 4 | 5
  status: 0 | 1 | 2 // 0: tap 1: flip left 2: flip right
  sync: 0 | 1 // operate at the same time
  groupId: number // group id
}

function createScore (csv: string) {
  let csvTable: string[] = csv.split('\n')
  const fullCombo = csvTable[1].split(',').map(value => Number(value))[5]
  const score: ScoreNote[] = []

  for (let i = 2; i < csvTable.length; i++) {
    const noteArr: any[] = csvTable[i].split(',').map(value => Number(value))
    if (noteArr[2] !== 1 && noteArr[2] !== 2 && noteArr[2] !== 3) {
      continue
    }
    score.push({
      sec: noteArr[1],
      type: noteArr[2],
      finishPos: noteArr[4],
      status: noteArr[5],
      sync: noteArr[6],
      groupId: noteArr[7]
    })
  }

  return { fullCombo, score }
}

export default async function (event: Event, scoreFile: string, difficulty: number | string, bpm: number, src: string) {
  let bdb = await openSqlite(scoreFile)
  let rows = await bdb._all(`SELECT data FROM blobs WHERE name LIKE "%/_${difficulty}.csv" ESCAPE '/'`)
  bdb.close()
  if (!rows.length) return

  const data = rows[0].data.toString()

  let { fullCombo, score } = createScore(data)

  let obj = { src, bpm, score, fullCombo }
  event.sender.send('score', obj)
}