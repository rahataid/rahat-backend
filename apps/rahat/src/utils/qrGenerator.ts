// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import QRCode from 'qrcode';

export async function generateQRCode(input) {
    return QRCode.toBuffer(input.toString())
        .then((buffer) => {
            return buffer
        })
        .catch((err) => {
            console.error(err);
        });
}
