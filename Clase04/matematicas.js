function restar(a,b){
    return a - b;
}
function sumar(a,b){
    return a + b;
}
function multiplicar(a,b){
    return a * b;
}
function dividir(a,b){
    if(!validarCero(b)){
        return a / b;
    }
}
function validarCero(a){
    return a ===  0;
}
export default{sumar,restar,multiplicar,dividir};