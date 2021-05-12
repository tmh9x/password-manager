import { printPassword } from './utils/messages';
import {
  askForCredential,
  askForMainPassword,
  chooseCommand,
  chooseService,
} from './utils/questions';
import { isMainPasswordValid } from './utils/validation';

//   let mainPassword = await askForMainPassword();
//   while (!isMainPasswordValid(mainPassword));
//   console.log('Is invalid');
//   mainPassword = await askForMainPassword();
// };
// console.log('Is valid');

const start = async () => {
  const mainPassword = await askForMainPassword();
  if (!isMainPasswordValid(mainPassword)) {
    console.log('Is invalid');
    start();
  } else {
    console.log('Is valid');

    const command = await chooseCommand();

    switch (command) {
      case 'list':
        {
          const service = await chooseService(['GitHub', 'Codewars', 'Google']);
          printPassword(service);
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
