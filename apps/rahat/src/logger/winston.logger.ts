// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { createLogger, format, transports } from 'winston';

// custom log display format
const customFormat = format.printf((info) => {
  return `${info.timestamp} ${info.level}: [${info.context || 'RumsanApp'}] ${
    info.message
  }`;
});

const options = {
  file: {
    filename: 'error.log',
    level: 'error',
  },
  console: {
    level: 'silly',
  },
};

// for development environment
const devLogger = {
  format: format.combine(
    format((info) => ({ ...info, level: info.level.toUpperCase() }))(),
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD, HH:mm:ss' }),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [new transports.Console(options.console)],
};

// for production environment
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'combine.log',
      level: 'info',
    }),
  ],
};

// export log instance based on the current environment
const envLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const loggerInstance = createLogger(envLogger);
