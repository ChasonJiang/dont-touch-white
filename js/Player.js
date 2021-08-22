function Player(){
    this.position = {x:0, y:0};
    this.life = 100;
    var _this = this;
    
    this.init = init;
    function init(image){
        this.image = image;
     }

    this.setPosition = setPosition;
    function setPosition(x, y){
        this.position['x'] = x;
        this.position['y'] = y;
    }

    this.getPosition = getPosition;
    function getPosition(){
        return this.position;
    }

    this.getImage = getImage;
    function getImage(){
        return this.image;
    }

}