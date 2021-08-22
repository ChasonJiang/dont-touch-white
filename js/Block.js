function Block() {
    this.position = {x:0, y:0};
    
    var _this = this;
    this.init = init;
    function init(image,color) {
        this.image = image;
        this.color = color;
    }

    this.setPosition = function (x, y){
        this.position['x'] = x;
        this.position['y'] = y;
    }

    this.getPosition = function (){
        return this.position;
    }

    this.getImage = getImage;
    function getImage(){
        return this.image;
    }

}