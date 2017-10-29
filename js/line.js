    function LineCreator(){


        //material

        this.vertexShader = [

            "varying float opacity;",
            "uniform vec3 bezierPos[NUM_SEGMENT];",
            "uniform float width;",
            "varying vec4 vWorldPosition;",
            "vec3 quadraticBezier(vec3 a,vec3 b,vec3 c,float t){",
            "float s = 1.-t;",
            "vec3 q = s*s*a+2.*s*t*b+t*t*c;",
            "return q;",
            "}",

            "void main(){",
            "const float numSegment = float(NUM_SEGMENT);",
            "float percent = uv.y;",
            "opacity = 1.0-percent;",

            "int i0 = int(percent*numSegment);",
            "int i1 = i0+1;",
            "int i2 = i0+2;",
            "float p0 = float(i0)/numSegment;",
            "vec3 sp = mix(bezierPos[i0],bezierPos[i1],.5);",
            "vec3 ep = mix(bezierPos[i1],bezierPos[i2],.5);",
            "vec3 np = quadraticBezier(sp,bezierPos[i1],ep,(percent-p0)*numSegment);",
            "vec3 tangent = bezierPos[i0] - bezierPos[i1];",
            "vec3 normal = -vec3(tangent.y, -tangent.x, 0.0);",            
            "vec3 pos = np + (uv.x - 0.5) * width * normalize(normal);",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);",   
            "}",

        ].join("\n");

        this.fragmentShader = [

            "uniform vec4 color;",
            "uniform vec4 color2;",
            "varying float opacity;",
            
            "void main(){",
            "gl_FragColor = mix(color, color2, (1.0-opacity)*(1.0-opacity));",
            "}",

        ].join("\n");

        this.material = new THREE.ShaderMaterial({
            vertexShader:this.vertexShader,
            fragmentShader:this.fragmentShader,
            side:THREE.DoubleSide,
            depthWrite:false,
            transparent:true
            //wireframe:true

        });


        //geometry


        var basic0 = new THREE.PlaneBufferGeometry(0, 0, 1, 50);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(basic0.attributes.normal.array.length*2), 3 ) );
        this.geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(basic0.attributes.position.array.length*2), 3 ) );
        this.geometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array(basic0.attributes.uv.array.length*2), 2 ) );
        this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(basic0.index.array.length*2), 1));

        for(var i=0,ilen = basic0.attributes.position.count;i<ilen;i++) {

            this.geometry.attributes.position.array[i*3] = basic0.attributes.position.array[i*3];
            this.geometry.attributes.position.array[i*3+1] = basic0.attributes.position.array[i*3+1];
            this.geometry.attributes.position.array[i*3+2] = basic0.attributes.position.array[i*3+2];

            this.geometry.attributes.normal.array[i*3] = basic0.attributes.normal.array[i*3];
            this.geometry.attributes.normal.array[i*3+1] = basic0.attributes.normal.array[i*3+1];
            this.geometry.attributes.normal.array[i*3+2] = basic0.attributes.normal.array[i*3+2];

            this.geometry.attributes.uv.array[i*2] = basic0.attributes.uv.array[i*2];
            this.geometry.attributes.uv.array[i*2+1] = basic0.attributes.uv.array[i*2+1];
        }

        for(i=0,ilen = basic0.index.array.length;i<ilen;i++) {

            this.geometry.index.array[i] = basic0.index.array[i];

        }

    };

    function Line( width, length, startColor, endColor, type ) {

        if(!endColor) endColor = startColor;

        var creator = new LineCreator();

        var numSegment = Math.ceil(100*length*2);

        var delay = 0.5;

        this.extra = {};

        this.material = creator.material.clone();

        this.material.defines = {NUM_SEGMENT:numSegment};

        this.material.uniforms = {

            color:{value:new THREE.Vector4(startColor.r, startColor.g, startColor.b, 1)},

            color2:{value:new THREE.Vector4(endColor.r, endColor.g, endColor.b, type ? 1 : 0)},

            bezierPos:{value:[]},

            width: {value: width}
        };

        THREE.Mesh.call(this, creator.geometry, this.material);

        this.frustumCulled = false;

        this.matrixAutoUpdate = false;

        //add line head
        
        var geometry = new THREE.CircleGeometry(1.0*width/2, 18);

        var material = new THREE.MeshBasicMaterial({color:startColor, side:THREE.DoubleSide});

        this.head = new THREE.Mesh(geometry, material);

        this.add(this.head);

        this.alpha = this.material.uniforms.alpha;

        for(var i=0;i<numSegment;i++){

            this.material.uniforms.bezierPos.value[i] = new THREE.Vector3();

        }        

        //

        this.render = function(){

            this.material.uniforms.bezierPos.value[0].copy(this.head.position);

            for(var i=1,ilen = this.material.uniforms.bezierPos.value.length;i<ilen;i++){

                this.material.uniforms.bezierPos.value[i].lerp(this.material.uniforms.bezierPos.value[i-1], delay);

            }

        }

        this.setStartPosition = function(val){

            this.head.position.copy(val);

            for(var i=0,ilen = this.material.uniforms.bezierPos.value.length;i<ilen;i++){

                this.material.uniforms.bezierPos.value[i].copy(val);

            }

        }

    }

    Line.prototype = Object.create(THREE.Mesh.prototype);

    Line.prototype.constructor = Line;
