var xdxdx = Array.prototype;
function i(e) {
    var t = e.reduce;
    return e === xdxdx || r(i, e) && t === i.reduce ? o : t
}

export var claszior = ({
  construct: function () {
    this._setVar();
  },
  _setVar: function () {
    this._curtimecheck = 0;
    this._keyName = null;
    this._nvalue = null;
    this._evalue = null;
    this._sessionKey = null;
  },
  _getKeys: function (e) {
    if (this._curtimecheck == 0 || new Date().getTime() - this._curtimecheck > 60000) {
      this._getKeyByRuntimeInclude(e);
    }
  },
  getKeys: function () {
    this._getKeys(true);
  },
  getKeysSync: function () {
    this._getKeys(false);
  },
  encrypt: function (e, t) {
    if (!this._keyName) {
      this.getKeys();
      return false;
    }
    var n = new w();
    n.setPublic(this._evalue, this._nvalue);
    return n.encrypt(this._getLenChar(this._sessionKey) + this._sessionKey + this._getLenChar(e) + e + this._getLenChar(t) + t);
  },
  getKeyName: function () {
    return this._keyName;
  },
  _getKeyByRuntimeInclude: function (e) {
    this._curtimecheck = new Date().getTime();
    p.ajax({
      url: "/member/login/rsa/getKeys",
      async: e
    }).then(p.proxy(this._onloadRsaKey, this));
  },
  _onloadRsaKey: function (e) {
    if (e) {
      this._keyName = e.keyName;
      this._nvalue = e.nvalue;
      this._evalue = e.evalue;
      this._sessionKey = e.sessionKey;
    }
  },
  _getLenChar: function (e) {
    e += "";
    return String.fromCharCode(e.length);
  }
});
function c(e, t, n) {
  if (e != null) {
    if (typeof e == "number") {
      this.fromNumber(e, t, n);
    } else if (t == null && typeof e != "string") {
      this.fromString(e, 256);
    } else {
      this.fromString(e, t);
    }
  }
}
function b() {
  return new c(null);
}

c.prototype.am = function (e, t, n, r, o, i) {
for (; --i >= 0;) {
    var a = t * this[e++] + n[r] + o;
    o = Math.floor(a / 67108864);
    n[r++] = 67108863 & a;
}
return o;
};

var r = 26;

