var k = (t, e, i) => {
  if (!e.has(t))
    throw TypeError("Cannot " + i);
};
var u = (t, e, i) => (k(t, e, "read from private field"), i ? i.call(t) : e.get(t)), c = (t, e, i) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, i);
}, n = (t, e, i, r) => (k(t, e, "write to private field"), r ? r.call(t, i) : e.set(t, i), i);
function v(t) {
  return t.nextItem ? [t.nextItem, ...v(t.nextItem)] : [];
}
function m(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...m(t.firstChildItem),
    ...v(t.firstChildItem).flatMap((e) => [e, ...m(e)])
  ] : [];
}
function I(t, e, i = !1) {
  var s;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = i ? [] : I(t.firstChildItem, e);
  if (((s = r.slice(-1)[0]) == null ? void 0 : s.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...I(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...I(t.parentItem, e, !0)].filter((a) => a.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function N(t, e) {
  return I(t, e);
}
function M(t, e) {
  if (t.firstChildItem && (e == null ? void 0 : e.ignoreChildren) != !0)
    return t.firstChildItem;
  if (t.nextItem)
    return t.nextItem;
  function i(r) {
    if (r.nextItem)
      return r.nextItem;
    if (r.parentItem)
      return i(r.parentItem);
  }
  return i(t);
}
function g(t, e) {
  function i(r) {
    if (r.id == e)
      return r;
    let s;
    return r.firstChildItem && (s || (s = i(r.firstChildItem))), r.nextItem && (s || (s = i(r.nextItem))), s;
  }
  return i(t);
}
function A(t) {
  if (!t)
    return [];
  const e = [
    t.getDetails()
  ];
  return t.firstChildItem && e.push(...A(t.firstChildItem)), t.nextItem && e.push(...A(t.nextItem)), e;
}
function L(t) {
  function e(i) {
    return i != null && i.nextItem ? e(i.nextItem) : i != null && i.firstChildItem ? e(i.firstChildItem) : i;
  }
  return e(t == null ? void 0 : t.firstChildItem);
}
function B(t, e, i) {
  var s, a;
  if (e == null && (t.parentId || t.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = e && g(e, t.id);
  if (r == null || ((s = r.parentItem) == null ? void 0 : s.id) != t.parentId || ((a = r.previousItem) == null ? void 0 : a.id) != t.previousId) {
    if (e && r && e.id == r.id)
      if (r.firstChildItem)
        e = r.firstChildItem;
      else if (r.nextItem)
        e = r.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (r == null && (r = i(t)), r == null || r.remove(), e == null)
      e = r;
    else if (t.previousId) {
      const o = g(e, t.previousId);
      if (!o)
        throw new Error("Failed to render item, previous item is not rendered");
      o.after(r);
    } else if (t.parentId) {
      const o = g(e, t.parentId);
      if (!o)
        throw new Error("Failed to render item, parent item is not rendered");
      o.append(r);
    } else
      e.before(r), e = r;
  }
  return r.update(t.data), e;
}
var w, l, f, d, h, p;
class H {
  constructor(e, i) {
    c(this, w, void 0);
    c(this, l, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    c(this, f, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    c(this, d, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    c(this, h, void 0);
    c(this, p, void 0);
    if (((e == null ? void 0 : e.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    n(this, w, e), n(this, p, this.render(i));
  }
  get id() {
    return u(this, w);
  }
  get parentItem() {
    return u(this, l);
  }
  get firstChildItem() {
    return u(this, f);
  }
  get nextItem() {
    return u(this, d);
  }
  get previousItem() {
    return u(this, h);
  }
  get target() {
    return u(this, p);
  }
  getDetails() {
    var e, i;
    return {
      id: this.id,
      parentId: (e = this.parentItem) == null ? void 0 : e.id,
      previousId: (i = this.previousItem) == null ? void 0 : i.id,
      data: this.data
    };
  }
  remove() {
    var e, i;
    ((i = (e = this.parentItem) == null ? void 0 : e.firstChildItem) == null ? void 0 : i.id) == this.id && n(this.parentItem, f, u(this, d)), this.previousItem && n(this.previousItem, d, u(this, d)), this.nextItem && n(this.nextItem, h, u(this, h)), n(this, l, void 0), n(this, d, void 0), n(this, h, void 0), u(this, p).remove();
  }
  append(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove();
    const i = this.firstChildItem && [this.firstChildItem, ...v(this.firstChildItem)], r = i == null ? void 0 : i.slice(-1)[0];
    n(e, l, this), r ? r.after(e) : (n(this, f, e), this.target.append(e.target));
  }
  before(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, h, this.previousItem), this.previousItem ? n(this.previousItem, d, e) : this.parentItem && n(this.parentItem, f, e), n(e, l, this.parentItem), n(e, d, this), n(this, h, e), this.target.before(e.target);
  }
  after(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, d, this.nextItem), this.nextItem && n(this.nextItem, h, e), n(e, l, this.parentItem), n(e, h, this), n(this, d, e), this.target.after(e.target);
  }
}
w = new WeakMap(), l = new WeakMap(), f = new WeakMap(), d = new WeakMap(), h = new WeakMap(), p = new WeakMap();
function x(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), 1 + x(t, r.id, void 0) + x(t, e, r.id)) : 0;
}
function S(t) {
  if (t.filter((o) => o.parentId == null && o.previousId == null).length != 1 && t.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (t.map((o) => o.id).some((o, b, C) => C.indexOf(o) != b))
    throw new Error("Found duplicated instances of ids");
  if (t.map((o) => o.previousId + "_" + o.parentId).some((o, b, C) => C.indexOf(o) != b))
    throw new Error("Some of the items have the same previousId");
  if (x(t) != t.length)
    throw new Error("Linked list is not valid");
}
function E(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), [
    r,
    ...E(t, r.id, void 0),
    ...E(t, e, r.id)
  ]) : [];
}
function D(t) {
  return S(t), E(t, void 0, void 0);
}
const Z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: H,
  getChildAndNextSiblingData: A,
  getChildItems: m,
  getItemsBetween: N,
  getLastChild: L,
  getNextItem: M,
  getNextOrChildById: g,
  getNextSiblings: v,
  sortList: D,
  upsertAndReturnRoot: B,
  validateList: S
}, Symbol.toStringTag, { value: "Module" }));
function V() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M9 18L15 12L9 6"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
function z() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M6 9L12 15L18 9"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e), t;
}
const F = {
  "arrow-chevron-right": V,
  "arrow-chevron-down": z
};
function y() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("width", "100%"), t.setAttribute("height", "100%"), t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("fill", "none");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), e.setAttribute("stroke", "currentColor"), e.setAttribute("stroke-width", "2"), e.setAttribute("stroke-linecap", "round"), e.setAttribute("stroke-linejoin", "round"), t.appendChild(e);
}
const _ = {
  "file-document": y
};
function j() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-bold"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), t.appendChild(e), t;
}
function O() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-italic"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), t.appendChild(e), t;
}
function T() {
  const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  t.setAttribute("xmlns", "http://www.w3.org/2000/svg"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "currentColor"), t.setAttribute("class", "bi bi-type-underline"), t.setAttribute("viewBox", "0 0 16 16");
  const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return e.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), t.appendChild(e), t;
}
const P = {
  "text-bold": j,
  "text-italic": O,
  "text-underline": T
}, R = {
  ...P,
  ...F,
  ..._
};
function q(t) {
  return R[t]();
}
export {
  q as getIcon,
  Z as linkedList
};
//# sourceMappingURL=index.es.js.map
