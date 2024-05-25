var j = Object.defineProperty;
var _ = (e, t, r) => t in e ? j(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var b = (e, t, r) => (_(e, typeof t != "symbol" ? t + "" : t, r), r), P = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var s = (e, t, r) => (P(e, t, "read from private field"), r ? r.call(e) : t.get(e)), l = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, d = (e, t, r, n) => (P(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
function R(e) {
  return e.nextItem ? [e.nextItem, ...R(e.nextItem)] : [];
}
function L(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...L(e.firstChildItem),
    ...R(e.firstChildItem).flatMap((t) => [t, ...L(t)])
  ] : [];
}
function S(e, t, r = !1) {
  var o;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const n = r ? [] : S(e.firstChildItem, t);
  if (((o = n.slice(-1)[0]) == null ? void 0 : o.id) == t.id)
    return [e, ...n];
  if (e.nextItem)
    return [e, ...n, ...S(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...n, ...S(e.parentItem, t, !0)].filter((c) => c.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function q(e, t) {
  return S(e, t);
}
function Z(e, t) {
  if (e.firstChildItem && (t == null ? void 0 : t.ignoreChildren) != !0)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function r(n) {
    if (n.nextItem)
      return n.nextItem;
    if (n.parentItem)
      return r(n.parentItem);
  }
  return r(e);
}
function E(e, t) {
  function r(n) {
    if (n.id == t)
      return n;
    let o;
    return n.firstChildItem && (o || (o = r(n.firstChildItem))), n.nextItem && (o || (o = r(n.nextItem))), o;
  }
  return r(e);
}
function k(e) {
  if (!e)
    return [];
  const t = [
    e.getDetails()
  ];
  return e.firstChildItem && t.push(...k(e.firstChildItem)), e.nextItem && t.push(...k(e.nextItem)), t;
}
function G(e) {
  function t(r) {
    return r != null && r.nextItem ? t(r.nextItem) : r != null && r.firstChildItem ? t(r.firstChildItem) : r;
  }
  return t(e == null ? void 0 : e.firstChildItem);
}
function F(e, t, r) {
  var o, c;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let n = t && E(t, e.id);
  if (n == null || ((o = n.parentItem) == null ? void 0 : o.id) != e.parentId || ((c = n.previousItem) == null ? void 0 : c.id) != e.previousId) {
    if (t && n && t.id == n.id)
      if (n.firstChildItem)
        t = n.firstChildItem;
      else if (n.nextItem)
        t = n.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (n == null && (n = r(e)), n == null || n.remove(), t == null)
      t = n;
    else if (e.previousId) {
      const h = E(t, e.previousId);
      if (!h)
        throw new Error("Failed to render item, previous item is not rendered");
      h.after(n);
    } else if (e.parentId) {
      const h = E(t, e.parentId);
      if (!h)
        throw new Error("Failed to render item, parent item is not rendered");
      h.append(n);
    } else
      t.before(n), t = n;
  }
  return n.update(e.data), t;
}
var U, D, m, A, f, g, C;
class J {
  constructor(t, r) {
    l(this, U, void 0);
    l(this, D, void 0);
    l(this, m, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    l(this, A, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    l(this, f, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    l(this, g, void 0);
    l(this, C, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is required");
    if (((r == null ? void 0 : r.trim()) ?? "").length == 0)
      throw new Error("type is required");
    d(this, U, t), d(this, D, r);
  }
  get id() {
    return s(this, U);
  }
  get type() {
    return s(this, D);
  }
  get parentItem() {
    return s(this, m);
  }
  get firstChildItem() {
    return s(this, A);
  }
  get nextItem() {
    return s(this, f);
  }
  get previousItem() {
    return s(this, g);
  }
  get target() {
    if (!s(this, C))
      throw new Error("Failed to get target. Please call the .initialized(data) method before fetching the target");
    return s(this, C);
  }
  init(t) {
    if (s(this, C))
      throw new Error("The target has already been initialized");
    d(this, C, this.render(t));
  }
  getDetails() {
    var t, r;
    return {
      id: this.id,
      type: this.type,
      parentId: (t = this.parentItem) == null ? void 0 : t.id,
      previousId: (r = this.previousItem) == null ? void 0 : r.id,
      data: this.data
    };
  }
  remove() {
    var t, r, n;
    ((r = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : r.id) == this.id && d(this.parentItem, A, s(this, f)), this.previousItem && d(this.previousItem, f, s(this, f)), this.nextItem && d(this.nextItem, g, s(this, g)), d(this, m, void 0), d(this, f, void 0), d(this, g, void 0), (n = s(this, C)) == null || n.remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const r = this.firstChildItem && [this.firstChildItem, ...R(this.firstChildItem)], n = r == null ? void 0 : r.slice(-1)[0];
    d(t, m, this), n ? n.after(t) : (d(this, A, t), this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), d(t, g, this.previousItem), this.previousItem ? d(this.previousItem, f, t) : this.parentItem && d(this.parentItem, A, t), d(t, m, this.parentItem), d(t, f, this), d(this, g, t), this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), d(t, f, this.nextItem), this.nextItem && d(this.nextItem, g, t), d(t, m, this.parentItem), d(t, g, this), d(this, f, t), this.target.after(t.target);
  }
}
U = new WeakMap(), D = new WeakMap(), m = new WeakMap(), A = new WeakMap(), f = new WeakMap(), g = new WeakMap(), C = new WeakMap();
function M(e, t, r) {
  const n = e.find((o) => o.parentId == t && o.previousId == r);
  return n ? (e = e.filter((o) => o.id != n.id), 1 + M(e, n.id, void 0) + M(e, t, n.id)) : 0;
}
function H(e) {
  if (e.filter((h) => h.parentId == null && h.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((h) => h.id).some((h, x, i) => i.indexOf(h) != x))
    throw new Error("Found duplicated instances of ids");
  if (e.map((h) => h.previousId + "_" + h.parentId).some((h, x, i) => i.indexOf(h) != x))
    throw new Error("Some of the items have the same previousId");
  if (M(e) != e.length)
    throw new Error("Linked list is not valid");
}
function N(e, t, r) {
  const n = e.find((o) => o.parentId == t && o.previousId == r);
  return n ? (e = e.filter((o) => o.id != n.id), [
    n,
    ...N(e, n.id, void 0),
    ...N(e, t, n.id)
  ]) : [];
}
function T(e) {
  return H(e), N(e, void 0, void 0);
}
var B, a;
class K {
  constructor(t) {
    l(this, B, void 0);
    l(this, a, void 0);
    d(this, B, t);
  }
  get rootItem() {
    return s(this, a);
  }
  get value() {
    return k(s(this, a));
  }
  set value(t) {
    if (H(t), T(t).length != t.length)
      throw new Error("Cannot set value, invalid linked list");
    const n = s(this, a);
    t.forEach((o, c) => {
      this.upsert(o), c == 0 && (s(this, B).replaceChildren(s(this, a).target), n == null || n.remove());
    });
  }
  upsert(t) {
    d(this, a, F(t, s(this, a), () => this.createItem(t.type, t.id, t.data)));
  }
  getItemById(t) {
    return E(s(this, a), t);
  }
  deleteItemById(t) {
    var r;
    (r = this.getItemById(t)) == null || r.remove();
  }
}
B = new WeakMap(), a = new WeakMap();
var y;
class Q {
  constructor(t) {
    l(this, y, void 0);
    d(this, y, t);
  }
  get id() {
    return s(this, y);
  }
}
y = new WeakMap();
const pt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Command: Q,
  ItemContainerElement: K,
  ItemElement: J,
  getChildAndNextSiblingData: k,
  getChildItems: L,
  getItemsBetween: q,
  getLastChild: G,
  getNextItem: Z,
  getNextOrChildById: E,
  getNextSiblings: R,
  sortList: T,
  upsertAndReturnRoot: F,
  validateList: H
}, Symbol.toStringTag, { value: "Module" }));
let O;
const W = new Uint8Array(16);
function X() {
  if (!O && (O = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !O))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return O(W);
}
const u = [];
for (let e = 0; e < 256; ++e)
  u.push((e + 256).toString(16).slice(1));
function Y(e, t = 0) {
  return u[e[t + 0]] + u[e[t + 1]] + u[e[t + 2]] + u[e[t + 3]] + "-" + u[e[t + 4]] + u[e[t + 5]] + "-" + u[e[t + 6]] + u[e[t + 7]] + "-" + u[e[t + 8]] + u[e[t + 9]] + "-" + u[e[t + 10]] + u[e[t + 11]] + u[e[t + 12]] + u[e[t + 13]] + u[e[t + 14]] + u[e[t + 15]];
}
const $ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), V = {
  randomUUID: $
};
function tt(e, t, r) {
  if (V.randomUUID && !t && !e)
    return V.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || X)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, Y(n);
}
function z() {
  return tt();
}
var I;
class gt {
  constructor() {
    l(this, I, {});
  }
  On(t, r) {
    let n = z();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({ Id: n, Execute: r }), n;
  }
  Once(t, r, n) {
    var o = z();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({
      Id: o,
      Execute: (c) => {
        n && n(c) != !0 || (this.Off(t, o), r(c));
      }
    }), o;
  }
  Off(t, r) {
    var o;
    const n = (o = s(this, I)[t]) == null ? void 0 : o.findIndex((c) => c.Id == r);
    n >= 0 && s(this, I)[t].splice(n, 1);
  }
  Emit(t, r) {
    var o;
    var n = { preventDefault: !1 };
    return (o = s(this, I)[t]) == null || o.slice().forEach((c) => c.Execute({
      ...r,
      preventDefault() {
        n.preventDefault = !0;
      }
    })), n;
  }
}
I = new WeakMap();
function et(e) {
  const t = [];
  var r = -1;
  function n() {
    var w, v;
    if (!x())
      return;
    const i = t[r];
    r--, (w = i.BeforeRedo) == null || w.call(i), i.Undo(), (v = i.OnUndo) == null || v.call(i);
  }
  function o() {
    var w, v;
    if (h()) {
      r++;
      var i = t[r];
      (w = i.BeforeRedo) == null || w.call(i), i.Redo(), (v = i.OnRedo) == null || v.call(i);
    }
  }
  function c(i) {
    var w, v;
    r < t.length - 1 && t.splice(r, t.length - r), t.push({
      Undo: () => i.Undo(),
      BeforeUndo: () => {
        var p;
        return (p = i.BeforeUndo) == null ? void 0 : p.call(i);
      },
      OnUndo: () => {
        var p;
        return (p = i.OnUndo) == null ? void 0 : p.call(i);
      },
      Redo: () => i.Action(),
      BeforeRedo: () => {
        var p;
        return (p = i.BeforeAction) == null ? void 0 : p.call(i);
      },
      OnRedo: () => {
        var p;
        return (p = i.OnAction) == null ? void 0 : p.call(i);
      }
    }), r = t.length - 1, (w = i.BeforeAction) == null || w.call(i), i.Action(), (v = i.OnAction) == null || v.call(i);
  }
  function h() {
    return r < t.length - 1;
  }
  function x() {
    return r >= 0;
  }
  return {
    get HistoryIndex() {
      return r;
    },
    //AddHistory,
    Execute: c,
    Undo: n,
    Redo: o,
    CanUndo: x,
    CanRedo: h
  };
}
class at {
  constructor(t) {
    b(this, "UndoAPI");
    b(this, "BeforeChanged");
    b(this, "OnChanged");
    b(this, "Insert");
    b(this, "Update");
    b(this, "Delete");
    this.UndoAPI = et(), this.BeforeChanged = t.BeforeChanged ?? (() => {
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
    t.items.forEach((r) => ({ insert: this.Insert, update: this.Update, delete: this.Delete })[r.Action](r.Data));
  }
}
function rt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M9 18L15 12L9 6"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
function nt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M6 9L12 15L18 9"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const it = {
  "arrow-chevron-right": rt,
  "arrow-chevron-down": nt
};
function ot() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const st = {
  "file-document": ot
};
function dt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-bold"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), e.appendChild(t), e;
}
function ht() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-italic"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), e.appendChild(t), e;
}
function ut() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-underline"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), e.appendChild(t), e;
}
const ct = {
  "text-bold": dt,
  "text-italic": ht,
  "text-underline": ut
}, lt = {
  ...ct,
  ...it,
  ...st
};
function It(e) {
  return lt[e]();
}
function wt(e, t) {
  function r(n) {
    e.contains(n.target) || (document.removeEventListener("click", r), t(n));
  }
  document.addEventListener("click", r);
}
export {
  gt as EventManager,
  at as SaveManager,
  z as generateUId,
  It as getIcon,
  pt as linkedList,
  wt as onceClickOutside
};
//# sourceMappingURL=index.es.js.map
