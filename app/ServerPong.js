import { Server } from "socket.io";

export default class ServerPong {

    constructor(serverHttp) {
        this.io = new Server(serverHttp);
        this.player1 = { pseudo : null, paddle : 190};;
        this.player2 = { pseudo : null, paddle : 190};;
        this.spectators = [];
        this.users = [];

        this.io.on('connection', (socket) => {this.onConnection(socket);});
    }

    onConnection(socket) {
        // on envoie dès la connexion toute les infos de la partie (la liste des spectateurs et les 2 joueurs)
        socket.emit('server:players:infos', this.player1.pseudo, this.player2.pseudo, this.spectators);
        // on écoute sur l'envoi d'un choix de pseudo
        socket.on('client:user:pseudo', (pseudo) => this.choicePseudo(socket, pseudo) );
        // on écoute la déconnexion
        socket.on('disconnect', () => { this.disconnect(socket) });
        // on écoute le choix du player
        socket.on('client:choice:player', (player) => this.playerChoice(socket, player));
    }

    playerChoice(socket, player) {
        if(player == 'spectator') {
          if(spectators.includes(socket.pseudo) === false) {
              spectators.push(socket.pseudo);
              // si le pseudo était en tant que player1 ou player2 on le retire
              if(socket.pseudo == this.player1.pseudo) this.player1 = {pseudo : null, paddle : 190};
              if(socket.pseudo == this.player2.pseudo) this.player2 = {pseudo : null, paddle : 190};
            }
          } else if((player == 'player1' && this.player1.pseudo === null) || (player == 'player2' && this.player2.pseudo === null)) {
              if(player == 'player1') {
                this.player1 = { pseudo : socket.pseudo, paddle : 190};
                // si il était en player2
                if(socket.pseudo == this.player2.pseudo) this.player2 = {pseudo : null, paddle : 190};
              }
              else if(player == 'player2') {
                this.player2 = { pseudo : socket.pseudo, paddle : 190};
                // si il était en player1
                if(socket.pseudo == this.player1.pseudo) this.player1 = {pseudo : null, paddle : 190};
              }
          // on le retire des spectateurs (si il était en spectateur)
          let index = this.spectators.indexOf(socket.pseudo);
          if(index != -1) { this.spectators.splice(index,1);}
        }
      // on renvoie toute les infos de la partie (la liste des spectateurs et les 2 joueurs)
      this.io.emit('server:players:infos', this.player1.pseudo, this.player2.pseudo, this.spectators);
    }

    disconnect(socket) {
        if(socket.pseudo != undefined) {
              let index = this.users.findIndex(user => user == socket.pseudo);
              if(index != -1) {
                  this.users.splice(index,1);
                  // si le pseudo était en tant que player1 ou player2
                  if(socket.pseudo == this.player1.pseudo)
                      this.player1 = {pseudo : null, paddle : 190};
                  if(socket.pseudo == this.player2.pseudo)
                      this.player2 = {pseudo : null, paddle : 190};
                  // on le retire des spectateurs
                  let index2 = this.spectators.indexOf(socket.pseudo);
                  if(index2 != -1) { this.spectators.splice(index2,1);}
                  // on renvoie toute les infos de la partie
                  this.io.emit('server:players:infos',
                      this.player1.pseudo,
                      this.player2.pseudo,
                      this.spectators
                  );
              }
            }
    }

    choicePseudo(socket, pseudo) {
        // si le pseudo n'est pas disponible
        if(this.users.includes(pseudo)) {
            socket.emit('server:user:pseudo_exists');
        }
        else {
            // si disponible on pousse dans le tableau
            this.users.push(pseudo);
            // // spectateur dans un premier temps
            // this.spectators.push(pseudo);
            // on stocke le pseudo dans la socket
            socket.pseudo = pseudo;

            console.log("PSEUDO : ", pseudo);

            // Envoie la liste des spectateurs à tous les sockets
            this.io.emit('server:spectator:list', this.spectators.map(spec => spec.pseudo));
            socket.emit('server:user:connected');
            // this.player1.pseudo === null ? this.player1.pseudo = pseudo : this.player2.pseudo = pseudo;
            // socket.emit('server:players:infos', this.player1.pseudo, this.player2.pseudo, this.spectators);
        }
    }
}
