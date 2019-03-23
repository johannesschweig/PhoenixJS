// collection of smaller utility functions
const {shell} = require('electron')

// opens the file explorer and shows the folder of the selected track
export function showInFileExplorer(e, data, target) {
    console.log('Opening folder of ' + constants.ROOT_PATH + target.getAttribute('path'))
    shell.showItemInFolder(constants.ROOT_PATH + target.getAttribute('path'))
}

// returns a safe version of a path where special characters are escaped
export function getSafePath(path) {
    // see https://web.cs.dal.ca/~jamie/CS3172/examples/XHTML/entities/ASCII.html for more codes
    let escapeCodes = {
        '#': '%23',
        '?': '%3F'
    }
    for (var key in escapeCodes) {
        path = path.replace(key, escapeCodes[key])
    }
    return path
}
