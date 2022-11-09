const { app, BrowserWindow } = require('electron');
const axios = require('axios');

const fetch = require('electron-fetch').default

const client_id = "jkbd76wjn7e1npbw98l2s1hrc270mm";
const url = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=jkbd76wjn7e1npbw98l2s1hrc270mm&redirect_uri=http://localhost:3000&scope=chat%3Aread+chat%3Aedit"

			

var access_token;



const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
  });
    // win.loadFile("index.html")    
  win.loadURL(url)
  // win.loadURL("https://dashboard.twitch.tv/popout/u/molera/stream-manager/chat")
  function runToken(token) {
    let client_id = '';
    fetch(
        'https://id.twitch.tv/oauth2/validate',
        {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
    )
    .then(resp => resp.json())
    .then(resp => {
        client_id = resp.client_id;
        return fetch(
            'https://api.twitch.tv/helix/users',
            {
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': client_id,
                    'Authorization': `Bearer ${token}`
                }
            }
        )
    })
    .then(resp => resp.json())
    .then(resp => {
        console.log('Got user', resp);
        
        // ipc
        const name = resp.data[0]['login']
        console.log(name)
        // win.webContents.send('twitch_user', resp.data[0]);
        win.loadURL('https://dashboard.twitch.tv/popout/u/'+name+'/stream-manager/chat')
    })
    .catch(err => {
        console.log('An Error Occurred', err);
    });
  }

  // 'will-navigate' is an event emitted when the window.location changes
// newUrl should contain the tokens you need
  win.webContents.on('will-navigate', function (event, newUrl) {
  console.log("test", newUrl);
  let url = new URL(newUrl);
  let params = new URLSearchParams(url.hash.slice(1));
  if (params.get('access_token')) {
    // we got a token to use
    runToken(params.get('access_token'));
}
  // More complex code to handle tokens goes here
});



};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});