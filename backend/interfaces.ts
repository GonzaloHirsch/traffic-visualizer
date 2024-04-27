import { Timestamp } from '@google-cloud/logging/build/src/entry';

enum FlowTypes {
  Normal = 'normal',
  CountryToPath = 'country_path',
  CountryToService = 'country_service',
  CityToPath = 'city_path',
  CityToService = 'city_service'
}

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

export interface ExtendedFlow {
  flows: {
    [key in FlowTypes]: {
      [key: string]: { [key: string]: number };
    };
  };
  countries: Set<string> | Array<string>;
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

export interface IPInformation {
  city: string;
  country: string;
  query: string;
  countryCode: string;
}

export interface LogHttpRequest {
  requestUrl: string;
  remoteIp: string;
  requestMethod: string;
}

export interface LogResource {
  labels: {
    service_name: string;
  };
}
