import { Server } from "socket.io";

export default class ServerPont {

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
          // spectateur dans un premier temps
          this.spectators.push(pseudo);
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
