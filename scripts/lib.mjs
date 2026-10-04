export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validURL(value) {
  try { return ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; }
}
// Small, deliberately safe Markdown subset. Raw HTML is always displayed as text.
export function markdown(value) {
  const inline = s => escape(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => validURL(url.replace(/&amp;/g,'&')) ? `<a href="${url}" rel="noopener noreferrer">${label}</a>` : label).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>');
  return String(value).replace(/\r/g,'').split(/\n\s*\n/).filter(Boolean).map(block => {
    if (/^#{1,3} /.test(block)) { const n = block.match(/^#+/)[0].length + 1; return `<h${n}>${inline(block.replace(/^#+ /,''))}</h${n}>`; }
    if (block.split('\n').every(l => /^- /.test(l))) return `<ul>${block.split('\n').map(l=>`<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
    if (block.startsWith('> ')) return `<blockquote>${inline(block.replace(/^> /gm,''))}</blockquote>`;
    return `<p>${inline(block).replace(/\n/g,'<br>')}</p>`;
  }).join('\n');
}
export function validatePost(p) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug ?? '')) throw Error('slug 必须为小写英文字母、数字和连字符');
  if (!['a-shares','ai'].includes(p.category)) throw Error('未知栏目');
  if (!['reading','original'].includes(p.kind)) throw Error('未知内容类型');
  if (typeof p.published !== 'boolean') throw Error('published 必须为布尔值');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date ?? '') || Number.isNaN(Date.parse(p.date)) || new Date(p.date).toISOString().slice(0,10) !== p.date) throw Error('无效日期');
  for (const lang of ['zh','en']) for (const field of ['title','summary','body']) if (!String(p[`${field}_${lang}`] ?? '').trim()) throw Error(`缺少 ${field}_${lang}`);
  if (p.kind === 'reading' && (!validURL(p.source_url) || !p.source_title || !p.source_author || !p.source_date)) throw Error('阅读推荐需要完整来源');
  if (p.source_url && !validURL(p.source_url)) throw Error('来源链接须为 HTTP(S)');
  return p;
}
