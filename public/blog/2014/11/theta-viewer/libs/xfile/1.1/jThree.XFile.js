/*!
 * jThree.XFile.js JavaScript Library v1.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0.0
 * Includes XLoader.js | Copyright (c) 2014 Matsuda Mitsuhide
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
 * Date: 2014-09-12
 */

THREE.XLoader = function( url, fn, error ) {

	this.txrPath = /\//.test( url ) ? url.slice( 0, url.lastIndexOf( "/" ) + 1 ) : "";
	this.onload = fn;
	this.onerror = error;

	this.mode = null;
	this.modeArr = [];
	this.uvIdx = [];
	this.txrs = {};
	this.nArr = [];
	this.uvArr = [];
	this.vColors = [];
	this.vId = {};
	this.txrLength = 0;
	this.meshNormalsVector = [];

	this.gmt = new THREE.Geometry;
	this.mtrs = new THREE.MeshFaceMaterial;

	var xhr = new XMLHttpRequest;
	var that = this;

	xhr.onload = function() {
		if ( xhr.status === 200 ) {
			that.parse( xhr.response );
		} else {
			that.onerror && that.onerror( url, xhr.statusText );
		}
		that = xhr = null;
	};
	xhr.onerror = function() {
		that.onerror && that.onerror( url, xhr.statusText );
	};
	xhr.open( 'GET', url, true );
	xhr.responseType = 'text';
	xhr.send();

};

