import type { TelemetryOptions } from './types';

/**
 * Telemetry runtime configuration environment variables:
 *
 * - `ISS_TELEMETRY_OUTPUT_DIR`: output directory for Node filesystem telemetry (default: 'tmp/telemetry')
 * - `ISS_TELEMETRY_INCLUDE_TIMESTAMP`: prepend timestamp to output filenames (default: false)
 * - `ISS_TELEMETRY_LOG_FILE`: filename for telemetry history (default: 'telemetry-log.json')
 * - `ISS_TELEMETRY_AGGREGATE_FILE`: filename for telemetry aggregate (default: 'telemetry-aggregate.json')
 *
 * This configuration applies only to the Node filesystem implementation.
 * Browser consumers using `@iss/telemetry/browser` are not affected.
 */

export const resolveTelemetryConfig = (env?: NodeJS.ProcessEnv): TelemetryOptions => {
  const environment = env ?? process.env;

  return {
    outputDir: environment.ISS_TELEMETRY_OUTPUT_DIR ?? 'tmp/telemetry',
    fileName: environment.ISS_TELEMETRY_LOG_FILE ?? 'telemetry-log.json',
    aggregateFileName: environment.ISS_TELEMETRY_AGGREGATE_FILE ?? 'telemetry-aggregate.json',
    includeTimestampInFileName: environment.ISS_TELEMETRY_INCLUDE_TIMESTAMP === 'true',
  };
};
