function AnimateSprite(imgs,size,fps,loopIndex,isLoop) {
	console.log(imgs);
    var scope = this;
    
    THREE.Sprite.call(this);
    
    var done = false;
    
    this.imgs = imgs;
    this.index = 0;
    this.spaceTime = fps;
    this.loopIndex = loopIndex;
    
    if(typeof size == 'object'){
        this.scaleX = size[0];
        this.scaleY = size[1];
    }else{
        this.scaleX = this.scaleY = size;
    }
    
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    
    this.context.drawImage(this.imgs[0],0,0,this.canvas.width,this.canvas.height);
    
    this.texture = new THREE.Texture(this.canvas);
    this.texture.anisotropy = 0;
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.needsUpdate = true;
    
    var spriteMaterial = new THREE.SpriteMaterial({
        map: this.texture,
        color: 0xffffff
    });
    
    this.material = spriteMaterial;
    this.scale.set(this.scaleX, this.scaleY, 1);

    var loop;
	var timeout;
    
    this.animate = function() {
        
        loop = setInterval(function(){
			
            if(scope.index < scope.imgs.length-1){
            	
            	TweenMax.to(scope.scale, 0.2, { x : 40, y : 40, z :40});
            	
                scope.index++;
                
            }else{
            	
				eventBus.dispatchEvent({type:'music'});
				
				if(isLoop) {
					scope.index = scope.loopIndex;
				}else{
                	clearInterval(loop);
                	done = true;
               	}
                	
            }
            
            if(!done) scope.scale.set(30,30,30);
            
            updateImage(scope.imgs[scope.index]);
            
        }, scope.spaceTime);
    }

    function updateImage(img){    
        scope.context.clearRect(0, 0, scope.canvas.width, scope.canvas.height);
        scope.context.drawImage(img,0,0,scope.canvas.width,scope.canvas.height);
        scope.texture.needsUpdate = true;
    }
    
    this.update = function(data) {
    	
    	var scale = THREE.Math.mapLinear(data, 0, 46, 25, 45);
    	
    	scope.scale.set(scale,scale,scale);
    	
    }

}

AnimateSprite.prototype = Object.create(THREE.Sprite.prototype);
AnimateSprite.prototype.constructor = AnimateSprite;
