const playButton = document.getElementById('startGamebtn');
const startGameContainer = document.getElementById('startGame');

playButton.addEventListener('click',()=>{
    startGameContainer.style.display = 'none';
    alertTimer();
    setTimeout(()=>{
        animate();
        startRenderingBallsInterval();
    },3900)
})

const alertTimer = () => {
    const countDownContainer = document.getElementById('countdownContainer');
    let currentSecond = 3;
    let timeInterval = setInterval(() => {
        countDownContainer.innerHTML = `<h1>${currentSecond}</h1>`;
        currentSecond -= 1;
        if (currentSecond < 0) {
            clearInterval(timeInterval);
            countDownContainer.innerHTML = '';
        }
    }, 1000);
}

 //main logic for canvas

 const canvas = document.getElementById('canvas');

 const context = canvas.getContext('2d');

 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;

 //All Elements array
 let ballArray = [];
 let ballParticlesArray = [];
 let enemyBombArray = [];

 function Ball() {
    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = Math.floor(Math.random() * window.innerHeight);
    this.size = Math.floor((Math.random() * 10) + 35);
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
    
    this.speedY = 10;
    this.speedX = Math.round((Math.random() - 0.5) * 4);

    this.update = () => {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.speedY -= 0.1;
    }

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}

function EnemyBomb() {

    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = Math.floor(Math.random() * window.innerHeight);
    this.size = Math.floor((Math.random() * 10) + 40);
    this.color = `black`;
    
    this.speedY = 10;
    this.speedX = Math.round((Math.random() - 0.5) * 4);

    this.update = () => {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.speedY -= 0.1;
    }

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.linewidth= 6;
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.stroke();
        context.strokestyle='red';
        context.fill();
    }
}

function BallParticles(x,y,color) {
    this.x = x;
    this.y = y;
    this.size = Math.floor(Math.random() * 3 + 8);
    this.color = color;
    
    this.speedY = Math.random() * 2 - 2;
    this.speedX = Math.round((Math.random() - 0.5) * 10);

    this.update = () => {
        if(this.size > .2) {
           this.size -= .1;

        }
        this.y -= this.speedY;
        this.x += this.speedX;
    }

    this.draw = () => {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }
}


function renderBalls() {
    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].draw();
        ballArray[i].update();

        // Detect collision of Mouse postion and Ball position
        let distanceBetweenMouseAndBall = Math.hypot(mouseX - ballArray[i].x, mouseY - ballArray[i].y);

        // IfMouse is on the ball i.e Collision
        if (distanceBetweenMouseAndBall <= ballArray[i].size) {


            // rendering ball particles
            for (let index = 0; index < 10; index++) {
                ballParticlesArray.push(new BallParticles(ballArray[i].x, ballArray[i].y, ballArray[i].color));
            }

            // splicing the ball from the array
            ballArray.splice(i, 1);
            i--;
            return;
        }

        if (ballArray[i].y > window.innerHeight + 10) {
            ballArray.splice(i, 1);
            i--;
        }
    }
}

function renderEnemyBombs() {
    for (let i = 0; i < enemyBombArray.length; i++) {
        enemyBombArray[i].draw();
        enemyBombArray[i].update();

        // Detect collision of Mouse postion and Ball position
        let distanceBetweenMouseAndEnemy = Math.hypot(mouseX - enemyBombArray[i].x, mouseY - ballArray[i].y);

        // IfMouse is on the ball i.e Collision
        if (distanceBetweenMouseAndEnemy <= enemyBombArray[i].size) {

            ballArray = [];
            ballParticlesArray = [];

            // splicing the ball from the array
            enemyBombArray.splice(i, 1);
            i--;
            return;
        }

        if (enemyBombArray[i].y > window.innerHeight + 10) {
            enemyBombArray.splice(i, 1);
            i--;
        }
    }
}

function renderBallParticles() {
    for (let i = 0; i < ballParticlesArray.length; i++) {
        ballParticlesArray[i].draw();
        ballParticlesArray[i].update();

        // if ball particle is too small, splice from the array
        if (ballParticlesArray[i].size <= 0.2) {
            ballParticlesArray.splice(i, 1);
            i--;
        }
    }
}
    function createNewBall() {
        ballArray.push(new Ball());
        setInterval(createNewBall, 2000);
    }

    let numberOfBallsToRender = [1, 2, 3, 4, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1];

        //setInterval to render the balls on an intervall
    const startRenderingBallsInterval = ()=>{
        let internal = setInterval(()=>{
            const numberOfBalls = Math.round(Math.random() * numberOfBallsToRender.length);
            let indexOf = numberOfBallsToRender[numberOfBalls]

            if(numberOfBalls >= Math.floor(numberOfBalls.length / 2)) {
                enemyBombArray(new EnemyBomb());
            }

            for (let i = 0; i < indexOf; i++) {
                ballArray.push(new Ball())
            }

        },1000)
    }


    let animationId;

    function animate(){
        context.fillStyle='rgba(24,28,31,.5)';
        context.fillRect(0,0,canvas.width,canvas.height); 
        renderBalls();
        renderBallParticles();
        renderEnemyBombs();
        animationId = requestAnimationFrame(animate);
    }

    //enemyBombArray.push(new EnemyBomb());

    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove',(e)=>{
        mouseX = e.clientX;
        mouseY = e.clientY;
        console.log(`mouseX: $(mouseX)  | mouseY: $(mouseY)`);
    })