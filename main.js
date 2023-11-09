title = "Saber Beats";

description = `
 [Tap]to Slash
`;

characters = [
`
ll
ll
ll
ll
ll
ll
ll
ll
ll
ll
`
];

const G = {
    WIDTH: 100,
    HEIGHT: 150,
    STAR_SPEED_MIN: 0.5,
    STAR_SPEED_MAX: 1.0
};

options = {
    theme: "dark",
    seed: 2,
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
    * }} Player
    */
   
   /**
    * @type { Player }
    */
   let player;

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

/**
 * @param {number} x
 * @param {number} y
**/

// The game loop function
function update() {
    if (input.isJustPressed) {
        console.log("x:", input.pos.x, "y:", input.pos.y);
    }
	if (!ticks) {
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

    player = {
        pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5)
    };
        player.pos = vec(input.pos.x, input.pos.y);
        //player.pos.clamp(0, G.WIDTH, G.HEIGHT);
        color("cyan");
        //box(player.pos, 4)
        char("a", player.pos);
    
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
}

