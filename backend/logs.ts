import { Logging, GetEntriesResponse } from '@google-cloud/logging';
import { Entry, StructuredJson } from '@google-cloud/logging/build/src/entry';
import { Event, LogHttpRequest, LogResource } from './interfaces';

export const getLogsForInterval = async (
  loggingClient: Logging,
  start: Date,
  end: Date
): Promise<GetEntriesResponse> => {
  // Prep filters.
  const filterItems = [
    'resource.type="cloud_run_revision"',
    'severity=INFO',
    'log_name=~"/logs/run.googleapis.com%2Frequests"',
    `timestamp >= "${start.toISOString()}"`,
    `timestamp < "${end.toISOString()}"`
  ];
  const filters = filterItems.join(' AND ');

  // Actually get the entries and map it to the JSON we are using.
  const result = await loggingClient.getEntries({
    filter: filters
  });

  return result;
};

export const mapLogsToEvents = (logs: GetEntriesResponse): Event[] => {
  // Map some of the values.
  const entryList: Event[] = logs[0].map((entryElem: Entry) => {
    const elem: StructuredJson = entryElem.toStructuredJSON();
    const targetUrl: string | undefined = (
      elem['httpRequest']! as LogHttpRequest
    )['requestUrl'];
    return {
      serviceName: (elem['resource']! as LogResource)['labels']['service_name'],
      sourceIp: (elem['httpRequest']! as LogHttpRequest)['remoteIp'],
      requestMethod: (elem['httpRequest']! as LogHttpRequest)['requestMethod'],
      targetUrl: targetUrl,
      targetUrlPath:
        targetUrl !== undefined ? new URL(targetUrl).pathname : undefined,
      timestamp: elem['timestamp']
    };
  });

  return entryList;
};
