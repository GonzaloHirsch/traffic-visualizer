import { ExtendedFlow, Event } from './interfaces';

export const buildFlow = (
  flow: ExtendedFlow,
  country: string,
  city: string,
  entry: Event
) => {
  // Add country to set
  flow.countries.add(country);
  // Builds the country to path flows
  if (!flow.flows.country_path[country]) {
    flow.flows.country_path[country] = {};
  }
  if (!flow.flows.country_path[country][entry.targetUrlPath!]) {
    flow.flows.country_path[country][entry.targetUrlPath!] = 0;
  }
  flow.flows.country_path[country][entry.targetUrlPath!] += 1;
  // Builds the country to service flows
  if (!flow.flows.country_service[country]) {
    flow.flows.country_service[country] = {};
  }
  if (!flow.flows.country_service[country][entry.serviceName!]) {
    flow.flows.country_service[country][entry.serviceName!] = 0;
  }
  flow.flows.country_service[country][entry.serviceName!] += 1;
  // Builds the city to path flows
  if (!flow.flows.city_path[city]) {
    flow.flows.city_path[city] = {};
  }
  if (!flow.flows.city_path[city][entry.targetUrlPath!]) {
    flow.flows.city_path[city][entry.targetUrlPath!] = 0;
  }
  flow.flows.city_path[city][entry.targetUrlPath!] += 1;
  // Builds the city to service flows
  if (!flow.flows.city_service[city]) {
    flow.flows.city_service[city] = {};
  }
  if (!flow.flows.city_service[city][entry.serviceName!]) {
    flow.flows.city_service[city][entry.serviceName!] = 0;
  }
  flow.flows.city_service[city][entry.serviceName!] += 1;
  // Builds the normal flows
  // Add country to city
  if (!flow.flows.normal[country]) {
    flow.flows.normal[country] = {};
  }
  if (!flow.flows.normal[country][city!]) {
    flow.flows.normal[country][city!] = 0;
  }
  if (country !== city) {
    flow.flows.normal[country][city!] += 1;
  }
  // Add from city to service
  if (!flow.flows.normal[city]) {
    flow.flows.normal[city] = {};
  }
  if (!flow.flows.normal[city][entry.serviceName!]) {
    flow.flows.normal[city][entry.serviceName!] = 0;
  }
  flow.flows.normal[city][entry.serviceName!] += 1;
  // Add from service to path
  if (!flow.flows.normal[entry.serviceName!]) {
    flow.flows.normal[entry.serviceName!] = {};
  }
  if (!flow.flows.normal[entry.serviceName!][entry.targetUrlPath!]) {
    flow.flows.normal[entry.serviceName!][entry.targetUrlPath!] = 0;
  }
  flow.flows.normal[entry.serviceName!][entry.targetUrlPath!] += 1;
};
