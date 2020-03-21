/*!
 * jThree.Cardboard.js JavaScript Library v0.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0.0
 * Includes vr.js | Copyright (c) Ben Vanik
 * Includes OculusRiftEffect.js | Copyright (c) 2010-2013 three.js authors
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2014-08-31
 */
 

THREE.OculusRiftEffect = function ( renderer, options ) {
	// worldFactor indicates how many units is 1 meter
	var worldFactor = (options && options.worldFactor) ? options.worldFactor: 1.0;

	// Specific HMD parameters
	var HMD = jThree.extend( {
		// Parameters from the Oculus Rift DK1
		hResolution: 1280,
		vResolution: 800,
		hScreenSize: 0.14976,
		vScreenSize: 0.0936,
		interpupillaryDistance: 0.064,
		lensSeparationDistance: 0.064,
		eyeToScreenDistance: 0.041,
		distortionK : [1.0, 0.22, 0.24, 0.0],
		chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
	}, options || {} );

	// Perspective camera
	var pCamera = new THREE.PerspectiveCamera();
	pCamera.matrixAutoUpdate = false;
	pCamera.target = new THREE.Vector3();

	// Orthographic camera
	var oCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000 );
	oCamera.position.z = 1;

	// pre-render hooks
	this.preLeftRender = function() {};
	this.preRightRender = function() {};

	var emptyColor = new THREE.Color("#000");

	// Render target
	var RTParams = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };
	var renderTargetL;
	var renderTargetR;
	var RTMaterialL = new THREE.MeshBasicMaterial({color:0xffffff});
	/*var RTMaterialL = new THREE.ShaderMaterial( {
		uniforms: {
			"texid": { type: "t" },
			"scale": { type: "v2", value: new THREE.Vector2(1.0,1.0) },
			"scaleIn": { type: "v2", value: new THREE.Vector2(1.0,1.0) },
			"lensCenter": { type: "v2", value: new THREE.Vector2(0.0,0.0) },
			"hmdWarpParam": { type: "v4", value: new THREE.Vector4(1.0,0.0,0.0,0.0) },
			"chromAbParam": { type: "v4", value: new THREE.Vector4(1.0,0.0,0.0,0.0) }
		},
		vertexShader: [
			"varying vec2 vUv;",
			"void main() {",
			" vUv = uv;",
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"
		].join("\n"),

		fragmentShader: [
			"uniform vec2 scale;",
			"uniform vec2 scaleIn;",
			"uniform vec2 lensCenter;",
			"uniform vec4 hmdWarpParam;",
			"uniform vec4 chromAbParam;",
			"uniform sampler2D texid;",
			"varying vec2 vUv;",
			"void main()",
			"{",
			"  vec2 uv = (vUv*2.0)-1.0;", // range from [0,1] to [-1,1]
			"  vec2 theta = (uv-lensCenter)*scaleIn;",
			"  float rSq = theta.x*theta.x + theta.y*theta.y;",
			"  vec2 rvector = theta*(hmdWarpParam.x + hmdWarpParam.y*rSq + hmdWarpParam.z*rSq*rSq + hmdWarpParam.w*rSq*rSq*rSq);",
			"  vec2 rBlue = rvector * (chromAbParam.z + chromAbParam.w * rSq);",
			"  vec2 tcBlue = (lensCenter + scale * rBlue);",
			"  tcBlue = (tcBlue+1.0)/2.0;", // range from [-1,1] to [0,1]
			"  if (any(bvec2(clamp(tcBlue, vec2(0.0,0.0), vec2(1.0,1.0))-tcBlue))) {",
			"    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);",
			"    return;}",
			"  vec2 tcGreen = lensCenter + scale * rvector;",
			"  tcGreen = (tcGreen+1.0)/2.0;", // range from [-1,1] to [0,1]
			"  vec2 rRed = rvector * (chromAbParam.x + chromAbParam.y * rSq);",
			"  vec2 tcRed = lensCenter + scale * rRed;",
			"  tcRed = (tcRed+1.0)/2.0;", // range from [-1,1] to [0,1]
			"  gl_FragColor = vec4(texture2D(texid, tcRed).r, texture2D(texid, tcGreen).g, texture2D(texid, tcBlue).b, 1);",
			"}"
		].join("\n")
	} );*/
	var RTMaterialR = RTMaterialL.clone();

	var meshL = new THREE.Mesh( new THREE.PlaneGeometry( 1, 2 ), RTMaterialL ),
		meshR = new THREE.Mesh( new THREE.PlaneGeometry( 1, 2 ), RTMaterialR );

	meshL.position.x = -.5;
	meshR.position.x = .5;

	// Final scene
	var finalScene = new THREE.Scene();
	finalScene.add( oCamera );
	finalScene.add( meshL );
	finalScene.add( meshR );

    var left = {}, right = {};
    var distScale = 1.0;
	this.setHMD = function(v) {
		HMD = v;
		// Compute aspect ratio and FOV
		var aspect = HMD.hResolution / (2*HMD.vResolution);

		// Fov is normally computed with:
		//   THREE.Math.radToDeg( 2*Math.atan2(HMD.vScreenSize,2*HMD.eyeToScreenDistance) );
		// But with lens distortion it is increased (see Oculus SDK Documentation)
		var r = -1.0 - (4 * (HMD.hScreenSize/4 - HMD.lensSeparationDistance/2) / HMD.hScreenSize);
		distScale = (HMD.distortionK[0] + HMD.distortionK[1] * Math.pow(r,2) + HMD.distortionK[2] * Math.pow(r,4) + HMD.distortionK[3] * Math.pow(r,6));
		var fov = THREE.Math.radToDeg(2*Math.atan2(HMD.vScreenSize*distScale, 2*HMD.eyeToScreenDistance));

		// Compute camera projection matrices
		var proj = (new THREE.Matrix4()).makePerspective( fov, aspect, 0.3, 10000 );
		var h = 4 * (HMD.hScreenSize/4 - HMD.interpupillaryDistance/2) / HMD.hScreenSize;
		left.proj = ((new THREE.Matrix4()).makeTranslation( h, 0.0, 0.0 )).multiply(proj);
		right.proj = ((new THREE.Matrix4()).makeTranslation( -h, 0.0, 0.0 )).multiply(proj);

		// Compute camera transformation matrices
		left.tranform = (new THREE.Matrix4()).makeTranslation( -worldFactor * HMD.interpupillaryDistance/2, 0.0, 0.0 );
		right.tranform = (new THREE.Matrix4()).makeTranslation( worldFactor * HMD.interpupillaryDistance/2, 0.0, 0.0 );


		// Distortion shader parameters
		var lensShift = 4 * (HMD.hScreenSize/4 - HMD.lensSeparationDistance/2) / HMD.hScreenSize;
		left.lensCenter = new THREE.Vector2(lensShift, 0.0);
		right.lensCenter = new THREE.Vector2(-lensShift, 0.0);

		/*RTMaterialL.uniforms["hmdWarpParam"].value = new THREE.Vector4(HMD.distortionK[0], HMD.distortionK[1], HMD.distortionK[2], HMD.distortionK[3]);
		RTMaterialL.uniforms["chromAbParam"].value = new THREE.Vector4(HMD.chromaAbParameter[0], HMD.chromaAbParameter[1], HMD.chromaAbParameter[2], HMD.chromaAbParameter[3]);
		RTMaterialL.uniforms["scaleIn"].value = new THREE.Vector2(1.0,1.0/aspect);
		RTMaterialL.uniforms["scale"].value = new THREE.Vector2(1.0/distScale, 1.0*aspect/distScale);

		RTMaterialR.uniforms["hmdWarpParam"].value = new THREE.Vector4(HMD.distortionK[0], HMD.distortionK[1], HMD.distortionK[2], HMD.distortionK[3]);
		RTMaterialR.uniforms["chromAbParam"].value = new THREE.Vector4(HMD.chromaAbParameter[0], HMD.chromaAbParameter[1], HMD.chromaAbParameter[2], HMD.chromaAbParameter[3]);
		RTMaterialR.uniforms["scaleIn"].value = new THREE.Vector2(1.0,1.0/aspect);
		RTMaterialR.uniforms["scale"].value = new THREE.Vector2(1.0/distScale, 1.0*aspect/distScale);*/

		// Create render target
		if ( renderTargetL ) renderTargetL.dispose();
		renderTargetL = new THREE.WebGLRenderTarget( HMD.hResolution*distScale/2, HMD.vResolution*distScale, RTParams );
		RTMaterialL.map/*uniforms[ "texid" ].value*/ = renderTargetL;

		// Create render target
		if ( renderTargetR ) renderTargetR.dispose();
		renderTargetR = new THREE.WebGLRenderTarget( HMD.hResolution*distScale/2, HMD.vResolution*distScale, RTParams );
		RTMaterialR.map/*uniforms[ "texid" ].value*/ = renderTargetR;

	};
	this.getHMD = function() {return HMD};

	this.setHMD(HMD);	

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );
	};

	this.render = function ( scene, camera ) {
		var cc = renderer.getClearColor().clone();

		// Clear
		renderer.setClearColor(emptyColor);
		renderer.clear();
		renderer.setClearColor(cc);

		// camera parameters
		if (camera.matrixAutoUpdate) camera.updateMatrix();

		// Render left
		this.preLeftRender();

		pCamera.projectionMatrix.copy(left.proj);

		pCamera.matrix.copy(camera.matrix).multiply(left.tranform);
		pCamera.matrixWorldNeedsUpdate = true;

		//RTMaterialL.uniforms["lensCenter"].value = left.lensCenter;
		renderer.render( scene, pCamera, renderTargetL, true );

		// Render right
		this.preRightRender();

		pCamera.projectionMatrix.copy(right.proj);

		pCamera.matrix.copy(camera.matrix).multiply(right.tranform);
		pCamera.matrixWorldNeedsUpdate = true;

		//RTMaterialR.uniforms["lensCenter"].value = right.lensCenter;
		renderer.render( scene, pCamera, renderTargetR, true );

		renderer.render( finalScene, oCamera );

	};

};

