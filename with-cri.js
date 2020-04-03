const path = require('path')
const { writeFileSync } = require("fs");
const CDP = require('chrome-remote-interface');

async function printToPDF(url, file) {
    let client;
    try {
        // connect to endpoint
        client = await CDP();
        // extract domains
        const {Network, Page} = client;
        // setup handlers
        Network.requestWillBeSent((params) => {
            console.log(params.request.url);
        });
        // enable events then start!
        await Network.enable();
        await Page.enable();
        await Page.navigate({url});
        await Page.loadEventFired();
        const {data} = await Page.printToPDF({
            landscape:true,
            paperWidth: 148 / 25.4, //A5
            paperHeight: 210 / 25.4,
            marginTop: 23.13 / 25.4,
            marginBottom: 25 / 25.4,
            marginLeft: 0,
            marginRight: 0

        })
        writeFileSync(file, data, "base64");
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

const htmlPath = './data/test.html'
const format = 'A5' // alt A5 A4
const htmlPathAb = path.resolve(htmlPath)
const pdfPath = `${htmlPathAb}-${format}-cri.pdf`

const htmlFileUrl = `file:///${path.resolve(htmlPath)}`

printToPDF(htmlFileUrl, pdfPath);

