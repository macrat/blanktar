/*!
 * jThree.Leap.js JavaScript Library v0.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0
 * Includes LeapMotionEffect.js | Copyright (c) 2014 Matsuda Mitsuhide
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
 * Date: 2014-10-07
 */

( function() {

var objs = [],
	tmpV = new THREE.Vector3;

// physics temporary
if ( window.Ammo ) {
	var _btransform = new Ammo.btTransform();
	var _bv = new Ammo.btVector3();
	var _bq = new Ammo.btQuaternion();
	var tmpBV = function( x,y,z ) {
		_bv.setValue( x,y,z );
		return _bv;
	};
	var tmpBQ = function( x,y,z,w ) {
		_bq.setValue( x,y,z,w );
		return _bq;
	};
}

var _v = new THREE.Vector3();
var _q = new THREE.Quaternion();
var _q2 = new THREE.Quaternion();

function makeSphere( btWorld ) {
	var gmt = new THREE.CubeGeometry( 1.5, 1.5, .5 );
	var mtr = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess:50, ambient: 0x999999 } );
	var mesh = new THREE.Mesh( gmt, mtr );

	btWorld && ( mesh.__leapBody = makePhysi( btWorld, 1.5, 1.5, .5 ) );

	/*//test
	mesh.__test = makeTest( 1.5, 1.5, .5 );*/
	return mesh;
}

function makeFinger( btWorld ) {
	var obj = new THREE.Object3D;
	var gmt = new THREE.CubeGeometry( .4, .4, 2 );
	var mtr = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess:50, ambient: 0x999999 } );
	var mesh = new THREE.Mesh( gmt, mtr );
	mesh.position.z = 1;
	obj.add( mesh );

	btWorld && ( mesh.__leapBody = makePhysi( btWorld, .4, .4, 2 ) );

	/*//test
	obj.__test = makeTest( .4, .4, 2 );*/
	return obj;
}

function makeTest( x, y, z ) {
	var gmt = new THREE.CubeGeometry( x, y, z );
	var mtr = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, shininess:50, ambient: 0x999999 } );
	var mesh = new THREE.Mesh( gmt, mtr );
	mesh.useQuaternion = true;

	return mesh;
}

function makePhysi( btWorld, x, y, z ) {

	var shape = new Ammo.btBoxShape( tmpBV( x / 2, y / 2, z / 2 ) );
	var localInertia = new Ammo.btVector3(0, 0, 0);

	shape.calculateLocalInertia( 0, localInertia );
	_btransform.setIdentity();
	//_btransform.setOrigin(tmpBV( v.pos[0] + mesh.position.x, v.pos[1] + mesh.position.y, v.pos[2] + mesh.position.z ));
	//_btransform.setRotation(tmpBQ( v.q.x, v.q.y, v.q.z, v.q.w ));
	var motionState = new Ammo.btDefaultMotionState( _btransform );
	var rbInfo = new Ammo.btRigidBodyConstructionInfo( 0, motionState, shape, localInertia );

	//rbInfo.set_m_friction( v.friction );
	//rbInfo.set_m_restitution( v.restitution );
	var body = new Ammo.btRigidBody( rbInfo );
	body.setCollisionFlags( body.getCollisionFlags() | 2 );
	//body.setDamping(v.posDamping, v.rotDamping);
	body.setSleepingThresholds(0, 0);
	btWorld.addRigidBody(body);
	Ammo.destroy(rbInfo);
	Ammo.destroy(localInertia);
	return body;
}

function getNode( obj, id, finger ) {
	var node  = obj.pool[ id ];

	if (!node) {
		node  = finger ? makeFinger( obj.world ) : makeSphere( obj.world );

		obj.obj.add(node);
		obj.pool[id] = node;
		/*//test
		jThree( "scene" ).three(0).add( node.__test );*/
	}

	return node;
}

function move( node, posX, posY, posZ, rotX, rotY, rotZ ) {

	var target, body;

	node.position.set( posX/100, posY/100, posZ/100 );
	if ( node.children.length ) {//finger
		target = node.children[ 0 ];
		node.children[ 0 ].lookAt( tmpV.set( rotX, rotY, rotZ ) );
	} else {//hand
		target = node;
		node.rotation.set( rotX, rotY, rotZ );
	}

	_v.copy( target.position ).applyMatrix4( target.parent.matrixWorld );
	_q.setFromEuler( target.rotation ).multiplyQuaternions( _q2.setFromRotationMatrix( target.parent.matrixWorld ), _q );

	/*//test
	node.__test.position.copy( _v );
	node.__test.quaternion.copy( _q );*/

	body = target.__leapBody;
	if ( !body ) return;

	body.getMotionState().getWorldTransform( _btransform );
			//body.getWorldTransform( _btransform );
	_btransform.setOrigin( tmpBV( _v.x, _v.y, _v.z ) );
	_btransform.setRotation( tmpBQ( _q.x, _q.y, _q.z, _q.w ) );
	body.setWorldTransform( _btransform );
}

