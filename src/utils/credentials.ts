import type { Credential } from '../types';
import { getCredentialsCollection } from './database';
import CryptoJS from 'crypto-js';

export const readCredentials = async (): Promise<Credential[]> => {
  return await getCredentialsCollection().find().sort({ service: 1 }).toArray();
  // const data: DB = JSON.parse(response);
  // return data.credentials;
};

export const writeCredentials = async (
  newCredential: Credential
): Promise<void> => {
  newCredential.password = CryptoJS.AES.encrypt(
    newCredential.password,
    'passwordHash'
  ).toString();
  await getCredentialsCollection().insertOne(newCredential);
};

// export const deleteCredentials = async (
//   selectedService: Credential
// ): Promise<void> => {
//   const allCredentials = await readCredentials();
//   const filteredCredentials = allCredentials.filter(
//     (credential) => credential.service !== selectedService.service
//   );
//   await fs.writeFile(
//     './db.json',
//     JSON.stringify({ credentials: filteredCredentials }, null, 2),
//     'utf-8'
//   );
// };
