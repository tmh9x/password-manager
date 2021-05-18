// import { printPassword } from './utils/messages';
import {
  deleteCredentials,
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

dotenv.config();

console.log(process.env.MONGO_URL);

//   let mainPassword = await askForMainPassword();
//   while (!isMainPasswordValid(mainPassword));
//   console.log('Is invalid');
//   mainPassword = await askForMainPassword();
// };
// console.log('Is valid');
// const databaseURI =
//   'mongodb+srv://tmh9x:123@cluster0.m4srh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const start = async () => {
  // await connectDatabase();

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
              const selectedService = credentials.find(
                (credential) => credential.service === service
              );

              if (selectedService) {
                selectedService.password = CryptoJS.AES.decrypt(
                  selectedService.password,
                  'passwordHash'
                ).toString(CryptoJS.enc.Utf8);
                console.log(
                  `The password for ${selectedService.service} with username: ${selectedService.username} is ${selectedService.password}.`
                );
              }
            }
            break;
          case 'delete': {
            const credentialServices = credentials.map(
              (credential) => credential.service
            );
            const service = await chooseService(credentialServices);
            const selectedService = credentials.find(
              (credential) => credential.service === service
            );
            if (selectedService) {
              deleteCredentials(selectedService);
              console.log(`${service} is removed from list.`);
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
};

start();
