const { app, BrowserWindow } = require('electron');
const axios = require('axios');

const tmi = require('tmi.js');

const client_id = "jkbd76wjn7e1npbw98l2s1hrc270mm";
const url = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=jkbd76wjn7e1npbw98l2s1hrc270mm&redirect_uri=http://localhost:3000&scope=chat%3Aread+chat%3Aedit"

// const client = new tmi.Client({
// 	options: { debug: true },
// 	identity: {
// 		username: 'my_bot_name',
// 		password: 'oauth:my_bot_token'
// 	},
// 	channels: [ 'my_name' ]
// });

// client.connect();

// client.on('message', (channel, tags, message, self) => {
// 	// Ignore echoed messages.
// 	if(self) return;

// 	if(message.toLowerCase() === '!hello') {
// 		// "@alca, heya!"
// 		client.say(channel, `@${tags.username}, heya!`);
// 	}
// });
			

var access_token;


const createWindow = () => {
  const win = new BrowserWindow({
    width: 600,
    height: 800,
  });
    win.loadFile("index.html")    
  win.loadURL(url)

  win.webContents.on("did-fail-load", ()=>{
    const acc_url = new URL( win.webContents.getURL());
    access_token = new URLSearchParams(acc_url.hash.substring(1)).get('access_token')
    console.log(access_token)
    win.loadFile("index.html")




    const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'my_bot_name',
		password: 'oauth:'+access_token
	},
	channels: [ '#' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	// Ignore echoed messages.
	if(self) return;

	if(message.toLowerCase() === '!hello') {
		// "@alca, heya!"
		client.say(channel, `@${tags.username}, heya!`);
	}
});
    
})
console.log(win.webContents.getURL())
//   console.log(win.webContents.getURL());
  console.log("test")
// axios.get(url).then((res)=>{console.log(res)


// })
// win.loadFile('index.html');

//   win.loadURL("https://www.naver.com")
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