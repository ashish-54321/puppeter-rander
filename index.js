const express = require("express");
const puppeteer = require('puppeteer');
const { scrapeLogic } = require("./scrapeLogic");
const app = express();


const PORT = process.env.PORT || 4000;


app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.get('/search', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).send('Please provide a valid URL');
    }

    // Launch Puppeteer without any proxy settings
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url);

    // Wait for a brief period to ensure page has loaded
    await page.waitForTimeout(2000);

    // Get the HTML content after rendering
    const content = await page.content();

    // Close the browser
    await browser.close();

    // Send the HTML content as the response
    res.send(content);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
