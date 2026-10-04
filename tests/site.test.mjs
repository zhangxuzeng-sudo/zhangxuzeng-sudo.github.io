import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {markdown} from '../scripts/lib.mjs';
const root=path.resolve(import.meta.dirname,'..');
test('article HTML and unsafe links are escaped',()=>{
  const html=markdown('<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))');
  assert(!html.includes('<script>')); assert(!html.includes('href="javascript:'));
});
test('drafts and future articles are absent from public output; links support project paths',()=>{
  const fixture={slug:'qa-unpublished',date:'2020-01-01',category:'ai',kind:'original',published:false,title_zh:'PRIVATE_DRAFT_SENTINEL',title_en:'Private draft',summary_zh:'测试',summary_en:'Test',body_zh:'测试',body_en:'Test'};
  const directory=path.join(root,'content/posts');
  const names=['qa-unpublished.json','qa-future.json'];
  fs.writeFileSync(path.join(directory,names[0]),JSON.stringify(fixture));
  fs.writeFileSync(path.join(directory,names[1]),JSON.stringify({...fixture,slug:'qa-future',date:'2099-01-01',published:true,title_zh:'FUTURE_POST_SENTINEL'}));
  try {
    const run=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,env:{...process.env,SITE_URL:'https://anonymous.example/journal',BASE_PATH:'/journal'},encoding:'utf8'});
    assert.equal(run.status,0,run.stderr);
    const dist=path.join(root,'dist');
    for(const file of fs.readdirSync(dist,{recursive:true}).filter(f=>/\.(html|xml|json)$/.test(f))){
      const text=fs.readFileSync(path.join(dist,file),'utf8');
      assert(!text.includes('PRIVATE_DRAFT_SENTINEL'));assert(!text.includes('FUTURE_POST_SENTINEL'));
      if(!file.endsWith('.html')) continue;
      for(const match of text.matchAll(/(?:href|src)="(\/journal\/[^"#?]*)/g)) assert(fs.existsSync(path.join(dist,match[1].slice('/journal/'.length))), 'Broken link '+match[1]);
    }
  } finally {for(const name of names) fs.unlinkSync(path.join(directory,name));}
});
