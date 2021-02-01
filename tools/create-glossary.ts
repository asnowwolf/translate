// Imports the Google Cloud Translation library
import { TranslationServiceClient } from '@google-cloud/translate';
import { basename } from 'path';

// Instantiates a client
const translationClient = new TranslationServiceClient();
const projectId = 'ralph-gde';
const region = 'us-central1';

async function createGlossary(filename: string) {
  const glossaryName = `projects/${projectId}/locations/${region}/glossaries/${(basename(filename, '.csv'))}`;
  const existingGlossary = await translationClient.getGlossary({
    name: glossaryName,
  });
  if (existingGlossary.length > 0) {
    await translationClient.deleteGlossary({ name: glossaryName });
  }
  // Create glossary using a long-running operation
  const [operation] = await translationClient.createGlossary({
    parent: `projects/${projectId}/locations/${region}`,
    glossary: {
      languageCodesSet: {
        languageCodes: ['en', 'zh-Hans'],
      },
      inputConfig: {
        gcsSource: {
          inputUri: `gs://nt-glossaries/${basename(filename)}`,
        },
      },
      name: glossaryName,
    },
  });

  // Wait for the operation to complete
  await operation.promise();

  return {
    parent: `projects/${projectId}/locations/${region}`,
    glossary: {
      languageCodesSet: {
        languageCodes: ['en', 'zh-Hans'],
      },
      inputConfig: {
        gcsSource: {
          inputUri: `gs://nt-glossaries/${basename(filename)}`,
        },
      },
      name: glossaryName,
    },
  }.glossary.inputConfig.gcsSource.inputUri;
}

createGlossary('programming.csv')
  .then(result => console.log(`Created glossary: InputUri ${result}`))
  .catch((error) => console.error(error));
createGlossary('angular.csv')
  .then(result => console.log(`Created glossary: InputUri ${result}`))
  .catch((error) => console.error(error));
createGlossary('material.csv')
  .then(result => console.log(`Created glossary: InputUri ${result}`))
  .catch((error) => console.error(error));
