/*!
 * jThree.Stats.js JavaScript Library v1.2
 * http://www.jthree.com/
 *
 * Requires jThree v2.0
 * Includes Stats.js | Copyright (c) 2010-2013 three.js authors
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

( function() {

	var l=Date.now(),
		m=l,
		g=
		o=
		h=
		q=
		r=
		s=0,
		n=
		p=Infinity,
		z=document,
		f,
		a,
		i,
		c,
		j,
		d,
		k,
		e,
		b,
		y,
		x;

	z.c=z.createElement;
	f=z.c("div");
	f.id="stats";

	f.addEventListener("mousedown",function(b){
		b.preventDefault();
		if(s=1-s){
			a.style.display="none";
			d.style.display="block";
		}else{
			a.style.display="block";
			d.style.display="none";
		}
	},!1);

	

	f.style.cssText="width:80px;opacity:0.9;cursor:pointer";

	a=z.c("div");

	a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";
	f.appendChild(a);

	i=z.c("div");

	i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
	i.innerHTML="FPS";
	a.appendChild(i);

	c=z.c("div");

	c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";

	for(a.appendChild(c);74>c.children.length;){
		j=z.c("span");
		j.style.cssText="width:1px;height:30px;float:left;background-color:#113";
		c.appendChild(j)
	}

	d=z.c("div");

	d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";
	f.appendChild(d);

	k=z.c("div");

	k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
	k.innerHTML="MS";
	d.appendChild(k);

	e=z.c("div");

	e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";

	for(d.appendChild(e);74>e.children.length;)
		j=z.c("span"),
		j.style.cssText="width:1px;height:30px;float:left;background-color:#131",
		e.appendChild(j);

	f.style.position = "absolute";
	f.style.top = f.style.left = "0px";

	x=function(){
		b=Date.now();
		g=b-l;
		n=Math.min(n,g);
		o=Math.min(Math.max(o,g),999);
		k.textContent=g+" MS ("+n+"-"+o+")";
		y=Math.min(30,30-30*(g/200));
		e.appendChild(e.firstChild).style.height=y+"px";
		r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),
		p=Math.min(p,h),
		q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",
		y=Math.min(30,30-30*(h/100)),
		c.appendChild(c.firstChild).style.height=y+"px",m=b,r=0);
		l = b;
	};

	jThree.Stats = function( selector ) {

		var r = jThree( isFinite( selector ) ? "rdr:eq(" + selector + ")" : selector || "rdr" ),
			_f = f,
			u = jThree.getCanvas( r[ 0 ] ).parentNode;

		f = null;

		if ( document.defaultView.getComputedStyle( u, null ).position === "static" )
			u.style.position = "relative";

		u.appendChild( _f );

		r.eq( 0 ).update( x );

		return _f;

	};

} )();
