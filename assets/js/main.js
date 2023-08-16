let
character,
player,
scoreDisplay,

obstacles = [],
flag = [],
npc = [],
house,

left,
right,

femaleVoice,
footstep,
gameOverSound,
scoreSound = []

function startGame() {
    document.getElementById('home').style.display = 'none'
    document.getElementById('btn-pause').style.display = 'block'

    myGameArea.start()

    left = new component((myGameArea.canvas.width - 168) / 2, myGameArea.canvas.height, 'limegreen', 0, 0)
    right = new component((myGameArea.canvas.width - 168) / 2, myGameArea.canvas.height, 'limegreen', myGameArea.canvas.width - ((myGameArea.canvas.width - 168) / 2), 0)
    leftLine = new component(5, myGameArea.canvas.height, 'black', ((myGameArea.canvas.width - 168) / 2) - 5, 0)
    rightLine = new component(5, myGameArea.canvas.height, 'black', myGameArea.canvas.width - ((myGameArea.canvas.width - 168) / 2), 0)

    if (myGameArea.canvas.width == 800) {
        character = new component(76, 120, 'run1', left.width + 56 - 10, myGameArea.canvas.height - 120 - 20, 'image')
        player = new component(56, 56, 'shadow', left.width + 56, myGameArea.canvas.height - 120 - 20 + 73, 'image')
    } else {
        character = new component(76, 120, 'run1', left.width + 56 - 10, myGameArea.canvas.height - 120 - 50, 'image')
        player = new component(56, 56, 'shadow', left.width + 56, myGameArea.canvas.height - 120 - 50 + 73, 'image')
    }
    scoreDisplay = new component('30px', 'visitor', 'black', 20, 40, 'text')

    // scoreSound = new sound('coin')
    // femaleVoiceL = new sound('female-voice-l')
    // femaleVoiceR = new sound('female-voice-r')
    // femaleVoice = new sound('female-voice')
    footstep = new sound('footstep')
    gameOverSound = new sound('shocked')

    // playBGM()
}

let myGameArea = {
    canvas: document.getElementById('canvas'),
    start: function() {
        let compStyle = window.getComputedStyle(this.canvas)
        this.canvas.width = parseInt(compStyle.getPropertyValue('width'), 10)
        this.canvas.height = parseInt(compStyle.getPropertyValue('height'), 10)

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
    if (localStorage.getItem('sound') == true) {
        playBGM()
    }

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
        // character sprite
        if(character.image.src == document.getElementById('run1').src) {
            character.image.src = document.getElementById('run2').src
        } else {
            character.image.src = document.getElementById('run1').src
        }
        footstep.play()

        // flag sprite
        for(i = 0; i < flag.length; i++) {
            if(flag[i].image.src == document.getElementById('flag1').src) {
                flag[i].image.src = document.getElementById('flag2').src
            } else {
                flag[i].image.src = document.getElementById('flag1').src
            }
        }
    }

    for(i = 0; i < obstacles.length; i++) {
        if(player.crashWith(obstacles[i])) {
            character.y -= 60
            character.image.src = document.getElementById('fall').src
            if(player.crashWith(obstacles[i])) {
                player.y += myGameArea.canvas.height
                myGameArea.stop()
            }
            updateData(score)
            footstep.stop()
            gameOverSound.play()
            document.getElementById('final-score').innerHTML = 'Score: ' + score
            document.getElementById('game-over').style.display = 'flex'
            document.getElementById('btn-pause').style.display = 'none'
        }
    }

    for(i = 0; i < flag.length; i++) {
        if(player.crashWith(flag[i])) {
            scoreSound[i].play()
            score += 1
            flag[i].y += myGameArea.canvas.height
        }
    }

    myGameArea.clear()
    frameNo++

    if(frameNo == 1 || everyinterval(objInterval[speed])) {
        let x
    
        // x = [119, 175, 231]

        x = [
            left.width + 3,
            left.width + 3 + 56,
            left.width + 3 + 56 + 56,
        ]

        rand = Math.floor(Math.random() * 3)
        rand2 = Math.floor(Math.random() * 3)
        randFlag = Math.floor(Math.random() * 3)

        randObs = Math.floor(Math.random() * 3)
        randObs2 = Math.floor(Math.random() * 3)

        if(rand != randFlag) {
            obstacles.push(new component(50, 30, 'obstacle' + (randObs + 1), x[rand], -50, 'image'))
            if(rand != rand2 && rand2 != randFlag && frameNo > 200) {
                obstacles.push(new component(50, 30, 'obstacle' + (randObs2 + 1), x[rand2], -50, 'image'))
            }
        }
        flag.push(new component(50, 50, 'flag1', x[randFlag], -70, 'image'))
        scoreSound.push(new sound('coin'))
    }

    if(frameNo == 1 || everyinterval(objInterval[speed] * 2)) {
        randNPC = Math.floor(Math.random() * 3)

        if (randNPC == 0) {
            npc.push(new component(210, 150, 'house1', left.width - 210 - 20, myGameArea.canvas.height / -2, 'image'))
        } else if (randNPC == 1) {
            npc.push(new component(280, 200, 'house2', left.width - 280 - 20, myGameArea.canvas.height / -2, 'image'))
        } else if (randNPC == 2) {
            npc.push(new component(240, 200, 'house3', left.width - 240 - 20, myGameArea.canvas.height / -2, 'image'))
        }
    }

    if(everyinterval(objInterval[speed] / 2 + objInterval[speed])) {
        randNPC2 = Math.floor(Math.random() * 3)

        if (randNPC2 == 0) {
            npc.push(new component(210, 150, 'house1', right.x + 20, myGameArea.canvas.height / -2, 'image'))
        } else if (randNPC2 == 1) {
            npc.push(new component(280, 200, 'house2', right.x + 20, myGameArea.canvas.height / -2, 'image'))
        } else if (randNPC2 == 2) {
            npc.push(new component(240, 200, 'house3', right.x + 20, myGameArea.canvas.height / -2, 'image'))
        }

        // house = new component(210, 150, 'house1', 40, 100, 'image')
        // house = new component(280, 200, 'house2', 40, 100, 'image')
        // house = new component(240, 200, 'house3', 40, 100, 'image')
    }

    if(myGameArea.key && myGameArea.key == 37) { moveleft() }
    if(myGameArea.key && myGameArea.key == 39) { moveright() }
    if(myGameArea.key && myGameArea.key == 27) { pauseGame() }

    left.update()
    right.update()
    // leftLine.update()
    // rightLine.update()

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
    if(player.x > left.width) {
        character.x -= 56
        player.x -= 56
        // femaleVoice.play()
    }
    myGameArea.key = false
}

