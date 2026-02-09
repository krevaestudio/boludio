export const validateBoludioPost = (text) => {
  const maxLength = 220;
  // Usamos el texto original para el largo, pero para el check de "argento" 
  // le quitamos los saltos de línea para que la regex no se maree
  const cleanText = text.replace(/\n/g, ' ').toLowerCase();

  // Regex mejorada: acepta boludo, boluda, bolude, boludx, boluds y sus variantes con puntos/ceros
  // El final [o0aexs] cubre casi todas las variantes inclusivas
  const isArgento = /b[o0.]l[u.][d|ð][o0aexs]/i.test(cleanText);

  if (text.trim().length === 0) {
    return {
      valid: false,
      error: "No podés publicar el vacío cósmico, escribí algo, boludo.",
    };
  }

  if (text.length > maxLength) {
    return {
      valid: false,
      error: `Te pasaste por ${text.length - maxLength} caracteres. Cortala un poco, boludo.`,
    };
  }

  if (!isArgento) {
    return {
      valid: false,
      error: "Falta el 'boludo'. Esto es bolud.io, no LinkedIn.",
    };
  }

  return { valid: true, error: null };
};