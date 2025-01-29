// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export function createBatches(total: number | any[], batchSize: number) {
  if (Array.isArray(total)) {
    const batches = [];
    let start = 0;

    while (start < total.length) {
      const end = Math.min(start + batchSize, total.length);
      const batch = total.slice(start, end);
      batches.push(batch);
      start += batchSize;
    }

    return batches;
  } else {
    const batches = [];
    let start = 1;

    while (start <= total) {
      const end = Math.min(start + batchSize - 1, total);
      batches.push({
        size: end - start + 1,
        start: start,
        end: end,
      });
      start = end + 1;
    }

    return batches;
  }
}
