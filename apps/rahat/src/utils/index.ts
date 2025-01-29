// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const splitCoordinates = (coordinateString: string) => {
  const [lat, lng, altitude, accuracy] = coordinateString.split(' ');

  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng),
    altitude: parseFloat(altitude),
    accuracy: parseFloat(accuracy),
  };
};

export const createExtrasAndPIIData = (beneficiary: any) => {
  if (beneficiary.coordinates) delete beneficiary.coordinates;
  const {
    name,
    phone,
    email,
    age,
    gender,
    province,
    district,
    wardNo,
    meta,
    type,
    ...rest
  } = beneficiary;
  const extras = { ...rest, province, district, wardNo, meta };
  const piiData = { name, phone, email };
  const payload = { type, age, gender, piiData, extras };
  return payload;
};
export function removeSpaces(phoneNumber: string): string {
  return phoneNumber.replace(/\s+/g, '');
}
