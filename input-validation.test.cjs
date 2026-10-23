const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('./node_modules/typescript');
const source = fs.readFileSync('src/App.tsx', 'utf8');
const handler = source.slice(source.indexOf('const handleJsonInput'), source.indexOf('const handleServerAdd'));
const code = ts.transpileModule(`${handler}; globalThis.handler = handleJsonInput;`, {}).outputText;
for (const value of [null, [], {}, {mcpServers: null}, {mcpServers: []}, {mcpServers: 'invalid'}]) {
  let status;
  let updated = false;
  const context = {setJsonContent: () => {updated = true;}, setUploadStatus: x => {status = x;}, setIsInstructionsOpen: () => {}, console: {error: () => {}}};
  vm.runInNewContext(code, context);
  context.handler({target: {value: JSON.stringify(value)}});
  assert.equal(status, 'error');
  assert.equal(updated, false);
}
for (const value of [{mcpServers: {}}, {mcpServers: {synthetic: {command: 'mock', args: []}}}]) {
  let status;
  let updated;
  const context = {setJsonContent: x => {updated = x;}, setUploadStatus: x => {status = x;}, setIsInstructionsOpen: () => {}, console};
  vm.runInNewContext(code, context);
  context.handler({target: {value: JSON.stringify(value)}});
  assert.equal(status, 'success');
  assert.equal(JSON.stringify(updated), JSON.stringify(value));
}
console.log('8 synthetic input-handler checks passed');
