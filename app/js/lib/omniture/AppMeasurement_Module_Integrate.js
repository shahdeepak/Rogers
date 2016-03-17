function AppMeasurement_Module_Integrate(s) {
    var m = this;
    m.s = s;
    var w = window;
    if (!w.s_c_in) w.s_c_il = [], w.s_c_in = 0;
    m._il = w.s_c_il;
    m._in = w.s_c_in;
    m._il[m._in] = m;
    w.s_c_in++;
    m._c = "s_m";
    m.list = [];
    m.add = function (c, b) {
        var a;
        b || (b = "s_Integrate_" + c);
        w[b] || (w[b] = {});
        a = m[c] = w[b];
        a.a = c;
        a.e = m;
        a._c = 0;
        a._d = 0;
        a.disable == void 0 && (a.disable = 0);
        a.get = function (b, c) {
            var d = document,
                f = d.getElementsByTagName("HEAD"),
                g;
            if (!a.disable && (c || (v = "s_" + m._in + "_Integrate_" + a.a + "_get_" + a._c), a._c++, a.VAR = v, a.CALLBACK = "s_c_il[" + m._in +
                "]." + a.a + ".callback", a.delay(), f = f && f.length > 0 ? f[0] : d.body)) try {
                g = d.createElement("SCRIPT");
                g.type = "text/javascript";
                g.setAttribute("async", "async");
                g.src = m.c(a, b);
                if (b.indexOf("[CALLBACK]") < 0) g.onload = g.onreadystatechange = function () {
                    a.callback(w[v])
                };
                f.firstChild ? f.insertBefore(g, f.firstChild) : f.appendChild(g)
            } catch (s) {}
        };
        a.callback = function (b) {
            var m;
            if (b)
                for (m in b) Object.prototype[m] || (a[m] = b[m]);
            a.ready()
        };
        a.beacon = function (b) {
            var c = "s_i_" + m._in + "_Integrate_" + a.a + "_" + a._c;
            if (!a.disable) a._c++,
                c = w[c] = new Image, c.src = m.c(a, b)
        };
        a.script = function (b) {
            a.get(b, 1)
        };
        a.delay = function () {
            a._d++
        };
        a.ready = function () {
            a._d--;
            a.disable || s.delayReady()
        };
        m.list.push(c)
    };
    m._g = function (c) {
        var b, a = (c ? "use" : "set") + "Vars";
        for (c = 0; c < m.list.length; c++)
            if ((b = m[m.list[c]]) && !b.disable && b[a]) try {
                b[a](s, b)
            } catch (w) {}
    };
    m._t = function () {
        m._g(1)
    };
    m._d = function () {
        var c, b;
        for (c = 0; c < m.list.length; c++)
            if ((b = m[m.list[c]]) && !b.disable && b._d > 0) return 1;
        return 0
    };
    m.c = function (m, b) {
        var a, w, e, d;
        b.toLowerCase().substring(0, 4) != "http" &&
        (b = "http://" + b);
        s.ssl && (b = s.replace(b, "http:", "https:"));
        m.RAND = Math.floor(Math.random() * 1E13);
        for (a = 0; a >= 0;) a = b.indexOf("[", a), a >= 0 && (w = b.index / Users / v590621 / Downloads / AppMeasurement_JavaScript - 1.1 / AppMeasurement_Module_Media.jsOf("]", a), w > a && (e = b.substring(a + 1, w), e.length > 2 && e.substring(0, 2) == "s." ? (d = s[e.substring(2)]) || (d = "") : (d = "" + m[e], d != m[e] && parseFloat(d) != m[e] && (e = 0)), e && (b = b.substring(0, a) + encodeURIComponent(d) + b.substring(w + 1)), a = w));
        return b
    }
}