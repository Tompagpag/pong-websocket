import http from 'http';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';


import ServerPong from './app/ServerPong.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const serve =  serveStatic(path.join(__dirname, 'public'), {index: 'index.html'});
const serverHttp = http.createServer((req,res) =>
    serve(req, res, finalhandler(req, res))
);

//----------------------------------------------------------
// Mise en écoute sur le port http
//----------------------------------------------------------

serverHttp.listen(9000, () => { console.log(`http://localhost:9000`); });

new ServerPong(serverHttp);






// io.on('connection', (socket) => {

//     // on envoie dès la connexion toute les infos de la partie (la liste des spectateurs et les 2 joueurs)
//     socket.emit('server:players:infos', player1.pseudo, player2.pseudo, spectators);



// });

// gerer les users, si player, si spectateur, quand on a deux player on peut lancer le jeu
