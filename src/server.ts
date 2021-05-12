// import { printPassword } from './utils/messages';
import {
  askForCredential,
  askForMainPassword,
  chooseCommand,
  chooseService,
} from './utils/questions';
import { isMainPasswordValid } from './utils/validation';
import { readCredentials } from './utils/credentials';

//   let mainPassword = await askForMainPassword();
//   while (!isMainPasswordValid(mainPassword));
//   console.log('Is invalid');
//   mainPassword = await askForMainPassword();
// };
// console.log('Is valid');

const start = async () => {
  const mainPassword = await askForMainPassword();
  if (!(await isMainPasswordValid(mainPassword))) {
    console.log('Is invalid');
    start();
  } else {
    console.log('Is valid');

    const command = await chooseCommand();

    switch (command) {
      case 'list':
        {
          const credentials = await readCredentials();
          const credentialServices = credentials.map(
            (credential) => credential.service
          );
          const service = await chooseService(credentialServices);
          const selectedService = credentials.find(
            (credential) => credential.service === service
          );
          console.log(selectedService);
          // printPassword(service);
        }
        break;
      case 'add':
        {
          const newCredential = await askForCredential();
          console.log(newCredential);
        }
        break;
    }
  }
};

start();
