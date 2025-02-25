import { Generator } from '@jspm/generator';
import assert from 'assert';
import { SemverRange } from 'sver';

const generator = new Generator({
  mapUrl: new URL('./local/page.html', import.meta.url),
  env: ['production', 'browser']
});

const esmsPkg = await generator.traceMap.resolver.resolveLatestTarget({ name: 'es-module-shims', registry: 'npm', ranges: [new SemverRange('*')] }, false, generator.traceMap.installer.defaultProvider);
const esmsUrl = generator.traceMap.resolver.pkgToUrl(esmsPkg, generator.traceMap.installer.defaultProvider) + 'dist/es-module-shims.js';

assert.strictEqual(await generator.htmlGenerate(`
<!doctype html>
<script type="module">
  import 'react';
</script>
`), '\n' +
'<!doctype html>\n' +
`<script async src="${esmsUrl}" crossorigin="anonymous"></script>\n` +
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
'<script type="module">\n' +
"  import 'react';\n" +
'</script>\n'), '\n' +
'<!doctype html>\n' +
`<script async src="${esmsUrl}" crossorigin="anonymous"></script>\n` +
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
'<script type="module">\n' +
"  import 'react';\n" +
'</script>\n');
