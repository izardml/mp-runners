let
character,
player,
scoreDisplay,

obstacles = [],
flag = [],
npc = [],

left,
right

function startGame() {
    let score = 0
    let frameNo = 0
    let speed = 0

    document.getElementById('home').style.display = 'none'
    document.querySelector('.game-controller').style.display = 'flex'

    left = new component(116, myGameArea.canvas.height, 'limegreen', 0, 0)
    right = new component(116, myGameArea.canvas.height, 'limegreen', 284, 0)
    leftLine = new component(5, myGameArea.canvas.height, 'black', 111, 0)
    rightLine = new component(5, myGameArea.canvas.height, 'black', 284, 0)

    character = new component(76, 120, 'run1', 172 - 10, 310, 'image')
    player = new component(56, 40, 'transparent', 172, 380)
    scoreDisplay = new component('30px', 'visitor', 'black', 10, 40, 'text')

    myGameArea.start()
}

let myGameArea = {
    canvas: document.getElementById('canvas'),
    start: function() {
        this.context = this.canvas.getContext('2d')
        this.interval = setInterval(updateGameArea, 20)

        window.addEventListener('keydown', function(e) {
            myGameArea.key = e.keyCode
        })
        window.addEventListener('keyup', function(e) {
            myGameArea.key = false
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    stop: function() {
        clearInterval(this.interval)
    },
}

function component(width, height, color, x, y, type) {
    this.type = type
    if(type == 'image') {
        this.image = new Image()
        this.image.src = document.getElementById(color).src
    } else {
        this.color = color
    }
    this.width = width
    this.height = height
    this.x = x
    this.y = y
    this.update = function() {
        ctx = myGameArea.context
        if(this.type == 'image') {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else if(this.type == 'text') {
            ctx.font = this.width + ' ' + this.height
            ctx.fillStyle = this.color
            ctx.fillText(this.text, this.x, this.y)
        } else {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    this.crashWith = function(otherobj) {
        let myleft = this.x
        let myright = this.x + (this.width)
        let mytop = this.y
        let mybottom = this.y + (this.height)
        let otherleft = otherobj.x
        let otherright = otherobj.x + (otherobj.width)
        let othertop = otherobj.y
        let otherbottom = otherobj.y + (otherobj.height)
        if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            return false
        }
        return true
    }
}

/**
 * Note:
 * gameSpeed = 5 - 10
 * objInterval = 50 - 25
 */

let playerSpeed = [10, 9, 8, 7, 6, 5]
let gameSpeed = [5, 6, 7, 8, 9, 10]
let objInterval = [50, 45, 40, 35, 30, 25]
let score = 0
let frameNo = 0
let speed = 0

function updateGameArea() {
    if (score > 100) {
        speed = 5
    } else if (score > 80) {
        speed = 4
    } else if (score > 60) {
        speed = 3
    } else if (score > 40) {
        speed = 2
    } else if (score > 20) {
        speed = 1
    } else {
        speed = 0
    }

    if(everyinterval(playerSpeed[speed])) {
        if(character.image.src == document.getElementById('run1').src) {
            character.image.src = document.getElementById('run2').src
        } else {
            character.image.src = document.getElementById('run1').src
        }
    }

    for(i = 0; i < obstacles.length; i++) {
        if(player.crashWith(obstacles[i])) {
            character.y -= 65
            character.image.src = document.getElementById('fall').src
            if(player.crashWith(obstacles[i])) {
                myGameArea.stop()
            }
            document.getElementById('final-score').innerHTML = 'Score: ' + score
            document.getElementById('game-over').style.display = 'flex'
        }
    }

    for(i = 0; i < flag.length; i++) {
        if(player.crashWith(flag[i])) {
            score += 1
            flag[i].y += myGameArea.canvas.height
        }
    }

    myGameArea.clear()
    frameNo++

    if(frameNo == 1 || everyinterval(objInterval[speed])) {
        let x, rand, rand2, rand3
    
        x = [119, 175, 231]

        rand = Math.floor(Math.random() * 3)
        rand2 = Math.floor(Math.random() * 3)
        rand3 = Math.floor(Math.random() * 3)

        if(rand != rand3) {
            obstacles.push(new component(50, 30, 'green', x[rand], -50))
            if(rand != rand2 && rand2 != rand3 && frameNo > 200) {
                obstacles.push(new component(50, 30, 'green', x[rand2], -50))
            }
        }
        flag.push(new component(50, 50, 'blue', x[rand3], -70))
        npc.push(new component(30, 30, 'blue', 0, 0))
    }

    if(myGameArea.key && myGameArea.key == 37) { moveleft() }
    if(myGameArea.key && myGameArea.key == 39) { moveright() }
    if(myGameArea.key && myGameArea.key == 27) { pauseGame() }

    left.update()
    right.update()
    leftLine.update()
    rightLine.update()

    for(i = 0; i < obstacles.length; i++) {
        obstacles[i].y += gameSpeed[speed]
        obstacles[i].update()
    }

    for(i = 0; i < flag.length; i++) {
        flag[i].y += gameSpeed[speed]
        flag[i].update()
    }

    for(i = 0; i < npc.length; i++) {
        npc[i].y += gameSpeed[speed]
        npc[i].update()
    }

    player.update()
    character.update()

    scoreDisplay.text = "Score: " + score
    scoreDisplay.update()
}

function moveleft() {
    if(player.x > 116) {
        character.x -= 56
        player.x -= 56
    }
    myGameArea.key = false
}

function moveright() {
    if(player.x < 228) {
        character.x += 56
        player.x += 56
    }
    myGameArea.key = false
}

function pauseGame() {
    document.getElementById('pause').style.display = 'flex'
    myGameArea.stop()
}

function resumeGame() {
    document.getElementById('pause').style.display = 'none'
    myGameArea.start()
}

function everyinterval(n) {
    if((frameNo / n) % 1 == 0) { return true }
    return false
}

let bgm = document.getElementById('bgm')

function playBGM() {
    bgm.play()
}

function stopBGM() {
    bgm.pause()
}

// startGame()
// playBGM()