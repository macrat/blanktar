!function() {

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

var camID = [];

window.MediaStreamTrack && MediaStreamTrack.getSources( function ( media_sources ) {

	media_sources.forEach( function( media ) {
		if ( media.kind == "video" ) {
			camID.push( media.id );
		}
	} );

} );

var RTC = function( video, error ) {

	var that = this;
	this.mediaID = 0;

	this.error = error;
	this.video = video;

};

RTC.prototype = {
	constructor: RTC,
	start: function() {

		if ( !navigator.getUserMedia ) {

			this.error && this.error();

		} else {

			this.playing = true;
			var that = this;

			navigator.getUserMedia(
				{ video: {
					optional: [ { sourceId: camID[ this.mediaID % camID.length ] } ]
				} },
				function( localMediaStream ) {
					that.video.src = URL.createObjectURL( localMediaStream );
				},
				function( err ) {
					that.error && that.error( err );
				}
			);

	    }

	},
	stop: function() {
		this.playing = false;
		URL && URL.revokeObjectURL( this.video.src );
	},
	change: function( n ) {

		if ( n !== undefined ) {
			this.mediaID = n;
		} else {
			this.mediaID++;
		}

		if ( this.playing ) {
			this.stop();
			this.start();
		}

	},
	toggle: function() {
		this[ this.playing ? "stop" : "start" ]();
	}
};

jThree.RTC = function( video, error ) {

	return new RTC( typeof video === "string" ? jThree( "import" ).contents().find( video )[ 0 ] : video, error );

};

}();