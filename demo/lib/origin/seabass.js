(function(global) {
"use strict";
var _u = undefined;

var o = {};

// AJAX-NoCacheモード.
// 開発時はON.
var NO_CACHE = true;

// ロードページキャッシュ時間(秒)
// 開発時はゼロをセット.
var PAGE_CACHE_TIME = 0;

// ロードページ用の基本パス.
var PAGE_PATH = "./app/pages/";

// 現在時間を取得.
var _t = function() {
    return new Date().getTime();
}

// ログ出力.
var _l = function(v) {
    console.log(v);
}

// ajax.
var xdom = {ajax:(function(){var k=undefined;var b=false;var c=false;var f="Msxml2.XMLHTTP";var g=[f+".6.0",f+".3.0","Microsoft.XMLHTTP"];try{new XDomainRequest();b=true;c=true}catch(h){try{new ActiveXObject(f);b=true}catch(i){}}var a=(function(){var l;if(b){for(var m=0;m<n.length;m++){try{new ActiveXObject(g[m]);l=function(){return new ActiveXObject(g[m])};break}catch(o){}}}if(l==k){l=function(){return new XMLHttpRequest()}}if(c){return function(e){if(e==1){var p=new XDomainRequest();p.ie=0;return p}return l()}}return l})();var j=function(l,e){if(l=="POST"||l=="DELETE"){e.setRequestHeader("Content-type","application/x-www-form-urlencoded")}};var d=function(l,e){if(e){for(var o in e){l.setRequestHeader(o,e[o])}}};return function(s,m,q,r,p){s=(s+"").toUpperCase();m=NO_CACHE?(m+((m.indexOf("?")==-1)?"?":"&")+_t()):m;var o="";if(typeof(q)!="string"){for(var l in q){o+="&"+l+"="+encodeURIComponent(q[l])}}if(s=="GET"){m+=o;o=null}if(p==k){var e=a();e.open(s,m,false);j(s,e);d(e,r);e.send(o);return e.responseText}else{var e=a((/^https?:\/\//i.test(m))?1:0);if(e.ie==0){e.onprogress=function(){};e.onload=function(){p(e.status,e.responseText)};e.open(s,m)}else{e.open(s,m,true);e.onreadystatechange=function(){if(e.readyState==4){p(e.status,e.responseText)}}}j(s,e);d(e,r);e.send(o)}}})()};
o.ajax = xdom.ajax;

// idからDOM取得.
var getEmId = function(name) {
    return document.getElementById(name);
}

// nullチェック.
var isNull = function(value) {
    return ( value == _u || value == null ) ;
}

// 文字存在チェック.
var useString = ( function() {
    var _USE_STR_REG = /\S/g ;
    return function( str ) {
        var s = str ;
        if( isNull( s ) ) {
            return false ;
        }
        if( typeof( s ) != "string" ) {
            if( !isNull( s["length"] ) ) {
                return s["length"] != 0 ;
            }
            s = "" + s ;
        }
        return s.match( _USE_STR_REG ) != _u ;
    }
})() ;

// 数値チェック.
var isNumeric = ( function() {
    var _IS_NUMERIC_REG = /[^0-9.0-9]/g ;
    return function( num ){
        var n = num ;
        if( isNull( n ) ) {
            return false ;
        }
        if( typeof( n ) != "string" ) {
            return true ;
        }
        if( n.indexOf( "-" ) == 0 ) {
            n = n.substring( 1 ) ;
        }
        return !( n.length == 0 || n.match( _IS_NUMERIC_REG ) ) ;
    }
})() ;

o.getEmId = getEmId;
o.isNull = isNull;
o.useString = useString;
o.isNumeric = isNumeric;

// localStorage.
o.local = (function() {
var l = window.localStorage ;
var o = {} ;
o.clear = function() {
    l.clear() ;
}
o.put = function( k,v ) {
    l.setItem( k,v ) ;
}
o.get = function( k ) {
    return l.getItem( k ) ;
}
o.remove = function( k ) {
    l.removeItem( k ) ;
}
o.size = function() {
    return l.length ;
}
o.keys = function() {
    var ret = [] ;
    var len = l.length ;
    for( var i = 0 ; i < len ; i ++ ) {
        ret[ret.length] = l[ i ] ;
    }
    return ret ;
}
return o;
})();

// 文字連結.
var StrBuf = function( str ) {
    return this.create( str ) ;
}
StrBuf.prototype = {
    create : function( str ) {
        this.clear() ;
        if( str != null && str != _u ) {
            return this.ad( str ) ;
        }
        return this ;
    },
    clear : function() {
        this._buf = [] ;
        this._len = 0 ;
        return this ;
    },
    ad : function(str) {
        if( str == null || str == _u ) {
            return this ;
        }
        if( typeof( str ) != "string" ) {
            str = ""+str ;
        }
        this._len += str.length ;
        this._buf[this._buf.length] = str ;
        return this ;
    },
    getLength : function() {
        if( this._len <= 0 ) {
            return 0 ;
        }
        return this._len ;
    },
    ts : function() {
        if( this._len <= 0 ) {
            return "" ;
        }
        return this._buf.join('');
    }
}
o.StrBuf = StrBuf;

// json系処理.
(function() {
    var $json = (function() {
        var object = {} ;
        
        // Arrayタイプから、eval実行可能内容を生成.
        var evalByArrayString = function( buf,v ) {
            var tt ;
            var vv = v ;
            var aryLen = vv.length ;
            buf.ad( "[" ) ;
            for( var i = 0 ; i < aryLen ; i ++ ) {
                if( i != 0 ) {
                    buf.ad( "," ) ;
                }
                tt = $json.valueof( vv[i] ) ;
                if( tt == "object" ) {
                    continue ; // 不明オブジェクトの内容は無視する.
                }
                else if( tt == "array" ) {
                    evalByArrayString( buf,vv[i] ) ;
                }
                else if( tt == "map" ) {
                    evalByMapString( buf,vv[i] ) ;
                }
                else {
                    buf.ad( evalByString( vv[i] ) ) ;
                }
            }
            buf.ad( "]" ) ;
            return aryLen ;
        }
        // Mapタイプから、eval実行可能内容を生成.
        var evalByMapString = function( buf,v ) {
            var tt ;
            var vv = v ;
            var cnt = 0 ;
            var ky ;
            buf.ad( "{" ) ;
            for( ky in vv ) {
                if( cnt != 0 ) {
                    buf.ad( "," ) ;
                }
                buf.ad( "\"" ).ad( ky ).ad( "\":" ) ;
                tt = $json.valueof( vv[ky] ) ;
                if( tt == "object" ) {
                    continue ; // 不明オブジェクトの内容は無視する.
                }
                else if( tt == "array" ) {
                    evalByArrayString( buf,vv[ky] ) ;
                }
                else if( tt == "map" ) {
                    evalByMapString( buf,vv[ky] ) ;
                }
                else {
                    buf.ad( evalByString( vv[ky] ) ) ;
                }
                cnt ++ ;
            }
            buf.ad( "}" ) ;
            return cnt ;
        }
        // 指定タイプから、eval実行可能内容を生成.
        var evalByString = function( vv ) {
            var tt = $json.valueof( vv ) ;
            if( tt == "string" ) {
                return "\""+stringByCote( vv )+"\"" ;
            }
            else if( tt == "boolean" ) {
                return ""+vv ;
            }
            else if( tt == "number" ) {
                return ""+vv ;
            }
            else if( tt == "date" ) {
                return "new Date(" + vv.getTime() + ")" ;
            }
            return "\"\"" ;
        }
        // 指定内容タイプがArrayかMapか取得.
        var arrayOrMapValueTo = function( val ) {
            if( typeof( val.length ) == "number" ) {
                return "array" ;
            }
            return "map" ;
        }
        // 文字列内のコーテーション対応.
        var stringByCote = function( val ) {
            var cLen = val.length ;
            var yen = 0 ;
            var ret = new StrBuf() ;
            for( var i = 0 ; i < cLen ; i ++ ) {
                var c = val.charAt( i ) ;
                if( c == '\\' ) {
                    yen ++ ;
                    ret.ad( c ) ;
                }
                else if( c == '\"' ) {
                    if( yen > 0 ) {
                        ret.ad( "\\\\" ) ;
                    }
                    else {
                        ret.ad( "\\" ) ;
                    }
                    yen = 0 ;
                    ret.ad( c ) ;
                }
                else {
                    yen = 0 ;
                    ret.ad( c ) ;
                }
            }
            return ret.ts() ;
        }
        
        // json形式に変換.
        object.encode = function( value ) {
            if( value == null || value == _u ) {
                return "\"\"" ;
            }
            var tt = $json.valueof( value ) ;
            if( tt == "array" ) {
                var s = new StrBuf() ;
                evalByArrayString( s,value ) ;
                return s.ts() ;
            }
            else if( tt == "map" ) {
                var s = new StrBuf() ;
                evalByMapString( s,value ) ;
                return s.ts() ;
            }
            return evalByString( value ) ;
        }
        // json形式の文字列を変換.
        object.decode = (function() {
            var _REG = /^\s+|\s+$/g ;
            return function( value ) {
                if( value == null || value == _u || typeof( value ) != "string" ) {
                    return null ;
                }
                return eval( "(" + value.replace(_REG, "") + ")" ) ;
            }
        } )(),
        // 指定内容タイプを取得.
        object.valueof = function( val ) {
            if( val == null || val == _u ) {
                return "null" ;
            }
            var tt = typeof( val ) ;
            if( tt == "string" ) {
                return "string" ;
            }
            if( tt == "boolean" ) {
                return "boolean" ;
            }
            else if( tt == "number" ) {
                return "number" ;
            }
            else if( tt == "function" ) {
                return "function" ;
            }
            else if( tt == "date" ) {
                return "date" ;
            }
            else if( tt == "object" ) {
                if( val instanceof Date ) {
                    return "date" ;
                }
                else if( val instanceof Array ) {
                    if( val.length == 0 ) {
                        return "array" ;
                    }
                    return arrayOrMapValueTo( val ) ;
                }
            }
            return arrayOrMapValueTo( val ) ;
        }
        
        return object ;
    })() ;

    // encodeJSON.
    o.encodeJSON = $json.encode ;

    // decodeJSON.
    o.decodeJSON = $json.decode ;

    // typeof拡張.
    o.valueof = $json.valueof ;
})() ;


// ページコールに対するパラメータセット.
var _pageToParams = function(js,params) {
    if(isNull(params)) {
        params = null;
    }
    var p = js.indexOf("(function(global)");
    if(p == -1) {
        return js;
    }
    p = js.indexOf("{");
    return js.substring(0,p+1) + "\nvar params=" + o.encodeJSON(params) + ";\n" + js.substring(p+1);
}

// データロード or キャッシュに存在する場合は、その内容を利用.
var _loadOrCache = function(src,params,call) {
    var time = o.local.get(src+"_time");
    var cacheFlag = !isNull(time) && parseInt(time)+(PAGE_CACHE_TIME*1000) >= _t();
    if(cacheFlag) {
        var html = o.local.get(src+".html");
        var js = o.local.get(src+".js");
        call(html,_pageToParams(js,params));
        return ;
    }
    xdom.ajax("GET",PAGE_PATH + src + ".html","",null,function(hstate,html) {
        if(hstate != 200 || !useString(html)) {
            _l("Failed to load page:"+src+" [html]");
            return;
        }
        xdom.ajax("GET",PAGE_PATH + src + ".js","",null,function(jstate,js) {
            if(jstate != 200) {
                _l("Failed to load page:"+src+" [js]");
                return;
            }
            if(!useString(js)) {
                js = "";
            }
            try {
                if(js.indexOf("(function(global)") == -1 || js.indexOf("})(window);") == -1) {
                    js = "\"use strict\";\n(function(global) {\n" + js + "\n})(window);";
                }
                o.local.put(src+"_time",""+_t());
                o.local.put(src+".html",html);
                o.local.put(src+".js",js);
                call(html,_pageToParams(js,params));
            } catch(e) {
                _l("Failed to load page:"+src+" error:" + e);
            }
        });
    });
}

// ページアンロード処理.
var _unloadCall = function(){}
o.onUnload = function(call) {
    if(typeof(call) != "function") {
        return;
    }
    _unloadCall = call;
}

// ページ読み込み.
// src : 対象ページ名を設定します.
// params : ページに渡すパラメータ内容を設定します.
// id : 対象の描画先DOM-IDを設定します.
o.load = function(src,params,id) {
    if(!useString(id)) {
        id = "body";
    }
    var em = getEmId(id);
    if(!isNull(em)) {
        _loadOrCache(src,params,function(html,js) {
            try {
                var p = js.indexOf("<<ID>>");
                if(p != -1) {
                    js = js.substring(0,p) + "#" + id + js.substring(p+6);
                }
                var call = _unloadCall;
                _unloadCall = function(){}
                if(typeof(call) == "function") {
                    call();
                }
                em.innerHTML = html;
                eval(js);
            } catch(e) {
                _l("Failed to load page:"+src+" error:" + e);
            }
        });
    } else {
        _l("Failed to load page:"+src+" error:" + id);
    }
};

// ポップアップ読み込み.
o.loadPopup = function(src,params) {
    o.load(src,params,"popup");
}

// xor128ランダムオブジェクト.
var Xor128 = function(seet) {
    
var o = {} ;

var _a = 123456789 ;
var _b = 362436069 ;
var _c = 521288629 ;
var _d = 88675123 ;

// シートセット.
o.setSeet = function(s) {
    if(isNumeric(s)) {
        s = s|0;
        _a=s=1812433253*(s^(s>>30))+1;
        _b=s=1812433253*(s^(s>>30))+2;
        _c=s=1812433253*(s^(s>>30))+3;
        _d=s=1812433253*(s^(s>>30))+4;
    }
}

// 乱数取得.
o.next = function() {
    var t=_a ;
    var r=t ;
    t = ( t << 11 ) ;
    t = ( t ^ r ) ;
    r = t ;
    r = ( r >> 8 ) ;
    t = ( t ^ r ) ;
    r = _b ;
    _a = r ;
    r = _c ;
    _b = r ;
    r = _d ;
    _c = r ;
    t = ( t ^ r ) ;
    r = ( r >> 19 ) ;
    r = ( r ^ t ) ;
    _d = r;
    return r ;
}

// 乱数取得.
o.nextInt = function() {
    return o.next() ;
}

// 初期値セット.
o.setSeet( seet ) ;

return o;
};
o.Xor128 = Xor128;

// CustomBase64.
var CBase64 = (function() {
    var o = {};
    var NOT_DEC = -1;
    var EQ = '=';
    var ENC_CD = "0123456789+abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var DEC_CD = (function() {
        var src = ENC_CD;
        var ret = {};
        var len = src.length;
        for(var i = 0; i < len; i ++) {
            ret[src[i]] = i;
        }
        return ret;
    })();
    o.encode = function(bin) {
        var i, j, k;
        var allLen = allLen = bin.length ;
        var etc = (allLen % 3)|0;
        var len = (allLen / 3)|0;
        var ary = new Array((len * 4) + ((etc != 0) ? 4 : 0));
        for (i = 0, j = 0, k = 0; i < len; i++, j += 3, k += 4) {
            ary[k] = ENC_CD[((bin[j] & 0x000000fc) >> 2)];
            ary[k + 1] = ENC_CD[(((bin[j] & 0x00000003) << 4) | ((bin[j+1] & 0x000000f0) >> 4))];
            ary[k + 2] = ENC_CD[(((bin[j+1] & 0x0000000f) << 2) | ((bin[j+2] & 0x000000c0) >> 6))];
            ary[k + 3] = ENC_CD[(bin[j+2] & 0x0000003f)];
        }
        switch (etc) {
        case 1:
            j = len * 3;
            k = len * 4;
            ary[k] = ENC_CD[((bin[j] & 0x000000fc) >> 2)];
            ary[k + 1] = ENC_CD[((bin[j] & 0x00000003) << 4)];
            ary[k + 2] = EQ;
            ary[k + 3] = EQ;
            break;
        case 2:
            j = len * 3;
            k = len * 4;
            ary[k] = ENC_CD[((bin[j] & 0x000000fc) >> 2)];
            ary[k + 1] = ENC_CD[(((bin[j] & 0x00000003) << 4) | ((bin[j+1] & 0x000000f0) >> 4))];
            ary[k + 2] = ENC_CD[(((bin[j+1] & 0x0000000f) << 2))];
            ary[k + 3] = EQ;
            break;
        }
        return ary.join('');
    }
    o.decode = function(base64) {
        var i, j, k;
        var allLen = base64.length ;
        var etc = 0 ;
        for (i = allLen - 1; i >= 0; i--) {
            if (base64.charAt(i) == EQ) {
                etc++;
            } else {
                break;
            }
        }
        var len = (allLen / 4)|0;
        var ret = new Array((len * 3) - etc);
        len -= 1;
        for (i = 0, j = 0, k = 0; i < len; i++, j += 4, k += 3) {
            ret[k] = (((DEC_CD[base64[j]] & 0x0000003f) << 2) | ((DEC_CD[base64[j+1]] & 0x00000030) >> 4));
            ret[k + 1] = (((DEC_CD[base64[j+1]] & 0x0000000f) << 4) | ((DEC_CD[base64[j+2]] & 0x0000003c) >> 2));
            ret[k + 2] = (((DEC_CD[base64[j+2]] & 0x00000003) << 6) | (DEC_CD[base64[j+3]] & 0x0000003f));
        }
        switch (etc) {
        case 0:
            j = len * 4;
            k = len * 3;
            ret[k] = (((DEC_CD[base64[j]] & 0x0000003f) << 2) | ((DEC_CD[base64[j+1]] & 0x00000030) >> 4));
            ret[k + 1] = (((DEC_CD[base64[j+1]] & 0x0000000f) << 4) | ((DEC_CD[base64[j+2]] & 0x0000003c) >> 2));
            ret[k + 2] = (((DEC_CD[base64[j+2]] & 0x00000003) << 6) | (DEC_CD[base64[j+3]] & 0x0000003f));
            break;
        case 1:
            j = len * 4;
            k = len * 3;
            ret[k] = (((DEC_CD[base64[j]] & 0x0000003f) << 2) | ((DEC_CD[base64[j+1]] & 0x00000030) >> 4));
            ret[k + 1] = (((DEC_CD[base64[j+1]] & 0x0000000f) << 4) | ((DEC_CD[base64[j+2]] & 0x0000003c) >> 2));
            break;
        case 2:
            j = len * 4;
            k = len * 3;
            ret[k] = (((DEC_CD[base64[j]] & 0x0000003f) << 2) | ((DEC_CD[base64[j+1]] & 0x00000030) >> 4));
            break;
        }
        return ret;
    }
    return o;
})();
o.CBase64 = CBase64;

// seabass32.
var Seabass32 = (function(){
    var o = {};
    var SB32HEAD = "";
    var rand = new Xor128(new Date().getTime());
    o.createKey = function(baseKey,domain) {
        if(!useString(domain)) {
            domain = document.domain;
            if(!useString(domain)) {
                domain = "127.0.0.1";
            }
        }
        var domainBin = code16(domain,1) ;
        var baseKeyBin = code16(baseKey,1) ;
        var ret = domainBin.concat(baseKeyBin) ;
        for( var i = 0 ; i < 16 ; i ++ ) {
            ret[ i ] = _convert( ret,i,baseKeyBin[ i ] ) ;
        }
        for( var i = 15,j = 0 ; i >= 0 ; i --,j ++ ) {
            ret[ i+16 ] = _convert( ret,i+16,domainBin[ j ] ) ;
        }
        return ret ;
    },
    o.encode = function( value,pKey ) {
        var bin = strToArray( ""+value ) ;
        var pubKey = _randKey() ;
        var key32 = _convertKey(pKey,pubKey) ;
        var key256 = _key256(key32) ;
        key32 = null ;
        var stepNo = _getStepNo( pKey,bin ) & 0x0000007f ;
        var nowStep = _convert256To( key256,pubKey,stepNo ) ;
        _ed( true,bin,key256,nowStep ) ;
        var eb = new Array(34+bin.length) ;
        eb[ 0 ] = rand.nextInt() & 0x000000ff;
        eb[ 1 ] = (~(stepNo^eb[ 0 ])) ;
        arraycopy( pubKey,0,eb,2,32 ) ;
        arraycopy( bin,0,eb,34,bin.length ) ;
        return SB32HEAD + CBase64.encode(eb);
    }
    o.decode = function( value,pKey ) {
        if(value.indexOf(SB32HEAD) != 0) {
            throw "decode:Unknown data format" ;
        }
        var bin = CBase64.decode(value.substring(SB32HEAD.length));
        if( bin.length <= 34 ) {
            throw "decode:Invalid binary length" ;
        }
        var stepNo = ((~(bin[ 1 ]^bin[0]))&0x0000007f) ;
        var pubKey = new Array( 32 ) ;
        arraycopy( bin,2,pubKey,0,32 ) ;
        var bodyLen = bin.length - 34 ;
        var body = new Array( bodyLen ) ;
        arraycopy(bin,34,body,0,bodyLen) ;
        bin = null ;
        var key32 = _convertKey(pKey,pubKey) ;
        var key256 = _key256( key32 ) ;
        key32 = null ;
        var nowStep = _convert256To( key256,pubKey,stepNo ) ;
        _ed( false,body,key256,nowStep ) ;
        if( ( _getStepNo( pKey,body ) & 0x0000007f ) != stepNo ) {
            throw "decode:Decryption process failed" ;
        }
        return aryToString(body) ;
    }
    var _convert = function(key,no,pause) {
        switch ((no & 0x00000001)) {
            case 0:
                return ((~(pause ^ key[no])) & 0x000000ff) ;
            case 1:
                return ((pause ^ key[no]) & 0x000000ff) ;
        }
        return 0 ;
    }
    var _randKey = function() {
        var bin = new Array(32) ;
        for( var i = 0 ; i < 32 ; i ++ ) {
            bin[ i ] = ( rand.next() & 0x000000ff ) ;
        }
        return bin ;
    }
    var code16 = function(s,mode) {
        var ret = [177, 75, 163, 143, 73, 49, 207, 40, 87, 41, 169, 91, 184, 67, 254, 89];
        var n;
        var len = s.length;
        mode = mode|0;
        for(var i = 0; i < len; i ++) {
            n = mode==1 ? s.charCodeAt(i)|0 : s[i];
            if((i&0x00000001) == 0) {
                for(var j = 1; j < 16; j+= 2) {
                    ret[j] = ret[j] ^ (n-(i+j));
                }
                for(var j = 0; j < 16; j+= 2) {
                    ret[j] = ret[j] * (n-(i+j));
                }
            }
            else {
                for(var j = 0; j < 16; j+= 2) {
                    ret[j] = ret[j] ^ (n-(i+j));
                }
                for(var j = 1; j < 16; j+= 2) {
                    ret[j] = ret[j] * (n-(i+j));
                }
            }
        }
        for(var i = 0; i < 16; i++) {
            ret[i] = ret[i] & 0x000000ff;
        }
        return ret;
    }
    var _convertKey = function( pKey,key ) {
        var low = code16(pKey,0);
        var hight = code16(key,0);
        var ret = new Array(32);
        for (var i = 0,j = 0,k = 15; i < 16; i++, j += 2, k--) {
            ret[j] = _convert(low, i, key[j]);
            ret[j + 1] = _convert(hight, i, low[k]);
        }
        return ret;
    }
    var _key256 = function( key32 ) {
        var ret = new Array( 256 ) ;
        var b = new Array( 4 ) ;
        var o ;
        var n = 0 ;
        var s,e ;
        for( var i = 0,j = 0 ; i < 31 ; i += 2,j += 16 ) {
            s = ( key32[i] & 0x000000ff ) ;
            e = ( key32[i+1] & 0x000000ff ) ;
            if( ( n & 0x00000001 ) != 0 ) {
                n += s ^ (~ e ) ;
            }
            else {
                n -= (~s) ^ e ;
            }
            b[0] = (n & 0x000000ff) ;
            b[1] = (((n & 0x0000ff00)>>8)&0x000000ff) ;
            b[2] = (((n & 0x00ff0000)>>16)&0x000000ff) ;
            b[3] = (((n & 0xff000000)>>24)&0x000000ff) ;
            o = code16(b,0) ;
            arraycopy( o,0,ret,j,16 ) ;
        }
        return ret ;
    }
    var _getStepNo = function(pubKey,binary) {
        var i, j;
        var bin;
        var ret = 0;
        var len = binary.length ;
        var addCd = (pubKey[(binary[len>>1] & 0x0000001f)] & 0x00000003) + 1;
        for (i = 0, j = 0; i < len; i += addCd, j += addCd) {
            bin = ((~binary[i]) & 0x000000ff);
            ret = ((bin & 0x00000001) + ((bin & 0x00000002) >> 1)
                    + ((bin & 0x00000004) >> 2) + ((bin & 0x00000008) >> 3)
                    + ((bin & 0x00000010) >> 4) + ((bin & 0x00000020) >> 5)
                    + ((bin & 0x00000040) >> 6) + ((bin & 0x00000080) >> 7))
                    + (j & 0x000000ff) + ret;
        }
        if ((ret & 0x00000001) == 0) {
            for (i = 0; i <32; i++) {
                bin = (((pubKey[i] & 0x00000001) == 0) ? ((~pubKey[i]) & 0x000000ff)
                        : (pubKey[i] & 0x000000ff));
                ret += ((bin & 0x00000001) + ((bin & 0x00000002) >> 1)
                        + ((bin & 0x00000004) >> 2) + ((bin & 0x00000008) >> 3)
                        + ((bin & 0x00000010) >> 4) + ((bin & 0x00000020) >> 5)
                        + ((bin & 0x00000040) >> 6) + ((bin & 0x00000080) >> 7));
            }
        } else {
            for (i = 0; i < 32; i++) {
                bin = (((pubKey[i] & 0x00000001) == 0) ? ((~pubKey[i]) & 0x000000ff)
                        : (pubKey[i] & 0x000000ff));
                ret -= ((bin & 0x00000001) + ((bin & 0x00000002) >> 1)
                        + ((bin & 0x00000004) >> 2) + ((bin & 0x00000008) >> 3)
                        + ((bin & 0x00000010) >> 4) + ((bin & 0x00000020) >> 5)
                        + ((bin & 0x00000040) >> 6) + ((bin & 0x00000080) >> 7));
            }
        }
        return ((~ret) & 0x000000ff);
    }
    var _flip = function(pause, step) {
        switch (step & 0x00000007) {
        case 1:
            return ((((pause & 0x00000003) << 6) & 0x000000c0) | (((pause & 0x000000fc) >> 2) & 0x0000003f)) & 0x000000ff ;
        case 2:
            return ((((pause & 0x0000003f) << 2) & 0x000000fc) | (((pause & 0x000000c0) >> 6) & 0x00000003)) & 0x000000ff ;
        case 3:
            return ((((pause & 0x00000001) << 7) & 0x00000080) | (((pause & 0x000000fe) >> 1) & 0x0000007f)) & 0x000000ff ;
        case 4:
            return ((((pause & 0x0000000f) << 4) & 0x000000f0) | (((pause & 0x000000f0) >> 4) & 0x0000000f)) & 0x000000ff ;
        case 5:
            return ((((pause & 0x0000007f) << 1) & 0x000000fe) | (((pause & 0x00000080) >> 7) & 0x00000001)) & 0x000000ff ;
        case 6:
            return ((((pause & 0x00000007) << 5) & 0x000000e0) | (((pause & 0x000000f8) >> 3) & 0x0000001f)) & 0x000000ff ;
        case 7:
            return ((((pause & 0x0000001f) << 3) & 0x000000f8) | (((pause & 0x000000e0) >> 5) & 0x00000007)) & 0x000000ff ;
        }
        return pause & 0x000000ff ;
    }
    var _nflip = function(pause, step) {
        switch (step & 0x00000007) {
        case 1:
            return ((((pause & 0x0000003f) << 2) & 0x000000fc) | (((pause & 0x000000c0) >> 6) & 0x00000003)) & 0x000000ff ;
        case 2:
            return ((((pause & 0x00000003) << 6) & 0x000000c0) | (((pause & 0x000000fc) >> 2) & 0x0000003f)) & 0x000000ff ;
        case 3:
            return ((((pause & 0x0000007f) << 1) & 0x000000fe) | (((pause & 0x00000080) >> 7) & 0x00000001)) & 0x000000ff ;
        case 4:
            return ((((pause & 0x0000000f) << 4) & 0x000000f0) | (((pause & 0x000000f0) >> 4) & 0x0000000f)) & 0x000000ff ;
        case 5:
            return ((((pause & 0x00000001) << 7) & 0x00000080) | (((pause & 0x000000fe) >> 1) & 0x0000007f)) & 0x000000ff ;
        case 6:
            return ((((pause & 0x0000001f) << 3) & 0x000000f8) | (((pause & 0x000000e0) >> 5) & 0x00000007)) & 0x000000ff ;
        case 7:
            return ((((pause & 0x00000007) << 5) & 0x000000e0) | (((pause & 0x000000f8) >> 3) & 0x0000001f)) & 0x000000ff ;
        }
        return pause & 0x000000ff ;
    }
    var _convert256To = function( key256, pKey, step) {
        var ns = step ;
        for (var i = 0, j = 0; i < 256; i++, j = ((j + 1) & 0x0000001f)) {
            ns = (ns ^ (~(key256[i]))) ;
            if( (ns & 0x00000001 ) == 0 ) {
                ns = ~ns ;
            }
            key256[i] = _convert(pKey, j, key256[i]);
            key256[i] = _flip(key256[i], ns);
        }
        return ns;
    }
    var _ed = function(mode,binary,key256,step) {
        var len = binary.length ;
        var ns = step ;
        if( mode ) {
            for (var i = 0, j = 0; i < len; i++, j = ((j + 1) & 0x000000ff)) {
                ns = (ns ^ (~( key256[j]))) ;
                if( (ns & 0x00000001 ) != 0 ) {
                    ns = ~ns ;
                }
                binary[i] = _convert(key256, j, binary[i]);
                binary[i] = _flip( binary[ i ],ns ) ;
            }
        }
        else {
            for (var i = 0, j = 0; i < len; i++, j = ((j + 1) & 0x000000ff)) {
                ns = (ns ^ (~( key256[j]))) ;
                if( (ns & 0x00000001 ) != 0 ) {
                    ns = ~ns ;
                }
                binary[i] = _nflip( binary[ i ],ns ) ;
                binary[i] = _convert(key256, j, binary[i]);
            }
        }
    }
    var strToArray = function( s ) {
        var len = s.length ;
        var ret = new Array( len ) ;
        for( var i = 0 ; i < len ; i ++ ) {
            ret[ i ] = s.charCodeAt( i )|0 ;
        }
        return ret ;
    }
    var aryToString = function( s ) {
        var len = s.length ;
        var ret = new Array( len ) ;
        for( var i = 0 ; i < len ; i ++ ) {
            ret[ i ] = String.fromCharCode( s[ i ] ) ;
        }
        return ret.join('') ;
    },
    arraycopy = function( s,sp,d,dp,len ) {
        len = len|0;
        sp = sp|0;
        dp = dp|0;
        for( var i = 0 ; i < len ; i ++ ) {
            d[(dp+i)] = s[(sp+i)] ;
        }
    }
    return o;
})();
o.S32 = Seabass32

global.Seabass = o;
})(window);
