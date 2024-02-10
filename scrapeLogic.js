const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    await page.goto("https://developer.chrome.com/");

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Evaluate JavaScript within the page context to extract the text content of the <h2> element
    const h2Text = await page.evaluate(() => {
      // Find the <h2> element by its id
      const h2Element = document.getElementById('a-powerful-web-span-stylecolor-var-chrome-primarymade-easierspan');

      // Extract the text content of the <h2> element
      return h2Element.innerText;
    });


    res.send(h2Text);
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
