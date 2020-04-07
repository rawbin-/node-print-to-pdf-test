const path = require('path')
const { writeFileSync } = require("fs");

require('chromedriver')

const webdriver = require('selenium-webdriver');
const {Builder, By, Key, until} = webdriver
const {Command} = require('selenium-webdriver/lib/command')


async function printToPDF(url,file) {
    const  chrome = require("selenium-webdriver/chrome");

    const options = new chrome.Options();
    options.addArguments("headless");

    // let service = new chrome.ServiceBuilder(chromedriver.path).build();
    // chrome.setDefaultService(service);

    let driver = await new webdriver.Builder()
        .setChromeOptions(options)
        .withCapabilities(webdriver.Capabilities.chrome())
        .forBrowser('chronium')
        .build();
    try {
        await driver.get(url);
        const cmd = new Command('Page.printToPDF').setParameter({
            landscape:true,
            paperWidth: 148 / 25.4, //A5
            paperHeight: 210 / 25.4,
            marginTop: 23.13 / 25.4,
            marginBottom: 25 / 25.4,
            marginLeft: 0,
            marginRight: 0

        })
        const {data} = await driver.execute(cmd)
        writeFileSync(file, data, "base64");
    } finally {
        await driver.quit();
    }
}

const htmlPath = './data/test.html'
const format = 'A5' // alt A5 A4
const htmlPathAb = path.resolve(htmlPath)
const pdfPath = `${htmlPathAb}-${format}-webdriver.pdf`

const htmlFileUrl = `file:///${path.resolve(htmlPath)}`

printToPDF(htmlFileUrl, pdfPath);
