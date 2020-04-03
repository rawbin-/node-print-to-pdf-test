const path = require('path')
const { writeFileSync } = require("fs");
const { spawnChrome } = require("chrome-debugging-client");

/**
 * Print a url to a PDF file.
 * @param url {string}
 * @param file {string}
 */
async function printToPDF(url, file) {
    const chrome = spawnChrome({ headless: true });
    try {
        const browser = chrome.connection;

        // we create with a target of about:blank so that we can
        // setup Page events before navigating to url
        const { targetId } = await browser.send("Target.createTarget", {
            url: "about:blank",
        });

        const page = await browser.attachToTarget(targetId);
        // enable events for Page domain
        await page.send("Page.enable");

        // concurrently wait until load and navigate
        await Promise.all([
            page.until("Page.loadEventFired"),
            page.send("Page.navigate", { url }),
        ]);

        const { data } = await page.send("Page.printToPDF",{
            landscape:true,
            paperWidth: 148 / 25.4, //A5
            paperHeight: 210 / 25.4,
            marginTop: 23.13 / 25.4,
            marginBottom: 25 / 25.4,
            marginLeft: 0,
            marginRight: 0

        });

        writeFileSync(file, data, "base64");

        // attempt graceful close
        await chrome.close();
    } finally {
        // kill process if hasn't exited
        await chrome.dispose();
    }

    console.log(`${url} written to ${file}`);
}

const htmlPath = './data/test.html'
const format = 'A5' // alt A5 A4
const htmlPathAb = path.resolve(htmlPath)
const pdfPath = `${htmlPathAb}-${format}-cdc.pdf`

const htmlFileUrl = `file:///${path.resolve(htmlPath)}`

printToPDF(htmlFileUrl, pdfPath);
