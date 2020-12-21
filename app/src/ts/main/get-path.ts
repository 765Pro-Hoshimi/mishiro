import { join } from 'path'
import { ipcMain } from 'electron'

export interface GetPath {
  (...relative: string[]): string
  configPath: string
  dataDir: (...relative: string[]) => string
  manifestPath: (resVer: number, db?: string) => string
  masterPath: (resVer: number, db?: string) => string
  downloadDir: (...relative: string[]) => string
  iconDir: (...relative: string[]) => string
  emblemDir: (...relative: string[]) => string
  cardDir: (...relative: string[]) => string
  scoreDir: (...relative: string[]) => string
  voiceDir: (...relative: string[]) => string
  bgmDir: (...relative: string[]) => string
  liveDir: (...relative: string[]) => string
  jacketDir: (...relative: string[]) => string
  batchDir: (...relative: string[]) => string
}

const getPath: GetPath = function getPath (...relative: string[]): string {
  return join(__dirname, '..', ...relative)
}

getPath.configPath = getPath('../config.json')
getPath.dataDir = (...relative) => getPath('../asset/data', ...relative)
getPath.manifestPath = (resVer, db = '') => getPath.dataDir(`manifest_${resVer}${db}`)
getPath.masterPath = (resVer, db = '') => getPath.dataDir(`master_${resVer}${db}`)
getPath.downloadDir = (...relative) => getPath('../asset/download', ...relative)
getPath.iconDir = (...relative) => getPath('../asset/icon', ...relative)
getPath.emblemDir = (...relative) => getPath('../asset/emblem', ...relative)
getPath.cardDir = (...relative) => getPath('../asset/card', ...relative)
getPath.scoreDir = (...relative) => getPath('../asset/score', ...relative)
getPath.voiceDir = (...relative) => getPath('../asset/voice', ...relative)
getPath.bgmDir = (...relative) => getPath('../asset/bgm', ...relative)
getPath.liveDir = (...relative) => getPath('../asset/live', ...relative)
getPath.jacketDir = (...relative) => getPath('../asset/jacket', ...relative)
getPath.batchDir = (...relative) => getPath('../asset/batch', ...relative)

export function pathIpc (): void {
  ipcMain.on('getPath', (event, type: any, ...args: any[]) => {
    event.returnValue = type === '' ? getPath(...args) : (getPath as any)[type](...args)
  })
}

export default getPath
