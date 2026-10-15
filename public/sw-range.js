/* Sirve una respuesta guardada completa como 206 cuando el navegador pide un rango (iOS lo hace con el audio). */
self.rangeResponse = async (request, cached) => {
  // Un solo rango; si viene vacío, con otra unidad o con varios tramos, se devuelve el archivo completo.
  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
  if (!match || (match[1] === '' && match[2] === '')) return cached;
  const buffer = await cached.arrayBuffer();
  const size = buffer.byteLength;
  const start = match[1] === '' ? Math.max(0, size - Number(match[2])) : Number(match[1]);
  const end = match[1] === '' || match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }
  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
};
