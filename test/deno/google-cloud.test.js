import { Generator } from '@jspm/generator';
import { denoExec } from '#test/deno';

const generator = new Generator({
  env: ['production', 'node', 'deno', 'module']
});

await generator.install('@google-cloud/storage');
await generator.install('assert');

const map = generator.getMap();

await denoExec(map, `
  import { Storage } from '@google-cloud/storage';
  import assert from 'assert';

  const storage = new Storage();
  const [metadata] = await storage.bucket("fakebucket").getMetadata();
`);
