const form=document.querySelector('#editor'), status=document.querySelector('#editor-status');
const KEY='kafka-editor-draft-v1';
const report=s=>status.textContent=s;
form.elements.date.value=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});
function data(){const p=Object.fromEntries(new FormData(form));p.published=p.published==='true';p.author_zh='海边的卡夫卡';return p;}
function populate(p){for(const [key,value]of Object.entries(p))if(form.elements.namedItem(key))form.elements.namedItem(key).value=String(value);}
function verify(p){if(!form.reportValidity())return false;if(p.kind==='reading'&&(!p.source_url||!p.source_title||!p.source_author||!p.source_date)){report('阅读推荐需要原文标题、作者、日期和链接。');return false;}if(p.source_url){try{if(!['https:','http:'].includes(new URL(p.source_url).protocol))throw Error();}catch{report('原文链接须为 HTTP(S)。');return false;}}return true;}
let posts=[];
const base=new URL('../',location.href);
fetch(new URL('assets/site.json',base)).then(r=>r.json()).then(site=>{if(/^https:\/\//.test(site.cms_url))document.querySelector('#cms-link').href=site.cms_url;}).catch(()=>{});
fetch(new URL('assets/posts.json',base)).then(r=>{if(!r.ok)throw Error();return r.json();}).then(items=>{posts=items;const select=document.querySelector('#post-choice');posts.forEach(p=>{const option=document.createElement('option');option.value=p.slug;option.textContent=p.title_zh;select.append(option);});}).catch(()=>report('文章列表暂时无法载入；仍可新建或导入稿件。'));
document.querySelector('#post-choice').addEventListener('change',event=>{const post=posts.find(p=>p.slug===event.target.value);if(post){populate(post);report('已载入文章副本；更改仍在本机。');}else{form.reset();form.elements.date.value=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'});}});
document.querySelector('#save').addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify(data()));report('草稿已保存到当前浏览器，尚未发布。');}catch{report('浏览器不允许本机存储，请导出文件备份。');}});
document.querySelector('#restore').addEventListener('click',()=>{try{const raw=localStorage.getItem(KEY);if(!raw){report('没有本机草稿。');return;}populate(JSON.parse(raw));report('本机草稿已恢复。');}catch{report('无法恢复草稿。');}});
document.querySelector('#clear').addEventListener('click',()=>{try{localStorage.removeItem(KEY);report('已清除浏览器中保存的草稿；编辑框仍保留内容。');}catch{report('无法访问浏览器存储。');}});
document.querySelector('#import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;if(file.size>2_000_000){report('文件过大，限 2 MB。');return;}try{const p=JSON.parse(await file.text());if(!p||Array.isArray(p)||typeof p!=='object')throw Error();populate(p);report('文件已导入；请检查内容和发布状态。');}catch{report('无法读取：请选择文章 JSON 文件。');}});
form.addEventListener('submit',event=>{event.preventDefault();const p=data();if(!verify(p))return;const blob=new Blob([JSON.stringify(p,null,2)+'\n'],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=p.slug+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);report('文章文件已导出，尚未发布。可交给助手或在 GitHub 上传到 content/posts/。');});
document.querySelector('#preview').addEventListener('click',()=>{const p=data();document.querySelector('#preview-panel').hidden=false;document.querySelector('#local-preview').textContent=p.title_zh+'\n\n'+p.summary_zh+'\n\n'+p.body_zh+'\n\n———————— English ————————\n\n'+p.title_en+'\n\n'+p.summary_en+'\n\n'+p.body_en;report('已显示稿件内容预览，网站排版以构建后的文章页为准。');});
