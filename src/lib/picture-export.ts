import { isRTL, type Picture } from './pics';

export async function exportPicture(picture: Picture): Promise<Blob> {
 await document.fonts.ready;
 const image = new Image(); image.src = picture.src;
 await image.decode();
 const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1080;
 const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image export is unavailable.');
 ctx.drawImage(image, 0, 0, 1080, 1080);
 const styles = getComputedStyle(document.documentElement);
 ctx.fillStyle = styles.getPropertyValue(picture.tone === 'light' ? '--picture-light' : '--picture-dark').trim();
 ctx.direction = isRTL(picture.text) ? 'rtl' : 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
 const text = picture.text;
 const family = '"Lora", "Noto Sans Malayalam", "Noto Sans Arabic", serif';
 let size = 82;
 let lines: string[] = [];
 function wrap(context: CanvasRenderingContext2D, fontSize: number) {
  context.font = `500 ${fontSize}px ${family}`;
  const result: string[] = [];
  for(const paragraph of text.split('\n')) {
   let line = '';
   for(const word of paragraph.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if(context.measureText(next).width > 900 && line) {result.push(line); line = word;} else line = next;
   }
   if(line) result.push(line);
  }
  return result;
 }
 for(;size > 18;size -= 2) { lines = wrap(ctx, size); if(lines.length <= 4 && lines.every(line => ctx.measureText(line).width <= 900)) break; }
 const lineHeight = size * 1.4;
 const base = picture.placement === 'bottom' ? 910 - lines.length * lineHeight : 155;
 if(picture.tone === 'light') { ctx.shadowColor = styles.getPropertyValue('--picture-shadow').trim(); ctx.shadowBlur = 18; }
 lines.forEach((line,index) => ctx.fillText(line,540,base + index * lineHeight));
 if(picture.subtitle) {ctx.font = '400 30px "DM Sans", "Noto Sans Malayalam", sans-serif'; ctx.fillText(picture.subtitle,540,base + lines.length * lineHeight + 12,900);}
 return new Promise((resolve,reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not export this picture.')),'image/png'));
}
export async function downloadPicture(picture: Picture) {
 const blob = await exportPicture(picture); const url = URL.createObjectURL(blob);
 const link = document.createElement('a'); link.href = url; link.download = `lamill-pics-${picture.slug ?? picture.id}.png`; link.click();
 setTimeout(() => URL.revokeObjectURL(url), 10000);
}
/** Web Share with the PNG attached; falls back to a wa.me text link. Returns a user-facing notice ('' if cancelled). */
export async function sharePicture(picture: Picture, url?: string): Promise<{ notice: string; method: 'web_share' | 'whatsapp' | 'cancelled' }> {
 try {
  const blob = await exportPicture(picture); const file = new File([blob], `lamill-pics-${picture.slug ?? picture.id}.png`, { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: picture.title }); return { notice: 'Picture shared.', method: 'web_share' }; }
  const text = encodeURIComponent(`${picture.title} — made with LaMill Pics${url ? ` ${url}` : ''}`);
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener');
  return { notice: 'Opening WhatsApp. Download the picture to attach it.', method: 'whatsapp' };
 } catch (error) {
  if (error instanceof Error && error.name === 'AbortError') return { notice: '', method: 'cancelled' };
  throw error;
 }
}
