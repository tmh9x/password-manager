import inquirer from 'inquirer';
import { Command, Credential } from '../types';

// export function askForMainPassword(); Promise<string> {
export const askForMainPassword = (): Promise<string> => {
  return inquirer
    .prompt<{ mainPassword: string }>([
      {
        type: 'password',
        name: 'mainPassword',
        message: 'Enter main password',
      },
    ])
    .then((answers) => answers.mainPassword);
};

export const chooseCommand = async (): Promise<Command> => {
  const answers = await inquirer.prompt<{ command: Command }>({
    type: 'list',
    name: 'command',
    message: 'What do you wand to do?',
    choices: [
      { name: 'List all credentials', value: 'list' },
      { name: 'Add new credential', value: 'add' },
    ],
  });
  return answers.command;
};

export const chooseService = async (services: string[]): Promise<string> => {
  const answers = await inquirer.prompt<{ service: string }>({
    type: 'list',
    name: 'service',
    message: 'Please choose a service',
    choices: services,
  });
  return answers.service;
};

export const askForCredential = async (): Promise<Credential> => {
  const answers = await inquirer.prompt<Credential>([
    {
      type: 'text',
      name: 'service',
      message: 'Please enter a service',
    },
    {
      type: 'text',
      name: 'username',
      message: 'Please enter a username',
    },
    {
      type: 'text',
      name: 'password',
      message: 'Please enter a password',
    },
  ]);
  return answers;
};