function moveright() {
    if(player.x < (left.width + (56 * 2))) {
        character.x += 56
        player.x += 56
        // femaleVoice.play()
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

function loadData() {
    var storedData = localStorage.getItem('leaderboard')
    var parsedData = JSON.parse(storedData)

    if (localStorage.getItem('leaderboard')) {
        console.log('data sudah ada')
    } else {
        var leaderboard = [
            { id: 1, name: 'Anton', score: 2200 },
            { id: 2, name: 'Ahmad', score: 1200 },
            { id: 3, name: 'David', score: 900 },
            { id: 4, name: 'Bilbo', score: 700 },
            { id: 5, name: 'Victor', score: 600 },
            { id: 6, name: 'Nicolas', score: 500 },
            { id: 7, name: 'Tono', score: 450 },
            { id: 8, name: 'Radian', score: 300 },
            { id: 9, name: 'Paul', score: 150 },
            { id: 10, name: 'You', score: 0 },
        ]
        
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
        localStorage.setItem('sound', false)
        console.log('data berhasil dimuat')
    }

    parsedData.sort(function(a, b) {
        return b.score - a.score
    })

    var table = document.getElementsByClassName('leaderboard-table')[0]

    while(table.rows.length > 1) {
        table.deleteRow(1)
    }

    var i = 1

    parsedData.forEach(function(item) {
        var row = table.insertRow()

        var noCell = row.insertCell(0)
        var nameCell = row.insertCell(1)
        var scoreCell = row.insertCell(2)

        noCell.innerHTML = i
        nameCell.innerHTML = item.name
        scoreCell.innerHTML = item.score

        i++
    })
}

function updateData(newScore) {
    var storedData = localStorage.getItem('leaderboard')
    var parsedData = JSON.parse(storedData)
    
    targetItemIndex = parsedData.findIndex(function(item) {
        return item.id === 10
    })

    if(targetItemIndex !== -1) {
        parsedData[targetItemIndex].score = newScore

        localStorage.setItem('leaderboard', JSON.stringify(parsedData))

        console.log('Succesfull')
    } else {
        console.log('Unsuccesfull')
    }
}

function sound(src) {
    this.sound = document.createElement('audio')
    this.sound.src = 'assets/sound/' + src + '.mp3'
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play()
    }
    this.stop = function() {
        this.sound.pause()
    }
}

let bgm = document.getElementById('bgm')

function playBGM() {
    bgm.play()
    document.getElementById('soundOn').style.display = 'none'
    document.getElementById('soundOff').style.display = 'inline-block'
    localStorage.setItem('sound', true)
}

function stopBGM() {
    bgm.pause()
    document.getElementById('soundOff').style.display = 'none'
    document.getElementById('soundOn').style.display = 'inline-block'
    localStorage.setItem('sound', false)
}

// playBGM()
stopBGM()
// startGame()