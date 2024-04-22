import { Timestamp } from '@google-cloud/logging/build/src/entry';

export interface Configuration {
  mode: string;
  frequency: number;
  initialOffset: number;
  http: {
    port: number;
  };
  gcp: {
    project_id: string;
  };
}

export interface Flow {
  flow: { [key: string]: { [key: string]: number } };
  countries: Set<string>;
  timestamp: Date;
}

export interface Event {
  serviceName?: string;
  sourceIp?: string;
  sourceCity?: string;
  sourceCountry?: string;
  requestMethod?: string;
  targetUrl?: string;
  targetUrlPath?: string;
  timestamp?: Timestamp;
}
