export function textoValido(valor, limite) {
  return typeof valor === "string" && valor.trim().length > 0 && valor.trim().length <= limite;
}

export function inteiroPositivo(valor) {
  return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}

export function numeroNaoNegativo(valor) {
  return valor !== null && valor !== "" && Number.isFinite(Number(valor)) && Number(valor) >= 0;
}

export function emailValido(valor) {
  return typeof valor === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim());
}
