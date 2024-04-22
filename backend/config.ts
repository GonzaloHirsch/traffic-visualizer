import nconf from 'nconf';
import { Configuration } from './interfaces';
import { exit } from 'process';

export const loadConfig = (): Configuration => {
  // Load configurations.
  nconf.argv().env({ separator: '__', lowerCase: true });
  nconf.file({ file: 'viz.config.json' });
  nconf.defaults({
    mode: 'NO_CACHE',
    frequency: 60 * 1,
    initialOffset: 6 * 60 * 60,
    http: {
      port: 3000
    }
  } as Configuration);

  // Get the config as my types.
  const config = nconf.get() as Configuration;

  // Do some mappings over the variables
  config.frequency *= 1000;
  config.initialOffset *= 1000;

  // Run some checks against the variables.
  if (!config?.gcp?.project_id) {
    console.error('Missing required gcp.project_id configuration.');
    exit(1);
  }

  return config;
};
