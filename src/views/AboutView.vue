<template>
  <div class="about">
    <h1>TODO List<br /><small>Prueba de concetpo</small></h1>
    <p>Consideraciones de desarrollo:</p>
    <ul>
      <li>
        Los services de Task y Category existen solo de forma demostativa. Su
        función sería ofrecer la posibilidad de agregar datos de fuentes
        adicionales (una API, un archivo, de un socket, etc.). En ese caso:
        <ul>
          <li>
            El constructor de cada service recibiría un array de interfaces a
            repositorios
          </li>
          <li>
            Cada operación (salvo getAll*) recibiría el identificador de la
            fuente de datos a utilizar
          </li>
        </ul>
      </li>
      <li>
        Los repositories de Task y Category existen para minimizar el
        acoplamiento con el sistema de persistencia subyancete a cada uno. En
        caso de necesitar cambiar de sistema de persistencia, solo habría que
        modificar el repository correspondiente.
      </li>
    </ul>
  </div>
</template>
