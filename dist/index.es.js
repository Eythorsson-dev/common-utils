var L = Object.defineProperty;
var V = (e, t, n) => t in e ? L(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var C = (e, t, n) => (V(e, typeof t != "symbol" ? t + "" : t, n), n), k = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
};
var u = (e, t, n) => (k(e, t, "read from private field"), n ? n.call(e) : t.get(e)), a = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, s = (e, t, n, r) => (k(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
function B(e) {
  return e.nextItem ? [e.nextItem, ...B(e.nextItem)] : [];
}
function O(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...O(e.firstChildItem),
    ...B(e.firstChildItem).flatMap((t) => [t, ...O(t)])
  ] : [];
}
function E(e, t, n = !1) {
  var o;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const r = n ? [] : E(e.firstChildItem, t);
  if (((o = r.slice(-1)[0]) == null ? void 0 : o.id) == t.id)
    return [e, ...r];
  if (e.nextItem)
    return [e, ...r, ...E(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...r, ...E(e.parentItem, t, !0)].filter((l) => l.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function P(e, t) {
  return E(e, t);
}
function z(e, t) {
  if (e.firstChildItem && (t == null ? void 0 : t.ignoreChildren) != !0)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function n(r) {
    if (r.nextItem)
      return r.nextItem;
    if (r.parentItem)
      return n(r.parentItem);
  }
  return n(e);
}
function D(e, t) {
  function n(r) {
    if (r.id == t)
      return r;
    let o;
    return r.firstChildItem && (o || (o = n(r.firstChildItem))), r.nextItem && (o || (o = n(r.nextItem))), o;
  }
  return n(e);
}
function S(e) {
  if (!e)
    return [];
  const t = [
    e.getDetails()
  ];
  return e.firstChildItem && t.push(...S(e.firstChildItem)), e.nextItem && t.push(...S(e.nextItem)), t;
}
function F(e) {
  function t(n) {
    return n != null && n.nextItem ? t(n.nextItem) : n != null && n.firstChildItem ? t(n.firstChildItem) : n;
  }
  return t(e == null ? void 0 : e.firstChildItem);
}
function j(e, t, n) {
  var o, l;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = t && D(t, e.id);
  if (r == null || ((o = r.parentItem) == null ? void 0 : o.id) != e.parentId || ((l = r.previousItem) == null ? void 0 : l.id) != e.previousId) {
    if (t && r && t.id == r.id)
      if (r.firstChildItem)
        t = r.firstChildItem;
      else if (r.nextItem)
        t = r.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (r == null && (r = n(e)), r == null || r.remove(), t == null)
      t = r;
    else if (e.previousId) {
      const d = D(t, e.previousId);
      if (!d)
        throw new Error("Failed to render item, previous item is not rendered");
      d.after(r);
    } else if (e.parentId) {
      const d = D(t, e.parentId);
      if (!d)
        throw new Error("Failed to render item, parent item is not rendered");
      d.append(r);
    } else
      t.before(r), t = r;
  }
  return r.update(e.data), t;
}
var x, v, b, c, p, A;
class T {
  constructor(t, n) {
    a(this, x, void 0);
    a(this, v, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    a(this, b, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    a(this, c, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    a(this, p, void 0);
    a(this, A, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    s(this, x, t), s(this, A, this.render(n));
  }
  get id() {
    return u(this, x);
  }
  get parentItem() {
    return u(this, v);
  }
  get firstChildItem() {
    return u(this, b);
  }
  get nextItem() {
    return u(this, c);
  }
  get previousItem() {
    return u(this, p);
  }
  get target() {
    return u(this, A);
  }
  getDetails() {
    var t, n;
    return {
      id: this.id,
      parentId: (t = this.parentItem) == null ? void 0 : t.id,
      previousId: (n = this.previousItem) == null ? void 0 : n.id,
      data: this.data
    };
  }
  remove() {
    var t, n;
    ((n = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : n.id) == this.id && s(this.parentItem, b, u(this, c)), this.previousItem && s(this.previousItem, c, u(this, c)), this.nextItem && s(this.nextItem, p, u(this, p)), s(this, v, void 0), s(this, c, void 0), s(this, p, void 0), u(this, A).remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const n = this.firstChildItem && [this.firstChildItem, ...B(this.firstChildItem)], r = n == null ? void 0 : n.slice(-1)[0];
    s(t, v, this), r ? r.after(t) : (s(this, b, t), this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), s(t, p, this.previousItem), this.previousItem ? s(this.previousItem, c, t) : this.parentItem && s(this.parentItem, b, t), s(t, v, this.parentItem), s(t, c, this), s(this, p, t), this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), s(t, c, this.nextItem), this.nextItem && s(this.nextItem, p, t), s(t, v, this.parentItem), s(t, p, this), s(this, c, t), this.target.after(t.target);
  }
}
x = new WeakMap(), v = new WeakMap(), b = new WeakMap(), c = new WeakMap(), p = new WeakMap(), A = new WeakMap();
function y(e, t, n) {
  const r = e.find((o) => o.parentId == t && o.previousId == n);
  return r ? (e = e.filter((o) => o.id != r.id), 1 + y(e, r.id, void 0) + y(e, t, r.id)) : 0;
}
function H(e) {
  if (e.filter((d) => d.parentId == null && d.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((d) => d.id).some((d, m, i) => i.indexOf(d) != m))
    throw new Error("Found duplicated instances of ids");
  if (e.map((d) => d.previousId + "_" + d.parentId).some((d, m, i) => i.indexOf(d) != m))
    throw new Error("Some of the items have the same previousId");
  if (y(e) != e.length)
    throw new Error("Linked list is not valid");
}
function R(e, t, n) {
  const r = e.find((o) => o.parentId == t && o.previousId == n);
  return r ? (e = e.filter((o) => o.id != r.id), [
    r,
    ...R(e, r.id, void 0),
    ...R(e, t, r.id)
  ]) : [];
}
function _(e) {
  return H(e), R(e, void 0, void 0);
}
const dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: T,
  getChildAndNextSiblingData: S,
  getChildItems: O,
  getItemsBetween: P,
  getLastChild: F,
  getNextItem: z,
  getNextOrChildById: D,
  getNextSiblings: B,
  sortList: _,
  upsertAndReturnRoot: j,
  validateList: H
}, Symbol.toStringTag, { value: "Module" }));
let U;
const Z = new Uint8Array(16);
function q() {
  if (!U && (U = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !U))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return U(Z);
}
const h = [];
for (let e = 0; e < 256; ++e)
  h.push((e + 256).toString(16).slice(1));
function G(e, t = 0) {
  return h[e[t + 0]] + h[e[t + 1]] + h[e[t + 2]] + h[e[t + 3]] + "-" + h[e[t + 4]] + h[e[t + 5]] + "-" + h[e[t + 6]] + h[e[t + 7]] + "-" + h[e[t + 8]] + h[e[t + 9]] + "-" + h[e[t + 10]] + h[e[t + 11]] + h[e[t + 12]] + h[e[t + 13]] + h[e[t + 14]] + h[e[t + 15]];
}
const J = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), M = {
  randomUUID: J
};
function K(e, t, n) {
  if (M.randomUUID && !t && !e)
    return M.randomUUID();
  e = e || {};
  const r = e.random || (e.rng || q)();
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, G(r);
}
function N() {
  return K();
}
var I;
class ut {
  constructor() {
    a(this, I, {});
  }
  On(t, n) {
    let r = N();
    return u(this, I)[t] = (u(this, I)[t] ?? []).concat({ Id: r, Execute: n }), r;
  }
  Once(t, n) {
    var r = N();
    return u(this, I)[t] = (u(this, I)[t] ?? []).concat({
      Id: r,
      Execute: (o) => {
        this.Off(t, r), n(o);
      }
    }), r;
  }
  Off(t, n) {
    var o;
    const r = (o = u(this, I)[t]) == null ? void 0 : o.findIndex((l) => l.Id == n);
    r >= 0 && u(this, I)[t].splice(r, 1);
  }
  Emit(t, n) {
    var o;
    var r = { preventDefault: !1 };
    return (o = u(this, I)[t]) == null || o.slice().forEach((l) => l.Execute({
      ...n,
      preventDefault() {
        r.preventDefault = !0;
      }
    })), r;
  }
}
I = new WeakMap();
function Q(e) {
  const t = [];
  var n = -1;
  function r() {
    var g, w;
    if (!m())
      return;
    const i = t[n];
    n--, (g = i.BeforeRedo) == null || g.call(i), i.Undo(), (w = i.OnUndo) == null || w.call(i);
  }
  function o() {
    var g, w;
    if (d()) {
      n++;
      var i = t[n];
      (g = i.BeforeRedo) == null || g.call(i), i.Redo(), (w = i.OnRedo) == null || w.call(i);
    }
  }
  function l(i) {
    var g, w;
    n < t.length - 1 && t.splice(n, t.length - n), t.push({
      Undo: () => i.Undo(),
      BeforeUndo: () => {
        var f;
        return (f = i.BeforeUndo) == null ? void 0 : f.call(i);
      },
      OnUndo: () => {
        var f;
        return (f = i.OnUndo) == null ? void 0 : f.call(i);
      },
      Redo: () => i.Action(),
      BeforeRedo: () => {
        var f;
        return (f = i.BeforeAction) == null ? void 0 : f.call(i);
      },
      OnRedo: () => {
        var f;
        return (f = i.OnAction) == null ? void 0 : f.call(i);
      }
    }), n = t.length - 1, (g = i.BeforeAction) == null || g.call(i), i.Action(), (w = i.OnAction) == null || w.call(i);
  }
  function d() {
    return n < t.length - 1;
  }
  function m() {
    return n >= 0;
  }
  return {
    get HistoryIndex() {
      return n;
    },
    //AddHistory,
    Execute: l,
    Undo: r,
    Redo: o,
    CanUndo: m,
    CanRedo: d
  };
}
class ht {
  constructor(t) {
    C(this, "UndoAPI");
    C(this, "BeforeChanged");
    C(this, "OnChanged");
    C(this, "Insert");
    C(this, "Update");
    C(this, "Delete");
    this.UndoAPI = Q(), this.BeforeChanged = t.BeforeChanged ?? (() => {
    }), this.OnChanged = t.OnChanged, this.Insert = t.Insert, this.Update = t.Update, this.Delete = t.Delete;
  }
  CanUndo() {
    return this.UndoAPI.CanUndo();
  }
  Undo() {
    this.UndoAPI.Undo();
  }
  CanRedo() {
    return this.UndoAPI.CanRedo();
  }
  Redo() {
    this.UndoAPI.Redo();
  }
  get HistoryIndex() {
    return this.UndoAPI.HistoryIndex;
  }
  Save(t) {
    if (!(t != null && t.Data) || !(t != null && t.UndoData))
      throw new Error("Invalid data or undoData");
    this.UndoAPI.Execute({
      Undo: () => {
        this.Execute(t.UndoData);
      },
      BeforeUndo: () => {
        this.BeforeChanged(t.UndoData);
      },
      OnUndo: () => {
        this.OnChanged(t.UndoData);
      },
      Action: () => {
        this.Execute(t.Data);
      },
      BeforeAction: () => {
        this.BeforeChanged(t.Data);
      },
      OnAction: () => {
        this.OnChanged(t.Data);
      }
    });
  }
  Execute(t) {
    t.items.forEach((n) => ({ insert: this.Insert, update: this.Update, delete: this.Delete })[n.Action](n.Data));
  }
}
function W() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M9 18L15 12L9 6"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
function X() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M6 9L12 15L18 9"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const Y = {
  "arrow-chevron-right": W,
  "arrow-chevron-down": X
};
function $() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const tt = {
  "file-document": $
};
function et() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-bold"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), e.appendChild(t), e;
}
function nt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-italic"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), e.appendChild(t), e;
}
function rt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-underline"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), e.appendChild(t), e;
}
const it = {
  "text-bold": et,
  "text-italic": nt,
  "text-underline": rt
}, ot = {
  ...it,
  ...Y,
  ...tt
};
function ct(e) {
  return ot[e]();
}
export {
  ut as EventManager,
  ht as SaveManager,
  N as generateUId,
  ct as getIcon,
  dt as linkedList
};
//# sourceMappingURL=index.es.js.map
