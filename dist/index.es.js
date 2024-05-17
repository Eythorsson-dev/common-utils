var k = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var o = (e, t, r) => (k(e, t, "read from private field"), r ? r.call(e) : t.get(e)), I = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, d = (e, t, r, i) => (k(e, t, "write to private field"), i ? i.call(e, r) : t.set(e, r), r);
function p(e) {
  return e.nextItem ? [e.nextItem, ...p(e.nextItem)] : [];
}
function w(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...w(e.firstChildItem),
    ...p(e.firstChildItem).flatMap((t) => [t, ...w(t)])
  ] : [];
}
function x(e, t, r = !1) {
  var s;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const i = r ? [] : x(e.firstChildItem, t);
  if (((s = i.slice(-1)[0]) == null ? void 0 : s.id) == t.id)
    return [e, ...i];
  if (e.nextItem)
    return [e, ...i, ...x(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...i, ...x(e.parentItem, t, !0)].filter((h) => h.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function O(e, t) {
  return x(e, t);
}
function B(e) {
  if (e.firstChildItem)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function t(r) {
    if (r.nextItem)
      return r.nextItem;
    if (r.parentItem)
      return t(r.parentItem);
  }
  return t(e);
}
function C(e, t) {
  function r(i) {
    if (i.id == t)
      return i;
    let s;
    return i.firstChildItem && (s || (s = r(i.firstChildItem))), i.nextItem && (s || (s = r(i.nextItem))), s;
  }
  return r(e);
}
function L(e, t, r) {
  var s, h;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let i = t && C(t, e.id);
  if (i == null || ((s = i.parentItem) == null ? void 0 : s.id) != e.parentId || ((h = i.previousItem) == null ? void 0 : h.id) != e.previousId) {
    if (t && i && t.id == i.id)
      if (i.firstChildItem)
        t = i.firstChildItem;
      else if (i.nextItem)
        t = i.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (i == null && (i = r(e)), i == null || i.remove(), t == null)
      t = i;
    else if (e.previousId) {
      const n = C(t, e.previousId);
      if (!n)
        throw new Error("Failed to render item, previous item is not rendered");
      n.after(i);
    } else if (e.parentId) {
      const n = C(t, e.parentId);
      if (!n)
        throw new Error("Failed to render item, parent item is not rendered");
      n.append(i);
    } else
      throw new Error(`Failed to render item (${i == null ? void 0 : i.id})`);
  }
  return i.update(e.data), t;
}
var m, a, v, c, f, l;
class S {
  constructor(t, r) {
    I(this, m, void 0);
    I(this, a, void 0);
    I(this, v, void 0);
    I(this, c, void 0);
    I(this, f, void 0);
    I(this, l, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    d(this, m, t), d(this, l, this.render(r));
  }
  get id() {
    return o(this, m);
  }
  get parentItem() {
    return o(this, a);
  }
  set parentItem(t) {
    d(this, a, t);
  }
  get firstChildItem() {
    return o(this, v);
  }
  set firstChildItem(t) {
    d(this, v, t);
  }
  get nextItem() {
    return o(this, c);
  }
  set nextItem(t) {
    d(this, c, t);
  }
  get previousItem() {
    return o(this, f);
  }
  set previousItem(t) {
    d(this, f, t);
  }
  get target() {
    return o(this, l);
  }
  remove() {
    var t, r;
    if (((r = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : r.id) == this.id && (this.parentItem.firstChildItem = this.nextItem), this.firstChildItem) {
      const i = [this.firstChildItem, ...p(this.firstChildItem)], s = i.map((n) => n.target), h = i.slice(-1)[0];
      if (this.previousItem) {
        i.forEach((u) => u.parentItem = this.previousItem);
        const n = this.previousItem.firstChildItem && p(this.previousItem.firstChildItem).slice(-1)[0];
        n && (n.nextItem = this.firstChildItem, this.firstChildItem.previousItem = n), this.previousItem.target.append(...s);
      } else
        i.forEach((n) => n.parentItem = this.parentItem), this.target.replaceWith(...s), i[0] && (i[0].previousItem = this.previousItem), h && (h.nextItem = this.nextItem), this.nextItem && (this.nextItem.previousItem = i[0]);
    }
    this.previousItem && (this.previousItem.nextItem = this.nextItem), this.nextItem && d(this.nextItem, f, o(this, f)), this.parentItem = void 0, this.firstChildItem = void 0, this.nextItem = void 0, this.previousItem = void 0, o(this, l).remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const r = this.firstChildItem && [this.firstChildItem, ...p(this.firstChildItem)], i = r == null ? void 0 : r.slice(-1)[0];
    i ? i.after(t) : (this.firstChildItem = t, t.parentItem = this, this.target.append(t.target));
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
m = new WeakMap(), a = new WeakMap(), v = new WeakMap(), c = new WeakMap(), f = new WeakMap(), l = new WeakMap();
function E(e, t, r) {
  const i = e.find((s) => s.parentId == t && s.previousId == r);
  return i ? (e = e.filter((s) => s.id != i.id), 1 + E(e, i.id, void 0) + E(e, t, i.id)) : 0;
}
function F(e) {
  if (e.filter((n) => n.parentId == null && n.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((n) => n.id).some((n, u, g) => g.indexOf(n) != u))
    throw new Error("Found duplicated instances of ids");
  if (e.map((n) => n.previousId + "_" + n.parentId).some((n, u, g) => g.indexOf(n) != u))
    throw new Error("Some of the items have the same previousId");
  if (E(e) != e.length)
    throw new Error("Linked list is not valid");
}
function b(e, t, r) {
  const i = e.find((s) => s.parentId == t && s.previousId == r);
  return i ? (e = e.filter((s) => s.id != i.id), [
    i,
    ...b(e, i.id, void 0),
    ...b(e, t, i.id)
  ]) : [];
}
function _(e) {
  return F(e), b(e, void 0, void 0);
}
const N = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: S,
  getChildItems: w,
  getItemsBetween: O,
  getNextItem: B,
  getNextOrChildById: C,
  getNextSiblings: p,
  sortList: _,
  upsertAndReturnRoot: L,
  validateList: F
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as linkedList
};
