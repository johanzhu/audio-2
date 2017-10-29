function MusicScene(imgs) {
	
	THREE.Scene.call(this);
	
	var aniSprite = new AnimateSprite(imgs, 40, 500, 0, false);
	
	this.add(aniSprite);
	
	var bars = new MusicBars();
	var eyeShow = false;
	
	this.add(bars);
		
	var light = new THREE.DirectionalLight();
	
	light.position.set(10,0,20);
		
	this.add(light);
	
	var eye = new THREE.Object3D();
	
	var texture = new THREE.Texture(preload.getResult('gouYu'));
	texture.needsUpdate = true;
	
	var r = 25;
	
	var deg = 2 * Math.PI / 3;
	
	for(var i = 0; i < 3; i++) {
		
		var gouYu = new THREE.Mesh(
			new THREE.PlaneGeometry(5,5),
			new THREE.MeshBasicMaterial({ map : texture, transparent : true ,alphaTest: 0.7})
		);
		
		gouYu.position.x = r * Math.cos(deg * i);
		gouYu.position.y = r * Math.sin(deg * i);
		gouYu.position.z = 5;
		
		if( i == 0 ) gouYu.rotation.z = Math.PI - Math.PI;
		
		if( i == 1 ) gouYu.rotation.z = Math.PI - Math.PI/6;
		
		if( i == 2 ) gouYu.rotation.z = -Math.PI + Math.PI/2.5;
		
		eye.add(gouYu);
		
	}
	
	eye.position.x -= 1;
	
	eye.scale.set(0.001,0.001,0.001);
	
	this.add(eye);
	
	eventBus.addEventListener('music',function() {
		
		TweenMax.to(eye.scale, 2, {x : 1, y : 1, z : 1, onComplete: function() {
			eyeShow = true;
		}});
		TweenMax.to(eye.rotation, 2, {z : 2 * Math.PI });
		
	});


	this.animate = function() {
		
		aniSprite.animate();
		
	}
	
	this.update = function(data1,data2) {
		
		var scale = THREE.Math.mapLinear(data2, 0, 46, 0.8, 1.2);
		
		if(eyeShow) eye.scale.set(scale,scale,scale);
		
		eye.rotation.z += Math.PI/1200;
		
		bars.rotation.z -= Math.PI/1200;
		
		bars.update(data1);		
		
		aniSprite.update(data2);
		
	}
	
}

MusicScene.prototype = Object.create(THREE.Scene.prototype);
MusicScene.prototype.constructor = MusicScene;
