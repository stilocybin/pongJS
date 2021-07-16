(function () {
  function el(css) {
    return document.querySelector(css);
  }

  let co = document.querySelector('#canvas');
  let ctx = co.getContext('2d');

  let tCode = false; //Tastatureingabe

  let brickSammler = {};
  let objKey = 0;

  let animate = false; //button steuert animatiob

  let protoBall = {
    x: 100,
    y: 200,
    r: 10,
    spX: 5,
    spY: 3,
    col: 'rgb(0,255,0)',
    rx: 0,
    ry: 0,
    move: function () {
      //links-rechts-Begrenzung
      if (this.x < 0) {
        this.rx = 0;
      }
      if (this.x > co.width) {
        this.rx = 1;
      }

      //Kollisionsabfrage
      if (kollision(this, protoPaddle)) {
        console.log('bang');
        this.ry = 1;
      }
      //Paddle oben
      if (this.y < 0) {
        this.ry = 0;
      }

      //Paddle fängt Ball nicht
      if (this.y > co.height) {
        this.y = 150;
        this.x = Math.ceil(Math.random() * co.width);
        this.ry = 0;
        // playAudio('mp3/death.mp3')
        klonFabrik();
      }
      //Positionen ausrechnen
      if (this.rx === 0) {
        this.x += this.spX;
      }
      if (this.rx === 1) {
        this.x -= this.spX;
      }
      if (this.ry === 0) {
        this.y += this.spY;
      }
      if (this.ry === 1) {
        this.y -= this.spY;
      }

      ctx.fillStyle = this.col;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
      ctx.fill();
    },
  };
  let protoPaddle = {
    x: co.width / 2 - 40,
    y: 350,
    w: 80,
    h: 20,
    col: '#fbad48',
    spX: 12,
    // init: function () { },
    move: function () {
      if (tCode === 'ArrowLeft' && this.x > 0) {
        this.x -= this.spX;
      }
      if (tCode === 'ArrowRight' && this.x < co.width - this.w) {
        this.x += this.spX;
      }

      ctx.fillStyle = this.col;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    },
  };

  let protoBrick = {
    x: 10,
    y: 10,
    w: 60,
    h: 20,
    id: 0,
    s: 0,

    col: 'rgb(200,200,200)',
    init: function () {
      this.id = objKey;
      brickSammler[objKey] = this;
      objKey++;
    },
    draw: function () {
      //Kollision
      if (kollision(protoBall, this)) {
        // playAudio('mp3/pong.mp3');
        protoBall.ry = 0;

        console.log('HIT');

        //Löschen
        delete brickSammler[this.id];
        let keys = Object.keys(brickSammler);
        if (keys.length === 0) {
          klonFabrik();
        }
      }
      //Zeichnen
      ctx.fillStyle = this.col;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    },
  };

  //-------------------------------------------------

  function playAudio(src) {
    let sound = new Audio(src);
    // sound.src = src;
    sound.play();
  }

  function klonFabrik() {
    let klon;
    let x = 10,
      y = 10;

    for (let i = 0; i < 40; i++) {
      klon = Object.create(protoBrick);
      klon.init();
      klon.x = x;
      klon.y = y;
      x += 90;
      if (x > co.width) {
        x = 10;
        y += 35;
      }
    }
    // console.log(brickSammler);
  }

  function el(css) {
    return document.querySelector(css);
  }

  function render() {
    ctx.clearRect(0, 0, co.width, co.height);
    animate = requestAnimationFrame(render);
    protoPaddle.move();
    protoBall.move();
    for (let i in brickSammler) {
      brickSammler[i].draw();
    }
  }
  function kollision(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > rect.w / 2 + circle.r) {
      return false;
    }
    if (distY > rect.h / 2 + circle.r) {
      return false;
    }

    if (distX <= rect.w / 2) {
      return true;
    }
    if (distY <= rect.h / 2) {
      return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;

    return dx * dx + dy * dy <= circle.r * circle.r;
  } // ENDE kollision

  function checkKeyDown(e) {
    tCode = e.key;
    e.preventDefault();
    console.log(tCode);
  }
  function checkKeyUp() {
    tCode = false;
  }

  //-------------------------------------------------
  klonFabrik();
  //    render();
  document.querySelector('#btn').addEventListener('click', function () {
    if (!animate) {
      render();
      this.innerHTML = 'PAUSE';
    } else {
      cancelAnimationFrame(animate);
      this.innerHTML = 'START';

      animate = !animate;
    }
  });

  document.addEventListener('keydown', checkKeyDown);
  document.addEventListener('keyup', checkKeyUp);
})();
