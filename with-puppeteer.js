const path = require('path')
const puppeteer = require('puppeteer')

const DEFAULT_ARGS = [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote',
    '--disable-extensions',
    '--disable-webgl'];

const htmlPath = './data/test.html'
const format = 'A5' // alt A5 A4
setTimeout(async () => {
    const htmlPathAb = path.resolve(htmlPath)
    const pdfPath = `${htmlPathAb}-${format}-puppeteer.pdf`

    const browser = await puppeteer.launch({
        args: DEFAULT_ARGS,
    });
    const page = await browser.newPage()
    console.log('opening the page')
    await page.goto(`file:///${path.resolve(htmlPath)}`, {
        waitUntil: 'networkidle0',
        timeout: 60000 * 10 // 尝试性加入最大等待时间，可能还不够。。。
    })
    console.log('waiting for the page')
    await page.waitForFunction(() => {
        return window.contentRenderFinished
    });
    console.log('generating pdf')
    await page.pdf({
        htmlPath: htmlPathAb,
        path: pdfPath,
        format: format,
        printBackground: true,
        landscape:true,
        margin: {
            top: '23.13mm',
            bottom: '25mm',
            left: '0mm',
            right: '0mm'
        }
    });
    await page.close();
    await browser.close()
    console.log('finished')
}, 5000)
