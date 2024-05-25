var F = Object.defineProperty;
var T = (e, t, n) => t in e ? F(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var b = (e, t, n) => (T(e, typeof t != "symbol" ? t + "" : t, n), n), N = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
};
var s = (e, t, n) => (N(e, t, "read from private field"), n ? n.call(e) : t.get(e)), a = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, d = (e, t, n, r) => (N(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
function S(e) {
  return e.nextItem ? [e.nextItem, ...S(e.nextItem)] : [];
}
function k(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...k(e.firstChildItem),
    ...S(e.firstChildItem).flatMap((t) => [t, ...k(t)])
  ] : [];
}
function y(e, t, n = !1) {
  var o;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const r = n ? [] : y(e.firstChildItem, t);
  if (((o = r.slice(-1)[0]) == null ? void 0 : o.id) == t.id)
    return [e, ...r];
  if (e.nextItem)
    return [e, ...r, ...y(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...r, ...y(e.parentItem, t, !0)].filter((c) => c.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function j(e, t) {
  return y(e, t);
}
function _(e, t) {
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
function E(e, t) {
  function n(r) {
    if (r.id == t)
      return r;
    let o;
    return r.firstChildItem && (o || (o = n(r.firstChildItem))), r.nextItem && (o || (o = n(r.nextItem))), o;
  }
  return n(e);
}
function O(e) {
  if (!e)
    return [];
  const t = [
    e.getDetails()
  ];
  return e.firstChildItem && t.push(...O(e.firstChildItem)), e.nextItem && t.push(...O(e.nextItem)), t;
}
function q(e) {
  function t(n) {
    return n != null && n.nextItem ? t(n.nextItem) : n != null && n.firstChildItem ? t(n.firstChildItem) : n;
  }
  return t(e == null ? void 0 : e.firstChildItem);
}
function V(e, t, n) {
  var o, c;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = t && E(t, e.id);
  if (r == null || ((o = r.parentItem) == null ? void 0 : o.id) != e.parentId || ((c = r.previousItem) == null ? void 0 : c.id) != e.previousId) {
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
      const u = E(t, e.previousId);
      if (!u)
        throw new Error("Failed to render item, previous item is not rendered");
      u.after(r);
    } else if (e.parentId) {
      const u = E(t, e.parentId);
      if (!u)
        throw new Error("Failed to render item, parent item is not rendered");
      u.append(r);
    } else
      t.before(r), t = r;
  }
  return r.update(e.data), t;
}
var U, m, A, l, p, C;
class Z {
  constructor(t) {
    a(this, U, void 0);
    a(this, m, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    a(this, A, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    a(this, l, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    a(this, p, void 0);
    a(this, C, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is required");
    d(this, U, t);
  }
  get id() {
    return s(this, U);
  }
  get parentItem() {
    return s(this, m);
  }
  get firstChildItem() {
    return s(this, A);
  }
  get nextItem() {
    return s(this, l);
  }
  get previousItem() {
    return s(this, p);
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
    var t, n;
    return {
      id: this.id,
      parentId: (t = this.parentItem) == null ? void 0 : t.id,
      previousId: (n = this.previousItem) == null ? void 0 : n.id,
      data: this.data
    };
  }
  remove() {
    var t, n, r;
    ((n = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : n.id) == this.id && d(this.parentItem, A, s(this, l)), this.previousItem && d(this.previousItem, l, s(this, l)), this.nextItem && d(this.nextItem, p, s(this, p)), d(this, m, void 0), d(this, l, void 0), d(this, p, void 0), (r = s(this, C)) == null || r.remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const n = this.firstChildItem && [this.firstChildItem, ...S(this.firstChildItem)], r = n == null ? void 0 : n.slice(-1)[0];
    d(t, m, this), r ? r.after(t) : (d(this, A, t), this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), d(t, p, this.previousItem), this.previousItem ? d(this.previousItem, l, t) : this.parentItem && d(this.parentItem, A, t), d(t, m, this.parentItem), d(t, l, this), d(this, p, t), this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), d(t, l, this.nextItem), this.nextItem && d(this.nextItem, p, t), d(t, m, this.parentItem), d(t, p, this), d(this, l, t), this.target.after(t.target);
  }
}
U = new WeakMap(), m = new WeakMap(), A = new WeakMap(), l = new WeakMap(), p = new WeakMap(), C = new WeakMap();
function R(e, t, n) {
  const r = e.find((o) => o.parentId == t && o.previousId == n);
  return r ? (e = e.filter((o) => o.id != r.id), 1 + R(e, r.id, void 0) + R(e, t, r.id)) : 0;
}
function M(e) {
  if (e.filter((u) => u.parentId == null && u.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((u) => u.id).some((u, x, i) => i.indexOf(u) != x))
    throw new Error("Found duplicated instances of ids");
  if (e.map((u) => u.previousId + "_" + u.parentId).some((u, x, i) => i.indexOf(u) != x))
    throw new Error("Some of the items have the same previousId");
  if (R(e) != e.length)
    throw new Error("Linked list is not valid");
}
function L(e, t, n) {
  const r = e.find((o) => o.parentId == t && o.previousId == n);
  return r ? (e = e.filter((o) => o.id != r.id), [
    r,
    ...L(e, r.id, void 0),
    ...L(e, t, r.id)
  ]) : [];
}
function z(e) {
  return M(e), L(e, void 0, void 0);
}
var D, g;
class G {
  constructor(t) {
    a(this, D, void 0);
    a(this, g, void 0);
    d(this, D, t);
  }
  get rootItem() {
    return s(this, g);
  }
  get value() {
    return O(s(this, g));
  }
  set value(t) {
    if (M(t), z(t).length != t.length)
      throw new Error("Cannot set value, invalid linked list");
    const r = s(this, g);
    t.forEach((o, c) => {
      this.upsert(o), c == 0 && (s(this, D).replaceChildren(s(this, g).target), r == null || r.remove());
    });
  }
  upsert(t) {
    d(this, g, V(t, s(this, g), () => this.createItem(t.id, t.data)));
  }
  getItemById(t) {
    return E(s(this, g), t);
  }
  deleteItemById(t) {
    var n;
    (n = this.getItemById(t)) == null || n.remove();
  }
}
D = new WeakMap(), g = new WeakMap();
const ct = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemContainerElement: G,
  ItemElement: Z,
  getChildAndNextSiblingData: O,
  getChildItems: k,
  getItemsBetween: j,
  getLastChild: q,
  getNextItem: _,
  getNextOrChildById: E,
  getNextSiblings: S,
  sortList: z,
  upsertAndReturnRoot: V,
  validateList: M
}, Symbol.toStringTag, { value: "Module" }));
let B;
const J = new Uint8Array(16);
function K() {
  if (!B && (B = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !B))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return B(J);
}
const h = [];
for (let e = 0; e < 256; ++e)
  h.push((e + 256).toString(16).slice(1));
function Q(e, t = 0) {
  return h[e[t + 0]] + h[e[t + 1]] + h[e[t + 2]] + h[e[t + 3]] + "-" + h[e[t + 4]] + h[e[t + 5]] + "-" + h[e[t + 6]] + h[e[t + 7]] + "-" + h[e[t + 8]] + h[e[t + 9]] + "-" + h[e[t + 10]] + h[e[t + 11]] + h[e[t + 12]] + h[e[t + 13]] + h[e[t + 14]] + h[e[t + 15]];
}
const W = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), H = {
  randomUUID: W
};
function X(e, t, n) {
  if (H.randomUUID && !t && !e)
    return H.randomUUID();
  e = e || {};
  const r = e.random || (e.rng || K)();
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, Q(r);
}
function P() {
  return X();
}
var I;
class lt {
  constructor() {
    a(this, I, {});
  }
  On(t, n) {
    let r = P();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({ Id: r, Execute: n }), r;
  }
  Once(t, n, r) {
    var o = P();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({
      Id: o,
      Execute: (c) => {
        r && r(c) != !0 || (this.Off(t, o), n(c));
      }
    }), o;
  }
  Off(t, n) {
    var o;
    const r = (o = s(this, I)[t]) == null ? void 0 : o.findIndex((c) => c.Id == n);
    r >= 0 && s(this, I)[t].splice(r, 1);
  }
  Emit(t, n) {
    var o;
    var r = { preventDefault: !1 };
    return (o = s(this, I)[t]) == null || o.slice().forEach((c) => c.Execute({
      ...n,
      preventDefault() {
        r.preventDefault = !0;
      }
    })), r;
  }
}
I = new WeakMap();
function Y(e) {
  const t = [];
  var n = -1;
  function r() {
    var w, v;
    if (!x())
      return;
    const i = t[n];
    n--, (w = i.BeforeRedo) == null || w.call(i), i.Undo(), (v = i.OnUndo) == null || v.call(i);
  }
  function o() {
    var w, v;
    if (u()) {
      n++;
      var i = t[n];
      (w = i.BeforeRedo) == null || w.call(i), i.Redo(), (v = i.OnRedo) == null || v.call(i);
    }
  }
  function c(i) {
    var w, v;
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
    }), n = t.length - 1, (w = i.BeforeAction) == null || w.call(i), i.Action(), (v = i.OnAction) == null || v.call(i);
  }
  function u() {
    return n < t.length - 1;
  }
  function x() {
    return n >= 0;
  }
  return {
    get HistoryIndex() {
      return n;
    },
    //AddHistory,
    Execute: c,
    Undo: r,
    Redo: o,
    CanUndo: x,
    CanRedo: u
  };
}
class ft {
  constructor(t) {
    b(this, "UndoAPI");
    b(this, "BeforeChanged");
    b(this, "OnChanged");
    b(this, "Insert");
    b(this, "Update");
    b(this, "Delete");
    this.UndoAPI = Y(), this.BeforeChanged = t.BeforeChanged ?? (() => {
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
function $() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M9 18L15 12L9 6"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
function tt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M6 9L12 15L18 9"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const et = {
  "arrow-chevron-right": $,
  "arrow-chevron-down": tt
};
function rt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const nt = {
  "file-document": rt
};
function it() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-bold"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), e.appendChild(t), e;
}
function ot() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-italic"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), e.appendChild(t), e;
}
function st() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-underline"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), e.appendChild(t), e;
}
const dt = {
  "text-bold": it,
  "text-italic": ot,
  "text-underline": st
}, ut = {
  ...dt,
  ...et,
  ...nt
};
function pt(e) {
  return ut[e]();
}
function at(e, t) {
  function n(r) {
    e.contains(r.target) || (document.removeEventListener("click", n), t(r));
  }
  document.addEventListener("click", n);
}
export {
  lt as EventManager,
  ft as SaveManager,
  P as generateUId,
  pt as getIcon,
  ct as linkedList,
  at as onceClickOutside
};
//# sourceMappingURL=index.es.js.map
