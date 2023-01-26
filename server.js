import http from 'http';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import { Server } from "socket.io";

const __dirname = dirname(fileURLToPath(import.meta.url));

const serve =  serveStatic(path.join(__dirname, 'public'), {index: 'index.html'});
const serverHttp = http.createServer((req,res) =>
    serve(req, res, finalhandler(req, res))
);

//----------------------------------------------------------
// Mise en écoute sur le port http
//----------------------------------------------------------

serverHttp.listen(9000, () => { console.log(`http://localhost:9000`); });

//----------------------------------------------------------
// Mise en place des WebSockets
//----------------------------------------------------------

const io = new Server(serverHttp);
