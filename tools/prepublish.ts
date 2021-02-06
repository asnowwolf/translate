import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const content = readFileSync(join(__dirname, '../package.json'), 'utf8');
const json = JSON.parse(content);
delete json.devDependencies;
delete json.scripts;
json.private = false;
writeFileSync(join(__dirname, '../dist/package.json'), JSON.stringify(json, null, 2));
