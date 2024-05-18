var k = (t, e, i) => {
  if (!e.has(t))
    throw TypeError("Cannot " + i);
};
var f = (t, e, i) => (k(t, e, "read from private field"), i ? i.call(t) : e.get(t)), I = (t, e, i) => {
  if (e.has(t))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(t) : e.set(t, i);
}, n = (t, e, i, r) => (k(t, e, "write to private field"), r ? r.call(t, i) : e.set(t, i), i);
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
function c(t, e, i = !1) {
  var s;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = i ? [] : c(t.firstChildItem, e);
  if (((s = r.slice(-1)[0]) == null ? void 0 : s.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...c(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...c(t.parentItem, e, !0)].filter((a) => a.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function F(t, e) {
  return c(t, e);
}
function L(t) {
  if (t.firstChildItem)
    return t.firstChildItem;
  if (t.nextItem)
    return t.nextItem;
  function e(i) {
    if (i.nextItem)
      return i.nextItem;
    if (i.parentItem)
      return e(i.parentItem);
  }
  return e(t);
}
function m(t, e) {
  function i(r) {
    if (r.id == e)
      return r;
    let s;
    return r.firstChildItem && (s || (s = i(r.firstChildItem))), r.nextItem && (s || (s = i(r.nextItem))), s;
  }
  return i(t);
}
function O(t, e, i) {
  var s, a;
  if (e == null && (t.parentId || t.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = e && m(e, t.id);
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
      const o = m(e, t.previousId);
      if (!o)
        throw new Error("Failed to render item, previous item is not rendered");
      o.after(r);
    } else if (t.parentId) {
      const o = m(e, t.parentId);
      if (!o)
        throw new Error("Failed to render item, parent item is not rendered");
      o.append(r);
    } else
      e.before(r), e = r;
  }
  return r.update(t.data), e;
}
var v, u, l, d, h, p;
class S {
  constructor(e, i) {
    I(this, v, void 0);
    I(this, u, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    I(this, l, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    I(this, d, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    I(this, h, void 0);
    I(this, p, void 0);
    if (((e == null ? void 0 : e.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    n(this, v, e), n(this, p, this.render(i));
  }
  get id() {
    return f(this, v);
  }
  get parentItem() {
    return f(this, u);
  }
  get firstChildItem() {
    return f(this, l);
  }
  get nextItem() {
    return f(this, d);
  }
  get previousItem() {
    return f(this, h);
  }
  get target() {
    return f(this, p);
  }
  remove() {
    var e, i;
    ((i = (e = this.parentItem) == null ? void 0 : e.firstChildItem) == null ? void 0 : i.id) == this.id && n(this.parentItem, l, f(this, d)), this.previousItem && n(this.previousItem, d, f(this, d)), this.nextItem && n(this.nextItem, h, f(this, h)), n(this, u, void 0), n(this, d, void 0), n(this, h, void 0), f(this, p).remove();
  }
  append(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove();
    const i = this.firstChildItem && [this.firstChildItem, ...g(this.firstChildItem)], r = i == null ? void 0 : i.slice(-1)[0];
    n(e, u, this), r ? r.after(e) : (n(this, l, e), this.target.append(e.target));
  }
  before(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, h, this.previousItem), this.previousItem ? n(this.previousItem, d, e) : this.parentItem && n(this.parentItem, l, e), n(e, u, this.parentItem), n(e, d, this), n(this, h, e), this.target.before(e.target);
  }
  after(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, d, this.nextItem), this.nextItem && n(this.nextItem, h, e), n(e, u, this.parentItem), n(e, h, this), n(this, d, e), this.target.after(e.target);
  }
}
v = new WeakMap(), u = new WeakMap(), l = new WeakMap(), d = new WeakMap(), h = new WeakMap(), p = new WeakMap();
function E(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), 1 + E(t, r.id, void 0) + E(t, e, r.id)) : 0;
}
function B(t) {
  if (t.filter((o) => o.parentId == null && o.previousId == null).length != 1 && t.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (t.map((o) => o.id).some((o, w, x) => x.indexOf(o) != w))
    throw new Error("Found duplicated instances of ids");
  if (t.map((o) => o.previousId + "_" + o.parentId).some((o, w, x) => x.indexOf(o) != w))
    throw new Error("Some of the items have the same previousId");
  if (E(t) != t.length)
    throw new Error("Linked list is not valid");
}
function b(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), [
    r,
    ...b(t, r.id, void 0),
    ...b(t, e, r.id)
  ]) : [];
}
function _(t) {
  return B(t), b(t, void 0, void 0);
}
const N = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: S,
  getChildItems: C,
  getItemsBetween: F,
  getNextItem: L,
  getNextOrChildById: m,
  getNextSiblings: g,
  sortList: _,
  upsertAndReturnRoot: O,
  validateList: B
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as linkedList
};
//# sourceMappingURL=index.es.js.map
