# Sprint 7.1: Xat

## Descripció

### Construïm un Xat!!!

Necessitarem socket.io, una biblioteca de JavaScript per a aplicacions web en temps real. Permet la comunicació bidireccional en temps real entre clients i servidors web. Té dues parts: una biblioteca del costat del client que s'executa en el navegador i una biblioteca del costat del servidor per a Node.js.

Trobaràs el que necessitis en ->socket.io

### Nivell 1

Crea una aplicació que mostri una pàgina de login on l'usuari/ària pugui entrar en una sala de xat (el client i el server han d'estar completament separats). Obrint la mateixa URL en una altra finestra del navegador podrem fer login amb un altre usuari/ària. Verifica que estan en la mateixa sala i permet que xategin. Afegeix la possibilitat de crear múltiples sales de xat i gestiona la persistència amb MongoDB (amb Mongoose) o MySQL (amb Sequelize).

### Nivell 2

Afegeix autentificació utilitzant Google Token (google-auth-library)

### Nivell 3

Per superar aquest nivell pots afegir diferents opcions:

- Afegeix qualsevol funcionalitat que vegis útil.
- Afegeix la personalització del frontend que vulguis.
- Realitza el frontend amb algun framework (React, Vue, Angular).
- Efectua el projecte amb TypeScript.

## Objectius

Aprendre a utilitzar Sockets (socket.io).

## Durada:

15 dies

## Lliurament:

S'ha de treballar sobre el teu propi repositori, en un projecte clonat del projecte typescript-tdd-template. El lliurament es farà mitjançant pull-request al propi repositori.

S'ha d'adjuntar la col·lecció de Postman corresponent per provar tots els endpoints.

El repositori ha de contenir un README amb les instruccions necessàries per fer funcionar l'exercici.

La qualificació inclou la defensa del teu codi en una entrevista amb el mentor/a.

<hr>

### Nivell 1

1. Instalamos dependencias del proyecto

```sh
npm install
```

2. levantamos container con el docker con MongoDB

```sh
docker-compose up
```

3. Server

```sh
npm run start
```

4. Server con Nodemon

```sh
npm run dev
```
