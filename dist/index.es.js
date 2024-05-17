var k = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var o = (e, t, r) => (k(e, t, "read from private field"), r ? r.call(e) : t.get(e)), I = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, d = (e, t, r, i) => (k(e, t, "write to private field"), i ? i.call(e, r) : t.set(e, r), r);
function l(e) {
  return e.nextItem ? [e.nextItem, ...l(e.nextItem)] : [];
}
function w(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...w(e.firstChildItem),
    ...l(e.firstChildItem).flatMap((t) => [t, ...w(t)])
  ] : [];
}
function c(e, t, r = !1) {
  var n;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const i = r ? [] : c(e.firstChildItem, t);
  if (((n = i.slice(-1)[0]) == null ? void 0 : n.id) == t.id)
    return [e, ...i];
  if (e.nextItem)
    return [e, ...i, ...c(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...i, ...c(e.parentItem, t, !0)].filter((h) => h.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function O(e, t) {
  return c(e, t);
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
    let n;
    return i.firstChildItem && (n || (n = r(i.firstChildItem))), i.nextItem && (n || (n = r(i.nextItem))), n;
  }
  return r(e);
}
function L(e, t, r) {
  var n, h;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let i = t && C(t, e.id);
  if (i == null || ((n = i.parentItem) == null ? void 0 : n.id) != e.parentId || ((h = i.previousItem) == null ? void 0 : h.id) != e.previousId) {
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
      const s = C(t, e.previousId);
      if (!s)
        throw new Error("Failed to render item, previous item is not rendered");
      s.after(i);
    } else if (e.parentId) {
      const s = C(t, e.parentId);
      if (!s)
        throw new Error("Failed to render item, parent item is not rendered");
      s.append(i);
    } else
      throw new Error(`Failed to render item (${i == null ? void 0 : i.id})`);
  }
  return i.update(e.data), t;
}
var u, m, a, v, f, p;
class S {
  constructor(t, r) {
    I(this, u, void 0);
    I(this, m, void 0);
    I(this, a, void 0);
    I(this, v, void 0);
    I(this, f, void 0);
    I(this, p, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    d(this, u, t), d(this, p, this.render(r));
  }
  get id() {
    return o(this, u);
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
    var t, r;
    if (((r = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : r.id) == this.id && (this.parentItem.firstChildItem = this.nextItem), this.firstChildItem) {
      const i = [this.firstChildItem, ...l(this.firstChildItem)], n = i.map((s) => s.target), h = i.slice(-1)[0];
      if (this.previousItem) {
        if (i.forEach((s) => s.parentItem = this.previousItem), this.previousItem.firstChildItem) {
          const s = this.previousItem.firstChildItem && l(this.previousItem.firstChildItem).slice(-1)[0];
          s.nextItem = this.firstChildItem, this.firstChildItem.previousItem = s;
        } else
          this.previousItem.firstChildItem = i[0];
        this.previousItem.target.append(...n);
      } else
        i.forEach((s) => s.parentItem = this.parentItem), this.target.replaceWith(...n), i[0] && (i[0].previousItem = this.previousItem), h && (h.nextItem = this.nextItem), this.nextItem && (this.nextItem.previousItem = i[0]);
    }
    this.previousItem && (this.previousItem.nextItem = this.nextItem), this.nextItem && d(this.nextItem, f, o(this, f)), this.parentItem = void 0, this.firstChildItem = void 0, this.nextItem = void 0, this.previousItem = void 0, o(this, p).remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const r = this.firstChildItem && [this.firstChildItem, ...l(this.firstChildItem)], i = r == null ? void 0 : r.slice(-1)[0];
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
u = new WeakMap(), m = new WeakMap(), a = new WeakMap(), v = new WeakMap(), f = new WeakMap(), p = new WeakMap();
function E(e, t, r) {
  const i = e.find((n) => n.parentId == t && n.previousId == r);
  return i ? (e = e.filter((n) => n.id != i.id), 1 + E(e, i.id, void 0) + E(e, t, i.id)) : 0;
}
function F(e) {
  if (e.filter((s) => s.parentId == null && s.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((s) => s.id).some((s, x, g) => g.indexOf(s) != x))
    throw new Error("Found duplicated instances of ids");
  if (e.map((s) => s.previousId + "_" + s.parentId).some((s, x, g) => g.indexOf(s) != x))
    throw new Error("Some of the items have the same previousId");
  if (E(e) != e.length)
    throw new Error("Linked list is not valid");
}
function b(e, t, r) {
  const i = e.find((n) => n.parentId == t && n.previousId == r);
  return i ? (e = e.filter((n) => n.id != i.id), [
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
  getNextSiblings: l,
  sortList: _,
  upsertAndReturnRoot: L,
  validateList: F
}, Symbol.toStringTag, { value: "Module" }));
export {
  N as linkedList
};
//# sourceMappingURL=index.es.js.map
