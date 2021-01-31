import { Storage } from '@google-cloud/storage';

// Creates a client
const storage = new Storage();

storage.bucket('ng-glossaries')
  .upload('src/dict/glossary/programming.csv')
  .then(() => console.log('glossaries uploaded'))
  .catch(console.error);
