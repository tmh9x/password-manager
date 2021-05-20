// import { printPassword } from './utils/messages';
import {
  deleteCredential,
  readCredentials,
  writeCredentials,
} from './utils/credentials';
import {
  askForCredential,
  askForMainPassword,
  chooseAction,
  chooseCommand,
  chooseService,
} from './utils/questions';
import {
  isMainPasswordValid,
  isServiceCredentialInDB,
} from './utils/validation';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './utils/database';

dotenv.config();

//   let mainPassword = await askForMainPassword();
//   while (!isMainPasswordValid(mainPassword));
//   console.log('Is invalid');
//   mainPassword = await askForMainPassword();
// };
// console.log('Is valid');
// const databaseURI =
//   'mongodb+srv://tmh9x:123@cluster0.m4srh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const start = async () => {
  if (process.env.MONGO_URL === undefined) {
    throw new Error('Missing env MONGO_URL');
  }

  await connectDatabase(process.env.MONGO_URL);

  let mainPassword = await askForMainPassword();
  while (!(await isMainPasswordValid(mainPassword))) {
    console.log('Is invalid');
    mainPassword = await askForMainPassword();
  }
  console.log('Is valid');

  const command = await chooseCommand();

  switch (command) {
    case 'list':
      {
        const action = await chooseAction();
        const credentials = await readCredentials();
        switch (action) {
          case 'show':
            {
              const credentialServices = credentials.map(
                (credential) => credential.service
              );
              const service = await chooseService(credentialServices);
              const selectedCredential = credentials.find(
                (credential) => credential.service === service
              );

              if (selectedCredential) {
                selectedCredential.password = CryptoJS.AES.decrypt(
                  selectedCredential.password,
                  'passwordHash'
                ).toString(CryptoJS.enc.Utf8);
                console.log(selectedCredential);
              }
            }
            break;
          case 'delete': {
            const credentialServices = credentials.map(
              (credential) => credential.service
            );
            const service = await chooseService(credentialServices);
            const selectedCredential = credentials.find(
              (credential) => credential.service === service
            );
            if (selectedCredential) {
              await deleteCredential(selectedCredential.service);
              console.log(selectedCredential);
            }
          }
        }
      }
      break;
    case 'add':
      console.log('Add Case');
      {
        const newCredential = await askForCredential();

        const existsInDb = await isServiceCredentialInDB(newCredential);
        if (existsInDb) {
          console.log('Credential already exists.');
        }
        await writeCredentials(newCredential);
        console.log(
          `Service: ${newCredential.service} with Username: ${newCredential.username} is saved in database`
        );
      }

      break;
  }
  await disconnectDatabase();
};

start();
