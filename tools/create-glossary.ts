// Imports the Google Cloud Translation library
import { TranslationServiceClient } from '@google-cloud/translate';

// Instantiates a client
const translationClient = new TranslationServiceClient();
const projectId = 'ralph-gde';
const region = 'us-central1';
const glossaryId = 'programming';

async function createGlossary() {
  // Construct glossary
  const glossary = {
    languageCodesSet: {
      languageCodes: ['en', 'zh-Hans'],
    },
    inputConfig: {
      gcsSource: {
        inputUri: 'gs://ng-glossaries/programming.csv',
      },
    },
    name: `projects/${projectId}/locations/${region}/glossaries/${glossaryId}`,
  };

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/${region}`,
    glossary: glossary,
  };

  try {
    // Create glossary using a long-running operation
    const [operation] = await translationClient.createGlossary(request);

    // Wait for the operation to complete
    await operation.promise();

    console.log('Created glossary:');
    console.log(`InputUri ${request.glossary.inputConfig.gcsSource.inputUri}`);
  } catch (error) {
    console.error(error);
  }
}

createGlossary().then(result => {
  console.log(result);
});
