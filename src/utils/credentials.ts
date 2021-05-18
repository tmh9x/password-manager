import fs from 'fs/promises';
import type { Credential } from '../types';
import CryptoJS from 'crypto-js';

type DB = {
  credentials: Credential[];
};

export const readCredentials = async (): Promise<Credential[]> => {
  const response = await fs.readFile('./db.json', 'utf-8');
  const data: DB = JSON.parse(response);
  return data.credentials;
};

export const writeCredentials = async (
  newCredential: Credential
): Promise<void> => {
  newCredential.password = CryptoJS.AES.encrypt(
    newCredential.password,
    'passwordHash'
  ).toString();

  const listCredentials = await readCredentials();
  listCredentials.push(newCredential);
  await fs.writeFile(
    './db.json',
    JSON.stringify({ credentials: listCredentials }, null, 2),
    'utf-8'
  );
};

export const deleteCredentials = async (
  selectedService: Credential
): Promise<void> => {
  const allCredentials = await readCredentials();
  const filteredCredentials = allCredentials.filter(
    (credential) => credential.service !== selectedService.service
  );
  await fs.writeFile(
    './db.json',
    JSON.stringify({ credentials: filteredCredentials }, null, 2),
    'utf-8'
  );
};
