const WIDTH = 800;
const HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: '#0980c6',
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);

function preload () {
    this.load.image('troll-default', 'res/troll-default.webp');
    this.load.image('troll-problem', 'res/troll-problem.webp');
    this.load.image('troll-crazy', 'res/troll-crazy.jpg');
    this.load.image('coin', 'res/coin.png');
    this.load.image('bomb', 'res/bomb.webp');
}

function create () {
    this.cursors = this.input.keyboard.createCursorKeys();

    let coins = [];
    for (let i = 0; i < 5; i++) {
        let x = Math.floor(Math.random() * WIDTH) + 1;
        let y = Math.floor(Math.random() * HEIGHT) + 1;
        let coin = this.physics.add.image(x, y, 'coin');
        coin.setScale(0.1);
        // coin.setBounce(100, 100);
        coin.setCollideWorldBounds(true);
        coins.push(coin);
    }
    this.coins = coins;

    let bombs = [];
    for (let i = 0; i < 3; i++) {
        let x = Math.floor(Math.random() * WIDTH) + 1;
        let y = Math.floor(Math.random() * HEIGHT) + 1;
        let bomb = this.physics.add.image(x, y, 'bomb');
        bomb.setCollideWorldBounds(true);
        bombs.push(bomb);
    }
    this.bombs = bombs;

    let troll = this.physics.add.image(WIDTH / 2, HEIGHT / 2, 'troll-default');
    troll.setScale(0.5);
    // troll.setBounce(1, 1);
    troll.setCollideWorldBounds(true);
    this.troll = troll

    for (let i = 0; i < coins.length; i++) {
        let coin = coins[i];
        this.physics.add.overlap(troll, coin, grabCoin, null, this);
    }
    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];
        this.physics.add.overlap(troll, bomb, explode, null, this);
    }
}

function update() {
    let cursors = this.cursors
    let troll = this.troll

    if (cursors.left.isDown) {
        troll.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        troll.setVelocityX(300);
    } else {
        troll.setVelocityX(0);
    }

    if (cursors.up.isDown) {
        troll.setVelocityY(-300);
    } else if (cursors.down.isDown) {
        troll.setVelocityY(300);
    } else {
        troll.setVelocityY(0);
    }
}

function grabCoin(troll, coin) {
    // coin.destroy();

    let distance = Phaser.Math.Distance.Between(troll.x, troll.y, coin.x, coin.y);
    if (distance < coin.width / 30) {
        let x = Math.floor(Math.random() * WIDTH) + 1;
        let y = Math.floor(Math.random() * HEIGHT) + 1;
        coin.setPosition(x, y);

        troll.setTexture('troll-crazy');
        troll.setScale(0.2);
        troll.setCollideWorldBounds(true);

        if (this.timer) {
            this.timer.destroy();
        }
        this.timer = this.time.addEvent({
            delay: 3000, // time in milliseconds
            callback: setDefaultTroll,
            callbackScope: this,
        });
    }
}

function explode(troll, bomb) {
    let distance = Phaser.Math.Distance.Between(troll.x, troll.y, bomb.x, bomb.y);
    if (distance < bomb.width / 2) {
        let x = Math.floor(Math.random() * WIDTH) + 1;
        let y = Math.floor(Math.random() * HEIGHT) + 1;
        bomb.setPosition(x, y);

        troll.setTexture('troll-problem');
        troll.setScale(0.15);

        if (this.timer) {
            this.timer.destroy();
        }
        this.timer = this.time.addEvent({
            delay: 3000, // time in milliseconds
            callback: setDefaultTroll,
            callbackScope: this,
        });
    }
}

function setDefaultTroll() {
    this.troll.setTexture('troll-default');
    this.troll.setScale(0.5);
}
