    var lines = [
		{
            color:[new THREE.Color(0xae68e7), new THREE.Color(0xae68e7)],

            length: 1,

            width: 1.6,

	    },
	    {
            color:[new THREE.Color(0xea86bc), new THREE.Color(0xea86bc)],

            length: 1,

            width: 1.6,

	    }
    ];


    function LineAnimation() {

        THREE.Object3D.call(this);

        var scope = this;

        scope.lines = [];

		var r = 10;

        var t = 0;
        
        for(var i = 0; i < lines.length; i++){
				
			var line;	
				
            var lineCfg = lines[i];
            
            var len = lineCfg.color.length;

            if(len == 1){

                line = new Line( lineCfg.width, lineCfg.length, lineCfg.color[0] );

            }else if(len == 2){

                line = new Line( lineCfg.width, lineCfg.length, lineCfg.color[0], lineCfg.color[1],true);

            }else if(len == 3){

                line = new Line( lineCfg.width, lineCfg.length, lineCfg.color[0], lineCfg.color[1], lineCfg.color[2]);

            }else{

                return;

            }

            line.extra.startA = line.startA;

            line.extra.speed = line.speed;

            line.setStartPosition(new THREE.Vector3(
            	
            	i == 0 ? -r : r,
            	
            	-10,
            	
            	0
            	
            ));

            this.add(line);

            this.lines.push(line);

        }

        this.update = function(deg){

            t += deg;

            if(scope.lines.length){

                for(var i = 0; i < scope.lines.length; i++) {
					
					var posx = i == 0 ? -r * Math.cos(t) : r * Math.cos(t);
					
					var posz = i == 0 ? r * Math.sin(t) : -r * Math.sin(t);
					
					scope.lines[i].head.position.x = posx;
					 
					scope.lines[i].head.position.y = -10 + 5.5 * t;
					
					scope.lines[i].head.position.z = 0;
					
                    scope.lines[i].render();

                }

            }

        }
        
        this.reset = function() {
        	
        	if(scope.lines.length){

                for(var i = 0; i < scope.lines.length; i++) {
					
					scope.lines[i].head.position.x = i == 0 ? -r : r;
					 
					scope.lines[i].head.position.y = -20;
					
					scope.lines[i].head.position.z = 0;
					
                }

            }
        }
        
    }

    LineAnimation.prototype = Object.create(THREE.Object3D.prototype);
    
    LineAnimation.prototype.constructor = LineAnimation;

