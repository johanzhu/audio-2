function Trail(scene,trailTarget,trailShape,length,headColor,tailColor) {
	var scope = this;
	var circlePoints = [];
	
	var twoPI = Math.PI * 2;
	var index = 0;
	var scale = 0.5;
	var inc = twoPI / 32.0;

	for ( var i = 0; i <= twoPI + inc; i+= inc )  {

		var vector = new THREE.Vector3();
		vector.set( Math.cos( i ) * scale, Math.sin( i ) * scale, 0 );
		circlePoints[ index ] = vector;
		index ++;

	}
	
	var planePoints = [];
	planePoints.push( new THREE.Vector3( 0.0, -10.0, 0.0 ), new THREE.Vector3( 0.0, 0.0, 0.0 ), new THREE.Vector3( 0.0, 10.0, 0.0 ) );
			
	if(trailShape == 'circle' || trailShape == 'plain') {
		
		this.trailHeadGeometry = trailShape == 'circle' ? circlePoints
										  		: planePoints;
										  
	}else{
		
		console.log('自己传入向量数组哦！');
		
	}
	
	this.trailTarget = trailTarget;
	
	this.trailLength = length;
	
	this.trail = new THREE.TrailRenderer( scene, false );	

	this.baseTrailMaterial = THREE.TrailRenderer.createBaseMaterial();
	
	setTrailColor( this.baseTrailMaterial, headColor, tailColor );
	
	this.trail.initialize( this.baseTrailMaterial, this.trailLength, false, 1, this.trailHeadGeometry, this.trailTarget );
	this.trail.activate();
	
	
	function setTrailColor(trailMaterial,headColor,tailColor) {
		trailMaterial.uniforms.headColor.value.set( headColor[0], headColor[1], headColor[2], headColor[3] );
		trailMaterial.uniforms.tailColor.value.set( tailColor[0], tailColor[1], tailColor[2], tailColor[3] );
	}
	
	var lastTrailUpdateTime = 0;
	
	var updateTrailTarget = (function() {
			
			return function(time, move) {
				
				if ( time > lastTrailUpdateTime ) {
	
					scope.trail.advance();
					lastTrailUpdateTime = time;
	
				} else {
	
					scope.trail.updateHead();
	
				}
				
				move(scope.trailTarget,time);
	
			}
			
	
	})();
	
	this.update = function(time,move) {
		
		updateTrailTarget(time,move);
		
	}
	
	
}
