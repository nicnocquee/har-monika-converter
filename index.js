// Generate monika.json directly from URL

const puppeteer = require("puppeteer");
const PuppeteerHar = require("puppeteer-har");
const fs = require("fs");
const { getRequestsFromHar, requestsToMonika } = require("./hartorequests");

(async () => {
  const url = process.argv[2];
  if (!url || url.trim().length === 0) {
    console.log("URL is required");
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const har = new PuppeteerHar(page);
  await har.start({ path: "results.json" });

  await page.goto(url.trim());

  await har.stop();
  await browser.close();

  const { output: requests, outputFile } = await getRequestsFromHar(
    "results.json"
  );
  await requestsToMonika(requests);

  fs.unlinkSync("results.json");
  fs.unlinkSync(outputFile);
})();
