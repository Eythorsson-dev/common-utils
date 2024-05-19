var k = (t, e, i) => {
  if (!e.has(t))
    throw TypeError("Cannot " + i);
};
var h = (t, e, i) => (k(t, e, "read from private field"), i ? i.call(t) : e.get(t)), I = (t, e, i) => {
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
function B(t, e) {
  return c(t, e);
}
function F(t) {
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
function E(t) {
  if (!t)
    return [];
  const e = [
    t.getDetails()
  ];
  return t.firstChildItem && e.push(...E(t.firstChildItem)), t.nextItem && e.push(...E(t.nextItem)), e;
}
function L(t, e, i) {
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
      const d = m(e, t.previousId);
      if (!d)
        throw new Error("Failed to render item, previous item is not rendered");
      d.after(r);
    } else if (t.parentId) {
      const d = m(e, t.parentId);
      if (!d)
        throw new Error("Failed to render item, parent item is not rendered");
      d.append(r);
    } else
      e.before(r), e = r;
  }
  return r.update(t.data), e;
}
var v, u, l, o, f, p;
class N {
  constructor(e, i) {
    I(this, v, void 0);
    I(this, u, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    I(this, l, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    I(this, o, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    I(this, f, void 0);
    I(this, p, void 0);
    if (((e == null ? void 0 : e.trim()) ?? "").length == 0)
      throw new Error("id is not valid");
    n(this, v, e), n(this, p, this.render(i));
  }
  get id() {
    return h(this, v);
  }
  get parentItem() {
    return h(this, u);
  }
  get firstChildItem() {
    return h(this, l);
  }
  get nextItem() {
    return h(this, o);
  }
  get previousItem() {
    return h(this, f);
  }
  get target() {
    return h(this, p);
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
    ((i = (e = this.parentItem) == null ? void 0 : e.firstChildItem) == null ? void 0 : i.id) == this.id && n(this.parentItem, l, h(this, o)), this.previousItem && n(this.previousItem, o, h(this, o)), this.nextItem && n(this.nextItem, f, h(this, f)), n(this, u, void 0), n(this, o, void 0), n(this, f, void 0), h(this, p).remove();
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
    e.remove(), n(e, f, this.previousItem), this.previousItem ? n(this.previousItem, o, e) : this.parentItem && n(this.parentItem, l, e), n(e, u, this.parentItem), n(e, o, this), n(this, f, e), this.target.before(e.target);
  }
  after(e) {
    if (e.id == this.id)
      throw new Error("Cannot append item before itself");
    e.remove(), n(e, o, this.nextItem), this.nextItem && n(this.nextItem, f, e), n(e, u, this.parentItem), n(e, f, this), n(this, o, e), this.target.after(e.target);
  }
}
v = new WeakMap(), u = new WeakMap(), l = new WeakMap(), o = new WeakMap(), f = new WeakMap(), p = new WeakMap();
function b(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), 1 + b(t, r.id, void 0) + b(t, e, r.id)) : 0;
}
function S(t) {
  if (t.filter((d) => d.parentId == null && d.previousId == null).length != 1 && t.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (t.map((d) => d.id).some((d, w, x) => x.indexOf(d) != w))
    throw new Error("Found duplicated instances of ids");
  if (t.map((d) => d.previousId + "_" + d.parentId).some((d, w, x) => x.indexOf(d) != w))
    throw new Error("Some of the items have the same previousId");
  if (b(t) != t.length)
    throw new Error("Linked list is not valid");
}
function D(t, e, i) {
  const r = t.find((s) => s.parentId == e && s.previousId == i);
  return r ? (t = t.filter((s) => s.id != r.id), [
    r,
    ...D(t, r.id, void 0),
    ...D(t, e, r.id)
  ]) : [];
}
function O(t) {
  return S(t), D(t, void 0, void 0);
}
const y = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ItemElement: N,
  getChildAndNextSiblingData: E,
  getChildItems: C,
  getItemsBetween: B,
  getNextItem: F,
  getNextOrChildById: m,
  getNextSiblings: g,
  sortList: O,
  upsertAndReturnRoot: L,
  validateList: S
}, Symbol.toStringTag, { value: "Module" }));
export {
  y as linkedList
};
//# sourceMappingURL=index.es.js.map
