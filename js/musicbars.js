function MusicBars() {
	
	var scope = this;
	
	THREE.Object3D.call(this);
	
	var r = 38;
	
	var oneSideNum = 170;
	
	var deg = Math.PI / oneSideNum;
	
	this.leftBars = [];
	
	this.rightBars = [];
	
	for(var i = 0; i < oneSideNum; i++) {
		
		var bool = Math.random() > 0.85 ? true : false;
		
		var leftBar = new THREE.Mesh(
			new THREE.PlaneGeometry(1,10),
			new THREE.MeshPhongMaterial({color:0XB975EC,wireframe:bool,transparent:true,opacity:Math.random()})
		);
		
		var rightBar = new THREE.Mesh(
			new THREE.PlaneGeometry(1,10),
			new THREE.MeshPhongMaterial({color:0xe986bc,wireframe:bool,transparent:true,opacity:Math.random()})
		);
		
		leftBar.scale.y = 0.001;
		rightBar.scale.y = 0.001;
		
		var posX = r * Math.sin(deg * i);
		var posY = r * Math.cos(deg * i);
		var posZ = 0;
		
		leftBar.position.set(-posX, posY, posZ);
		rightBar.position.set( posX, -posY, posZ);
		
		leftBar.rotation.z = deg * i;
		rightBar.rotation.z = deg * i;
		
		this.leftBars.push(leftBar);
		this.rightBars.push(rightBar);
		
		this.add(leftBar);
		this.add(rightBar);
		
	}
	
	this.update = function(data) {
		
		if(data[0] !== 0) {
			
			for(var i = 0; i < oneSideNum; i++) {
			
				var leftBar = scope.leftBars[i];
				
				var rightBar = scope.rightBars[i];
			
				var d = data[i];
				
				var scaleY = THREE.Math.mapLinear(d, 0, 250, 0, 2.5);
				
				if(scaleY < 0.001) scaleY = 0.001; 
				
				leftBar.scale.y = scaleY;
				
				rightBar.scale.y = scaleY;
			
			}
			
		}
		
	}
	
	
	
	
}

MusicBars.prototype = Object.create(THREE.Object3D.prototype);
MusicBars.prototype.constructor = MusicBars;