THREE.XLoader.prototype = {
	constructor: THREE.XLoader,
	parse: function( text ) {

		var that = this;

		text.replace( /^xof[\s.]+?\r\n/, "" ).split( "\r\n" ).forEach( function( row ) {
			that.decision( row );
		} );

		if ( this.uvArr.length ) {
			this.uvIdx.forEach( function( arr ) {
				that.gmt.faceVertexUvs[ 0 ].push( [ that.uvArr[ arr[ 0 ] ], that.uvArr[ arr[ 1 ] ], that.uvArr[ arr[ 2 ] ], that.uvArr[ arr[ 3 ] ] ] );
			} );
		}

		if ( this.vColors.length ) {
			this.gmt.faces.forEach( function( face ) {
				face.vertexColors = [ that.vColors[ face.a ], that.vColors[ face.b ], that.vColors[ face.c ] ];
				isFinite( face.d ) && ( face.vertexColors[ 3 ] = that.vColors[ face.d ] );
			} );
		}

		this.gmt.computeCentroids();
		!this.meshNormalsVector.length && this.gmt.computeFaceNormals();
		this.gmt.computeVertexNormals();
		!this.txrLength && this.onload( new THREE.Mesh( this.gmt, this.mtrs ) );

		this.txrPath =
		this.mode =
		this.modeArr =
		this.uvIdx =
		this.txrs =
		this.nArr =
		this.uvArr =
		this.vColors =
		this.meshNormalsVector =
		this.vId = null;

	},
	decision: function ( row ) {

		if ( !row || /^\s+$/.test( row ) ) return;

		if ( /{.+?}/.test( row ) ) {
			if ( /^\s*TextureFilename/.test( row ) ) {
				this.TextureFilename( row.match( /{\s*(.+)?\s*}/ )[ 1 ] );
			}
			return;
		} else if ( /{/.test( row ) ) {
			this.modeArr.push( this.mode );
			this.mode = row.match( /^\s*([a-zA-Z]+)/ )[ 1 ];
			this.nArr.push( this.n );
			this.n = 0;
			return;
		} else if ( /}/.test( row ) ) {
			this.mode = this.modeArr.pop();
			this.n = this.nArr.pop();
			return;
		}

		if ( this.mode && !/^(Header|template)$/.test( this.mode ) ) {
			this.n++;
			this[ this.mode ] && this[ this.mode ]( row );
		}

	},
	toRgb: function( r, g, b ) {
		return "rgb(" + Math.floor( r * 100 ) + "%," + Math.floor( g * 100 ) + "%," + Math.floor( b * 100 ) + "%)";
	},
	Mesh: function( row ) {

		row = row.split( ";" );

		if ( row.length === 2 && row[ 1 ] === "" ) {
			return;
		} else if ( row.length === 3 || row[ 2 ] === "" || row.length === 2 && /,/.test( row[ 1 ] ) ) {//face

			var num = row[ 1 ].split( "," );

			if ( /3/.test( row[ 0 ] ) ) {//face3

				this.gmt.faces.push( new THREE.Face3( +num[ 2 ], +num[ 1 ], +num[ 0 ] ) );
				this.uvIdx.push( [ +num[ 2 ], +num[ 1 ], +num[ 0 ] ] );

			} else {//face4

				this.gmt.faces.push( new THREE.Face4( +num[ 3 ], +num[ 2 ], +num[ 1 ], +num[ 0 ] ) );
				this.uvIdx.push( [ +num[ 3 ], +num[ 2 ], +num[ 1 ], +num[ 0 ] ] );

			}

		} else {//vector

			var id = row.join( ";" ), v = this.vId[ id ] = this.vId[ id ] || new THREE.Vector3( +row[ 0 ], +row[ 1 ], -row[ 2 ] );
			this.gmt.vertices.push( v );

		}

	},
	MeshNormals: function( row ) {

		row = row.split( ";" );

		if ( row.length === 2 ) {
			return;
		} else if ( row.length === 3 || row[ 2 ] === "" ) {//face

			!this.faceN && ( this.faceN = this.n );

			var num = row[ 1 ].split( "," );

			//Correct probably face.vertexNormals...
			if ( /3/.test( row[ 0 ] ) ) {//face3

				this.gmt.faces[ this.n - this.faceN ].normal = this.meshNormalsVector[ +num[ 0 ] ];

			} else {//face4

				this.gmt.faces[ this.n - this.faceN ].normal = this.meshNormalsVector[ +num[ 0 ] ];

			}

		} else {//vector

			this.meshNormalsVector.push( new THREE.Vector3( +row[ 0 ], +row[ 1 ], -row[ 2 ] ) );

		}

	},
	MeshMaterialList: function( row ) {
		if ( this.n < 3 ) return;
		this.gmt.faces[ this.n - 3 ].materialIndex = +row.match( /[0-9]+/ )[ 0 ];
	},
	Material: function( row ) {
		row = row.split( ";" );

		if ( this.n === 1 ) {
			this.mtr = new THREE.MeshPhongMaterial( { ambient: "#444", color: this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ), opacity: + row[ 3 ] } );
			this.mtrs.materials.push( this.mtr );
		} else if ( this.n === 2 ) {
			this.mtr.shininess = + row[ 0 ];
		} else if ( this.n === 3 ) {
			this.mtr.specular.setStyle( this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ) );
		} else if ( this.n === 4 ) {
			this.mtr.emissive.setStyle( this.toRgb( row[ 0 ], row[ 1 ], row[ 2 ] ) );
		}

	},
	TextureFilename: function( row ) {
		row = row.split( '"' )[ 1 ].split( "\\" ).join( "/" ).split( "*" )[ 0 ];
		if ( this.txrs[ row ] ) {
			this.mtr.map = this.txrs[ row ];
			return;
		}

		var that = this;
		this.txrLength++;

		this.mtr.map = this.txrs[ row ] = THREE.ImageUtils.loadTexture( this.txrPath + row, undefined, function() {
			if ( --that.txrLength ) return;
			that.onload( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		}, function() {
			if ( --that.txrLength ) return;
			that.onerror( new THREE.Mesh( that.gmt, that.mtrs ) );
			that = null;
		} );
	},
	MeshTextureCoords: function( row ) {
		if ( this.n === 1 ) return;
		row = row.split( ";" );
		var v;
		row[1] = 1 - row[1]; // reverse V

		// adjustment
		v = +row[0];
		v = v % 1.0;
		if ( v < 0 ) {
			v += 1;
		}
		row[0] = v;
		v = row[1];
		v = v % 1.0;
		if ( v < 0 ) {
			v += 1;
		}
		row[1] = v;
		this.uvArr.push( new THREE.Vector2( row[ 0 ], row[ 1 ] ) );
	},
	MeshVertexColors: function( row ) {
		return;
		if ( this.n === 1 ) {
			this.mtrs.materials.forEach( function( mtr ) {
				this.vertexColors = THREE.VertexColors;
			} );
			return;
		}
		row = row.split( ";" );
		this.vColors[ +row[ 0 ] ] = new THREE.Color( this.toRgb( row[ 1 ], row[ 2 ], row[ 3 ] ) );

	}
};

jThree.modelHooks.x = function( url, loaded, errored ) {
	new THREE.XLoader( url, function( mesh ) {
		loaded( mesh );
		loaded = errored = null;
	}, function() {
		errored();
		loaded = errored = null;
	} );
};