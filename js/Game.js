
function $(id){ return document.getElementById(id);}

function Game(){
    this.bgSpeed = 100;
    this.playerFallSpeed = 3;
    this.playerturnSpeed = 200;
    this.blockSpeed = 200;
    this.width = $("canvas").width;
    this.height =  $("canvas").height;
    this.playerImageSize = {w:35,h:35};
    this.blockImageSize = {w:80,h:16};
    this.block_arr = [];
    this.fall = true;
    this.hurt = false;
    this.addBlood = false;
    this.score = 0;
    var _this = this;

    // console.debug(this.height);


    this.init = function(inputBuffer) {
        this.player_image = new Image();
        this.black_block_image = new Image();
        this.white_block_image = new Image();
        this.player_image.src ="./img/player.png";
        this.black_block_image.src = "./img/black_block.png";
        this.white_block_image.src = "./img/white_block.png";
        this.inputBuffer = inputBuffer;
        this.player = new Player();
        this.player.init(this.player_image);
        this.player.position['x']=(_this.width - _this.playerImageSize['w'])/2;
        this.player.position['y']=(_this.height - _this.playerImageSize['h'])/2;
        this.initBlock();
        this.initKeyboardListener();

        // img.onload = function () {console.log(1);};
        window.requestAnimationFrame(this.update);

    };


    this.processInput = function(input,time) {
        if(input.left ){
            _this.player.position['x'] -= _this.linear(time,_this.playerturnSpeed);
            if(_this.player.position['x'] <0)
                _this.player.position['x'] = 0;
            // console.log(_this.player.position['x']);
        }else{

        }

        if(input.right){
            _this.player.position['x'] += _this.linear(time,_this.playerturnSpeed);
            if(_this.player.position['x'] + _this.playerImageSize['w'] > _this.width )
                _this.player.position['x'] = _this.width - _this.playerImageSize['w'];
            // console.log(_this.player.position['x']);
        }else{

        }



    }

    var start;
    var fallStart = -1;
    this.update = function (time){
        // console.log(start);

        if(start === undefined)
            start = time;
        let dtime = (time - start) / 1000;
        start = time;
        let _dy = _this.linear(dtime,_this.blockSpeed);
        var ctx = $("canvas").getContext('2d');
        ctx.imageSmoothingEnabled = true;


        let player_x=_this.player.position['x'];
        let player_y=_this.player.position['y'];

        //clear player
        ctx.clearRect( player_x, player_y,_this.playerImageSize["w"],_this.playerImageSize["h"]);
        // clear block
        for (let i = 0; i < _this.block_arr.length;i++){
            var x = _this.block_arr[i].position['x'];
            var y = _this.block_arr[i].position['y'];
            ctx.clearRect( x,y,_this.blockImageSize["w"],_this.blockImageSize["h"]);
        }
        // process block
        for (let i = 0; i < _this.block_arr.length;i++){
            var x = _this.block_arr[i].position['x'];
            var y = _this.block_arr[i].position['y'];
            
            _this.block_arr[i].setPosition(x,y-_dy);

            if(y<=0){
                _this.block_arr.shift();
                let block = _this.createBlock();
                _this.block_arr.push(block);
            }
        }
        // draw block
        for (let i = 0; i < _this.block_arr.length;i++){
            var x = _this.block_arr[i].position['x'];
            var y = _this.block_arr[i].position['y'];
            ctx.drawImage(_this.block_arr[i].image,x,y,_this.blockImageSize["w"],_this.blockImageSize["h"]);
        }
        _this.collisionDetection();

        _this.processInput(_this.inputBuffer,dtime);
        player_x=_this.player.position['x'];
        player_y=_this.player.position['y'];
        // 碰撞检测

        if(_this.fall){
            var t;
            if(fallStart === -1)
            {
                fallStart = performance.now();
                t = fallStart;
            }else
                t = performance.now();
            let dt = (t - fallStart)/1000;
            _this.player.position['y'] += _this.fallFunction(dt);
            // _this.player.position['y'] += _this.linear(dtime,_this.playerFallSpeed);
            player_y=_this.player.position['y'];

            _this.fall = false;
            _this.hurt = true;
            _this.addBlood = true;
        }else {
            fallStart = -1;
            _this.player.position['y'] -= _dy;
            player_y = _this.player.position['y']
            _this.hurt = false;
            _this.addBlood = false;
        }
        ctx.drawImage(_this.player.image,player_x, player_y ,_this.playerImageSize["w"],_this.playerImageSize["h"]);




    
        if(_this.player.life>0)
            window.requestAnimationFrame(_this.update);
    }

    // player下落位移函数
    this.fallFunction = function(t) {
        return _this.playerFallSpeed*t+Math.pow(t,2)*9.8/2; 
    }

    // 线性位移函数
    this.linear = function(t,speed){
        return t*speed;
    }

    this.collisionDetection = function(){
        let x = _this.player.position['x'];
        let y = _this.player.position['y'];
        if(y<=0){
            _this.fall = true;
            _this.player.life -= 20;
            return;
        }
        if(y>=_this.height-_this.playerImageSize['h'])
        {
            _this.fall = false;
            _this.player.life = 0;
            return;
        }
        for(let i=0;i<_this.block_arr.length;i++)
        {
            let block_x = _this.block_arr[i].position['x'];
            let block_y = _this.block_arr[i].position['y'];
            if(block_y - y - _this.playerImageSize['h'] <= 3.5  && block_y - y - _this.playerImageSize['h'] >= -5){
                // console.log(block_y - y - _this.playerImageSize['h']);
                if (-_this.playerImageSize['w'] < (x-block_x) && (x-block_x) < _this.blockImageSize['w']){
                    // 计算血量
                    if(_this.addBlood && _this.block_arr[i].color == "black" ){
                        if(_this.player.life <=100)
                            _this.player.life+=10;
                        _this.score += 10;
                        _this.blockSpeed += Math.log((_this.score/10)+1);
                    }
                    else if (_this.hurt && _this.block_arr[i].color == "white"  ){
                        if(_this.player.life >0)
                            _this.player.life-=20;
                        _this.score -= 5;
                    }


                    _this.fall = false;
                    break;
                }else{
                    _this.fall = true;
                }

            }
            else{
                _this.fall = true;
            }
        }
    }


    this.createBlock = function() {
        let block = new Block();
        let x = _this.getRandomArbitrary(0,_this.width-_this.blockImageSize['w']);
        let y = _this.height;

        if (Math.random()>0.4) {
            block.init(_this.black_block_image,"black");
            // _this.black_block_num++;
            // _this.black_block_rate = _this.black_block_num/(_this.black_block_num+_this.white_block_num);
        }
        else {
            block.init(_this.white_block_image,"white");
            // _this.white_block_num++;
        }


        block.setPosition(x,y);

        return block;
    }

    this.getRandomArbitrary = function (min, max) {
        return Math.random() * (max - min) + min;
      }

    this.initBlock = function() {
        let block_number = _this.height/(_this.blockImageSize['h']+_this.playerImageSize['h']);

        for(var i = 0; i < block_number; i++){
            let block = _this.createBlock();
            block.setPosition(block.position['x'],(_this.blockImageSize['h']+_this.playerImageSize['h'])*i);
            _this.block_arr.push(block);
        }
        // _this.black_block_rate = _this.black_block_num/(_this.black_block_num+_this.white_block_num);

    }
    this.initKeyboardListener = function() {
        document.addEventListener('keydown',press);
        document.onkeydown = press;
        document.addEventListener('keyup',release);
        document.onkeyup = release;
    }




}

  

