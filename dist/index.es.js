var N = (t, e, n) => {
  if (!e.has(t))
    throw TypeError("Cannot " + n);
};
var o = (t, e, n) => (N(t, e, "read from private field"), n ? n.call(t) : e.get(t)), a = (t, e, n) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, n);
}, s = (t, e, n, r) => (N(t, e, "write to private field"), r ? r.call(t, n) : e.set(t, n), n);
function C(t) {
  return t.nextItem ? [t.nextItem, ...C(t.nextItem)] : [];
}
function E(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...E(t.firstChildItem),
    ...C(t.firstChildItem).flatMap((e) => [e, ...E(e)])
  ] : [];
}
function b(t, e, n = !1) {
  var i;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = n ? [] : b(t.firstChildItem, e);
  if (((i = r.slice(-1)[0]) == null ? void 0 : i.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...b(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...b(t.parentItem, e, !0)].filter((p) => p.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function U(t, e) {
  return b(t, e);
}
function B(t, e) {
  if (t.firstChildItem && (e == null ? void 0 : e.ignoreChildren) != !0)
    return t.firstChildItem;
  if (t.nextItem)
    return t.nextItem;
  function n(r) {
    if (r.nextItem)
      return r.nextItem;
    if (r.parentItem)
      return n(r.parentItem);
  }
  return n(t);
}
function m(t, e) {
  function n(r) {
    if (r.id == e)
      return r;
    let i;
    return r.firstChildItem && (i || (i = n(r.firstChildItem))), r.nextItem && (i || (i = n(r.nextItem))), i;
  }
  return n(t);
}
function S(t) {
  if (!t)
    return [];
  const e = [
    t.getDetails()
  ];
  return t.firstChildItem && e.push(...S(t.firstChildItem)), t.nextItem && e.push(...S(t.nextItem)), e;
}
function V(t) {
  function e(n) {
    return n != null && n.nextItem ? e(n.nextItem) : n != null && n.firstChildItem ? e(n.firstChildItem) : n;
  }
  return e(t == null ? void 0 : t.firstChildItem);
}
function H(t, e, n) {
  var i, p;
  if (e == null && (t.parentId || t.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = e && m(e, t.id);
  if (r == null || ((i = r.parentItem) == null ? void 0 : i.id) != t.parentId || ((p = r.previousItem) == null ? void 0 : p.id) != t.previousId) {
    if (e && r && e.id == r.id)
      if (r.firstChildItem)
        e = r.firstChildItem;
      else if (r.nextItem)
        e = r.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (r == null && (r = n(t)), r == null || r.remove(), e == null)
      e = r;
    else if (t.previousId) {
      const u = m(e, t.previousId);
      if (!u)
        throw new Error("Failed to render item, previous item is not rendered");
      u.after(r);
    } else if (t.parentId) {
      const u = m(e, t.parentId);
      if (!u)
        throw new Error("Failed to render item, parent item is not rendered");
      u.append(r);
    } else
      e.before(r), e = r;
  }
  return r.update(t.data), e;
}
var g, f, w, h, l, I;
class O {
  constructor(e, n) {
    a(this, g, void 0);
    a(this, f, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    a(this, w, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    a(this, h, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    a(this, l, void 0);
    a(this, I, void 0);
    if (((e == null ? void 0 : e.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    s(this, g, e), s(this, I, this.render(n));
  }
  get id() {
    return o(this, g);
  }
  get parentItem() {
    return o(this, f);
  }
  get firstChildItem() {
    return o(this, w);
  }
  get nextItem() {
    return o(this, h);
  }
  get previousItem() {
    return o(this, l);
  }
  get target() {
    return o(this, I);
  }
  getDetails() {
    var e, n;
    return {
      id: this.id,
      parentId: (e = this.parentItem) == null ? void 0 : e.id,
      previousId: (n = this.previousItem) == null ? void 0 : n.id,
      data: this.data
    };
  }
  remove() {
    var e, n;
    ((n = (e = this.parentItem) == null ? void 0 : e.firstChildItem) == null ? void 0 : n.id) == this.id && s(this.parentItem, w, o(this, h)), this.previousItem && s(this.previousItem, h, o(this, h)), this.nextItem && s(this.nextItem, l, o(this, l)), s(this, f, void 0), s(this, h, void 0), s(this, l, void 0), o(this, I).remove();
  }
  append(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove();
    const n = this.firstChildItem && [this.firstChildItem, ...C(this.firstChildItem)], r = n == null ? void 0 : n.slice(-1)[0];
    s(e, f, this), r ? r.after(e) : (s(this, w, e), this.target.append(e.target));
  }
  before(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), s(e, l, this.previousItem), this.previousItem ? s(this.previousItem, h, e) : this.parentItem && s(this.parentItem, w, e), s(e, f, this.parentItem), s(e, h, this), s(this, l, e), this.target.before(e.target);
  }
  after(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), s(e, h, this.nextItem), this.nextItem && s(this.nextItem, l, e), s(e, f, this.parentItem), s(e, l, this), s(this, h, e), this.target.after(e.target);
  }
}
g = new WeakMap(), f = new WeakMap(), w = new WeakMap(), h = new WeakMap(), l = new WeakMap(), I = new WeakMap();
function k(t, e, n) {
  const r = t.find((i) => i.parentId == e && i.previousId == n);
  return r ? (t = t.filter((i) => i.id != r.id), 1 + k(t, r.id, void 0) + k(t, e, r.id)) : 0;
}
function L(t) {
  if (t.filter((u) => u.parentId == null && u.previousId == null).length != 1 && t.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (t.map((u) => u.id).some((u, x, A) => A.indexOf(u) != x))
    throw new Error("Found duplicated instances of ids");
  if (t.map((u) => u.previousId + "_" + u.parentId).some((u, x, A) => A.indexOf(u) != x))
    throw new Error("Some of the items have the same previousId");
  if (k(t) != t.length)
    throw new Error("Linked list is not valid");
}
function D(t, e, n) {
  const r = t.find((i) => i.parentId == e && i.previousId == n);
  return r ? (t = t.filter((i) => i.id != r.id), [
    r,
    ...D(t, r.id, void 0),
    ...D(t, e, r.id)
  ]) : [];
}
function z(t) {
  return L(t), D(t, void 0, void 0);
}
const tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: O,
  getChildAndNextSiblingData: S,
  getChildItems: E,
  getItemsBetween: U,
  getLastChild: V,
  getNextItem: B,
  getNextOrChildById: m,
  getNextSiblings: C,
  sortList: z,
  upsertAndReturnRoot: H,
  validateList: L
}, Symbol.toStringTag, { value: "Module" }));
let v;
const F = new Uint8Array(16);
function R() {
  if (!v && (v = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !v))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return v(F);
}
const d = [];
for (let t = 0; t < 256; ++t)
  d.push((t + 256).toString(16).slice(1));
function j(t, e = 0) {
  return d[t[e + 0]] + d[t[e + 1]] + d[t[e + 2]] + d[t[e + 3]] + "-" + d[t[e + 4]] + d[t[e + 5]] + "-" + d[t[e + 6]] + d[t[e + 7]] + "-" + d[t[e + 8]] + d[t[e + 9]] + "-" + d[t[e + 10]] + d[t[e + 11]] + d[t[e + 12]] + d[t[e + 13]] + d[t[e + 14]] + d[t[e + 15]];
}
const T = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), y = {
  randomUUID: T
};
function _(t, e, n) {
  if (y.randomUUID && !e && !t)
    return y.randomUUID();
  t = t || {};
  const r = t.random || (t.rng || R)();
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, j(r);
}
function M() {
  return _();
}
var c;
class et {
  constructor() {
    a(this, c, {});
  }
  On(e, n) {
    let r = M();
    return o(this, c)[e] = (o(this, c)[e] ?? []).concat({ Id: r, Execute: n }), r;
  }
  Once(e, n) {
    var r = M();
    return o(this, c)[e] = (o(this, c)[e] ?? []).concat({
      Id: r,
      Execute: (i) => {
        this.Off(e, r), n(i);
      }
    }), r;
  }
  Off(e, n) {
    var i;
    const r = (i = o(this, c)[e]) == null ? void 0 : i.findIndex((p) => p.Id == n);
    r >= 0 && o(this, c)[e].splice(r, 1);
  }
  Emit(e, n) {
    var i;
    var r = { preventDefault: !1 };
    return (i = o(this, c)[e]) == null || i.slice().forEach((p) => p.Execute({
      ...n,
      preventDefault() {
        r.preventDefault = !0;
      }
    })), r;
  }
}
c = new WeakMap();
function P() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M9 18L15 12L9 6"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
function Z() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M6 9L12 15L18 9"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
const q = {
  "arrow-chevron-right": P,
  "arrow-chevron-down": Z
};
function G() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
const J = {
  "file-document": G
};
function K() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-bold"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), t.appendChild(e), t;
}
function Q() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-italic"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), t.appendChild(e), t;
}
function W() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-underline"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), t.appendChild(e), t;
}
const X = {
  "text-bold": K,
  "text-italic": Q,
  "text-underline": W
}, Y = {
  ...X,
  ...q,
  ...J
};
function rt(t) {
  return Y[t]();
}
export {
  et as EventManager,
  M as generateUId,
  rt as getIcon,
  tt as linkedList
};
//# sourceMappingURL=index.es.js.map
