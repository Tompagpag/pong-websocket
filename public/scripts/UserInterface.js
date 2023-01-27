export default class UserInterface {

    listenInterface() {
        //----------------------------------------------------------
        // Ecoutes sur l'interface
        //----------------------------------------------------------
        // quand on clique sur le bouton "Se connecter sans s'authentifier"
        document.querySelector("#btnConnect").addEventListener('click', this.pseudoChoice );
        document.querySelector("#join-game").addEventListener('click', this.displayBoard );
        document.querySelector("#start").addEventListener('click', this.drawGame );
    }

    uiShowRoom() {
        document.querySelector(".not_authenticated").classList.add('hide');
        document.querySelector(".authenticated").classList.remove('hide');
    }

    showSpectators(spectators) {
        document.getElementById('nb-spectator').innerText = `La salle compte ${spectators.length} spectateur${spectators.length > 1 ? 's' : ''}.`;
    }


    // uiShowInfos(pseudoP1, pseudoP2, spectators) {
      //     console.log("ici");
      //     console.log(pseudoP1, pseudoP2, spectators);
      // }

    pseudoChoice(alertPseudo = false) {
        if(alertPseudo === true) alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);

        let user;
        do {
          user = window.prompt(`Choisissez un pseudo`);
        } while(user === '');

        if(user !== null)  {
          document.dispatchEvent(new CustomEvent('local:user:pseudo', {detail : { user }}));
          // socket.emit('client:user:pseudo', user);
        }
    }

    displayBoard() {
        document.querySelector(".authenticated").classList.add('hide');
        document.querySelector(".party-container").classList.remove('hide');
        window.scrollTo(0, document.body.scrollHeight);
        this.drawGame;
    }

    drawGame() {
        this.canvas = document.querySelector('canvas');
        console.log("canvas =>", this.canvas);
        this.context = this.canvas.getContext('2d');
        console.log("context =>", this.context);
        // on vide tout le canvas
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        // on positionne la premiere raquette
        this.context.fillStyle = '#0556B5';
        this.context.fillRect(10, /*this.paddle1*/ 190, 20, 200);

        // on positionne la premiere raquette
        this.context.fillStyle = '#BB070E';
        this.context.fillRect(970, /*this.paddle1*/ 190, 20, 200);

        window.requestAnimationFrame(this.drawGame.bind(this));
    }

  }
