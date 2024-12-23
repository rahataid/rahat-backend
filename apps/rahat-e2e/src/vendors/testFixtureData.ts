import * as dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';

export const vendorDto = {
    service: "EMAIL",
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    wallet: faker.finance.ethereumAddress(),
    extras: {
      "isVendor": true
    }
};

export const vendorEmail = {
  service: "EMAIL",
  name: faker.person.fullName(),
  email: "john@mailinator.com",
  phone: faker.phone.number(),
  wallet: faker.finance.ethereumAddress(),
  extras: {
    "isVendor": true
  }
};

export const invalidVendor = {
  service: "EMAIL",
  name: faker.person.fullName(),
  email: "john@mailinator.com",
  phone: faker.phone.number(),
  extras: {
    "isVendor": true
  }
};