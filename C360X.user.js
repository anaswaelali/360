// ==UserScript==
// @name         C360X - Bulk Search
// @namespace    http://tampermonkey.net/
// @version      32.6.5
// @description  Fast Bulk Search for Customer 360.
// @author       Anas Wael
// @match        *://*.te.eg/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/anaswaelali/360/main/C360X.user.js
// @updateURL    https://raw.githubusercontent.com/anaswaelali/360/main/C360X.user.js
// ==/UserScript==

(function () {
    "use strict";

    // ==========================================
    // 1. حقن الـ CSS الأصلي الخاص بك
    // ==========================================
    var css = `
/* زرار الفتح */
.c360x-trigger {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 38px;
    padding: 0 14px;
    margin-inline-start: 8px;
    border: 1px solid rgba(255, 255, 255, 0.2) !important; 
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.15) !important; 
    color: #ffffff !important; 
    font: 700 14px/1 Roboto, "Segoe UI", Arial, sans-serif !important;
    cursor: pointer;
    white-space: nowrap;
    transition: all .18s ease;
}

.c360x-trigger:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    transform: translateY(-1px);
}

.c360x-trigger svg { width: 18px; height: 18px; color: #ffffff !important; }
.c360x-trigger .c360x-label { color: #ffffff !important; font-weight: 700 !important; }

.c360x-trigger .c360x-pill {
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    background: #ffffff !important;
    color: #702283 !important; 
    font-size: 12px;
    font-weight: 800;
    line-height: 20px;
    text-align: center;
    display: inline-block;
}

.c360x-trigger .c360x-pill[data-empty="1"] { background: rgba(255, 255, 255, 0.3) !important; color: transparent !important; }

/* البانل الأساسي */
#c360x-modal {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: none;
    --bg: #ffffff;
    --fg: #231a2e;
    --muted: #6d6480;
    --line: #e8e2ef;
    --soft: #f6f2fa;
    --accent: #702283;
}

#c360x-modal.on { display: block; }
body.c360x-lock { overflow: hidden !important; }

.c360x-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(18, 8, 26, .55);
    backdrop-filter: blur(3px);
}

.c360x-panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(850px, 96vw);
    max-height: 92vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--fg);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 30px 90px rgba(0, 0, 0, .48);
    font: 15px/1.5 Roboto, "Segoe UI", Arial, sans-serif;
}

.c360x-head {
    display: flex;
    justify-content: space-between;
    padding: 22px 28px;
    background: linear-gradient(135deg, #702283, #aa20a6);
}

#c360x-modal .c360x-head h3 { margin: 0 0 6px; font-size: 24px; font-weight: 800; color: #ffffff !important; letter-spacing: 0.5px; }
#c360x-modal .c360x-head p { margin: 0; font-size: 15px; color: #f0f0f0 !important; font-weight: 400; }

.c360x-x {
    background: rgba(255,255,255,.16);
    border: 0;
    color: #fff !important;
    font-size: 24px;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    cursor: pointer;
    transition: 0.2s;
}
.c360x-x:hover { background: rgba(255,255,255,.3); transform: scale(1.05); }

.c360x-body { padding: 24px 28px; overflow: auto; flex: 1; background: #fafbfc; }

.c360x-label { font-size: 15px; font-weight: 700; margin-bottom: 8px; display: block; color: #333 !important; }

#c360x-input {
    width: 100%;
    min-height: 100px;
    padding: 14px;
    border-radius: 11px;
    border: 1px solid #d1d5db;
    background: #ffffff !important;
    font-family: monospace;
    font-size: 15px;
    outline: none;
    box-sizing: border-box;
    transition: 0.2s;
    color: #333 !important;
}
#c360x-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(112,34,131,0.1); }

.c360x-row { display: flex; gap: 10px; align-items: center; margin: 18px 0; flex-wrap: wrap; }

.c360x-types { display: flex; gap: 8px; }
.c360x-types button {
    height: 38px;
    padding: 0 16px;
    border-radius: 9px;
    border: 1px solid #d1d5db;
    background: #ffffff !important;
    color: #4b5563 !important;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: 0.2s;
}
.c360x-types button:hover { background: #f3f4f6 !important; }
.c360x-types button.active { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; box-shadow: 0 4px 10px rgba(112,34,131,0.2); }

.c360x-btn {
    height: 40px;
    padding: 0 18px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.2s;
}

.c360x-btn.primary { background: linear-gradient(135deg, #702283, #aa20a6) !important; color: #fff !important; box-shadow: 0 4px 12px rgba(112,34,131,0.3); }
.c360x-btn.primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.c360x-btn.ghost { background: transparent !important; border-color: #d1d5db !important; color: #4b5563 !important; }
.c360x-btn.ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; background: #f9fafb !important; }
.c360x-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.c360x-list { max-height: 180px; overflow: auto; border: 1px solid #d1d5db; border-radius: 10px; background: #ffffff !important; padding: 8px; }
.c360x-item { display: flex; gap: 10px; padding: 10px 12px; align-items: center; border-bottom: 1px solid #f3f4f6; font-size: 15px; }
.c360x-item:last-child { border: 0; }
.c360x-num { font-weight: 700; font-family: monospace; font-size: 16px; color: #111827 !important; }

/* تنسيق الـ Checkbox */
.c360x-checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #702283;
    margin-right: 5px;
    border-radius: 4px;
    vertical-align: middle;
}

/* تنسيق القائمة المنسدلة للنوع */
.c360x-type-select {
    font-size: 12px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 8px;
    background: rgba(112,34,131,.1);
    color: #702283;
    border: 1px solid transparent;
    cursor: pointer;
    outline: none;
    margin-left: 5px;
    font-family: inherit;
}
.c360x-type-select:hover {
    border-color: #702283;
}
.c360x-type-select option {
    color: #333;
    background: #fff;
}

/* جدول النتائج */
#c360x-results { display: none; margin-top: 20px; border: 1px solid #d1d5db; border-radius: 12px; overflow: hidden; background: white !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
#c360x-results table { width: 100%; border-collapse: collapse; font-size: 15px; }
#c360x-results th, #c360x-results td { padding: 16px 14px; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
#c360x-results th { background: #f9fafb !important; font-weight: 700; color: #4b5563 !important; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
#c360x-results tbody tr { transition: 0.15s; }
#c360x-results tbody tr:hover { background: #f3f4f6 !important; }
#c360x-results td { color: #333 !important; }
#c360x-results .status-error { color: #d9534f !important; font-weight: bold; }
#c360x-results .status-ok { color: #28a745 !important; font-weight: bold; }
    `;

    try {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            var style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    } catch(e) {
        console.error("CSS Injection Error:", e);
    }

    // ==========================================
    // 2. كود الجافاسكريبت الأصلي الخاص بك
    // ==========================================
    if (window.__C360X__) { return; }
    var X = window.__C360X__ = { version: "32.6.5" };

    var state = { items: [], type: "FBB" };
    var isFetching = false;

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
    function digits(v) { return String(v || "").replace(/[^0-9]+/g, ""); }

    var ui = {};

    // دالة بحث عادية
    function findValue(obj, keyToFind) {
        if (!obj || typeof obj !== 'object') return null;
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var normK = k.toLowerCase().replace(/[^a-z0-9]/g, '');
            var normTarget = keyToFind.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normK === normTarget && obj[k] !== null && obj[k] !== undefined && obj[k] !== "") return obj[k];
            var res = findValue(obj[k], keyToFind);
            if (res) return res;
        }
        return null;
    }

    // دالة سكانر مخصوصة للـ Card Type بتدور على أي مفتاح فيه card/board + type/name/model
    function findCardType(obj) {
        var result = null;
        function traverse(o) {
            if (!o || typeof o !== 'object' || result) return;
            for (var k in o) {
                var key = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                // لو المفتاح فيه card أو board أو module وكمان فيه type أو name أو model
                if ((key.includes('card') || key.includes('board') || key.includes('module')) &&
                    (key.includes('type') || key.includes('name') || key.includes('model'))) {
                    var val = o[k];
                    // لازم تكون قيمة نصية ومش فاضية ومش 0 أو N/A
                    if (typeof val === 'string' && val.trim() !== '' && val.trim() !== 'N/A' && val.trim() !== '0') {
                        result = val.trim();
                        return;
                    }
                }
                traverse(o[k]);
            }
        }
        traverse(obj);
        return result;
    }

    function note(msg, kind) {
        if (!ui.note) return;
        ui.note.hidden = false;
        ui.note.style.color = kind === "warn" ? "#d9534f" : "#702283";
        ui.note.textContent = msg;
        clearTimeout(note.timer);
        note.timer = setTimeout(function () { ui.note.hidden = true; }, 8000);
    }

    function loadState() {
        try {
            var saved = localStorage.getItem("c360x.items");
            if (saved) state.items = JSON.parse(saved).filter(function(i) { return i && i.n; });
        } catch(e) {}
    }
    function persist() { try { localStorage.setItem("c360x.items", JSON.stringify(state.items)); } catch(e) {} }

    function addNumbers(raw, type) {
        var added = 0;
        String(raw).split(/[^0-9]+/).forEach(function (p) {
            var v = digits(p);
            if (v.length < 4 || v.length > 15) return;
            if (state.items.some(function (i) { return i.n === v; })) return;
            state.items.push({ n: v, t: type, selected: false });
            added++;
        });
        if (added) { persist(); render(); }
        return added;
    }

    function openSingleTab(number, type) {
        var url = location.href.split("#")[0] + "#c360=" + encodeURIComponent(number) + "&t=" + encodeURIComponent(type);
        window.open(url, "_blank");
    }

    function fetchWithTimeout(url, options, timeout) {
        return Promise.race([
            fetch(url, options),
            new Promise(function(resolve, reject) {
                setTimeout(function() { reject(new Error("Timeout")); }, timeout || 5000);
            })
        ]);
    }

    function render() {
        if (!ui.list) return;
        ui.list.innerHTML = "";
        state.items.forEach(function (item, index) {
            var row = document.createElement("div");
            row.className = "c360x-item";
            
            var chk = document.createElement("input");
            chk.type = "checkbox";
            chk.className = "c360x-checkbox";
            chk.checked = item.selected || false;
            chk.onchange = function() {
                state.items[index].selected = this.checked;
                persist();
            };
            row.appendChild(chk);

            var numSpan = document.createElement("span");
            numSpan.className = "c360x-num";
            numSpan.textContent = item.n;
            row.appendChild(numSpan);

            var typeSelect = document.createElement("select");
            typeSelect.className = "c360x-type-select";
            ["FBB", "VOICE", "MOB"].forEach(function(t) {
                var opt = document.createElement("option");
                opt.value = t;
                opt.textContent = t;
                if (item.t === t) opt.selected = true;
                typeSelect.appendChild(opt);
            });
            typeSelect.onchange = function() {
                state.items[index].t = this.value;
                persist();
            };
            row.appendChild(typeSelect);

            var spacer = document.createElement("span");
            spacer.style.flex = "1";
            row.appendChild(spacer);

            var btnFast = document.createElement("button");
            btnFast.className = "c360x-btn ghost";
            btnFast.style.height = "30px";
            btnFast.style.color = "#28a745";
            btnFast.style.borderColor = "#c3e6cb";
            btnFast.style.background = "#d4edda";
            btnFast.style.marginRight = "6px";
            btnFast.style.fontWeight = "bold";
            btnFast.textContent = "⚡ Fast";
            btnFast.onclick = function() { fetchAndOpen(item.n, item.t, 'fast', this); };
            row.appendChild(btnFast);

            var btnNormal = document.createElement("button");
            btnNormal.className = "c360x-btn ghost";
            btnNormal.style.height = "30px";
            btnNormal.style.color = "#0056b3";
            btnNormal.style.borderColor = "#cce5ff";
            btnNormal.style.background = "#e6f2ff";
            btnNormal.style.marginRight = "6px";
            btnNormal.style.fontWeight = "bold";
            btnNormal.textContent = "⚙️ Normal";
            btnNormal.onclick = function() { fetchAndOpen(item.n, item.t, 'normal', this); };
            row.appendChild(btnNormal);

            var btnDel = document.createElement("button");
            btnDel.className = "c360x-btn ghost";
            btnDel.style.height = "30px";
            btnDel.style.color = "#d9534f";
            btnDel.style.borderColor = "#f5c6cb";
            btnDel.textContent = "Remove";
            btnDel.onclick = function () { state.items.splice(index, 1); persist(); render(); };
            row.appendChild(btnDel);

            ui.list.appendChild(row);
        });
        ui.pill.textContent = state.items.length;
    }

    /* ------------------------------------------------------------------
       API Fetch Logic
    ------------------------------------------------------------------ */
    function getBase64(img) { return img.startsWith("data:") ? img : "data:image/png;base64," + img; }

    function findGapX(bgSrc, sliderSrc) {
        return new Promise(function (resolve) {
            var bg = new Image(), sl = new Image(), loaded = 0;
            function onLoad() {
                if (++loaded < 2) return;
                try {
                    var BG_W = 340, BG_H = 211, SL_W = 68, SL_H = 212;
                    var c1 = document.createElement("canvas"), c2 = document.createElement("canvas");
                    c1.width = BG_W; c1.height = BG_H; c2.width = SL_W; c2.height = SL_H;
                    var cx1 = c1.getContext("2d"), cx2 = c2.getContext("2d");
                    cx1.drawImage(bg, 0, 0, BG_W, BG_H); cx2.drawImage(sl, 0, 0, SL_W, SL_H);
                    var d1 = cx1.getImageData(0, 0, BG_W, BG_H).data, d2 = cx2.getImageData(0, 0, SL_W, SL_H).data;
                    var minDiff = Infinity, bestX = -1;
                    for (var x = 0; x <= 272; x++) {
                        var diff = 0, cnt = 0;
                        for (var y = 20; y < SL_H - 20; y += 2) {
                            for (var sx = 10; sx < SL_W - 10; sx += 2) {
                                var i2 = (y * SL_W + sx) * 4;
                                if (d2[i2 + 3] < 128) continue;
                                var i1 = (y * BG_W + (x + sx)) * 4;
                                diff += Math.pow(d2[i2] - d1[i1], 2) + Math.pow(d2[i2+1] - d1[i1+1], 2) + Math.pow(d2[i2+2] - d1[i1+2], 2);
                                cnt++;
                            }
                        }
                        if (cnt > 50 && diff < minDiff) { minDiff = diff; bestX = x; }
                    }
                    resolve(bestX);
                } catch(e) { resolve(-1); }
            }
            bg.onload = onLoad; sl.onload = onLoad;
            bg.onerror = sl.onerror = function(){ resolve(-1); };
            bg.src = getBase64(bgSrc); sl.src = getBase64(sliderSrc);
        });
    }

    function genTracks(x) {
        var t = [], cur = 0, time = 0;
        time = Math.floor(Math.random()*100) + 50; 
        t.push({x:0, y:0, t:time});
        while (cur < x) {
            cur += Math.min(x - cur, Math.floor(Math.random()*3) + 1);
            time += Math.floor(Math.random()*10) + 5;
            t.push({ x: cur, y: Math.floor(Math.random()*3)-1, t: time });
        }
        var overshoot = Math.floor(Math.random() * 5) + 2;
        var maxOver = Math.min(x + overshoot, 272);
        while (cur < maxOver) { cur += 1; time += 10; t.push({ x: cur, y: 1, t: time }); }
        while (cur > x) { cur -= 1; time += 15; t.push({ x: cur, y: 0, t: time }); }
        time += 50; t.push({ x: x, y: 0, t: time });
        return t;
    }

    async function fetchMainData(number, type, onRetry) {
        var maxRetries = 5; 
        for (var attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                var genRes = await fetchWithTimeout("https://customer360.te.eg/api/captcha/gen", { credentials: "include" }, 4000);
                var genData = await genRes.json();
                if (!genData.Id) throw new Error("No Captcha ID");

                var targetX = await findGapX(genData.BackgroundImage, genData.SliderImage);
                if (targetX === -1) throw new Error("Could not solve image");
                targetX = Math.min(targetX, 272);

                var tracks = genTracks(targetX);
                var end = new Date();
                var start = new Date(end.getTime() - tracks[tracks.length-1].t);

                var payload = {
                    backgroundImageWidth: 340, backgroundImageHeight: 211,
                    sliderImageWidth: 68, sliderImageHeight: 212,
                    startTime: start.toISOString(), endTime: end.toISOString(),
                    tracks: tracks, SearchValue: number, SearchType: type
                };

                var searchRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/Search?id=${genData.Id}`, {
                    method: "POST", credentials: "include",
                    headers: { "Content-Type": "application/json;charset=UTF-8" },
                    body: JSON.stringify(payload)
                }, 6000);
                var data = await searchRes.json();
                
                if (data.Code === 200 || data.AuthCode === 200) return data;
                throw new Error(data.Message || "Server rejected tracks");
                
            } catch (e) {
                if (attempt === maxRetries) return { error: e.message };
                if (onRetry) onRetry(attempt, e.message);
                await new Promise(r => setTimeout(r, 1200)); 
            }
        }
    }

    async function fetchExtras(number, type, transId, sa, mainData) {
        var res = { 
            outages: "Up", outageId: null, tts: "No", ttsId: "", ttsGroup: "", ttsProblem: "", ttsStatus: "",
            usage: "N/A", attainable: "N/A", operational: "N/A", portStatus: "N/A", serialNo: null, financialStatus: null,
            adminStatus: "N/A", opStatus: "N/A", cabinCode: "N/A", popType: "N/A", cardType: "N/A", portNo: "N/A", frame: "N/A"
        };
        var accountNumber = sa.ACCOUNT_NO || "";

        var pOutage = (async function() {
            try {
                var oRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/outage/${number}/${type}/NewGetCurrentOutage?transactionID=${transId}`, { credentials: "include" }, 5000);
                var oData = await oRes.json();
                if (Array.isArray(oData) && oData.length > 0) {
                    res.outages = "Down";
                    res.outageId = findValue(oData[0], "OutageId") || findValue(oData[0], "Id") || findValue(oData[0], "IncidentId") || findValue(oData[0], "OutageID") || "N/A";
                } else {
                    res.outages = "Up";
                }
            } catch (e) {}
        })();

        var pTTS = (async function() {
            try {
                var tRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/${number}/${type}/GetLastTicket?transactionID=${transId}`, { credentials: "include" }, 5000);
                var tData = await tRes.json();
                res.tts = (tData && tData.IsHaveTicketing === "Yes") ? "Yes" : "No";
                
                if (res.tts === "Yes") {
                    res.ttsId = findValue(tData, "TicketId") || findValue(tData, "TicketNumber") || findValue(tData, "Id") || "N/A";
                    res.ttsGroup = findValue(tData, "SupporterGroup") || findValue(tData, "Group") || findValue(tData, "SupportGroup") || "N/A";
                    res.ttsProblem = findValue(tData, "Problem") || findValue(tData, "ProblemType") || findValue(tData, "Issue") || "N/A";
                    res.ttsStatus = findValue(tData, "Status") || findValue(tData, "TicketStatus") || "N/A";
                }
            } catch (e) {}
        })();

        var pUsage = (async function() {
            try {
                var uRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/${number}/${type}/GetUsage?transactionID=${transId}`, { credentials: "include" }, 5000);
                var uData = await uRes.json();
                
                if (uData && uData.UnitsUnUsedAmount !== undefined) {
                    res.usage = `${uData.UnitsUnUsedAmount} / ${uData.UnitsInitialNumber} GB`;
                    return; 
                }

                var subRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/${number}/${type}/GetSubscriberUsageResult?transactionID=${transId}`, { credentials: "include" }, 5000);
                if (subRes.ok) {
                    var subData = await subRes.json();
                    var rem = findValue(subData, "Remaining") || findValue(subData, "RemainingQuota");
                    var tot = findValue(subData, "Total") || findValue(subData, "TotalQuota");
                    var cons = findValue(subData, "Consumed") || findValue(subData, "Used");
                    if (tot) {
                        if (cons) res.usage = `${cons} / ${tot} GB`;
                        else if (rem) res.usage = `${(parseFloat(tot)-parseFloat(rem)).toFixed(2)} / ${tot} GB`;
                    }
                }
            } catch (e) {}
        })();

        var pResources = (async function() {
            if (!accountNumber) return;
            try {
                var rRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/${accountNumber}/GetResourse?transactionID=${transId}`, { credentials: "include" }, 5000);
                var rData = await rRes.json();
                var sn = findValue(rData, "SerialNo") || findValue(rData, "SerialNumber");
                var fs = findValue(rData, "FinancialStatus") || findValue(rData, "Financial_Status");
                if (sn) res.serialNo = sn;
                if (fs) res.financialStatus = fs;
            } catch (e) {}
        })();

        var pPorts = (async function() {
            if (!accountNumber) return;
            try {
                var pData = {}, popData = {};
                if (sa.MSAN_IP && sa.SHELF && sa.DATA_SLOT && sa.DATA_PORT) {
                    var popUrl = `https://customer360.te.eg/api/Customers/ServiceAcativation/XDSL/${accountNumber}/${number}/${sa.MSAN_IP}/${sa.SHELF}/${sa.DATA_SLOT}/${sa.DATA_PORT}/${sa.MSAN_VENDORID || 3}/RetrievePOPUPInfo?transactionID=${transId}`;
                    var popRes = await fetchWithTimeout(popUrl, { credentials: "include" }, 5000);
                    popData = await popRes.json();
                }
                
                var pRes = await fetchWithTimeout(`https://customer360.te.eg/api/Customers/ServiceAcativation/${accountNumber}/${number}/GetAnotherPortDetails?transactionID=${transId}`, { credentials: "include" }, 5000);
                pData = await pRes.json();

                // لو الـ pData راجع Array، بندور على البورت بتاعنا
                var targetPortData = pData;
                if (Array.isArray(pData) && sa.DATA_PORT) {
                    var matched = pData.find(function(x) {
                        return String(x.PORT_NO || x.PortNo || x.PORT || x.portNo) === String(sa.DATA_PORT);
                    });
                    if (matched) targetPortData = matched;
                }
                
                // ديباج: بنطبع الداتا في الكونسول عشان لو لسه مظهرش نعرف السبب
                console.log("Port Details Data for Debugging:", { popData: popData, pData: pData, targetPortData: targetPortData, sa: sa });

                var att = findValue(popData, "AttainableSpeed") || findValue(targetPortData, "AttainableSpeed") || sa.ATTAINABLE_SPEED;
                var op = findValue(popData, "OperationalSpeed") || findValue(targetPortData, "OperationalSpeed") || sa.OPERATIONAL_SPEED;
                var admin = findValue(popData, "PortAdminStatus") || findValue(targetPortData, "PortAdminStatus") || sa.ADMIN_STATUS;
                var opStat = findValue(popData, "PortOperationalStatus") || findValue(targetPortData, "PortOperationalStatus") || sa.OPERATIONAL_STATUS;
                
                if (att) res.attainable = att;
                if (op) res.operational = op;
                if (admin) res.adminStatus = admin;
                if (opStat) res.opStatus = opStat;

                if (admin && opStat) res.portStatus = admin + " / " + opStat;
                else if (admin) res.portStatus = admin;
                else if (opStat) res.portStatus = opStat;

                res.cabinCode = sa.CABIN_CODE || sa.CabinCode || findValue(popData, "CabinCode") || findValue(targetPortData, "CabinCode") || "N/A";
                res.popType = sa.POP_TYPE || sa.POPType || findValue(popData, "POPType") || findValue(targetPortData, "POPType") || "N/A";
                
                // استخدام الدالة القوية للبحث عن الـ Card Type
                res.cardType = findCardType(sa) || findCardType(mainData) || findCardType(popData) || findCardType(targetPortData) || "N/A";

                res.portNo = sa.PORT_NO || sa.PortNo || sa.DATA_PORT || findValue(popData, "PortNo") || findValue(targetPortData, "PortNo") || "N/A";
                res.frame = sa.FRAME || sa.Frame || findValue(popData, "Frame") || findValue(targetPortData, "Frame") || "N/A";

            } catch (e) {}
        })();

        await Promise.all([pOutage, pTTS, pUsage, pResources, pPorts]);

        return res;
    }

    function openFastProfile(number, type, sa, ivr, extras, targetWin) {
        var win = targetWin || window.open('', '_blank');
        if (!win) return; 
        
        var freeRes = extras.freeRes || "Available";
        var offerStatus = extras.offerStatus || "Active";
        var billing = extras.billing || "Paid";
        var om = extras.om || "No";
        var subStatus = ivr.SubscriberStatus || "N/A";
        var accountNo = sa.ACCOUNT_NO || findValue(sa, "AccountNo") || "N/A";

        var ttsHtml = "";
        if (extras.tts === 'Yes') {
            ttsHtml = `
                <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; width: 100%; margin-top: 5px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="color:#c53030; font-weight:600;">🎫 Ticket ID:</span> <b style="font-family:monospace;">${extras.ttsId || 'N/A'}</b></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="color:#c53030; font-weight:600;">👥 Supporter group:</span> <b>${extras.ttsGroup || 'N/A'}</b></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="color:#c53030; font-weight:600;">⚠️ Problem:</span> <b>${extras.ttsProblem || 'N/A'}</b></div>
                    <div style="display:flex; justify-content:space-between;"><span style="color:#c53030; font-weight:600;">📌 Status:</span> <b>${extras.ttsStatus || 'N/A'}</b></div>
                </div>
            `;
        } else {
            ttsHtml = `<span class="pill pill-success" style="align-self: flex-end;">No</span>`;
        }

        var resourceSectionHtml = "";
        if (extras.serialNo) {
            resourceSectionHtml = `
                <div class="data-row"><span class="data-label">Resources</span><span class="pill pill-success">✔ YES</span></div>
                <div class="data-row"><span class="data-label">Serial No.</span><span class="data-value" style="font-family:monospace; font-size:15px;">${extras.serialNo}</span></div>
                <div class="data-row"><span class="data-label">Financial Status</span><span class="data-value">${extras.financialStatus || 'N/A'}</span></div>
            `;
        } else {
            resourceSectionHtml = `
                <div class="data-row"><span class="data-label">Resources</span><span class="pill pill-danger">✖ NO</span></div>
            `;
        }

        var outageHtml = "";
        if (extras.outages === 'Down') {
            outageHtml = `
                <div style="background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; width: 100%; margin-top: 5px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><span style="color:#c53030; font-weight:600;">📉 Status:</span> <b style="color:#c53030;">Down</b></div>
                    <div style="display:flex; justify-content:space-between;"><span style="color:#c53030; font-weight:600;">🚨 Outage ID:</span> <b style="font-family:monospace;">${extras.outageId || 'N/A'}</b></div>
                </div>
            `;
        } else {
            outageHtml = `<span class="pill pill-success" style="align-self: flex-end;">Up</span>`;
        }

        var portDetailsHtml = `
            <div class="data-row"><span class="data-label">Shelf / Slot / Port</span><span class="data-value">${sa.SHELF || 'N/A'} / ${sa.DATA_SLOT || 'N/A'} / ${sa.DATA_PORT || 'N/A'}</span></div>
            <div class="data-row"><span class="data-label">Admin Status</span><span class="data-value">${extras.adminStatus}</span></div>
            <div class="data-row"><span class="data-label">Operational Status</span><span class="data-value">${extras.opStatus}</span></div>
            <div class="data-row"><span class="data-label">Attainable Speed</span><span class="data-value">${extras.attainable}</span></div>
            <div class="data-row"><span class="data-label">Operational Speed</span><span class="data-value">${extras.operational}</span></div>
            <div class="data-row"><span class="data-label">Cabin Code</span><span class="data-value">${extras.cabinCode}</span></div>
            <div class="data-row"><span class="data-label">POP type</span><span class="data-value">${extras.popType}</span></div>
            <div class="data-row"><span class="data-label">Card type</span><span class="data-value">${extras.cardType}</span></div>
            <div class="data-row"><span class="data-label">Port No</span><span class="data-value">${extras.portNo}</span></div>
            <div class="data-row"><span class="data-label">Frame</span><span class="data-value">${extras.frame}</span></div>
        `;

        win.document.open(); 
        win.document.write(`
            <!DOCTYPE html>
            <html dir="ltr">
            <head>
                <meta charset="UTF-8">
                <title>Profile - ${number}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
                <style>
                    :root { --primary: #6a1b9a; --primary-light: #9c27b0; --success: #10b981; --danger: #ef4444; --bg: #f8fafc; --card-bg: #ffffff; --text: #1e293b; --text-muted: #64748b; }
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: 'Inter', sans-serif; background-color: var(--bg); color: var(--text); padding: 40px 20px; }
                    .container { max-width: 1200px; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); border-radius: 16px; padding: 30px 40px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px rgba(106, 27, 154, 0.2); margin-bottom: 30px; position: relative; overflow: hidden; }
                    .header::before { content: ''; position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; }
                    .header-info h1 { font-size: 32px; font-weight: 800; margin-bottom: 5px; letter-spacing: -0.5px; }
                    .header-info p { font-size: 15px; color: rgba(255,255,255,0.9); font-weight: 400; display: flex; gap: 15px; }
                    .status-badge { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 10px 25px; border-radius: 30px; font-weight: 700; font-size: 16px; display: inline-flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.3); }
                    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 24px; }
                    .card { background: var(--card-bg); border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; transition: transform 0.2s ease; }
                    .card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                    .card-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #f1f5f9; display: flex; align-items: center; gap: 10px; }
                    .card-title span { font-size: 22px; }
                    .data-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14.5px; }
                    .data-row:last-child { border-bottom: none; padding-bottom: 0; }
                    .data-label { color: var(--text-muted); font-weight: 500; }
                    .data-value { font-weight: 700; color: var(--text); text-align: right; }
                    .pill { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.3px; text-transform: uppercase; display: inline-block; }
                    .pill-success { background: #d1fae5; color: var(--success); }
                    .pill-danger { background: #fee2e2; color: var(--danger); }
                    .full-width { grid-column: 1 / -1; }
                    .agent-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; }
                    .agent-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
                    .agent-item span { font-size: 13px; color: var(--text-muted); font-weight: 600; }
                    .agent-item .icon { font-size: 24px; margin-bottom: 5px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="header-info">
                            <h1>${number}</h1>
                            <p><span>📦 ${sa.PACKAGE_NAME || 'N/A'}</span> <span>🆔 Account: ${accountNo}</span></p>
                        </div>
                        <div class="status-badge">${subStatus === 'Active' ? '🟢' : '🔴'} ${subStatus}</div>
                    </div>
                    
                    <div class="grid">
                        <div class="card">
                            <div class="card-title"><span>ℹ️</span> Basic Information</div>
                            <div class="data-row"><span class="data-label">Account No.</span><span class="data-value" style="color:var(--primary);">${accountNo}</span></div>
                            <div class="data-row"><span class="data-label">Service Type</span><span class="data-value">${type}</span></div>
                            <div class="data-row"><span class="data-label">Usage</span><span class="data-value">${extras.usage}</span></div>
                            <div class="data-row"><span class="data-label">Contracted Speed</span><span class="data-value">${sa.ContractedSpeed || 'N/A'}</span></div>
                            <div class="data-row"><span class="data-label">Port Status</span><span class="pill ${extras.portStatus.includes('UP') || extras.portStatus.includes('Enabled') ? 'pill-success' : 'pill-danger'}">${extras.portStatus}</span></div>
                        </div>

                        <div class="card">
                            <div class="card-title"><span>🖥️</span> Resources & Tickets</div>
                            ${resourceSectionHtml}
                            <div class="data-row" style="align-items: flex-start; flex-direction: column;">
                                <span class="data-label" style="margin-bottom: 10px;">TTS Ticket</span>
                                ${ttsHtml}
                            </div>
                            <div class="data-row" style="align-items: flex-start; flex-direction: column;">
                                <span class="data-label" style="margin-bottom: 10px;">Outage</span>
                                ${outageHtml}
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-title"><span>🔌</span> Port Details</div>
                            ${portDetailsHtml}
                        </div>
                    </div>

                    <div class="card full-width">
                        <div class="card-title"><span>🎧</span> Agent Assistant</div>
                        <div class="agent-grid">
                            <div class="agent-item"><span class="icon">⏳</span><span>Free resources</span> <b class="pill ${freeRes === 'Available' ? 'pill-success' : 'pill-danger'}">${freeRes}</b></div>
                            <div class="agent-item"><span class="icon">👤</span><span>Subscriber status</span> <b class="pill ${subStatus === 'Active' ? 'pill-success' : 'pill-danger'}">${subStatus}</b></div>
                            <div class="agent-item"><span class="icon">🎁</span><span>Offer status</span> <b class="pill ${offerStatus === 'Active' ? 'pill-success' : 'pill-danger'}">${offerStatus}</b></div>
                            <div class="agent-item"><span class="icon">🧾</span><span>TE billing</span> <b class="pill ${billing === 'Paid' ? 'pill-success' : 'pill-danger'}">${billing}</b></div>
                            <div class="agent-item"><span class="icon">🌐</span><span>OM</span> <b class="pill ${om === 'No' ? 'pill-success' : 'pill-danger'}">${om}</b></div>
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 40px; color: var(--text-muted); font-size: 13px; font-weight: 600; opacity: 0.8;">
                        Developed By Anas Wael @2026
                    </div>
                </div>
            </body>
            </html>
        `);
        win.document.close();
    }

    async function fetchAndOpen(number, type, mode, btnElement) {
        if (mode === 'normal') {
            openSingleTab(number, type);
            return;
        }

        var originalText = btnElement.textContent;
        btnElement.disabled = true;
        btnElement.textContent = "⏳";
        note("Loading " + number + "...");

        var data = await fetchMainData(number, type, function(attempt, err) {
            note("Attempt " + attempt + " failed for " + number + ". Retrying...", "warn");
        });

        if (data.error) {
            alert("Error fetching " + number + " after 5 attempts: " + data.error);
            btnElement.disabled = false;
            btnElement.textContent = originalText;
            return;
        }
        var sa = data.ServiceActivation || {};
        var ivr = data.IVR || {};
        var transId = data.TransactionNumber;

        var extras = await fetchExtras(number, type, transId, sa, data);
        var freeRes = findValue(data, "FreeResources") || "Available";
        var offerStatus = findValue(data, "OfferStatus") || "Active";
        var billing = findValue(data, "TE_Billing") || findValue(data, "BillingStatus") || "Paid";
        var om = findValue(data, "OM_Ticket") || "No";
        
        extras.freeRes = freeRes; extras.offerStatus = offerStatus; extras.billing = billing; extras.om = om;

        openFastProfile(number, type, sa, ivr, extras);
        
        btnElement.disabled = false;
        btnElement.textContent = originalText;
        note("");
    }

    /* ------------------------------------------------------------------
       UI Injection
    ------------------------------------------------------------------ */
    function injectUI() {
        if (document.getElementById("c360x-trigger")) return true;
        var adv = document.querySelector('.advanced-search[data-bs-target="#advanced-search"]');
        if (!adv) return false;

        var btn = document.createElement("button");
        btn.className = "c360x-trigger"; 
        btn.id = "c360x-trigger";
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M4 5.5h10M4 12h16M4 18.5h7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><circle cx="18.5" cy="5.5" r="2.6" stroke="currentColor" stroke-width="1.9"/><circle cx="14.5" cy="18.5" r="2.6" stroke="currentColor" stroke-width="1.9"/></svg><span class="c360x-label">Multi Search</span><span class="c360x-pill" id="c360x-pill">0</span>`;
        adv.parentNode.insertBefore(btn, adv.nextSibling);

        var modal = document.createElement("div");
        modal.id = "c360x-modal";
        modal.innerHTML = `
            <div class="c360x-backdrop" data-close="1"></div>
            <div class="c360x-panel" style="width: 98vw; max-width: 1800px; display: flex; flex-direction: column;">
                <div class="c360x-head">
                    <div><h3>Multi Search</h3><p>Fast Data Fetching & Full Details.</p></div>
                    <button class="c360x-x" data-close="1">&times;</button>
                </div>
                <div class="c360x-body" style="flex: 1; overflow-y: auto;">
                    
                    <div style="background: #f4eef7; padding: 15px; border-radius: 8px; display: flex; gap: 10px; margin-bottom: 20px; align-items: center;">
                        <span style="font-weight:bold; color:#702283;">⚡ Quick Search:</span>
                        <input type="text" id="c360x-quick-input" placeholder="Enter number..." style="flex:1; padding: 10px; border: 1px solid #702283; border-radius: 4px; font-size: 14px; outline:none;">
                        <select id="c360x-quick-type" style="padding: 10px; border: 1px solid #702283; border-radius: 4px;">
                            <option value="FBB">FBB</option>
                            <option value="VOICE">Voice</option>
                            <option value="MOB">Mobile</option>
                        </select>
                        <button class="c360x-btn primary" id="c360x-quick-btn" style="background:#702283; padding: 0 20px; height: 40px;">Instant Fetch 🚀</button>
                    </div>

                    <label class="c360x-label">Bulk Numbers:</label>
                    <textarea id="c360x-input" placeholder="01012345678&#10;01123456789"></textarea>
                    
                    <div class="c360x-row" style="justify-content: space-between;">
                        <div class="c360x-types" id="c360x-types">
                            <button data-type="FBB" class="active">FBB</button>
                            <button data-type="VOICE">Voice</button>
                            <button data-type="MOB">Mobile</button>
                        </div>
                        <div class="c360x-actions" style="display:flex; gap:10px;">
                            <button class="c360x-btn primary" id="c360x-add">Add to list</button>
                            <button class="c360x-btn ghost" id="c360x-clear">Clear List</button>
                        </div>
                    </div>
                    
                    <div class="c360x-list-head" style="display:flex; justify-content: space-between; align-items:center; margin-top:15px;">
                        <span style="font-weight:bold; color:#555;">List (<span id="c360x-count">0</span>)</span>
                        <div style="display:flex; gap:8px;">
                            <button class="c360x-btn ghost" id="c360x-selectall" style="height:26px; font-size:12px; padding:0 10px;">Select All</button>
                            <button class="c360x-btn ghost" id="c360x-deselectall" style="height:26px; font-size:12px; padding:0 10px;">Deselect All</button>
                        </div>
                    </div>
                    
                    <div class="c360x-list" id="c360x-list" style="margin-top:8px;"></div>
                    
                    <div class="c360x-row" style="margin-top:20px; border-top:1px solid #e5e7eb; padding-top:20px; display:flex; gap:10px;">
                        <button class="c360x-btn primary" id="c360x-fetch-all" style="flex:1; height:50px; font-size:16px;">Fetch All 🚀</button>
                        <button class="c360x-btn primary" id="c360x-fetch-selected" style="flex:1; height:50px; font-size:16px; background:#702283;">Fetch Selected 🚀</button>
                        <button class="c360x-btn ghost" id="c360x-openselected" style="flex:1; height:50px; font-size:16px; border-color:#0056b3; color:#0056b3;">Open Selected ⚡</button>
                        <button class="c360x-btn ghost" id="c360x-clear-results" style="flex:0.5; height:50px; font-size:16px; border-color:#d9534f; color:#d9534f;">Clear Results 🗑️</button>
                    </div>

                    <div id="c360x-results" style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 1300px;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Number</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Account No</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Plan</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd; background: #f4eef7;">Agent Assistant</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Port Status</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Usage (GB)</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Resources</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Attainable</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Operational</th>
                                    <th style="padding: 10px; border-bottom: 2px solid #ddd;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="c360x-results-body"></tbody>
                        </table>
                    </div>
                    <div id="c360x-note" hidden style="margin-top:10px; font-weight:bold; text-align:center; font-size:15px;"></div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea; font-size: 13px; color: #888; font-weight: 600;">
                        Developed By Anas Wael @2026
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        ui = {
            modal: modal, input: $("#c360x-input", modal), list: $("#c360x-list", modal),
            pill: $("#c360x-pill"), note: $("#c360x-note", modal), results: $("#c360x-results", modal),
            resultsBody: $("#c360x-results-body", modal),
            quickInput: $("#c360x-quick-input", modal), quickType: $("#c360x-quick-type", modal)
        };

        btn.onclick = function () { modal.classList.add("on"); document.body.classList.add("c360x-lock"); render(); };
        $$("[data-close]", modal).forEach(function (el) { el.onclick = function () { modal.classList.remove("on"); document.body.classList.remove("c360x-lock"); }; });
        
        $$("#c360x-types button").forEach(function (b) {
            b.onclick = function () {
                $$("#c360x-types button").forEach(function (x) { x.classList.remove("active"); });
                b.classList.add("active"); state.type = b.getAttribute("data-type");
            };
        });

        $("#c360x-add").onclick = function () {
            var a = addNumbers(ui.input.value, state.type);
            if (a) { ui.input.value = ""; note("Added " + a + " numbers"); }
        };
        $("#c360x-clear").onclick = function () { state.items = []; persist(); render(); };

        $("#c360x-selectall").onclick = function () { state.items.forEach(function(i) { i.selected = true; }); persist(); render(); };
        $("#c360x-deselectall").onclick = function () { state.items.forEach(function(i) { i.selected = false; }); persist(); render(); };

        $("#c360x-clear-results").onclick = function() {
            ui.resultsBody.innerHTML = "";
            ui.results.style.display = "none";
            note("Results cleared.");
        };

        $("#c360x-quick-btn").onclick = async function() {
            var num = digits(ui.quickInput.value);
            var type = ui.quickType.value;
            if (!num) return alert("Please enter a number");
            
            var btn = this;
            btn.disabled = true; btn.textContent = "Loading...";
            note("Loading " + num + "...");

            var data = await fetchMainData(num, type, function(attempt, err) {
                note("Attempt " + attempt + " failed for " + num + ". Retrying...", "warn");
            });

            if (data.error) {
                note("Error: " + data.error, "warn");
                btn.disabled = false; btn.textContent = "Instant Fetch 🚀";
                return;
            }
            var sa = data.ServiceActivation || {};
            var ivr = data.IVR || {};
            var transId = data.TransactionNumber;

            var extras = await fetchExtras(num, type, transId, sa, data);
            var freeRes = findValue(data, "FreeResources") || "Available";
            var offerStatus = findValue(data, "OfferStatus") || "Active";
            var billing = findValue(data, "TE_Billing") || findValue(data, "BillingStatus") || "Paid";
            var om = findValue(data, "OM_Ticket") || "No";
            
            extras.freeRes = freeRes; extras.offerStatus = offerStatus; extras.billing = billing; extras.om = om;

            openFastProfile(num, type, sa, ivr, extras);
            
            btn.disabled = false; btn.textContent = "Instant Fetch 🚀";
            ui.quickInput.value = "";
            note("Done! Profile opened in new tab.");
        };

        $("#c360x-openselected").onclick = async function() {
            var selected = state.items.filter(function(i) { return i.selected; });
            if (!selected.length) return alert("Please select at least one number first.");

            var btn = this;
            btn.disabled = true; btn.textContent = "Opening...";
            var originalText = "Open Selected ⚡";
            
            for (var i = 0; i < selected.length; i++) {
                var item = selected[i];
                
                var win = window.open('', '_blank');
                if (!win) {
                    alert("Popup Blocked! Please allow popups for this site to open multiple tabs.");
                    break;
                }
                
                win.document.open();
                win.document.write(`
                    <!DOCTYPE html>
                    <html dir="ltr">
                    <head>
                        <meta charset="UTF-8">
                        <title>Loading...</title>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                        <style>
                            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background-color: #f8fafc; font-family: 'Inter', sans-serif; flex-direction: column; }
                            .spinner { width: 60px; height: 60px; border: 5px solid #e2e8f0; border-top: 5px solid #6a1b9a; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto; }
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                            h2 { color: #6a1b9a; margin: 0 0 10px 0; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                            .num-badge { color: #0056b3; font-family: monospace; font-size: 24px; background: #e6f2ff; padding: 4px 12px; border-radius: 8px; border: 1px solid #cce5ff; }
                            p { color: #f59e0b; font-weight: 600; margin: 0; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="spinner"></div>
                        <h2>Loading... <span class="num-badge">${item.n}</span></h2>
                        <p id="status">Attempt 1...</p>
                    </body>
                    </html>
                `);
                win.document.close();
                
                var data = await fetchMainData(item.n, item.t, function(attempt, err) {
                    if (win && !win.closed) {
                        var statusEl = win.document.getElementById('status');
                        if (statusEl) statusEl.innerText = `Attempt ${attempt} failed. Retrying...`;
                    }
                });

                if (data.error) {
                    win.close(); 
                    note("Failed to fetch " + item.n + " after 5 attempts. Tab closed.", "warn");
                    continue; 
                }
                
                var sa = data.ServiceActivation || {};
                var ivr = data.IVR || {};
                var transId = data.TransactionNumber;
                var extras = await fetchExtras(item.n, item.t, transId, sa, data);
                
                var freeRes = findValue(data, "FreeResources") || "Available";
                var offerStatus = findValue(data, "OfferStatus") || "Active";
                var billing = findValue(data, "TE_Billing") || findValue(data, "BillingStatus") || "Paid";
                var om = findValue(data, "OM_Ticket") || "No";
                
                extras.freeRes = freeRes; extras.offerStatus = offerStatus; extras.billing = billing; extras.om = om;

                openFastProfile(item.n, item.t, sa, ivr, extras, win);
                
                await new Promise(r => setTimeout(r, 500));
            }
            btn.disabled = false; btn.textContent = originalText;
            note("Done opening profiles! ✅");
        };

        async function executeFetch(itemsToFetch) {
            if (!itemsToFetch.length) return alert("No numbers to fetch!");
            isFetching = true;
            
            ui.results.style.display = "block";
            ui.resultsBody.innerHTML = "";
            
            var btnAll = $("#c360x-fetch-all");
            var btnSel = $("#c360x-fetch-selected");
            
            btnAll.disabled = false; btnSel.disabled = false;
            btnAll.textContent = "⏹️ Stop"; btnAll.style.background = "#d9534f";
            btnSel.textContent = "⏹️ Stop"; btnSel.style.background = "#d9534f";
            
            var stopFetch = function() { isFetching = false; };
            btnAll.onclick = stopFetch; btnSel.onclick = stopFetch;

            for (var i = 0; i < itemsToFetch.length; i++) {
                if (!isFetching) break;

                var item = itemsToFetch[i];
                note("Processing " + item.n + " (" + (i+1) + "/" + itemsToFetch.length + ")...");
                
                var data = await fetchMainData(item.n, item.t, function(attempt, err) {
                    note("Attempt " + attempt + " failed for " + item.n + ". Retrying...", "warn");
                });
                
                var tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid #eee";
                
                if (data.error) {
                    tr.innerHTML = `<td style="padding:10px;"><b>${item.n}</b></td><td colspan="9" class="status-error" style="padding:10px;">Error: ${data.error}</td>`;
                } else {
                    var sa = data.ServiceActivation || {};
                    var ivr = data.IVR || {};
                    var transId = data.TransactionNumber;

                    note("Loading details for " + item.n + "...");
                    var extras = await fetchExtras(item.n, item.t, transId, sa, data);
                    
                    var freeRes = findValue(data, "FreeResources") || "Available";
                    var offerStatus = findValue(data, "OfferStatus") || "Active";
                    var billing = findValue(data, "TE_Billing") || findValue(data, "BillingStatus") || "Paid";
                    var om = findValue(data, "OM_Ticket") || "No";
                    var subStatus = ivr.SubscriberStatus || "N/A";
                    
                    extras.freeRes = freeRes; extras.offerStatus = offerStatus; extras.billing = billing; extras.om = om;

                    var portStatusColor = (extras.portStatus.includes("UP") || extras.portStatus.includes("Enabled")) ? "#28a745" : "#d9534f";
                    var ttsDisplay = extras.tts === 'Yes' ? `Yes (${extras.ttsId})` : 'No';
                    var ttsColor = extras.tts === 'No' ? '#28a745' : '#d9534f';

                    var outageDisplay = extras.outages === 'Down' ? `Down (${extras.outageId})` : 'Up';

                    var resourceHtml = extras.serialNo ? `
                        <span style="color:#28a745; font-weight:bold; font-size:14px;">YES</span><br>
                        <span style="font-size:13px; color:#333; font-family:monospace; font-weight:bold;">${extras.serialNo}</span><br>
                        <span style="font-size:12px; color:#702283; font-weight:bold;">${extras.financialStatus || 'N/A'}</span>
                    ` : `<span style="color:#d9534f; font-weight:bold; font-size:14px;">NO</span>`;

                    var agentAssistantHtml = `
                        <div style="font-size: 12px; display: flex; flex-direction: column; gap: 6px; background: #fdfdfd; padding: 8px; border-radius: 8px; border: 1px solid #eaeaea; width: 190px;">
                            <div style="display:flex; justify-content:space-between;"><span>Free resources:</span> <b style="color:${freeRes === 'Available' ? '#28a745' : '#d9534f'}">${freeRes}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>Subscriber status:</span> <b style="color:${subStatus === 'Active' ? '#28a745' : '#d9534f'}">${subStatus}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>Offer status:</span> <b style="color:${offerStatus === 'Active' ? '#28a745' : '#d9534f'}">${offerStatus}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>Outage:</span> <b style="color:${extras.outages === 'Up' ? '#28a745' : '#d9534f'}">${outageDisplay}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>TE billing:</span> <b style="color:${billing === 'Paid' ? '#28a745' : '#d9534f'}">${billing}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>TTS ticket:</span> <b style="color:${ttsColor}">${ttsDisplay}</b></div>
                            <div style="display:flex; justify-content:space-between;"><span>OM:</span> <b style="color:${om === 'No' ? '#28a745' : '#d9534f'}">${om}</b></div>
                        </div>
                    `;

                    var accountNo = sa.ACCOUNT_NO || findValue(sa, "AccountNo") || "N/A";

                    tr.innerHTML = `
                        <td style="padding:10px;"><b style="font-size:15px; font-family:monospace;">${item.n}</b></td>
                        <td style="padding:10px; font-weight:bold; color:#0056b3; font-size:14px;">${accountNo}</td>
                        <td style="padding:10px;"><div style="font-weight:bold; color:#333; font-size:14px;">${sa.PACKAGE_NAME || "N/A"}</div></td>
                        <td style="padding:10px;">${agentAssistantHtml}</td>
                        <td style="padding:10px; color:${portStatusColor}; font-weight:bold; font-size:13px;">${extras.portStatus}</td>
                        <td style="padding:10px; font-size:14px;">${extras.usage}</td>
                        <td style="padding:10px; font-size:14px;">${resourceHtml}</td>
                        <td style="padding:10px; font-size:14px; font-weight:bold; color:#0056b3;">${extras.attainable}</td>
                        <td style="padding:10px; font-size:14px; font-weight:bold; color:#0056b3;">${extras.operational}</td>
                        <td style="padding:10px;"></td>
                    `;

                    var btnOpenRow = document.createElement("button");
                    btnOpenRow.className = "c360x-btn ghost";
                    btnOpenRow.style.height = "30px";
                    btnOpenRow.style.fontSize = "12px";
                    btnOpenRow.style.color = "#28a745";
                    btnOpenRow.style.borderColor = "#c3e6cb";
                    btnOpenRow.style.background = "#d4edda";
                    btnOpenRow.style.fontWeight = "bold";
                    btnOpenRow.textContent = "Fast View ⚡";
                    btnOpenRow.onclick = function() { openFastProfile(item.n, item.t, sa, ivr, extras); };
                    tr.lastElementChild.appendChild(btnOpenRow);
                }
                ui.resultsBody.appendChild(tr);
                await new Promise(function(r){ setTimeout(r, 200); }); 
            }
            
            isFetching = false;
            note("Process stopped / Done ✅");
            btnAll.textContent = "Fetch All 🚀"; btnAll.style.background = ""; btnAll.onclick = function() { executeFetch(state.items); };
            btnSel.textContent = "Fetch Selected 🚀"; btnSel.style.background = ""; btnSel.onclick = function() { executeFetch(state.items.filter(function(i) { return i.selected; })); };
        }

        $("#c360x-fetch-all").onclick = function() { executeFetch(state.items); };
        $("#c360x-fetch-selected").onclick = function() { executeFetch(state.items.filter(function(i) { return i.selected; })); };

        return true;
    }

    function bootDeepLink() {
        var target = { n: "", t: "" };
        var raw = String(location.hash || "").replace(/^#/, "");
        if (raw) {
            raw.split("&").forEach(function (pair) {
                var eq = pair.indexOf("=");
                var key = eq < 0 ? pair : pair.slice(0, eq);
                var value = eq < 0 ? "" : decodeURIComponent(pair.slice(eq + 1));
                if (key === "c360") target.n = digits(value);
                if (key === "t") target.t = String(value).toUpperCase();
            });
        }
        if (target.n.length < 4) return;
        var attempts = 0;
        var timer = setInterval(function () {
            var input = document.getElementById("txt_customerNumber");
            var icon = document.querySelector('span[ng-click*="Search"]');
            if (input && icon) {
                clearInterval(timer);
                setTimeout(function () {
                    var allT = document.querySelectorAll('.ServiceNumberType');
                    for (var i = 0; i < allT.length; i++) allT[i].classList.remove('active');
                    var active = document.querySelector('.ServiceNumberType[data-Type="' + target.t + '"]');
                    if (active) active.classList.add('active');
                    try {
                        if (window.angular) {
                            var bodyScope = window.angular.element(document.body).scope();
                            if (bodyScope) bodyScope.$apply(function() { bodyScope.Type = target.t; });
                        }
                    } catch (e) {}
                    input.value = target.n;
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    setTimeout(function() { icon.click(); }, 300);
                }, 500);
            } else if (++attempts > 100) { clearInterval(timer); }
        }, 200);
    }

    function boot() {
        var tries = 0;
        var t = setInterval(function () {
            if (injectUI()) { 
                clearInterval(t); loadState(); render(); bootDeepLink(); 
            }
            if (++tries > 100) clearInterval(t);
        }, 300);
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
})();