c.prototype.DB = r;
c.prototype.DM = (1 << r) - 1;
c.prototype.DV = 1 << r;
c.prototype.FV = Math.pow(2, 52);
c.prototype.F1 = 52 - r;
c.prototype.F2 = 2 * r - 52;
var M;
var u;
var z = new Array();
for (M = "0".charCodeAt(0), u = 0; u <= 9; ++u) {
  z[M++] = u;
}
for (M = "a".charCodeAt(0), u = 10; u < 36; ++u) {
  z[M++] = u;
}
for (M = "A".charCodeAt(0), u = 10; u < 36; ++u) {
  z[M++] = u;
}
function l(e) {
  return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(e);
}
function d(e, t) {
  var n = z[e.charCodeAt(t)];
  return n == null ? -1 : n;
}
function f(e) {
  var t = b();
  t.fromInt(e);
  return t;
}
function O(e) {
  var t;
  var n = 1;
  if ((t = e >>> 16) != 0) {
    e = t;
    n += 16;
  }
  if ((t = e >> 8) != 0) {
    e = t;
    n += 8;
  }
  if ((t = e >> 4) != 0) {
    e = t;
    n += 4;
  }
  if ((t = e >> 2) != 0) {
    e = t;
    n += 2;
  }
  if ((t = e >> 1) != 0) {
    e = t;
    n += 1;
  }
  return n;
}
function h(e) {
  this.m = e;
}
function A(e) {
  this.m = e;
  this.mp = e.invDigit();
  this.mpl = 32767 & this.mp;
  this.mph = this.mp >> 15;
  this.um = (1 << e.DB - 15) - 1;
  this.mt2 = 2 * e.t;
}
function m() {
  this.i = 0;
  this.j = 0;
  this.S = new Array();
}
h.prototype.convert = function (e) {
  return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e;
};
h.prototype.revert = function (e) {
  return e;
};
h.prototype.reduce = function (e) {
  e.divRemTo(this.m, null, e);
};
h.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
  h.prototype.reduce.call(this, n);
};
h.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
  h.prototype.reduce.call(this, t);
};
A.prototype.convert = function (e) {
  var t = b();
  e.abs().dlShiftTo(this.m.t, t);
  t.divRemTo(this.m, null, t);
  if (e.s < 0 && t.compareTo(c.ZERO) > 0) {
    this.m.subTo(t, t);
  }
  return t;
};
A.prototype.revert = function (e) {
  var t = b();
  e.copyTo(t);
  A.prototype.reduce.call(this, t);
  return t;
};
A.prototype.reduce = function (e) {
  for (; e.t <= this.mt2;) {
    e[e.t++] = 0;
  }
  for (var t = 0; t < this.m.t; ++t) {
    var n = 32767 & e[t];
    var r = n * this.mpl + ((n * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
    for (e[n = t + this.m.t] += this.m.am(0, r, e, t, 0, this.m.t); e[n] >= e.DV;) {
      e[n] -= e.DV;
      e[++n]++;
    }
  }
  e.clamp();
  e.drShiftTo(this.m.t, e);
  if (e.compareTo(this.m) >= 0) {
    e.subTo(this.m, e);
  }
};
A.prototype.mulTo = function (e, t, n) {
  e.multiplyTo(t, n);
  A.prototype.reduce.call(this, n);
};
A.prototype.sqrTo = function (e, t) {
  e.squareTo(t);
  A.prototype.reduce.call(this, t);
};
c.prototype.copyTo = function (e) {
  for (var t = this.t - 1; t >= 0; --t) {
    e[t] = this[t];
  }
  e.t = this.t;
  e.s = this.s;
};
c.prototype.fromInt = function (e) {
  this.t = 1;
  this.s = e < 0 ? -1 : 0;
  if (e > 0) {
    this[0] = e;
  } else if (e < -1) {
    this[0] = e + DV;
  } else {
    this.t = 0;
  }
};
c.prototype.fromString = function (e, t) {
  var n;
  if (t == 16) {
    n = 4;
  } else if (t == 8) {
    n = 3;
  } else if (t == 256) {
    n = 8;
  } else if (t == 2) {
    n = 1;
  } else if (t == 32) {
    n = 5;
  } else {
    if (t != 4) {
      return void this.fromRadix(e, t);
    }
    n = 2;
  }
  this.t = 0;
  this.s = 0;
  for (var r = e.length, o = false, i = 0; --r >= 0;) {
    var a = n == 8 ? 255 & e[r] : d(e, r);
    if (a < 0) {
      if (e.charAt(r) == "-") {
        o = true;
      }
    } else {
      o = false;
      if (i == 0) {
        this[this.t++] = a;
      } else if (i + n > this.DB) {
        this[this.t - 1] |= (a & (1 << this.DB - i) - 1) << i;
        this[this.t++] = a >> this.DB - i;
      } else {
        this[this.t - 1] |= a << i;
      }
      if ((i += n) >= this.DB) {
        i -= this.DB;
      }
    }
  }
  if (n == 8 && (128 & e[0]) != 0) {
    this.s = -1;
    if (i > 0) {
      this[this.t - 1] |= (1 << this.DB - i) - 1 << i;
    }
  }
  this.clamp();
  if (o) {
    c.ZERO.subTo(this, this);
  }
};
c.prototype.clamp = function () {
  for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e;) {
    --this.t;
  }
};
c.prototype.dlShiftTo = function (e, t) {
  var n;
  for (n = this.t - 1; n >= 0; --n) {
    t[n + e] = this[n];
  }
  for (n = e - 1; n >= 0; --n) {
    t[n] = 0;
  }
  t.t = this.t + e;
  t.s = this.s;
};
c.prototype.drShiftTo = function (e, t) {
  for (var n = e; n < this.t; ++n) {
    t[n - e] = this[n];
  }
  t.t = Math.max(this.t - e, 0);
  t.s = this.s;
};
c.prototype.lShiftTo = function (e, t) {
  var n;
  var r = e % this.DB;
  var o = this.DB - r;
  var i = (1 << o) - 1;
  var a = Math.floor(e / this.DB);
  var s = this.s << r & this.DM;
  for (n = this.t - 1; n >= 0; --n) {
    t[n + a + 1] = this[n] >> o | s;
    s = (this[n] & i) << r;
  }
  for (n = a - 1; n >= 0; --n) {
    t[n] = 0;
  }
  t[a] = s;
  t.t = this.t + a + 1;
  t.s = this.s;
  t.clamp();
};
c.prototype.rShiftTo = function (e, t) {
  t.s = this.s;
  var n = Math.floor(e / this.DB);
  if (n >= this.t) {
    t.t = 0;
  } else {
    var r = e % this.DB;
    var o = this.DB - r;
    var i = (1 << r) - 1;
    t[0] = this[n] >> r;
    for (var a = n + 1; a < this.t; ++a) {
      t[a - n - 1] |= (this[a] & i) << o;
      t[a - n] = this[a] >> r;
    }
    if (r > 0) {
      t[this.t - n - 1] |= (this.s & i) << o;
    }
    t.t = this.t - n;
    t.clamp();
  }
};
c.prototype.subTo = function (e, t) {
  for (var n = 0, r = 0, o = Math.min(e.t, this.t); n < o;) {
    r += this[n] - e[n];
    t[n++] = r & this.DM;
    r >>= this.DB;
  }
  if (e.t < this.t) {
    for (r -= e.s; n < this.t;) {
      r += this[n];
      t[n++] = r & this.DM;
      r >>= this.DB;
    }
    r += this.s;
  } else {
    for (r += this.s; n < e.t;) {
      r -= e[n];
      t[n++] = r & this.DM;
      r >>= this.DB;
    }
    r -= e.s;
  }
  t.s = r < 0 ? -1 : 0;
  if (r < -1) {
    t[n++] = this.DV + r;
  } else if (r > 0) {
    t[n++] = r;
  }
  t.t = n;
  t.clamp();
};
c.prototype.multiplyTo = function (e, t) {
  var n = this.abs();
  var r = e.abs();
  var o = n.t;
  for (t.t = o + r.t; --o >= 0;) {
    t[o] = 0;
  }
  for (o = 0; o < r.t; ++o) {
    t[o + n.t] = n.am(0, r[o], t, o, 0, n.t);
  }
  t.s = 0;
  t.clamp();
  if (this.s != e.s) {
    c.ZERO.subTo(t, t);
  }
};
c.prototype.squareTo = function (e) {
  for (var t = this.abs(), n = e.t = 2 * t.t; --n >= 0;) {
    e[n] = 0;
  }
  for (n = 0; n < t.t - 1; ++n) {
    var r = t.am(n, t[n], e, 2 * n, 0, 1);
    if ((e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV) {
      e[n + t.t] -= t.DV;
      e[n + t.t + 1] = 1;
    }
  }
  if (e.t > 0) {
    e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1);
  }
  e.s = 0;
  e.clamp();
};
c.prototype.divRemTo = function (e, t, n) {
  var r = e.abs();
  if (!(r.t <= 0)) {
    var o = this.abs();
    if (o.t < r.t) {
      if (t != null) {
        t.fromInt(0);
      }
      return void (n != null && this.copyTo(n));
    }
    if (n == null) {
      n = b();
    }
    var i = b();
    var a = this.s;
    var s = e.s;
    var p = this.DB - O(r[r.t - 1]);
    if (p > 0) {
      r.lShiftTo(p, i);
      o.lShiftTo(p, n);
    } else {
      r.copyTo(i);
      o.copyTo(n);
    }
    var M = i.t;
    var u = i[M - 1];
    if (u != 0) {
      var z = u * (1 << this.F1) + (M > 1 ? i[M - 2] >> this.F2 : 0);
      var l = this.FV / z;
      var d = (1 << this.F1) / z;
      var f = 1 << this.F2;
      var h = n.t;
      var A = h - M;
      var m = t == null ? b() : t;
      for (i.dlShiftTo(A, m), n.compareTo(m) >= 0 && (n[n.t++] = 1, n.subTo(m, n)), c.ONE.dlShiftTo(M, m), m.subTo(i, i); i.t < M;) {
        i[i.t++] = 0;
      }
      for (; --A >= 0;) {
        var q = n[--h] == u ? this.DM : Math.floor(n[h] * l + (n[h - 1] + f) * d);
        if ((n[h] += i.am(0, q, n, A, 0, M)) < q) {
          for (i.dlShiftTo(A, m), n.subTo(m, n); n[h] < --q;) {
            n.subTo(m, n);
          }
        }
      }
      if (t != null) {
        n.drShiftTo(M, t);
        if (a != s) {
          c.ZERO.subTo(t, t);
        }
      }
      n.t = M;
      n.clamp();
      if (p > 0) {
        n.rShiftTo(p, n);
      }
      if (a < 0) {
        c.ZERO.subTo(n, n);
      }
    }
  }
};
c.prototype.invDigit = function () {
  if (this.t < 1) {
    return 0;
  }
  var e = this[0];
  if ((1 & e) == 0) {
    return 0;
  }
  var t = 3 & e;
  return (t = (t = (t = (t = t * (2 - (15 & e) * t) & 15) * (2 - (255 & e) * t) & 255) * (2 - ((65535 & e) * t & 65535)) & 65535) * (2 - e * t % this.DV) % this.DV) > 0 ? this.DV - t : -t;
};
c.prototype.isEven = function () {
  return (this.t > 0 ? 1 & this[0] : this.s) == 0;
};
c.prototype.exp = function (e, t) {
  if (e > 4294967295 || e < 1) {
    return c.ONE;
  }
  var n = b();
  var r = b();
  var o = t.convert(this);
  var i = O(e) - 1;
  for (o.copyTo(n); --i >= 0;) {
    t.sqrTo(n, r);
    if ((e & 1 << i) > 0) {
      t.mulTo(r, o, n);
    } else {
      var a = n;
      n = r;
      r = a;
    }
  }
  return t.revert(n);
};
c.prototype.toString = function (e) {
  if (this.s < 0) {
    return "-" + this.negate().toString(e);
  }
  var t;
  if (e == 16) {
    t = 4;
  } else if (e == 8) {
    t = 3;
  } else if (e == 2) {
    t = 1;
  } else if (e == 32) {
    t = 5;
  } else {
    if (e != 4) {
      return this.toRadix(e);
    }
    t = 2;
  }
  var n;
  var r = (1 << t) - 1;
  var o = false;
  var i = "";
  var a = this.t;
  var s = this.DB - a * this.DB % t;
  if (a-- > 0) {
    for (s < this.DB && (n = this[a] >> s) > 0 && (o = true, i = l(n)); a >= 0;) {
      if (s < t) {
        n = (this[a] & (1 << s) - 1) << t - s;
        n |= this[--a] >> (s += this.DB - t);
      } else {
        n = this[a] >> (s -= t) & r;
        if (s <= 0) {
          s += this.DB;
          --a;
        }
      }
      if (n > 0) {
        o = true;
      }
      if (o) {
        i += l(n);
      }
    }
  }
  return o ? i : "0";
};
c.prototype.negate = function () {
  var e = b();
  c.ZERO.subTo(this, e);
  return e;
};
c.prototype.abs = function () {
  return this.s < 0 ? this.negate() : this;
};
c.prototype.compareTo = function (e) {
  var t = this.s - e.s;
  if (t != 0) {
    return t;
  }
  var n = this.t;
  if ((t = n - e.t) != 0) {
    return t;
  }
  for (; --n >= 0;) {
    if ((t = this[n] - e[n]) != 0) {
      return t;
    }
  }
  return 0;
};
c.prototype.bitLength = function () {
  return this.t <= 0 ? 0 : this.DB * (this.t - 1) + O(this[this.t - 1] ^ this.s & this.DM);
};
c.prototype.mod = function (e) {
  var t = b();
  this.abs().divRemTo(e, null, t);
  if (this.s < 0 && t.compareTo(c.ZERO) > 0) {
    e.subTo(t, t);
  }
  return t;
};
c.prototype.modPowInt = function (e, t) {
  var n;
  n = e < 256 || t.isEven() ? new h(t) : new A(t);
  return this.exp(e, n);
};
c.ZERO = f(0);
c.ONE = f(1);
m.prototype.init = function (e) {
  var t;
  var n;
  var r;
  for (t = 0; t < 256; ++t) {
    this.S[t] = t;
  }
  for (n = 0, t = 0; t < 256; ++t) {
    n = n + this.S[t] + e[t % e.length] & 255;
    r = this.S[t];
    this.S[t] = this.S[n];
    this.S[n] = r;
  }
  this.i = 0;
  this.j = 0;
};
m.prototype.next = function () {
  var e;
  this.i = this.i + 1 & 255;
  this.j = this.j + this.S[this.i] & 255;
  e = this.S[this.i];
  this.S[this.i] = this.S[this.j];
  this.S[this.j] = e;
  return this.S[e + this.S[this.i] & 255];
};
var q;
var g;
var _;
function v() {
  var e;
  e = new Date().getTime();
  g[_++] ^= 255 & e;
  g[_++] ^= e >> 8 & 255;
  g[_++] ^= e >> 16 & 255;
  g[_++] ^= e >> 24 & 255;
  if (_ >= 256) {
    _ -= 256;
  }
}
if (g == null) {
  var y;
  g = new Array();
  _ = 0;
  for (; _ < 256;) {
    y = Math.floor(65536 * Math.random());
    g[_++] = y >>> 8;
    g[_++] = 255 & y;
  }
  _ = 0;
  v();
}
function L() {
  if (q == null) {
    for (v(), (q = new m()).init(g), _ = 0; _ < g.length; ++_) {
      g[_] = 0;
    }
    _ = 0;
  }
  return q.next();
}
function R() {}
export function w() {
  this.n = null;
  this.e = 0;
  this.d = null;
  this.p = null;
  this.q = null;
  this.dmp1 = null;
  this.dmq1 = null;
  this.coeff = null;
}
R.prototype.nextBytes = function (e) {
  var t;
  for (t = 0; t < e.length; ++t) {
    e[t] = L();
  }
};
w.prototype.doPublic = function (e) {
  return e.modPowInt(this.e, this.n);
};
w.prototype.setPublic = function (e, t) {
  if (e != null && t != null && e.length > 0 && t.length > 0) {
    this.n = function (e, t) {
      return new c(e, t);
    }(e, 16);
    this.e = parseInt(t, 16);
  } else {
    console.log("잘못된 보안키입니다.");
  }
};
w.prototype.encrypt = function (e) {
  var t = function (e, t) {
    if (t < e.length + 11) {
      console.log("암호화가 정상적으로 이루어지지 않았습니다.");
      return null;
    }
    for (var n = new Array(), r = e.length - 1; r >= 0 && t > 0;) {
      n[--t] = e.charCodeAt(r--);
    }
    n[--t] = 0;
    for (var o = new R(), i = new Array(); t > 2;) {
      for (i[0] = 0; i[0] == 0;) {
        o.nextBytes(i);
      }
      n[--t] = i[0];
    }
    n[--t] = 2;
    n[--t] = 0;
    return new c(n);
  }(e, this.n.bitLength() + 7 >> 3);
  if (t == null) {
    return null;
  }
  var n = this.doPublic(t);
  if (n == null) {
    return null;
  }
  for (var r = n.toString(16), o = (this.n.bitLength() + 7 >> 3 << 1) - r.length; o-- > 0;) {
    r = "0" + r;
  }
  return r;
};