var playing;

function loop( frame ) {

	if ( !playing ) return;

	var ids = {};
	var hands = frame.hands; // left and right
	var pointables = frame.pointables; // fingers

	for (var i = 0, hand; hand = hands[i++];) {


		var posX = (hand.palmPosition[0] * 3);
		var posY = (hand.palmPosition[1] * 3) - 200;
		var posZ = (hand.palmPosition[2] * 3) - 200;
		var rotX = Math.atan2( hand.palmNormal[1], -hand.palmNormal[2] );
		var rotY = -Math.atan2( hand.palmNormal[0], -hand.palmNormal[1] );
		var rotZ = Math.atan2( hand.palmNormal[2], -hand.palmNormal[0] );

		objs.forEach( function( obj ) {
			var node = getNode( obj, hand.id, 0 );

			move(node, posX, posY, posZ, rotX, rotY, rotZ);
		} );

		ids[hand.id] = true;
	}

	for (var i = 0, pointable; pointable = pointables[i++];) {
		var posX = (pointable.tipPosition[0] * 3);
		var posY = (pointable.tipPosition[1] * 3) - 200;
		var posZ = (pointable.tipPosition[2] * 3) - 200;
		var dirX = pointable.direction[0];
		var dirY = pointable.direction[1];
		var dirZ = pointable.direction[2];

		objs.forEach( function( obj ) {
			var node = getNode( obj, pointable.id, 1 );

			move(node, posX, posY, posZ, dirX, dirY, dirZ);
		} );

		ids[pointable.id] = true;
	}


	objs.forEach( function( obj ) {
		var target;

		for (var id in obj.pool) {
			if (!ids[id]) {
				target = obj.pool[id];
				/*jThree( "scene" ).three(0).remove( target.__test );//test*/
				target.parent.remove( target );

				if ( obj.world ) {
					obj.world.removeRigidBody( target.__leapBody || target.children[ 0 ].__leapBody );
					Ammo.destroy( target.__leapBody || target.children[ 0 ].__leapBody );
				}

				delete obj.pool[id];
			}
		}
	} );

}

THREE.LeapMotionEffect = function( world ) {

	this.world = world;
	this.pool = {};

	var obj = new THREE.Object3D();
	obj.position.set( 0, -1.5, -12 );

	this.obj = obj;
	objs.push( this );

	if ( !this.controller ) {
		THREE.LeapMotionEffect.prototype.controller = new Leap.Controller( { useAllPlugins: true } );
		this.controller.on( this.controller.frameEventName, loop );
	}


};

THREE.LeapMotionEffect.prototype = {
	constructor: THREE.LeapMotionEffect,
	start: function() {
		playing === undefined && this.controller.connect();
		playing = true;
	},
	stop: function() {
		playing = false;

		objs.forEach( function( obj ) {
			var target;

			for (var id in obj.pool) {
				target = obj.pool[id];
				target.parent.remove( target );

				if ( obj.world ) {
					obj.world.removeRigidBody( target.__leapBody || target.children[ 0 ].__leapBody );
					Ammo.destroy( target.__leapBody || target.children[ 0 ].__leapBody );
				}

				delete obj.pool[id];
			}
		} );
	},
	get playing() {
		return playing;
	},
	toggle: function() {
		this[ this.playing ? "stop" : "start" ]();
	}
};

} )();

jThree.Leap = function( selector ) {

	var leaps = [];

	jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ).each( function() {

		var leap = new THREE.LeapMotionEffect( THREE.MMD && THREE.MMD.getWorld() );
		jThree.three( jThree.getCamera( this ) ).add( leap.obj );

		jThree( this ).on( "attrChange", function( e ) {

			if ( e.attrName !== "camera" ) return;
			leap.obj.parent.remove( leap.obj );
			jThree.three( jThree.getCamera( this ) ).add( leap.obj );

		} );

		leaps.push( leap );

	} );

	return leaps.length > 1 ? leaps : leaps[ 0 ];

};