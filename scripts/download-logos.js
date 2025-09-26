const https = require('https');
const fs = require('fs');
const path = require('path');

const platforms = [
  {
    name: 'google-calendar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg'
  },
  {
    name: 'teams',
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282019%E2%80%93present%29.svg'
  },
  {
    name: 'zoom',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/512px-Zoom_Communications_Logo.svg.png'
  },
  {
    name: 'slack',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/512px-Slack_icon_2019.svg.png'
  },
  {
    name: 'discord',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Discord_Logo_2015.svg/512px-Discord_Logo_2015.svg.png'
  },
  {
    name: 'webex',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Webex_logo.svg/512px-Webex_logo.svg.png'
  },
  {
    name: 'google-meet',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Google_Meet_icon_%282020%29.svg/512px-Google_Meet_icon_%282020%29.svg.png'
  },
  {
    name: 'skype',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Skype_logo_%282019%E2%80%93present%29.svg/512px-Skype_logo_%282019%E2%80%93present%29.svg.png'
  }
];

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    });
  });
};

async function downloadAll() {
  const outputDir = path.join(__dirname, 'public', 'assets', 'platforms');
  
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const platform of platforms) {
    const filepath = path.join(outputDir, `${platform.name}.png`);
    console.log(`Downloading ${platform.name}...`);
    try {
      await downloadImage(platform.url, filepath);
      console.log(`Successfully downloaded ${platform.name}`);
    } catch (err) {
      console.error(`Error downloading ${platform.name}:`, err);
    }
  }
}

downloadAll();
