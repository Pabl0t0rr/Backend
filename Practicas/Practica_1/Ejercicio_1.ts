function factorialRecursivo(n: number): number {
  // Tu código aquí
  if (n > 0){
    if (n === 1) {
      return 1;
    } else {
      return n * factorialRecursivo(n - 1);
    }
  }else {
    console.log("Faltan numeros");
    return 0;
  }
}
 
// Ejemplo de uso:
const numero = 5;
const resultadoFactorial = factorialRecursivo(numero);
console.log(`El factorial de ${numero} es: ${resultadoFactorial}`); // Debería imprimir 120