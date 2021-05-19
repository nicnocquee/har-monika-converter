const jq = require("node-jq");
const fs = require("fs");
const path = require("path");

// Get the requests from Har file and write it out to json
const getRequestsFromHar = async (harFile) => {
  const filter = "[.log.entries[].request]";
  const extension = path.extname(harFile);
  const fileName = path.basename(harFile, extension);
  const outputFile = `${fileName}-requests.json`;
  return new Promise((resolve) => {
    jq.run(filter, harFile, { output: "json" }).then((output) => {
      fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
      resolve({ output, outputFile });
    });
  });
};

// Create monika.json from list of requests
const requestsToMonika = async (requests) => {
  const probes = [
    {
      id: "probe-1",
      name: "probe-1",
      requests: requests.map((r) => ({
        method: r.method,
        url: r.url,
        headers: r.headers
          .filter((h) => !h.name.startsWith(":"))
          .reduce((prev, curr) => {
            return {
              ...prev,
              [curr.name]: curr.value,
            };
          }, {}),
        timeout: 10000,
      })),
    },
  ];
  const notifications = [];
  const config = {
    notifications,
    probes,
  };

  await new Promise((resolve) => {
    fs.writeFileSync("monika.json", JSON.stringify(config, null, 2));
    resolve();
  });
};

module.exports = {
  getRequestsFromHar,
  requestsToMonika,
};
