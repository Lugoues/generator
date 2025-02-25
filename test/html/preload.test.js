import { Generator } from '@jspm/generator';
import assert from 'assert';
import { SemverRange } from 'sver';
import { getIntegrity } from "../../lib/common/integrity.js";

const generator = new Generator({
  mapUrl: new URL('./local/page.html', import.meta.url),
  env: ['production', 'browser']
});

const esmsPkg = await generator.traceMap.resolver.resolveLatestTarget({ name: 'es-module-shims', registry: 'npm', ranges: [new SemverRange('*')] }, false, generator.traceMap.installer.defaultProvider);
const esmsUrl = generator.traceMap.resolver.pkgToUrl(esmsPkg, generator.traceMap.installer.defaultProvider) + 'dist/es-module-shims.js';
const esmsIntegrity = await getIntegrity(esmsUrl, {});

assert.strictEqual(await generator.htmlGenerate(`
<!doctype html>
<script type="module">
  import 'react';
</script>
`, { preload: true, integrity: true }), '\n' +
'<!doctype html>\n' +
`<script async src="${esmsUrl}" crossorigin="anonymous" integrity="${esmsIntegrity}"></script>\n` +
'<script type="importmap">\n' +
'{\n' +
'  "imports": {\n' +
'    "react": "https://ga.jspm.io/npm:react@17.0.2/index.js"\n' +
'  },\n' +
'  "scopes": {\n' +
'    "https://ga.jspm.io/": {\n' +
'      "object-assign": "https://ga.jspm.io/npm:object-assign@4.1.1/index.js"\n' +
'    }\n' +
'  }\n' +
'}\n' +
'</script>\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:react@17.0.2/index.js" integrity="sha384-XapV4O3iObT3IDFIFYCLWwO8NSi+SIOMlAWsO3n8+HsPNzAitpl3cdFHbe+msAQY" />\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:object-assign@4.1.1/index.js" integrity="sha384-iQp1zoaqIhfUYyYkz3UNk1QeFfmBGgt1Ojq0kZD5Prql1g7fgJVzVgsjDoR65lv8" />\n' +
'<script type="module">\n' +
"  import 'react';\n" +
'</script>\n');

// Idempotency
assert.strictEqual(await generator.htmlGenerate('\n' +
'<!doctype html>\n' +
`<script async src="${esmsUrl}"></script>\n` +
'<script type="importmap">\n' +
'{\n' +
'  "imports": {\n' +
'    "react": "https://ga.jspm.io/npm:react@17.0.2/index.js"\n' +
'  },\n' +
'  "scopes": {\n' +
'    "https://ga.jspm.io/": {\n' +
'      "object-assign": "https://ga.jspm.io/npm:object-assign@4.1.1/index.js"\n' +
'    }\n' +
'  }\n' +
'}\n' +
'</script>\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:react@17.0.2/index.js" integrity="sha384-XapV4O3iObT3IDFIFYCLWwO8NSi+SIOMlAWsO3n8+HsPNzAitpl3cdFHbe+msAQY" />\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:object-assign@4.1.1/index.js" integrity="sha384-iQp1zoaqIhfUYyYkz3UNk1QeFfmBGgt1Ojq0kZD5Prql1g7fgJVzVgsjDoR65lv8" />\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:react@17.0.2/cjs/react.production.min.js" integrity="sha384-vXMyhkZyH+f511olSQcszeIja6v6wqVgCllFQ5yk4qCDfVRzDEHt90aYx9e6V1KL" />\n' +
'<script type="module">\n' +
"  import 'react';\n" +
'</script>\n', { preload: true, integrity: true, whitespace: false }), '\n' +
'<!doctype html>\n' +
`<script async src="${esmsUrl}" crossorigin="anonymous" integrity="${esmsIntegrity}"></script>\n` +
'<script type="importmap">{"imports":{"react":"https://ga.jspm.io/npm:react@17.0.2/index.js"},"scopes":{"https://ga.jspm.io/":{"object-assign":"https://ga.jspm.io/npm:object-assign@4.1.1/index.js"}}}</script>\n' +
'<link rel="modulepreload" href="https://ga.jspm.io/npm:react@17.0.2/index.js" integrity="sha384-XapV4O3iObT3IDFIFYCLWwO8NSi+SIOMlAWsO3n8+HsPNzAitpl3cdFHbe+msAQY" /><link rel="modulepreload" href="https://ga.jspm.io/npm:object-assign@4.1.1/index.js" integrity="sha384-iQp1zoaqIhfUYyYkz3UNk1QeFfmBGgt1Ojq0kZD5Prql1g7fgJVzVgsjDoR65lv8" />\n' +
'<script type="module">\n' +
"  import 'react';\n" +
'</script>\n');
