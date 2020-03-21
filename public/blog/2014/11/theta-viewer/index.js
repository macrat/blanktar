/*
 *		thetaビューワ的な
 *	2014/11/23 Microsoft Azure x jThree Class Tokyo #2 での成果物、の、改良。
 *
 *					MIT License (c)2014 MacRat
 */

jThree(function(j3){
	$("#loading").remove();

	j3.Trackball();
	//j3.Stats();

	var oldCamera = null;

	setInterval(function(){
		if(oldCamera != null){
			return;
		}

		var x = Math.floor(Math.random()*1000) - 500;
		var z = Math.floor(Math.random()*1000) - 500;
		var id = Math.floor(Math.random()*5);
		j3("scene").append("<mesh geo=\"#sphere\" mtl=\"#ball" + id + "\" style=\"scaleX: -1; positionX: " + x + "; positionY: -1000; positionZ: " + z + ";\" />");

		j3("mesh:last")
			.animate({
				positionY: 1000
			}, {
				duration: 15000 + Math.random()*30000,
				complete: function(){
					if(oldCamera == null){
						j3(this).remove();
					}
				}
			})
			.click(function(){
				if(oldCamera == null){
					oldCamera = j3("camera").css("position");
					j3("mesh").stop();

					var cx = j3("camera").css("positionX");
					var cy = j3("camera").css("positionY");
					var cz = j3("camera").css("positionZ");
					var cm = Math.max(cx, cy, cz);

					var x = (cx/cm)*5;
					var y = (cy/cm)*5;
					var z = (cz/cm)*5;

					j3("camera")
						.animate({
							lookAt: j3(this).css("position"),
							position: (j3(this).css("positionX")+x) + " " + (j3(this).css("positionY")+y) + " " + (j3(this).css("positionZ")+z)
						}, 1000)
				}
			})
	}, 500);

	$("html, body")
		.dblclick(function(e){
			if(oldCamera != null){
				j3("camera").animate({
					lookAt: "0 0 0",
					position: oldCamera
				}, 1000);
				oldCamera = null;

				j3("mesh")
					.animate({
						positionY: "+=1000"
					}, {
						duration: 10000 + Math.random()*15000,
						complete: function(){
							if(oldCamera == null){
								j3(this).remove();
							}
						}
					})
			}
		})
},
function(){
	alert("このブラウザはWebGLに対応していません。");
});
