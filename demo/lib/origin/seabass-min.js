!function(global){"use strict";var _u=void 0,o={},

// AJAX-NoCacheモード.
// 開発時はON.
NO_CACHE=true,

// ロードページキャッシュ時間(秒)
// 開発時はゼロをセット.
PAGE_CACHE_TIME=0,

// ロードページ用の基本パス.
PAGE_PATH="./app/pages/",

_t=function(){return(new Date).getTime()},_l=function(n){console.log(n)},xdom={ajax:function(){var r=void 0,e=!1,t=!1,a="Msxml2.XMLHTTP",o=[a+".6.0",a+".3.0","Microsoft.XMLHTTP"];try{new XDomainRequest,e=!0,t=!0}catch(u){try{new ActiveXObject(a),e=!0}catch(i){}}var c=function(){var a;if(e)for(var u=0;u<n.length;u++)try{new ActiveXObject(o[u]),a=function(){return new ActiveXObject(o[u])};break}catch(i){}return a==r&&(a=function(){return new XMLHttpRequest}),t?function(n){if(1==n){var r=new XDomainRequest;return r.ie=0,r}return a()}:a}(),l=function(n,r){"POST"!=n&&"DELETE"!=n||r.setRequestHeader("Content-type","application/x-www-form-urlencoded")},f=function(n,r){if(r)for(var e in r)n.setRequestHeader(e,r[e])};return function(n,e,t,a,o){n=(n+"").toUpperCase(),e=NO_CACHE?e+(-1==e.indexOf("?")?"?":"&")+_t():e;var u="";if("string"!=typeof t)for(var i in t)u+="&"+i+"="+encodeURIComponent(t[i]);if("GET"==n&&(e+=u,u=null),o==r){var s=c();return s.open(n,e,!1),l(n,s),f(s,a),s.send(u),s.responseText}var s=c(/^https?:\/\//i.test(e)?1:0);0==s.ie?(s.onprogress=function(){},s.onload=function(){o(s.status,s.responseText)},s.open(n,e)):(s.open(n,e,!0),s.onreadystatechange=function(){4==s.readyState&&o(s.status,s.responseText)}),l(n,s),f(s,a),s.send(u)}}()};o.ajax=xdom.ajax;var getEmId=function(n){return document.getElementById(n)},isNull=function(n){return n==_u||null==n},useString=function(){var n=/\S/g;return function(r){var e=r;if(isNull(e))return!1;if("string"!=typeof e){if(!isNull(e.length))return 0!=e.length;e=""+e}return e.match(n)!=_u}}(),isNumeric=function(){var n=/[^0-9.0-9]/g;return function(r){var e=r;return isNull(e)?!1:"string"!=typeof e?!0:(0==e.indexOf("-")&&(e=e.substring(1)),!(0==e.length||e.match(n)))}}();o.getEmId=getEmId,o.isNull=isNull,o.useString=useString,o.isNumeric=isNumeric,o.local=function(){var n=window.localStorage,r={};return r.clear=function(){n.clear()},r.put=function(r,e){n.setItem(r,e)},r.get=function(r){return n.getItem(r)},r.remove=function(r){n.removeItem(r)},r.size=function(){return n.length},r.keys=function(){for(var r=[],e=n.length,t=0;e>t;t++)r[r.length]=n[t];return r},r}();var StrBuf=function(n){return this.create(n)};StrBuf.prototype={create:function(n){return this.clear(),null!=n&&n!=_u?this.ad(n):this},clear:function(){return this._buf=[],this._len=0,this},ad:function(n){return null==n||n==_u?this:("string"!=typeof n&&(n=""+n),this._len+=n.length,this._buf[this._buf.length]=n,this)},getLength:function(){return this._len<=0?0:this._len},ts:function(){return this._len<=0?"":this._buf.join("")}},o.StrBuf=StrBuf,function(){var $json=function(){var object={},evalByArrayString=function(n,r){var e,t=r,a=t.length;n.ad("[");for(var o=0;a>o;o++)0!=o&&n.ad(","),e=$json.valueof(t[o]),"object"!=e&&("array"==e?evalByArrayString(n,t[o]):"map"==e?evalByMapString(n,t[o]):n.ad(evalByString(t[o])));return n.ad("]"),a},evalByMapString=function(n,r){var e,t,a=r,o=0;n.ad("{");for(t in a)0!=o&&n.ad(","),n.ad('"').ad(t).ad('":'),e=$json.valueof(a[t]),"object"!=e&&("array"==e?evalByArrayString(n,a[t]):"map"==e?evalByMapString(n,a[t]):n.ad(evalByString(a[t])),o++);return n.ad("}"),o},evalByString=function(n){var r=$json.valueof(n);return"string"==r?'"'+stringByCote(n)+'"':"boolean"==r?""+n:"number"==r?""+n:"date"==r?"new Date("+n.getTime()+")":'""'},arrayOrMapValueTo=function(n){return"number"==typeof n.length?"array":"map"},stringByCote=function(n){for(var r=n.length,e=0,t=new StrBuf,a=0;r>a;a++){var o=n.charAt(a);"\\"==o?(e++,t.ad(o)):'"'==o?(e>0?t.ad("\\\\"):t.ad("\\"),e=0,t.ad(o)):(e=0,t.ad(o))}return t.ts()};return object.encode=function(n){if(null==n||n==_u)return'""';var r=$json.valueof(n);if("array"==r){var e=new StrBuf;return evalByArrayString(e,n),e.ts()}if("map"==r){var e=new StrBuf;return evalByMapString(e,n),e.ts()}return evalByString(n)},object.decode=function(){var _REG=/^\s+|\s+$/g;return function(value){return null==value||value==_u||"string"!=typeof value?null:eval("("+value.replace(_REG,"")+")")}}(),object.valueof=function(n){if(null==n||n==_u)return"null";var r=typeof n;if("string"==r)return"string";if("boolean"==r)return"boolean";if("number"==r)return"number";if("function"==r)return"function";if("date"==r)return"date";if("object"==r){if(n instanceof Date)return"date";if(n instanceof Array)return 0==n.length?"array":arrayOrMapValueTo(n)}return arrayOrMapValueTo(n)},object}();o.encodeJSON=$json.encode,o.decodeJSON=$json.decode,o.valueof=$json.valueof}();var _pageToParams=function(n,r){isNull(r)&&(r=null);var e=n.indexOf("(function(global)");return-1==e?n:(e=n.indexOf("{"),n.substring(0,e+1)+"\nvar params="+o.encodeJSON(r)+";\n"+n.substring(e+1))},_loadOrCache=function(n,r,e){var t=o.local.get(n+"_time"),a=!isNull(t)&&parseInt(t)+1e3*PAGE_CACHE_TIME>=_t();if(a){var u=o.local.get(n+".html"),i=o.local.get(n+".js");return void e(u,_pageToParams(i,r))}xdom.ajax("GET",PAGE_PATH+n+".html","",null,function(t,a){return 200==t&&useString(a)?void xdom.ajax("GET",PAGE_PATH+n+".js","",null,function(t,u){if(200!=t)return void _l("Failed to load page:"+n+" [js]");useString(u)||(u="");try{-1!=u.indexOf("(function(global)")&&-1!=u.indexOf("})(window);")||(u='"use strict";\n(function(global) {\n'+u+"\n})(window);"),o.local.put(n+"_time",""+_t()),o.local.put(n+".html",a),o.local.put(n+".js",u),e(a,_pageToParams(u,r))}catch(i){_l("Failed to load page:"+n+" error:"+i)}}):void _l("Failed to load page:"+n+" [html]")})},_unloadCall=function(){};o.onUnload=function(n){"function"==typeof n&&(_unloadCall=n)},o.load=function(src,params,id){useString(id)||(id="body");var em=getEmId(id);isNull(em)?_l("Failed to load page:"+src+" error:"+id):_loadOrCache(src,params,function(html,js){try{var p=js.indexOf("<<ID>>");-1!=p&&(js=js.substring(0,p)+"#"+id+js.substring(p+6));var call=_unloadCall;_unloadCall=function(){},"function"==typeof call&&call(),em.innerHTML=html,eval(js)}catch(e){_l("Failed to load page:"+src+" error:"+e)}})},o.loadPopup=function(n,r){o.load(n,r,"popup")};var Xor128=function(n){var r={},e=123456789,t=362436069,a=521288629,o=88675123;return r.setSeet=function(n){isNumeric(n)&&(n=0|n,e=n=1812433253*(n^n>>30)+1,t=n=1812433253*(n^n>>30)+2,a=n=1812433253*(n^n>>30)+3,o=n=1812433253*(n^n>>30)+4)},r.next=function(){var n=e,r=n;return n<<=11,n^=r,r=n,r>>=8,n^=r,r=t,e=r,r=a,t=r,r=o,a=r,n^=r,r>>=19,r^=n,o=r,r},r.nextInt=function(){return r.next()},r.setSeet(n),r};o.Xor128=Xor128;var CBase64=function(){var n={},r="=",e="0123456789+abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ",t=function(){for(var n=e,r={},t=n.length,a=0;t>a;a++)r[n[a]]=a;return r}();return n.encode=function(n){var t,a,o,u=u=n.length,i=u%3|0,c=u/3|0,l=new Array(4*c+(0!=i?4:0));for(t=0,a=0,o=0;c>t;t++,a+=3,o+=4)l[o]=e[(252&n[a])>>2],l[o+1]=e[(3&n[a])<<4|(240&n[a+1])>>4],l[o+2]=e[(15&n[a+1])<<2|(192&n[a+2])>>6],l[o+3]=e[63&n[a+2]];switch(i){case 1:a=3*c,o=4*c,l[o]=e[(252&n[a])>>2],l[o+1]=e[(3&n[a])<<4],l[o+2]=r,l[o+3]=r;break;case 2:a=3*c,o=4*c,l[o]=e[(252&n[a])>>2],l[o+1]=e[(3&n[a])<<4|(240&n[a+1])>>4],l[o+2]=e[(15&n[a+1])<<2],l[o+3]=r}return l.join("")},n.decode=function(n){var e,a,o,u=n.length,i=0;for(e=u-1;e>=0&&n.charAt(e)==r;e--)i++;var c=u/4|0,l=new Array(3*c-i);for(c-=1,e=0,a=0,o=0;c>e;e++,a+=4,o+=3)l[o]=(63&t[n[a]])<<2|(48&t[n[a+1]])>>4,l[o+1]=(15&t[n[a+1]])<<4|(60&t[n[a+2]])>>2,l[o+2]=(3&t[n[a+2]])<<6|63&t[n[a+3]];switch(i){case 0:a=4*c,o=3*c,l[o]=(63&t[n[a]])<<2|(48&t[n[a+1]])>>4,l[o+1]=(15&t[n[a+1]])<<4|(60&t[n[a+2]])>>2,l[o+2]=(3&t[n[a+2]])<<6|63&t[n[a+3]];break;case 1:a=4*c,o=3*c,l[o]=(63&t[n[a]])<<2|(48&t[n[a+1]])>>4,l[o+1]=(15&t[n[a+1]])<<4|(60&t[n[a+2]])>>2;break;case 2:a=4*c,o=3*c,l[o]=(63&t[n[a]])<<2|(48&t[n[a+1]])>>4}return l},n}();o.CBase64=CBase64;var Seabass32=function(){var n={},r="",e=new Xor128((new Date).getTime());n.createKey=function(n,r){useString(r)||(r=document.domain,useString(r)||(r="127.0.0.1"));for(var e=o(r,1),a=o(n,1),u=e.concat(a),i=0;16>i;i++)u[i]=t(u,i,a[i]);for(var i=15,c=0;i>=0;i--,c++)u[i+16]=t(u,i+16,e[c]);return u},n.encode=function(n,t){var o=v(""+n),l=a(),f=u(t,l),g=i(f);f=null;var p=127&c(t,o),y=s(g,l,p);d(!0,o,g,y);var m=new Array(34+o.length);return m[0]=255&e.nextInt(),m[1]=~(p^m[0]),h(l,0,m,2,32),h(o,0,m,34,o.length),r+CBase64.encode(m)},n.decode=function(n,e){if(0!=n.indexOf(r))throw"decode:Unknown data format";var t=CBase64.decode(n.substring(r.length));if(t.length<=34)throw"decode:Invalid binary length";var a=127&~(t[1]^t[0]),o=new Array(32);h(t,2,o,0,32);var l=t.length-34,f=new Array(l);h(t,34,f,0,l),t=null;var v=u(e,o),p=i(v);v=null;var y=s(p,o,a);if(d(!1,f,p,y),(127&c(e,f))!=a)throw"decode:Decryption process failed";return g(f)};var t=function(n,r,e){switch(1&r){case 0:return 255&~(e^n[r]);case 1:return 255&(e^n[r])}return 0},a=function(){for(var n=new Array(32),r=0;32>r;r++)n[r]=255&e.next();return n},o=function(n,r){var e,t=[177,75,163,143,73,49,207,40,87,41,169,91,184,67,254,89],a=n.length;r=0|r;for(var o=0;a>o;o++)if(e=1==r?0|n.charCodeAt(o):n[o],0==(1&o)){for(var u=1;16>u;u+=2)t[u]=t[u]^e-(o+u);for(var u=0;16>u;u+=2)t[u]=t[u]*(e-(o+u))}else{for(var u=0;16>u;u+=2)t[u]=t[u]^e-(o+u);for(var u=1;16>u;u+=2)t[u]=t[u]*(e-(o+u))}for(var o=0;16>o;o++)t[o]=255&t[o];return t},u=function(n,r){for(var e=o(n,0),a=o(r,0),u=new Array(32),i=0,c=0,l=15;16>i;i++,c+=2,l--)u[c]=t(e,i,r[c]),u[c+1]=t(a,i,e[l]);return u},i=function(n){for(var r,e,t,a=new Array(256),u=new Array(4),i=0,c=0,l=0;31>c;c+=2,l+=16)e=255&n[c],t=255&n[c+1],0!=(1&i)?i+=e^~t:i-=~e^t,u[0]=255&i,u[1]=(65280&i)>>8&255,u[2]=(16711680&i)>>16&255,u[3]=(4278190080&i)>>24&255,r=o(u,0),h(r,0,a,l,16);return a},c=function(n,r){var e,t,a,o=0,u=r.length,i=(3&n[31&r[u>>1]])+1;for(e=0,t=0;u>e;e+=i,t+=i)a=255&~r[e],o=(1&a)+((2&a)>>1)+((4&a)>>2)+((8&a)>>3)+((16&a)>>4)+((32&a)>>5)+((64&a)>>6)+((128&a)>>7)+(255&t)+o;if(0==(1&o))for(e=0;32>e;e++)a=0==(1&n[e])?255&~n[e]:255&n[e],o+=(1&a)+((2&a)>>1)+((4&a)>>2)+((8&a)>>3)+((16&a)>>4)+((32&a)>>5)+((64&a)>>6)+((128&a)>>7);else for(e=0;32>e;e++)a=0==(1&n[e])?255&~n[e]:255&n[e],o-=(1&a)+((2&a)>>1)+((4&a)>>2)+((8&a)>>3)+((16&a)>>4)+((32&a)>>5)+((64&a)>>6)+((128&a)>>7);return 255&~o},l=function(n,r){switch(7&r){case 1:return 255&((3&n)<<6&192|(252&n)>>2&63);case 2:return 255&((63&n)<<2&252|(192&n)>>6&3);case 3:return 255&((1&n)<<7&128|(254&n)>>1&127);case 4:return 255&((15&n)<<4&240|(240&n)>>4&15);case 5:return 255&((127&n)<<1&254|(128&n)>>7&1);case 6:return 255&((7&n)<<5&224|(248&n)>>3&31);case 7:return 255&((31&n)<<3&248|(224&n)>>5&7)}return 255&n},f=function(n,r){switch(7&r){case 1:return 255&((63&n)<<2&252|(192&n)>>6&3);case 2:return 255&((3&n)<<6&192|(252&n)>>2&63);case 3:return 255&((127&n)<<1&254|(128&n)>>7&1);case 4:return 255&((15&n)<<4&240|(240&n)>>4&15);case 5:return 255&((1&n)<<7&128|(254&n)>>1&127);case 6:return 255&((31&n)<<3&248|(224&n)>>5&7);case 7:return 255&((7&n)<<5&224|(248&n)>>3&31)}return 255&n},s=function(n,r,e){for(var a=e,o=0,u=0;256>o;o++,u=u+1&31)a^=~n[o],0==(1&a)&&(a=~a),n[o]=t(r,u,n[o]),n[o]=l(n[o],a);return a},d=function(n,r,e,a){var o=r.length,u=a;if(n)for(var i=0,c=0;o>i;i++,c=c+1&255)u^=~e[c],0!=(1&u)&&(u=~u),r[i]=t(e,c,r[i]),r[i]=l(r[i],u);else for(var i=0,c=0;o>i;i++,c=c+1&255)u^=~e[c],0!=(1&u)&&(u=~u),r[i]=f(r[i],u),r[i]=t(e,c,r[i])},v=function(n){for(var r=n.length,e=new Array(r),t=0;r>t;t++)e[t]=0|n.charCodeAt(t);return e},g=function(n){for(var r=n.length,e=new Array(r),t=0;r>t;t++)e[t]=String.fromCharCode(n[t]);return e.join("")},h=function(n,r,e,t,a){a=0|a,r=0|r,t=0|t;for(var o=0;a>o;o++)e[t+o]=n[r+o]};return n}();o.S32=Seabass32,global.Seabass=o}(window);