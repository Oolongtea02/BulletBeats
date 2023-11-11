title = "Bullet Beats";

description = `
 [Tap]to Shoot
`;

characters = [
      `
  L  L
  ll ll
  LwwwL
cbLwL
 ll ll
   L L   
`,
      `
 L  L
ll ll
LwwwL
  Lwlbc
  ll ll
  L L   
`,

    `
  bc
 bbcc
bbwcwc
bbwcwc
bccccL
 c  b
`,

    `
   b  
  cb  
bby c
 c ybb
  bc
  b
` 
];

const G = {
    WIDTH: 100,
    HEIGHT: 150,
    PLAYER_FIRE_RATE: 60,
    PLAYER_GUN_OFFSET: 3,
    STAR_SPEED_MIN: 0.5,
    STAR_SPEED_MAX: 1.0,
    PROJECTILE_SPEED: 1,
    ENEMY_SPEED: 0.5,
    ENEMY_GNERATE_SPEED: 100,
    ENEMY_FIRE_RATE: 60
};

options = {
    theme: "pixel",
    seed: 10,
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isPlayingBgm: true,
    isReplayEnabled: true
};

/**
* @typedef {{
    * pos: Vector,
    * speed: number
    * }} Star
    */
    
    /**
    * @type  { Star [] }
    */
    let stars;

/**
 * @typedef {{
    * pos: Vector,
    * firingCooldown: number,
    * isFiring: boolean,
    * healthRemain: number
    * }} Player
    */
   
   /**
    * @type { Player }
    */
   let player;

/**
 * @typedef {{
    * pos: Vector,
    * firingCooldown: number,
    * angle: number
    * }} Enemy
    */

    /**
    * @type { Enemy [] }
    */
   let enemies;

/**
 * @typedef {{
    * pos: Vector,
    * angle: number,
    * rotation: number
    * }} Projectile
    */

    /**
    * @type { Projectile [] }
    */
    let projectiles;



let select;
let side;
let direction;
let s;

// The game loop function
function update() {
    if (input.isJustPressed) {
        console.log("x:", input.pos.x, "y:", input.pos.y);
    }
	if (!ticks) {
        player = {
            pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
            firingCooldown: G.PLAYER_FIRE_RATE,
            isFiring: false,
            healthRemain: 6
        };

        enemies = [];
        projectiles = [];
        
        select = false;
        laser = false;
        s =0;
        direction = [];
        direction[0] = vec(rnd(0, G.WIDTH), 0);//North
        direction[1] = vec(rnd(0, G.WIDTH), G.HEIGHT);//South
        direction[2] = vec(0, rnd(0, G.HEIGHT));//West
        direction[3] = vec(G.WIDTH, rnd(0, G.HEIGHT));//East

        stars = times(20, () => {
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            return {
                pos: vec(posX, posY),
                speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
            };
        });
    }

    stars.forEach((s) => {
        s.pos.y += s.speed;
        s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

        color("light_black");
        box(s.pos, 1);
    });

    //ticks
    //player
    //start to count down CD
    if (player.firingCooldown > 0) {
        player.firingCooldown--;
    }
    // End Game
    if (player.healthRemain <= 0) {
        end("You Died");
    }


    if (!select && input.isJustPressed && player.firingCooldown == 0) {
        //refresh cooldown
        player.firingCooldown = G.PLAYER_FIRE_RATE;
        projectiles.push({
            pos: vec(player.pos.x, player.pos.y),
            angle: player.pos.angleTo(input.pos),
            rotation: rnd()
        });
    }


    //health bar
    color("light_red");
    rect(player.pos.x - 3, player.pos.y - 6, 1 * 6, 1);
    color("green");
    rect(player.pos.x - 3, player.pos.y - 6, 1 * player.healthRemain, 1);
    //cooldown bar
    color("light_blue");
    rect(player.pos.x - 3, player.pos.y - 5, 1 * 6, 1);
    color("blue");
    rect(player.pos.x - 3, player.pos.y - 5, 1 * (6 - player.firingCooldown / 10), 1);


    color("black");
    if (input.pos.x >= player.pos.x) {
        char("b", player.pos);
    } else {
        char("a", player.pos);
    }
    //create enemy
    G.ENEMY_SPEED = rnd(0.1, 0.6);
    G.ENEMY_GNERATE_SPEED--;

    if (G.ENEMY_GNERATE_SPEED <= 0) {
        G.ENEMY_GNERATE_SPEED = 100 / difficulty;
        s++;
        let theD = direction[Math.floor(rnd(0, 4))];//ALL 4 directions

        enemies.push({
            pos: vec(theD),
            firingCooldown: G.ENEMY_FIRE_RATE,
            angle: theD.angleTo(player.pos)
        });
        console.log(s);
        if(s>=15){
            console.log("pushed")
            s=0;
        }
    }

    projectiles.forEach((p) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        p.pos.x += G.PROJECTILE_SPEED * Math.cos(p.angle);
        p.pos.y += G.PROJECTILE_SPEED * Math.sin(p.angle);
        // The bullet also rotates around itself
        p.rotation += 0.1;
        char("d", p.pos);
    });
    remove(enemies, (e) => {
        // console.log("here")
        e.pos.x += G.ENEMY_SPEED * Math.cos(e.angle);
        e.pos.y += G.ENEMY_SPEED * Math.sin(e.angle);
        color("black");
        const isCollidingWithHalos =
            char("c", e.pos).isColliding.rect.light_yellow;
        const isCollidingWithProjectiles =
            char("c", e.pos).isColliding.char.d;
        const isCollidingWithPlayerA =
            char("c", e.pos).isColliding.char.a;
        const isCollidingWithPlayerB =
            char("c", e.pos).isColliding.char.b;
        if (isCollidingWithPlayerA || isCollidingWithPlayerB && !input.isPressed) {
            player.healthRemain--;
            play("hit");
            return true;
        }
        if (isCollidingWithProjectiles) {
            // console.log("did")
            play("laser");
            particle(e.pos, 10)
            
            addScore(10,e.pos);
            return true;
        }
    });
    remove(projectiles, (pp) => {


        const isCollidingWithEnemies
            = char("d", pp.pos, { rotation: pp.rotation }).isColliding.char.c;

        if (isCollidingWithEnemies) {
            //make enemies disappear

            enemies.push({
                pos: pp.pos,
                rotation: 0.1,
                open: true
            });
        }
        // // If bullet is not onscreen, remove it
        if (!pp.pos.isInRect(0, 0, G.WIDTH, G.HEIGHT) || isCollidingWithEnemies) {
            // console.log("removed")
            return true;
        }
    });

}

