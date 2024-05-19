var S = (t, e, r) => {
  if (!e.has(t))
    throw TypeError("Cannot " + r);
};
var d = (t, e, r) => (S(t, e, "read from private field"), r ? r.call(t) : e.get(t)), f = (t, e, r) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, r);
}, n = (t, e, r, i) => (S(t, e, "write to private field"), i ? i.call(t, r) : e.set(t, r), r);
function g(t) {
  return t.nextItem ? [t.nextItem, ...g(t.nextItem)] : [];
}
function C(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...C(t.firstChildItem),
    ...g(t.firstChildItem).flatMap((e) => [e, ...C(e)])
  ] : [];
}
function w(t, e, r = !1) {
  var s;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const i = r ? [] : w(t.firstChildItem, e);
  if (((s = i.slice(-1)[0]) == null ? void 0 : s.id) == e.id)
    return [t, ...i];
  if (t.nextItem)
    return [t, ...i, ...w(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...i, ...w(t.parentItem, e, !0)].filter((a) => a.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function k(t, e) {
  return w(t, e);
}
function L(t, e) {
  if (t.firstChildItem && (e == null ? void 0 : e.ignoreChildren) != !0)
    return t.firstChildItem;
  if (t.nextItem)
    return t.nextItem;
  function r(i) {
    if (i.nextItem)
      return i.nextItem;
    if (i.parentItem)
      return r(i.parentItem);
  }
  return r(t);
}
function v(t, e) {
  function r(i) {
    if (i.id == e)
      return i;
    let s;
    return i.firstChildItem && (s || (s = r(i.firstChildItem))), i.nextItem && (s || (s = r(i.nextItem))), s;
  }
  return r(t);
}
function x(t) {
  if (!t)
    return [];
  const e = [
    t.getDetails()
  ];
  return t.firstChildItem && e.push(...x(t.firstChildItem)), t.nextItem && e.push(...x(t.nextItem)), e;
}
function B(t) {
  function e(r) {
    return r != null && r.nextItem ? e(r.nextItem) : r != null && r.firstChildItem ? e(r.firstChildItem) : r;
  }
  return e(t == null ? void 0 : t.firstChildItem);
}
function M(t) {
  function e(r) {
    if (r.previousItem && r.previousItem.firstChildItem)
      return B(r.previousItem) ?? r.previousItem;
    if (r.parentItem)
      return e(r.parentItem);
  }
  return e(t);
}
function D(t, e, r) {
  var s, a;
  if (e == null && (t.parentId || t.previousId))
    throw new Error("the initial upsert must be the root window");
  let i = e && v(e, t.id);
  if (i == null || ((s = i.parentItem) == null ? void 0 : s.id) != t.parentId || ((a = i.previousItem) == null ? void 0 : a.id) != t.previousId) {
    if (e && i && e.id == i.id)
      if (i.firstChildItem)
        e = i.firstChildItem;
      else if (i.nextItem)
        e = i.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (i == null && (i = r(t)), i == null || i.remove(), e == null)
      e = i;
    else if (t.previousId) {
      const o = v(e, t.previousId);
      if (!o)
        throw new Error("Failed to render item, previous item is not rendered");
      o.after(i);
    } else if (t.parentId) {
      const o = v(e, t.parentId);
      if (!o)
        throw new Error("Failed to render item, parent item is not rendered");
      o.append(i);
    } else
      e.before(i), e = i;
  }
  return i.update(t.data), e;
}
var I, l, p, u, h, c;
class z {
  constructor(e, r) {
    f(this, I, void 0);
    f(this, l, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    f(this, p, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    f(this, u, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    f(this, h, void 0);
    f(this, c, void 0);
    if (((e == null ? void 0 : e.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    n(this, I, e), n(this, c, this.render(r));
  }
  get id() {
    return d(this, I);
  }
  get parentItem() {
    return d(this, l);
  }
  get firstChildItem() {
    return d(this, p);
  }
  get nextItem() {
    return d(this, u);
  }
  get previousItem() {
    return d(this, h);
  }
  get target() {
    return d(this, c);
  }
  getDetails() {
    var e, r;
    return {
      id: this.id,
      parentId: (e = this.parentItem) == null ? void 0 : e.id,
      previousId: (r = this.previousItem) == null ? void 0 : r.id,
      data: this.data
    };
  }
  remove() {
    var e, r;
    ((r = (e = this.parentItem) == null ? void 0 : e.firstChildItem) == null ? void 0 : r.id) == this.id && n(this.parentItem, p, d(this, u)), this.previousItem && n(this.previousItem, u, d(this, u)), this.nextItem && n(this.nextItem, h, d(this, h)), n(this, l, void 0), n(this, u, void 0), n(this, h, void 0), d(this, c).remove();
  }
  append(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove();
    const r = this.firstChildItem && [this.firstChildItem, ...g(this.firstChildItem)], i = r == null ? void 0 : r.slice(-1)[0];
    n(e, l, this), i ? i.after(e) : (n(this, p, e), this.target.append(e.target));
  }
  before(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, h, this.previousItem), this.previousItem ? n(this.previousItem, u, e) : this.parentItem && n(this.parentItem, p, e), n(e, l, this.parentItem), n(e, u, this), n(this, h, e), this.target.before(e.target);
  }
  after(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, u, this.nextItem), this.nextItem && n(this.nextItem, h, e), n(e, l, this.parentItem), n(e, h, this), n(this, u, e), this.target.after(e.target);
  }
}
I = new WeakMap(), l = new WeakMap(), p = new WeakMap(), u = new WeakMap(), h = new WeakMap(), c = new WeakMap();
function A(t, e, r) {
  const i = t.find((s) => s.parentId == e && s.previousId == r);
  return i ? (t = t.filter((s) => s.id != i.id), 1 + A(t, i.id, void 0) + A(t, e, i.id)) : 0;
}
function N(t) {
  if (t.filter((o) => o.parentId == null && o.previousId == null).length != 1 && t.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (t.map((o) => o.id).some((o, b, m) => m.indexOf(o) != b))
    throw new Error("Found duplicated instances of ids");
  if (t.map((o) => o.previousId + "_" + o.parentId).some((o, b, m) => m.indexOf(o) != b))
    throw new Error("Some of the items have the same previousId");
  if (A(t) != t.length)
    throw new Error("Linked list is not valid");
}
function E(t, e, r) {
  const i = t.find((s) => s.parentId == e && s.previousId == r);
  return i ? (t = t.filter((s) => s.id != i.id), [
    i,
    ...E(t, i.id, void 0),
    ...E(t, e, i.id)
  ]) : [];
}
function _(t) {
  return N(t), E(t, void 0, void 0);
}
const U = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: z,
  getChildAndNextSiblingData: x,
  getChildItems: C,
  getItemsBetween: k,
  getNextItem: L,
  getNextOrChildById: v,
  getNextSiblings: g,
  getPreviousWithoutChild: M,
  sortList: _,
  upsertAndReturnRoot: D,
  validateList: N
}, Symbol.toStringTag, { value: "Module" }));
function y() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M9 18L15 12L9 6"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
function P() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M6 9L12 15L18 9"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
const F = {
  "arrow-chevron-right": y,
  "arrow-chevron-down": P
};
function O() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-bold"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), t.appendChild(e), t;
}
function T() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-italic"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), t.appendChild(e), t;
}
function V() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-underline"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), t.appendChild(e), t;
}
const j = {
  "text-bold": O,
  "text-italic": T,
  "text-underline": V
}, H = {
  ...j,
  ...F
};
function W(t) {
  return H[t]();
}
export {
  W as getIcon,
  U as linkedList
};
//# sourceMappingURL=index.es.js.map
