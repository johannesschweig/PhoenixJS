// system-wide constants
export const AUTODJ_OFF = "AUTODJ_OFF"
export const AUTODJ_RANDOM = "AUTODJ_RANDOM"
export const AUTODJ_ALBUM_ARTIST = "AUTODJ_ALBUM_ARTIST"
export const ROOT_PATH = process.platform === "linux" ? "/mnt/music/Musik/" : "E:/Musik/"
export const DATABASE_FILE_PATH = ROOT_PATH.replace("Musik", "Tools") + "musiccollection.db"
export const DELAY_TOOLTIP = 500 // delay before tooltip is displayed in ms
export const SHOW_IN_FILE_EXPLORER = 'showInFileExplorer'
