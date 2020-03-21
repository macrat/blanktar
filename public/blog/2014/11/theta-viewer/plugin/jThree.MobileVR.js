/*!
 * jThree.MobileVR.js JavaScript Library v0.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0
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
 * Date: 2014-09-22
 */

!function() {

var MobileVR = function( camera ) {
	this.camera = camera;
};

MobileVR.prototype = {

	constructor: MobileVR,

	tmpVec: new THREE.Vector3,

	degToRad: function() {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	init: function( e ) {
		this.first = [ e.alpha, e.gamma, e.beta ];
	},

	verticalUpdate: function( e ) {
		/*var a;
		if ( e.alpha > 180 ) {
			a = e.alpha;
		} else {
			a = e.alpha;
		}
		$( "#valA" ).val(a);
		$( "#valB" ).val(e.beta);
		$( "#valG" ).val(e.gamma);*/

		this.camera.quaternion.setFromEuler( {
			x: 0/*this.degToRad( this.first[ 2 ] - e.beta )*/,
			y: this.degToRad( e.alpha - this.first[ 0 ] ),
			z: 0/*- this.degToRad( this.first[ 0 ] - e.alpha )*/
		} );

	},
	leftHorizonUpdate: function( e ) {

		this.camera.quaternion.setFromEuler( {
			x: - this.degToRad( e.gamma - this.first[ 1 ] ),
			y: this.degToRad( e.alpha - this.first[ 0 ] ),
			z: - this.degToRad( e.beta - this.first[ 2 ] )
		} );

	},
	rightHorizonUpdate: function( e ) {

		this.camera.quaternion.setFromEuler( {
			x: this.degToRad( e.gamma - this.first[ 1 ] ),
			y: this.degToRad( e.alpha - this.first[ 0 ] ),
			z: this.degToRad( e.beta - this.first[ 2 ] ) / 2
		} );

	},
	start: function( mode ) {

		if ( mode === undefined ) {
			mode = 1;
		}

		var that = this;
		this.mode = mode;
		this.qtMode = this.camera.useQuaternion;
		this.camera.useQuaternion = true;
		this.playing = true;
		this.remove = function() {
			that = null;
		};

		if ( !mode ) {
			this.update = function( e ) {
				that.verticalUpdate( e );
			};
		} else if ( mode === 1 ) {
			this.update = function( e ) {
				that.leftHorizonUpdate( e );
			};
		} else if ( mode === 2 ) {
			this.update = function( e ) {
				that.rightHorizonUpdate( e );
			};
		}

		window.addEventListener( "deviceorientation", function( e ) {

			that.init( e );
			window.removeEventListener( "deviceorientation", arguments.callee, false );
			window.addEventListener( "deviceorientation", that.update, false );

		}, false );

	},

	stop: function() {
		window.removeEventListener( "deviceorientation", this.update, false );
		this.camera.useQuaternion = this.qtMode;
		this.playing = false;
		this.remove();
	},

	toggle: function() {
		this[ this.playing ? "stop" : "start" ]();
	}

};

jThree.MobileVR = function( selector ) {

	var vrs = [];

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		var vr = new MobileVR( jThree.three( jThree.getCamera( this ) ) );


		jThree( this ).on( "attrChange", function( e ) {

			if ( e.attrName !== "camera" ) return;
			vr.camera = jThree.three( jThree.getCamera( this ) );

		} );

		vrs.push( vr );

	} );

	return vrs.length > 1 ? vrs : vrs[ 0 ];

};

}();