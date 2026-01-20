const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let diamonds = 0;
let balloons = [];
let projectiles = [];

// Configuración
const balloonRadius = 25;
const projectileRadius = 8;

class Balloon {
    constructor() {
        this.x = Math.random() * (canvas.width - balloonRadius * 2) + balloonRadius;
        this.y = canvas.height + balloonRadius;
        this.speed = Math.random() * 2 + 1; // Velocidad de subida
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }
    update() {
        this.y -= this.speed;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, balloonRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Projectile {
    constructor(targetX, targetY) {
        this.x = canvas.width / 2; // Sale desde el centro abajo (la tira piedra)
        this.y = canvas.height - 20;
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.speed = 7;
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, projectileRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#444";
        ctx.fill();
        ctx.closePath();
    }
}

function spawnBalloon() {
    if (Math.random() < 0.03) balloons.push(new Balloon());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar "Resortera" (Base fija)
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(canvas.width / 2 - 5, canvas.height - 40, 10, 40);

    // Actualizar Globos
    balloons.forEach((balloon, bIndex) => {
        balloon.update();
        balloon.draw();
        // Eliminar si sale de pantalla
        if (balloon.y < -balloonRadius) balloons.splice(bIndex, 1);
    });

    // Actualizar Proyectiles
    projectiles.forEach((p, pIndex) => {
        p.update();
        p.draw();

        // Colisión con globos
        balloons.forEach((balloon, bIndex) => {
            const dist = Math.hypot(p.x - balloon.x, p.y - balloon.y);
            if (dist < balloonRadius + projectileRadius) {
                balloons.splice(bIndex, 1);
                projectiles.splice(pIndex, 1);
                diamonds++;
                scoreElement.innerText = diamonds;
            }
        });

        if (p.y < 0 || p.x < 0 || p.x > canvas.width) projectiles.splice(pIndex, 1);
    });

    spawnBalloon();
    requestAnimationFrame(animate);
}

// Disparar al tocar
window.addEventListener("mousedown", (e) => {
    projectiles.push(new Projectile(e.clientX, e.clientY));
});
window.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    projectiles.push(new Projectile(touch.clientX, touch.clientY));
});

animate();
