// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import xlsx from 'xlsx';

export function ExcelParser(buffer: Buffer) {
  // Read the Excel workbook from the buffer
  const workbook = xlsx.read(buffer, {
    type: 'buffer',
    cellDates: true,
    cellNF: false,
    cellText: true,

  });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Parse the sheet data into JSON format
  let parsedData = xlsx.utils.sheet_to_json(sheet);

  // Recursive function to handle nested fields
  const processNestedField = (obj: any, keys: string[], value: any) => {
    const key = keys.shift();
    if (key !== undefined) {
      obj[key] = processNestedField(obj[key] || {}, keys, value);
      return obj;
    }
    return value;
  };

  // Process each record to handle nested fields
  parsedData = parsedData.map((record) => {
    const newRecord = {};
    Object.entries(record).forEach(([key, value]) => {
      // Split key into nested field hierarchy
      const keys = key.split('.');
      // Process nested fields
      processNestedField(newRecord, keys, value);
    });
    return newRecord;
  });

  return parsedData;
}
