export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://desarrollo-web-integrado-back.onrender.com';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  console.log('🌐 Iniciando llamada a API:', `${API_BASE}${path}`);
  console.log('🔧 Opciones:', opts);

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });

  const text = await res.text();
  console.log('📄 Respuesta cruda:', text.substring(0, 200) + '...');
  console.log('📊 Estado HTTP:', res.status);

  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      console.error('❌ Error en respuesta:', data || { status: res.status, body: text });
      throw data || { status: res.status, body: text };
    }
    console.log('✅ Respuesta parseada exitosamente');
    return data;
  } catch (e) {
    if (!res.ok) {
      console.error('❌ Error en respuesta (no JSON):', { status: res.status, body: text });
      throw { status: res.status, body: text };
    }
    console.log('⚠️ Respuesta no es JSON, retornando texto');
    return text;
  }
}