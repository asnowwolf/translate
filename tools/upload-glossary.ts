import * as gs from '@google-cloud/storage';
import { readFileSync, writeFileSync } from 'fs';

// Creates a client
const storage = new gs.Storage();

function mergeTsvsToCsv(tsvFiles: string[], csvFile: string): string {
  const tsvLines = tsvFiles.map(it => readFileSync(it, 'utf8').split('\n')).flat().map(it => it.trim());
  const csvLines = tsvLines.filter(it => !!it).map(it => it.split('\t')).map(it => `${it[0].trim()},${it[1].trim()},${it[2]?.trim() ?? ''}`);
  const result = [`en,zh-Hans,pos`, ...csvLines].join('\n');
  writeFileSync(csvFile, result, 'utf8');
  return csvFile;
}

async function uploadAll() {
  await storage.bucket('nt-glossaries')
    .upload(mergeTsvsToCsv(['src/dict/glossary/programming.tsv'], './temp/programming.csv'))
    .then(() => console.log('glossaries for programming uploaded'))
    .catch(console.error);

  await storage.bucket('nt-glossaries')
    .upload(mergeTsvsToCsv([
      'src/dict/glossary/programming.tsv',
      'src/dict/glossary/angular.tsv',
    ], './temp/angular.csv'))
    .then(() => console.log('glossaries for angular uploaded'))
    .catch(console.error);

  await storage.bucket('nt-glossaries')
    .upload(mergeTsvsToCsv([
      'src/dict/glossary/programming.tsv',
      'src/dict/glossary/angular.tsv',
      'src/dict/glossary/material.tsv',
    ], './temp/material.csv'))
    .then(() => console.log('glossaries for material uploaded'))
    .catch(console.error);
}

uploadAll();
