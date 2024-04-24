import { Logging } from '@google-cloud/logging';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Local imports.
import countries from './countries';
import { ExtendedFlow } from './interfaces';
import { chunkify } from './utils';
import { loadConfig } from './config';
import { initCache, createCache } from './cache';
import { getLocationByIP } from './location';
import { mapLogsToEvents, getLogsForInterval } from './logs';
import { buildFlow } from './flow';

// Load the configuration.
const config = loadConfig();

// Attempt to init based on the mode.
const flow: ExtendedFlow = initCache(config?.mode);

// If the mode is not cache, load one day worth of data, otherwise use the timestamp we stored
if (config?.mode !== 'CACHE') {
  flow.timestamp = new Date(flow.timestamp.getTime() - config.initialOffset); // Start with the last day of data.
}

// Initialise the logging client.
console.log(`Target project is: ${config?.gcp?.project_id}`);
const logging = new Logging({ projectId: config?.gcp?.project_id });

// Dates to use as references. New date is the latest one, while the last one is the one stored in the flow.
let newDate = new Date();
let lastDate = flow.timestamp;

const fetchLogs = async () => {
  // Get the new date for filtering.
  newDate = new Date();

  // Actually get the entries and map it to the JSON we are using.
  const result = await getLogsForInterval(logging, lastDate, newDate);

  // Map some of the values.
  const entryList = mapLogsToEvents(result);

  // Reduce to get a list of unique IPs.
  const ipChunks = chunkify(
    Object.keys(
      entryList.reduce((accum, curr) => {
        accum[curr.sourceIp!] = true;
        return accum;
      }, {} as any)
    ),
    100
  );
  console.info(
    `Received ${entryList.length} records for ${lastDate} - ${newDate} interval...`
  );

  // Get the locations.
  const ipLocationsMap = (
    await Promise.all(ipChunks.map((ips) => getLocationByIP(ips)))
  )
    // Reduce the results to get them all into a map for easy access.
    .reduce((accum: any, curr: any[]) => {
      // Each item from the list is a list with the results.
      curr.forEach((ipLocation) => {
        accum[ipLocation.query] = ipLocation;
      });
      return accum;
    }, {} as any);

  // Update our counts for visualisation
  entryList.forEach((entry) => {
    buildFlow(
      flow,
      countries[ipLocationsMap[entry.sourceIp!]['countryCode'] as string],
      ipLocationsMap[entry.sourceIp!]['city'],
      entry
    );
  });

  // Update the date for the flow.
  flow.timestamp = newDate;

  console.log(flow);

  createCache(config?.mode, flow);

  // Update the dates with the old one.
  lastDate = newDate;
};

// Interval runs in the background.
console.log('Fetching initial batch of logs...');
fetchLogs();
let interval = setInterval(fetchLogs, config.frequency);

// Initialize the express server.
console.log('Starting server...');
const app = express();
app.use(
  cors({
    origin: '*' // Allow all origins since this is local.
  })
);

// Configure app start.
app.listen(config?.http?.port, () => {
  console.log(`Server is running on port ${config?.http?.port}`);
});

// Handler for the traffic
app.get('/traffic', (_req: Request, res: Response) => {
  res.json({ ...flow, countries: Array.from(flow.countries) });
});
