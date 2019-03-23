var batch = []
var files = []
var start = 0

// starts to read the metadata of all files fs in batch-wise execution
export function startMetadataBatch(fs) {
    files = fs
    runMetadataBatch(0)
}

// inits a new batch and automatically chains in new batches if this one has finished executing
function runMetadataBatch(s) {
    var batchSize = 500
    start = s
    batch = files.slice(s, s + batchSize)
    batch.forEach((file, index) => {
        mm.parseFile(file)
        .then( metadata => {
            let md = metadata.common
            // to avoid ratings being undefined
            let r = 0
            // md.rating can range from 0 to 1
            if(md.rating && md.rating.length>0){
                r = Math.round(md.rating[0].rating * 5)
            }
            console.log(md.title, r)
            //remove rootPath from filepath
            let filePath = file.replace(constants.ROOT_PATH, "")
            database.insert({path: filePath, title: md.title, track: md.track.no, artist: md.artist, albumartist: md.albumartist, album: md.album, year: md.year, rating: r, selected: false})
            // remove file from batch
            batch.pop(file)
            if (batch.length == 0 && start < files.length) {
                console.log("INFO database update", Math.round(start / files.length * 100) + "% done")
                runMetadataBatch(start + batchSize)
            }
        })
        .catch((err) => {
            console.log(err.message)
        })
    })
}
