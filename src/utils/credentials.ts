import type { Credential } from '../types';
import { getCredentialsCollection } from './database';
import CryptoJS from 'crypto-js';

export const readCredentials = async (): Promise<Credential[]> => {
  return await getCredentialsCollection().find().sort({ service: 1 }).toArray();
  // const data: DB = JSON.parse(response);
  // return data.credentials;
};

export const readCredential = async (service: string): Promise<Credential> => {
  const credential = await getCredentialsCollection().findOne({ service });
  if (!credential) {
    throw new Error('Can not find Credential');
  }
  return credential;
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

export const deleteCredential = async (service: string): Promise<void> => {
  await getCredentialsCollection().deleteOne({ service });
};
