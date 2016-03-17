function AppMeasurement_Module_Media(s) {
    var m = this;
    m.s = s;
    s = window;
    if (!s.s_c_in) s.s_c_il = [], s.s_c_in = 0;
    m._il = s.s_c_il;
    m._in = s.s_c_in;
    m._il[m._in] = m;
    s.s_c_in++;
    m._c = "s_m";
    m.list = [];
    m.open = function (w, b, c, h) {
        var d = {}, a = new Date,
            g = "",
            e;
        b || (b = -1);
        if (w && c) {
            if (!m.list) m.list = {};
            m.list[w] && m.close(w);
            if (h && h.id) g = h.id;
            if (g)
                for (e in m.list)!Object.prototype[e] && m.list[e] && m.list[e].S == g && m.close(m.list[e].name);
            d.name = w;
            d.length = b;
            d.u = 0;
            d.c = 0;
            d.playerName = m.playerName ? m.playerName : c;
            d.S = g;
            d.L = 0;
            d.f = 0;
            d.timestamp =
                Math.floor(a.getTime() / 1E3);
            d.j = 0;
            d.r = d.timestamp;
            d.a = -1;
            d.B = "";
            d.k = -1;
            d.C = 0;
            d.H = {};
            d.F = 0;
            d.m = 0;
            d.e = "";
            d.A = 0;
            d.K = 0;
            d.z = 0;
            d.D = 0;
            d.l = !1;
            d.v = "";
            d.I = "";
            d.J = 0;
            d.q = !1;
            d.G = "";
            d.complete = 0;
            d.Q = 0;
            d.o = 0;
            d.p = 0;
            m.list[w] = d
        }
    };
    m.openAd = function (w, b, c, h, d, a, g, e) {
        var f = {};
        m.open(w, b, c, e);
        if (f = m.list[w]) f.l = !0, f.v = h, f.I = d, f.J = a, f.G = g
    };
    m.M = function (w) {
        var b = m.list[w];
        m.list[w] = 0;
        b && b.monitor && clearTimeout(b.monitor.R)
    };
    m.close = function (w) {
        m.g(w, 0, -1)
    };
    m.play = function (w, b, c, h) {
        var d = m.g(w, 1, b, c, h);
        if (d && !d.monitor) d.monitor = {}, d.monitor.update = function () {
            d.j == 1 && m.g(d.name, 3, -1);
            d.monitor.R = setTimeout(d.monitor.update, 1E3)
        }, d.monitor.update()
    };
    m.click = function (w, b) {
        m.g(w, 7, b)
    };
    m.complete = function (w, b) {
        m.g(w, 5, b)
    };
    m.stop = function (w, b) {
        m.g(w, 2, b)
    };
    m.track = function (w) {
        m.g(w, 4, -1)
    };
    m.P = function (w, b) {
        var c = "a.media.",
            h = w.linkTrackVars,
            d = w.linkTrackEvents,
            a = "m_i",
            g, e = w.contextData,
            f;
        if (b.l) {
            c += "ad.";
            if (b.v) e["a.media.name"] = b.v, e[c + "pod"] = b.I, e[c + "podPosition"] = b.J;
            if (!b.F) e[c + "CPM"] = b.G
        }
        if (b.q) e[c + "clicked"] = !0, b.q = !1;
        e["a.contentType"] =
            "video" + (b.l ? "Ad" : "");
        e["a.media.channel"] = m.channel;
        e[c + "name"] = b.name;
        e[c + "playerName"] = b.playerName;
        if (b.length > 0) e[c + "length"] = b.length;
        e[c + "timePlayed"] = Math.floor(b.f);
        Math.floor(b.f) > 0 && (e[c + "timePlayed"] = Math.floor(b.f));
        if (!b.F) e[c + "view"] = !0, a = "m_s", b.F = 1;
        if (b.e) {
            e[c + "segmentNum"] = b.m;
            e[c + "segment"] = b.e;
            if (b.A > 0) e[c + "segmentLength"] = b.A;
            b.z && b.f > 0 && (e[c + "segmentView"] = !0)
        }
        if (!b.Q && b.complete) e[c + "complete"] = !0, b.T = 1;
        if (b.o > 0) e[c + "milestone"] = b.o;
        if (b.p > 0) e[c + "offsetMilestone"] = b.p;
        if (h)
            for (f in e) Object.prototype[f] ||
            (h += ",contextData." + f);
        g = e["a.contentType"];
        w.pe = a;
        w.pev3 = g;
        var s, n;
        if (m.contextDataMapping) {
            if (!w.events2) w.events2 = "";
            h && (h += ",events");
            for (f in m.contextDataMapping)
                if (!Object.prototype[f]) {
                    a = f.length > c.length && f.substring(0, c.length) == c ? f.substring(c.length) : "";
                    g = m.contextDataMapping[f];
                    if (typeof g == "string") {
                        s = g.split(",");
                        for (n = 0; n < s.length; n++) g = s[n], f == "a.contentType" ? (h && (h += "," + g), w[g] = e[f]) : a == "view" || a == "segmentView" || a == "clicked" || a == "complete" || a == "timePlayed" || a == "CPM" ? (d && (d += "," +
                            g), a == "timePlayed" || a == "CPM" ? e[f] && (w.events2 += (w.events2 ? "," : "") + g + "=" + e[f]) : e[f] && (w.events2 += (w.events2 ? "," : "") + g)) : a == "segment" && e[f + "Num"] ? (h && (h += "," + g), w[g] = e[f + "Num"] + ":" + e[f]) : (h && (h += "," + g), w[g] = e[f])
                    } else if (a == "milestones" || a == "offsetMilestones") f = f.substring(0, f.length - 1), e[f] && m.contextDataMapping[f + "s"][e[f]] && (d && (d += "," + m.contextDataMapping[f + "s"][e[f]]), w.events2 += (w.events2 ? "," : "") + m.contextDataMapping[f + "s"][e[f]]);
                    e[f] && (e[f] = 0);
                    a == "segment" && e[f + "Num"] && (e[f + "Num"] = 0)
                }
        }
        w.linkTrackVars =
            h;
        w.linkTrackEvents = d
    };
    m.g = function (w, b, c, h, d) {
        var a = {}, g = (new Date).getTime() / 1E3,
            e, f, s = m.trackVars,
            n = m.trackEvents,
            o = m.trackSeconds,
            p = m.trackMilestones,
            q = m.trackOffsetMilestones,
            r = m.segmentByMilestones,
            t = m.segmentByOffsetMilestones,
            k, j, l = 1,
            i = {}, u;
        if (!m.channel) m.channel = m.s.w.location.hostname;
        if (a = w && m.list && m.list[w] ? m.list[w] : 0) {
            if (a.l) o = m.adTrackSeconds, p = m.adTrackMilestones, q = m.adTrackOffsetMilestones, r = m.adSegmentByMilestones, t = m.adSegmentByOffsetMilestones;
            c < 0 && (c = a.j == 1 && a.r > 0 ? g - a.r + a.a :
                a.a);
            a.length > 0 && (c = c < a.length ? c : a.length);
            c < 0 && (c = 0);
            a.u = c;
            if (a.length > 0) a.c = a.u / a.length * 100, a.c = a.c > 100 ? 100 : a.c;
            if (a.a < 0) a.a = c;
            u = a.C;
            i.name = w;
            i.ad = a.l;
            i.length = a.length;
            i.openTime = new Date;
            i.openTime.setTime(a.timestamp * 1E3);
            i.offset = a.u;
            i.percent = a.c;
            i.playerName = a.playerName;
            i.mediaEvent = a.k < 0 ? "OPEN" : b == 1 ? "PLAY" : b == 2 ? "STOP" : b == 3 ? "MONITOR" : b == 4 ? "TRACK" : b == 5 ? "COMPLETE" : b == 7 ? "CLICK" : "CLOSE";
            if (b > 2 || b != a.j && (b != 2 || a.j == 1)) {
                if (!d) h = a.m, d = a.e;
                if (b) {
                    if (b == 1) a.a = c;
                    if ((b <= 3 || b >= 5) && a.k >= 0)
                        if (l = !1, s = n =
                            "None", a.k != c) {
                            f = a.k;
                            if (f > c) f = a.a, f > c && (f = c);
                            k = p ? p.split(",") : 0;
                            if (a.length > 0 && k && c >= f)
                                for (j = 0; j < k.length; j++)
                                    if ((e = k[j] ? parseFloat("" + k[j]) : 0) && f / a.length * 100 < e && a.c >= e) l = !0, j = k.length, i.mediaEvent = "MILESTONE", a.o = i.milestone = e;
                            if ((k = q ? q.split(",") : 0) && c >= f)
                                for (j = 0; j < k.length; j++)
                                    if ((e = k[j] ? parseFloat("" + k[j]) : 0) && f < e && c >= e) l = !0, j = k.length, i.mediaEvent = "OFFSET_MILESTONE", a.p = i.offsetMilestone = e
                        }
                    if (a.K || !d) {
                        if (r && p && a.length > 0) {
                            if (k = p.split(",")) {
                                k.push("100");
                                for (j = f = 0; j < k.length; j++)
                                    if (e = k[j] ? parseFloat("" +
                                        k[j]) : 0) {
                                        if (a.c < e) h = j + 1, d = "M:" + f + "-" + e, j = k.length;
                                        f = e
                                    }
                            }
                        } else if (t && q && (k = q.split(","))) {
                            k.push("" + (a.length > 0 ? a.length : "E"));
                            for (j = f = 0; j < k.length; j++)
                                if ((e = k[j] ? parseFloat("" + k[j]) : 0) || k[j] == "E") {
                                    if (c < e || k[j] == "E") h = j + 1, d = "O:" + f + "-" + e, j = k.length;
                                    f = e
                                }
                        }
                        if (d) a.K = !0
                    }
                    if ((d || a.e) && d != a.e) {
                        a.D = !0;
                        if (!a.e) a.m = h, a.e = d;
                        a.k >= 0 && (l = !0)
                    }
                    if ((b >= 2 || a.c >= 100) && a.a < c) a.L += c - a.a, a.f += c - a.a;
                    if (b <= 2 || b == 3 && !a.j) a.B += (b == 1 || b == 3 ? "S" : "E") + Math.floor(c), a.j = b == 3 ? 1 : b;
                    if (!l && a.k >= 0 && b <= 3 && (o = o ? o : 0) && a.f >= o) l = !0, i.mediaEvent =
                        "SECONDS";
                    a.r = g;
                    a.a = c
                }
                if (!b || b <= 3 && a.c >= 100) a.j != 2 && (a.B += "E" + Math.floor(c)), b = 0, s = n = "None", i.mediaEvent = "CLOSE";
                if (b == 7) l = i.clicked = a.q = !0;
                if (b == 5 || m.completeByCloseOffset && (!b || a.c >= 100) && a.length > 0 && c >= a.length - m.completeCloseOffsetThreshold) l = i.complete = a.complete = !0;
                g = i.mediaEvent;
                g == "MILESTONE" ? g += "_" + i.milestone : g == "OFFSET_MILESTONE" && (g += "_" + i.offsetMilestone);
                a.H[g] ? i.eventFirstTime = !1 : (i.eventFirstTime = !0, a.H[g] = 1);
                i.event = i.mediaEvent;
                i.timePlayed = a.L;
                i.segmentNum = a.m;
                i.segment = a.e;
                i.segmentLength =
                    a.A;
                m.monitor && b != 4 && m.monitor(m.s, i);
                b == 0 && m.M(w);
                if (l && a.C == u) {
                    w = {};
                    w.contextData = {};
                    w.linkTrackVars = s;
                    w.linkTrackEvents = n;
                    if (!w.linkTrackVars) w.linkTrackVars = "";
                    if (!w.linkTrackEvents) w.linkTrackEvents = "";
                    m.P(w, a);
                    w.linkTrackVars || (w["!linkTrackVars"] = 1);
                    w.linkTrackEvents || (w["!linkTrackEvents"] = 1);
                    m.s.track(w);
                    if (a.D) a.m = h, a.e = d, a.z = !0, a.D = !1;
                    else if (a.f > 0) a.z = !1;
                    a.B = "";
                    a.o = a.p = 0;
                    a.f -= Math.floor(a.f);
                    a.k = c;
                    a.C++
                }
            }
        }
        return a
    };
    m.O = function (w, b, c, h, d) {
        var a = 0;
        if (w && (!m.autoTrackMediaLengthRequired ||
            b && b > 0)) {
            if (!m.list || !m.list[w]) {
                if (c == 1 || c == 3) m.open(w, b, "HTML5 Video", d), a = 1
            } else a = 1;
            a && m.g(w, c, h, -1, 0)
        }
    };
    m.attach = function (w) {
        var b, c, h;
        if (w && w.tagName && w.tagName.toUpperCase() == "VIDEO") {
            if (!m.n) m.n = function (b, a, w) {
                var c, f;
                if (m.autoTrack) {
                    c = b.currentSrc;
                    (f = b.duration) || (f = -1);
                    if (w < 0) w = b.currentTime;
                    m.O(c, f, a, w, b)
                }
            };
            b = function () {
                m.n(w, 1, -1)
            };
            c = function () {
                m.n(w, 1, -1)
            };
            m.i(w, "play", b);
            m.i(w, "pause", c);
            m.i(w, "seeking", c);
            m.i(w, "seeked", b);
            m.i(w, "ended", function () {
                m.n(w, 0, -1)
            });
            m.i(w, "timeupdate",
                b);
            h = function () {
                !w.paused && !w.ended && !w.seeking && m.n(w, 3, -1);
                setTimeout(h, 1E3)
            };
            h()
        }
    };
    m.i = function (m, b, c) {
        m.attachEvent ? m.attachEvent("on" + b, c) : m.addEventListener && m.addEventListener(b, c, !1)
    };
    if (m.completeByCloseOffset == void 0) m.completeByCloseOffset = 1;
    if (m.completeCloseOffsetThreshold == void 0) m.completeCloseOffsetThreshold = 1;
    m.N = function () {
        var w, b;
        if (m.autoTrack && (w = m.s.d.getElementsByTagName("VIDEO")))
            for (b = 0; b < w.length; b++) m.attach(w[b])
    };
    m.i(s, "load", m.N)
}
AppMeasurement_Module_Media.REMOVE = 1;
new AppMeasurement_Module_Media("REMOVE");