!function() {

var Oculus = function( selector ) {
	var that = this;
	this.rdrObj = jThree( selector || "rdr:first" ).resize( function() { that.resize(); } );
	this.rdr = this.rdrObj.three( 0 );

	this.scene = jThree.three( jThree.getScene( this.rdr ) );
	this.canvas = jThree.getCanvas( this.rdr );

	this.camera = jThree.three( jThree.getCamera( this.rdr ) );
	this.camera.useQuaternion = this.isInstalled && true;

	this.effect = new THREE.OculusRiftEffect( this.rdr, {
		worldFactor: 10
	} );

	this.quaternion = new THREE.Quaternion;

};

Oculus.prototype = {
	constructor: Oculus,
	get tracking() {
		return this.camera.useQuaternion;
	},
	set tracking( bool ) {
		this.camera.useQuaternion = !!bool;
	},
	resize: function() {
		if ( !this.playing ) return;
		var hmd = this.effect.getHMD();
		hmd.vResolution = this.canvas.height;
		hmd.hResolution = hmd.vResolution / 10 * 16;
		this.effect.setHMD( hmd );
		this.rdr.setViewport( ( this.canvas.width - hmd.hResolution ) /2, 0, hmd.hResolution, this.canvas.height );
	},
	start: function() {

		var that = this;
		this.playing = true;
		this.rdrObj.attr( "rendering", "false" );
		this.rdr.autoClear = false;

		this.resize();

		( function () {

			var rdr = that.rdr, j, elem,
				quaternion = that.quaternion,
				scene = that.scene,
				camera = that.camera,
				visible = [];

			jThree.update( that.updateFn = function( delta, elapsed ) {

				for ( ( j = rdr.__updateFn.length ) && ( elem = rdr.userData.dom ); j; ) {
					rdr.__updateFn[ --j ].call( elem, delta, elapsed );
				}

				for ( j = rdr.__renderTarget.length; j; ) {
					elem = rdr.__renderTarget[ --j ];

					elem.__invisible && elem.__invisible.forEach( function( obj ) {

						if ( jThree.styleHooks.display.get( obj ) ) {
							visible.push( obj );
							jThree.styleHooks.display.set( obj, false );
						}

					} );

					rdr.render( elem.__camera.userData.scene, elem.__camera, elem );

					visible.forEach( function( obj ) {
						jThree.styleHooks.display.set( obj, true );
					} );
					visible.length = 0;

				}

				that.effect.render( scene, camera );

			} );

		} )();

		return this;
	},
	stop: function() {
		this.playing = false;
		this.rdrObj.attr( "rendering", "true" );
		this.rdr.autoClear = true;
		jThree.update( this.updateFn, false );
		this.rdr.setViewport( 0, 0, this.canvas.width, this.canvas.height );
		return this;
	},
	toggle: function() {
		this[ this.playing ? "stop" : "start" ]();
	}
};

jThree.Oculus = function( selector ) {
	return new Oculus( selector );
};

}();