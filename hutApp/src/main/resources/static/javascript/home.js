//Canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

//Cookie
const cookieArr = document.cookie.split("=");
const userId = cookieArr[1];

//Game selectors
const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const submitScore = document.getElementById("saveScore")

const headers = {
    'Content-Type': 'application/json'
}

//Base URL
const baseUrl = "http://localhost:8080/api/v1/scores/";

//handle logout
function handleLogout(){
    let c = document.cookie.split(";");
    for(let i in c){
        document.cookie = /^[^=]+/.exec(c[i])[0]+";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

//player object
class Player {
  constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
  }
//draw player
  draw() {
      c.beginPath()
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill()
  }
}

//projectile object
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
//draw projectile
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
//update projectile
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//enemy object
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
//draw enemy
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
//update enemy
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

//spread of particles
const friction = 0.99;
//particle object
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
//particle draw
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
//particle update
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

//game variables
const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 80, 'blue');
let projectiles = [];
let enemies = [];
let particles = [];

//initiate game variables
function init() {
    player = new Player(x, y, 80, 'blue');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

//spawn enemies
function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 5) + 5;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        const angle = Math.atan2( canvas.height / 2 - y, canvas.width / 2 - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

//animations for the particles/enemies/projectiles
let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });
    projectiles.forEach((projectile, index) => {
        projectile.update();

        //remove from edges of screen
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        //end game
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'flex';
            bigScoreEl.innerHTML = score;

            alert('Houston, we have a problem... Earth has been destroyed!')
        }
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            //when projectiles touch enemy
            if (dist - enemy.radius - projectile.radius < 1) {

                //create explosions
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            enemy.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random
                                () * 6),
                                y: (Math.random() - 0.5) * (Math.random
                                () * 6)
                            }
                        )
                    )
                }

                if (enemy.radius - 10 > 5) {

                    // increase score
                    score += 100;
                    scoreEl.innerHTML = score;

                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {

                    // remove from scene
                        score += 250;
                        scoreEl.innerHTML = score;

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }

            }
        });
    });
}

//Post high score
const handleSubmit = async (e) =>{
    e.preventDefault()

    let bodyObj = {
        high: bigScoreEl.innerHTML
    }

    const response = await fetch(`${baseUrl}user/${userId}`, {
        method: "POST",
        body: JSON.stringify(bodyObj),
        headers: headers
    })
        .catch(err => console.error(err.message))


    if (response.status === 200){
    }
    if(!alert('Score Saved Successfully!')){window.location.reload();}
}

submitScore.addEventListener("click", handleSubmit)


//display scores
const scoreCon = document.getElementById("scoreCon")

async function getScores(userId) {
    await fetch(`${baseUrl}user/${userId}`, {
        method: "GET",
        headers: headers
    })
        .then(response => response.json())
        .then(data => createScoreCard(data))
        .catch(err => console.error(err))
}

const createScoreCard = (array) => {
    scoreCon.innerHTML

    array.sort((score1, score2) => score1.high - score2.high);

    array.reverse();

    const firstFiveScores = array.slice(0,5);

    console.log(firstFiveScores);
    firstFiveScores.forEach(obj => {
        let scoreCard = document.createElement("div")
        // scoreCard.classList.add("m-2")
        scoreCard.innerHTML = `
            <div>
               <p>${obj.high}</p>
            </div>
        `
        scoreCon.append(scoreCard);
    })
}

getScores(userId);


///////

//listener for controls
addEventListener('mousedown', (event)=> {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity));
});

// start game button
startGameBtn.addEventListener('click', ()=> {
    init();
    animate();
    spawnEnemies();
    modalEl.style.display = 'none';
});


