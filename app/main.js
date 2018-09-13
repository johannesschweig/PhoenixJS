import path from 'path'
import url from 'url'
import {app, crashReporter, BrowserWindow, Menu, globalShortcut} from 'electron'

const isDevelopment = (process.env.NODE_ENV === 'development')

let mainWindow = null
let forceQuit = false

const installExtensions = async () => {
    const installer = require('electron-devtools-installer')
    const extensions = [
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS'
    ]
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    for (const name of extensions) {
        try {
            await installer.default(installer[name], forceDownload)
        } catch (e) {
            console.log(`Error installing ${name} extension: ${e.message}`)
        }
    }
}

crashReporter.start({
    productName: 'YourName',
    companyName: 'YourCompany',
    submitURL: 'https://your-domain.com/url-to-submit',
    uploadToServer: false
})

app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('ready', async () => {
    if (isDevelopment) {
        await installExtensions()
    }

    mainWindow = new BrowserWindow({
        width: 800,
        height: 430,
        minWidth: 640,
        minHeight: 430,
        show: false,
        icon: path.join(__dirname, "/img/icon.png")
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // show window once on first load
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.show()
    })

    mainWindow.webContents.on('did-finish-load', () => {
        // Handle window logic properly on macOS:
        // 1. App should not terminate if window has been closed
        // 2. Click on icon in dock should re-open the window
        // 3. ⌘+Q should close the window and quit the app
        if (process.platform === 'darwin') {
            mainWindow.on('close', function (e) {
                if (!forceQuit) {
                    e.preventDefault()
                    mainWindow.hide()
                }
            })

            app.on('activate', () => {
                mainWindow.show()
            })

            app.on('before-quit', () => {
                forceQuit = true
            })
        } else {
            mainWindow.on('closed', () => {
                mainWindow = null
            })
        }
    })
    // auto-open dev tools
    mainWindow.webContents.openDevTools()
    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {
        Menu.buildFromTemplate([{
            label: 'Inspect element',
            click() {
                mainWindow.inspectElement(props.x, props.y)
            }}]).popup(mainWindow)
        })

    // register keyboard shortcuts
    // backward
    globalShortcut.register("CmdOrCtrl+PageUp", () => {
        mainWindow.webContents.send("backward")
    })
    // forward
    globalShortcut.register("CmdOrCtrl+PageDown", () => {
        mainWindow.webContents.send("forward")
    })
    // play/pause
    globalShortcut.register("CmdOrCtrl+Home", () => {
        mainWindow.webContents.send("playPause")
    })
    // autodj
    globalShortcut.register("CmdOrCtrl+End", () => {
        mainWindow.webContents.send("autodj")
    })
})

app.on("will-quit", () => {
    //unregister shortcuts
    globalShortcut.unregisterAll()
})
