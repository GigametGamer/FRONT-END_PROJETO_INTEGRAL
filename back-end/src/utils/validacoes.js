export function textoValido(valor, limite) {
    return typeof valor === "string" && valor.trim().length > 0 && valor.trim().length <= limite;
}
export function inteiroPositivo(valor) {
    return typeof valor === "number" && Number.isSafeInteger(valor) && valor > 0;
}
export function inteiroNaoNegativo(valor) {
    return typeof valor === "number" && Number.isSafeInteger(valor) && valor >= 0;
}
export function numeroNaoNegativo(valor) {
    return typeof valor === "number" && Number.isFinite(valor) && valor >= 0;
}
export function emailValido(valor) {
    return typeof valor === "string" && valor.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}
export function dataValida(valor) {
    return valor == null || valor === "" || !Number.isNaN(Date.parse(valor));
}
