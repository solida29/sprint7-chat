function decodeCookie(username: string) {
  const cookies = document.cookie.split(';');
  // cadena que contiene todas las cookies del doc se divide en un array

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const separateCookie = cookie.indexOf('='); // '=' separa el nombre de la cookie de su valor.
    const usernameCookie = cookie.substring(0, separateCookie); // Se extrae el nombre de la cookie de la cadena.
    const valorCookie = cookie.substring(separateCookie + 1); // Se extrae el valor de la cookie de la cadena.

    if (usernameCookie === username) {
      return decodeURIComponent(valorCookie); // decodeURIComponent porque los valores de las cookies se codifican para evitar problemas con caracteres especiales.
    }
  }
  return null; // Si no se encuentra ninguna cookie con el nombre proporcionado, la función devuelve null.
}

const valorjwtCookie = decodeCookie('jwtCookie');
console.log(valorjwtCookie);
