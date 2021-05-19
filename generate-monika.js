// Create monika.json from a Har file

const fs = require("fs");
const path = require("path");
const { getRequestsFromHar, requestsToMonika } = require("./hartorequests");

(async () => {
  const harFile = process.argv[2];
  fs.statSync(harFile);
  const extension = path.extname(harFile);
  const fileName = path.basename(harFile, extension);
  const harJson = `${fileName}.json`;
  fs.copyFileSync(harFile, harJson);
  const { output: requests, outputFile } = await getRequestsFromHar(harJson);
  await requestsToMonika(requests);
  fs.unlinkSync(harJson);
  fs.unlinkSync(outputFile);
})();
