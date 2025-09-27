const fs = require('fs');
const path = require('path');
const https = require('https');

const logos = {
    'google-calendar': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    'microsoft-teams': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg',
    'zoom': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Zoom_Video_Communications_Logo.svg',
    'slack': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    'discord': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Discord_icon.svg',
    'webex': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Webex_logo.svg',
    'google-meet': 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg',
    'skype': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Skype_logo_%282019%E2%80%93present%29.svg'
};

const destDir = path.join(__dirname, '..', 'public', 'assets', 'platforms');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

Object.entries(logos).forEach(([name, url]) => {
    const destPath = path.join(destDir, `${name}.svg`);
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${name}.svg`);
        });
    }).on('error', (err) => {
        fs.unlink(destPath);
        console.error(`Error downloading ${name}.svg: ${err.message}`);
    });
});
