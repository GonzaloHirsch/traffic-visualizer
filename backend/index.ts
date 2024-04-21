import { Logging } from '@google-cloud/logging';
import {
  Entry,
  StructuredJson,
  Timestamp
} from '@google-cloud/logging/build/src/entry';
import express, { Express, Request, Response, query } from 'express';
import cors from 'cors';
import axios from 'axios';
import countries from './countries';

const targetCache = './.cache/cache.json';

const PROJECT_ID: string = 'ssr-blog-prototype';
console.log(`Target project is: ${PROJECT_ID}`);
const logging = new Logging({ projectId: PROJECT_ID });

interface Flow {
  flow: { [key: string]: { [key: string]: number } };
  countries: Set<string>;
}
const flow: Flow = {
  flow: {},
  countries: new Set()
};

interface Event {
  serviceName?: string;
  sourceIp?: string;
  sourceCity?: string;
  sourceCountry?: string;
  requestMethod?: string;
  targetUrl?: string;
  targetUrlPath?: string;
  timestamp?: Timestamp;
}

// Dates to use as references.
let newDate = new Date();
let lastDate = new Date(newDate.getTime() - 6 * 60 * 60 * 1000); // Start with the last day of data.

/**
 * Splits a list into multiple chunks based on the chunk size.
 * @param data to split into chunks.
 * @param size of each chunk.
 * @returns a list full of chunks from the original data.
 */
const chunkify = (data: any[], size: number): any[][] => {
  const result: any[][] = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
};

const getLocationByIP = async (ips: string[]) => {
  return (
    await axios.post(
      // Free service, batching up to 100 queries, 45 RPM max
      'http://ip-api.com/batch',
      // Map the list of IPs to the format necessary.
      ips.map((ip) => {
        return {
          query: ip,
          fields: 'city,country,query,countryCode'
        };
      })
    )
  ).data;
};

const fetchLogs = async () => {
  // Get the new date for filtering.
  newDate = new Date();

  // Prep filters.
  const filterItems = [
    'resource.type="cloud_run_revision"',
    'severity=INFO',
    'log_name=~"/logs/run.googleapis.com%2Frequests"',
    `timestamp >= "${lastDate.toISOString()}"`,
    `timestamp < "${newDate.toISOString()}"`
  ];
  const filters = filterItems.join(' AND ');

  // Actually get the entries and map it to the JSON we are using.
  const result = await logging.getEntries({
    filter: filters
  });

  // Map some of the values.
  const entryList: Event[] = result[0].map((entryElem: Entry) => {
    const elem: StructuredJson = entryElem.toStructuredJSON();
    let targetUrl: string | undefined = (elem['httpRequest']! as any)[
      'requestUrl'
    ];
    return {
      serviceName: (elem['resource']! as any)['labels']['service_name'],
      sourceIp: (elem['httpRequest']! as any)['remoteIp'],
      requestMethod: (elem['httpRequest']! as any)['requestMethod'],
      targetUrl: targetUrl,
      targetUrlPath:
        targetUrl !== undefined ? new URL(targetUrl).pathname : undefined,
      timestamp: elem['timestamp']
    };
  });

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
  console.info(`Received ${entryList.length} records...`);

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
  let city, country;
  entryList.forEach((entry) => {
    city = ipLocationsMap[entry.sourceIp!]['city'];
    country =
      countries[ipLocationsMap[entry.sourceIp!]['countryCode'] as string];
    // Add country to set
    flow.countries.add(country);
    // Add country to city
    if (!flow.flow[country]) flow.flow[country] = {};
    if (!flow.flow[country][city!]) flow.flow[country][city!] = 0;
    flow.flow[country][city!] += 1;
    // Add from city to service
    if (!flow.flow[city]) flow.flow[city] = {};
    if (!flow.flow[city][entry.serviceName!])
      flow.flow[city][entry.serviceName!] = 0;
    flow.flow[city][entry.serviceName!] += 1;
    // Add from service to path
    if (!flow.flow[entry.serviceName!]) flow.flow[entry.serviceName!] = {};
    if (!flow.flow[entry.serviceName!][entry.targetUrlPath!])
      flow.flow[entry.serviceName!][entry.targetUrlPath!] = 0;
    flow.flow[entry.serviceName!][entry.targetUrlPath!] += 1;
  });

  console.log(flow);

  // Update the dates with the old one.
  lastDate = newDate;
};

// Interval runs in the background.
console.log('Fetching initial batch of logs...');
fetchLogs();
let interval = setInterval(fetchLogs, 1000 * 60 * 1);

// Initialize the express server.
console.log('Starting server...');
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);

// Configure app start.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handler for the traffic
app.get('/traffic', (req: Request, res: Response) => {
  res.json({ ...flow, countries: Array.from(flow.countries) });
});
