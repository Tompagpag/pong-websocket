import UI from './UserInterface.js';

export default class ClientPong {

    constructor() {
        this.socket = io.connect(document.location.host);
        this.UI = new UI();

        this.listenServer();
        this.transmitUiServer();
        this.UI.listenInterface();
    }

    listenServer() {
        // Réception des infos début de partie
        // this.socket.on('server:players:infos', this.UI.uiShowInfos)
        // Ecoute le retour de pseudo existant
        this.socket.on('server:user:pseudo_exists', () => { this.UI.pseudoChoice(true); } );
        // Ecoute le retour de connexion validée
        this.socket.on('server:user:connected', this.UI.uiShowRoom);
        // Ecoute sur l'envoi des spectateurs
        this.socket.on('server:spectator:list', this.UI.showSpectators);
    }

    transmitUiServer() {
        document.addEventListener('local:user:pseudo', (e) => {
            this.socket.emit('client:user:pseudo', e.detail.user);
        });
    }
}
