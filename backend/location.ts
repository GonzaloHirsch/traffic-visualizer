import axios from 'axios';
import { IPInformation } from './interfaces';

/**
 * Fetches country information for each IP on a given list using the `http://ip-api.com/batch` api.
 * @param ips list of IPs to query for information.
 * @returns a list of IP information objects.
 */
export const getLocationByIP = async (
  ips: string[]
): Promise<IPInformation[]> => {
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
