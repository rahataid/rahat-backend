// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
export const createListQuery = (dto: any) => {
  const AND_CONDITIONS = [];

  const queryKeys = Object.keys(dto);
  const queryValues = Object.values(dto);

  for (let i = 0; i < queryKeys.length; i++) {
    if (queryKeys[i] === 'gender') {
      AND_CONDITIONS.push({
        gender: queryValues[i],
      });
    }
    if (queryKeys[i] === 'type') {
      AND_CONDITIONS.push({
        type: queryValues[i],
      });
    }
  }

  return AND_CONDITIONS;
};

export const splitBeneficiaryPII = (beneficiary: any) => {
  const { firstName, lastName, phone, email, govtIDNumber, archived, deletedAt, ...rest } = beneficiary;
  const piiData = {
    name: `${beneficiary.firstName} ${beneficiary.lastName}`,
    phone: phone || '',
    email: email || '',
    extras: {
      govtIDNumber: govtIDNumber || ''
    }
  }
  const sanitized = sanitizeBeneficiaryPayload(rest);
  return { piiData, nonPii: sanitized }
}

const sanitizeBeneficiaryPayload = (beneficiary: any) => {
  if (beneficiary.id) delete beneficiary.id;
  if (beneficiary.uuid) delete beneficiary.uuid;
  if (beneficiary.targetUUID) delete beneficiary.targetUUID;
  if (beneficiary.groupName) delete beneficiary.groupName;
  if (beneficiary.createdAt) delete beneficiary.createdAt;
  if (beneficiary.updatedAt) delete beneficiary.updatedAt;

  return beneficiary;
}