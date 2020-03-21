/*!
 * jThree.WebAR.js JavaScript Library v0.1
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
 * Date: 2014-09-23
 */

!function() {

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var WebAR = function( rdr, canvas, error ) {

	var that = this;
	this.rdr = rdr;
	this.canvas = canvas;
	this.error = error;
	this.renderer = jThree.three( rdr );
	this.video = jQuery( '<div style="position: absolute; top: 0; left: 0; overflow: hidden; width: 100%; height: 100%;"><video autoplay style="position: absolute;"></video></div>' ).insertBefore( canvas ).find( "video" )[ 0 ];

	this.video.addEventListener( "play", function() {
		that.aspect = this.videoWidth / this.videoHeight;
		that.resize();
	}, false );

	this.resize = function() {

		var aspect = that.canvas.clientWidth / that.canvas.clientHeight;

		if ( that.aspect === aspect ) {

			jQuery( that.video ).css( {
				height: "100%",
				width: "100%",
				top: 0,
				left: 0
			} );

		} else if ( that.aspect > aspect ) {

			var tmp = that.aspect / aspect;
			jQuery( that.video ).css( {
				height: "100%",
				width: 100 * tmp + "%",
				top: 0,
				left: ( 1 - tmp ) * .5 * 100 + "%"
			} );

		} else {

			var tmp = aspect / that.aspect;
			jQuery( that.video ).css( {
				height: 100 * tmp + "%",
				width: "100%",
				top: ( 1 - tmp ) * .5 * 100 + "%",
				left: 0
			} );

		}

	};

	jThree.event.add( rdr, "resize", this.resize );

};

WebAR.prototype = {
	constructor: WebAR,
	start: function() {

		if ( !navigator.getUserMedia ) {

			this.error && this.error();

		} else {

			this.playing = true;
			var that = this;

			this.remove = function() {
				that = null;
			};
			this.alpha = this.renderer.getClearAlpha();
			this.color = this.renderer.getClearColor().value;

			 navigator.getUserMedia(
				{ video: true },
				function( localMediaStream ) {
					that.video.src = URL.createObjectURL( localMediaStream );
					that.renderer.setClearColor( 0, 0 );
				},
				function( err ) {
					that.error && that.error( err );
		        }
		    );

	    }

	},
	stop: function() {
		this.playing = false;
		this.remove();
		URL && URL.revokeObjectURL( this.video.src );
		this.video.src = "";
		this.renderer.setClearColor( this.color, this.alpha );
	},
	toggle: function() {
		this[ this.playing ? "stop" : "start" ]();
	}
};

jThree.WebAR = function( selector, error ) {

	var ars = [];

	if ( typeof selector === "function" ) {
		error = selector;
		selector = undefined;
	}

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		ars.push( new WebAR( this, jThree.getCanvas( this ), error ) );

	} );

	return ars.length > 1 ? ars : ars[ 0 ];

};

}();