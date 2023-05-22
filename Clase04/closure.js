// Antes de que existan los modulos se utilizaban los closure
// Encapsula unas funciones
const matematicas = (function (){
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
    return{
        //retorno un objeto, del lado izquierdo esta una variable y del lado derecho el nombre de la funcion(referencia)
         restar:restar,
         sumar:sumar,
         multiplicar:multiplicar,
         dividir:dividir,
    };
})() // Es una funcion autoinvocada, en el momento que el interprete de js la ve, automaticamente la ejecuta