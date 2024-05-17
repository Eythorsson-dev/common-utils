var k = (e, t, i) => {
  if (!t.has(e))
    throw TypeError("Cannot " + i);
};
var o = (e, t, i) => (k(e, t, "read from private field"), i ? i.call(e) : t.get(e)), I = (e, t, i) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, i);
}, d = (e, t, i, r) => (k(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
function u(e) {
  return e.nextItem ? [e.nextItem, ...u(e.nextItem)] : [];
}
function w(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...w(e.firstChildItem),
    ...u(e.firstChildItem).flatMap((t) => [t, ...w(t)])
  ] : [];
}
function c(e, t, i = !1) {
  var s;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const r = i ? [] : c(e.firstChildItem, t);
  if (((s = r.slice(-1)[0]) == null ? void 0 : s.id) == t.id)
    return [e, ...r];
  if (e.nextItem)
    return [e, ...r, ...c(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...r, ...c(e.parentItem, t, !0)].filter((h) => h.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function F(e, t) {
  return c(e, t);
}
function L(e) {
  if (e.firstChildItem)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function t(i) {
    if (i.nextItem)
      return i.nextItem;
    if (i.parentItem)
      return t(i.parentItem);
  }
  return t(e);
}
function x(e, t) {
  function i(r) {
    if (r.id == t)
      return r;
    let s;
    return r.firstChildItem && (s || (s = i(r.firstChildItem))), r.nextItem && (s || (s = i(r.nextItem))), s;
  }
  return i(e);
}
function O(e, t, i) {
  var s, h;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = t && x(t, e.id);
  if (r == null || ((s = r.parentItem) == null ? void 0 : s.id) != e.parentId || ((h = r.previousItem) == null ? void 0 : h.id) != e.previousId) {
    if (t && r && t.id == r.id)
      if (r.firstChildItem)
        t = r.firstChildItem;
      else if (r.nextItem)
        t = r.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (r == null && (r = i(e)), r == null || r.remove(), t == null)
      t = r;
    else if (e.previousId) {
      const n = x(t, e.previousId);
      if (!n)
        throw new Error("Failed to render item, previous item is not rendered");
      n.after(r);
    } else if (e.parentId) {
      const n = x(t, e.parentId);
      if (!n)
        throw new Error("Failed to render item, parent item is not rendered");
      n.append(r);
    } else
      t.before(r), t = r;
  }
  return r.update(e.data), t;
}
var l, m, a, v, f, p;
class S {
  constructor(t, i) {
    I(this, l, void 0);
    I(this, m, void 0);
    I(this, a, void 0);
    I(this, v, void 0);
    I(this, f, void 0);
    I(this, p, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    d(this, l, t), d(this, p, this.render(i));
  }
  get id() {
    return o(this, l);
  }
  get parentItem() {
    return o(this, m);
  }
  set parentItem(t) {
    d(this, m, t);
  }
  get firstChildItem() {
    return o(this, a);
  }
  set firstChildItem(t) {
    d(this, a, t);
  }
  get nextItem() {
    return o(this, v);
  }
  set nextItem(t) {
    d(this, v, t);
  }
  get previousItem() {
    return o(this, f);
  }
  set previousItem(t) {
    d(this, f, t);
  }
  get target() {
    return o(this, p);
  }
  remove() {
    var t, i;
    if (((i = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : i.id) == this.id && (this.parentItem.firstChildItem = this.nextItem), this.firstChildItem) {
      const r = [this.firstChildItem, ...u(this.firstChildItem)], s = r.map((n) => n.target), h = r.slice(-1)[0];
      this.previousItem ? r.forEach(
        (n) => this.previousItem.append(n)
      ) : (r.forEach((n) => n.parentItem = this.parentItem), this.target.replaceWith(...s), r[0] && (r[0].previousItem = this.previousItem), h && (h.nextItem = this.nextItem), this.nextItem && (this.nextItem.previousItem = r[0]));
    }
    this.previousItem && (this.previousItem.nextItem = this.nextItem), this.nextItem && d(this.nextItem, f, o(this, f)), this.parentItem = void 0, this.firstChildItem = void 0, this.nextItem = void 0, this.previousItem = void 0, o(this, p).remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const i = this.firstChildItem && [this.firstChildItem, ...u(this.firstChildItem)], r = i == null ? void 0 : i.slice(-1)[0];
    t.parentItem = this, r ? r.after(t) : (this.firstChildItem = t, this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), t.previousItem = this.previousItem, this.previousItem ? this.previousItem.nextItem = t : this.parentItem && (this.parentItem.firstChildItem = t), t.parentItem = this.parentItem, t.nextItem = this, this.previousItem = t, this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), t.nextItem = this.nextItem, this.nextItem && (this.nextItem.previousItem = t), t.parentItem = this.parentItem, t.previousItem = this, this.nextItem = t, this.target.after(t.target);
  }
}
l = new WeakMap(), m = new WeakMap(), a = new WeakMap(), v = new WeakMap(), f = new WeakMap(), p = new WeakMap();
function E(e, t, i) {
  const r = e.find((s) => s.parentId == t && s.previousId == i);
  return r ? (e = e.filter((s) => s.id != r.id), 1 + E(e, r.id, void 0) + E(e, t, r.id)) : 0;
}
function B(e) {
  if (e.filter((n) => n.parentId == null && n.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((n) => n.id).some((n, g, C) => C.indexOf(n) != g))
    throw new Error("Found duplicated instances of ids");
  if (e.map((n) => n.previousId + "_" + n.parentId).some((n, g, C) => C.indexOf(n) != g))
    throw new Error("Some of the items have the same previousId");
  if (E(e) != e.length)
    throw new Error("Linked list is not valid");
}
function b(e, t, i) {
  const r = e.find((s) => s.parentId == t && s.previousId == i);
  return r ? (e = e.filter((s) => s.id != r.id), [
    r,
    ...b(e, r.id, void 0),
    ...b(e, t, r.id)
  ]) : [];
}
function _(e) {
  return B(e), b(e, void 0, void 0);
}
const N = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: S,
  getChildItems: w,
  getItemsBetween: F,
  getNextItem: L,
  getNextOrChildById: x,
  getNextSiblings: u,
  sortList: _,
  upsertAndReturnRoot: O,
  validateList: B
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as linkedList
};
//# sourceMappingURL=index.es.js.map
