export const validateBoludioPost = (text) => {
  const maxLength = 220;
  const lowerText = text.toLowerCase();

  // Expresión regular para buscar "boludo" o "boluda"
  // incluso si le ponen espacios o puntos (ej: b.o.l.u.d.o)
  const isArgento = /b[o0.]l[u-][d|ð][o0a]/i.test(lowerText);

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
