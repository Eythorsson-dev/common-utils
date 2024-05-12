function c(e) {
  return e.nextItem ? [e.nextItem, ...c(e.nextItem)] : [];
}
function I(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...I(e.firstChildItem),
    ...c(e.firstChildItem).flatMap((t) => [t, ...I(t)])
  ] : [];
}
function s(e, t, i = !1) {
  var n;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const r = i ? [] : s(e.firstChildItem, t);
  if (((n = r.slice(-1)[0]) == null ? void 0 : n.id) == t.id)
    return [e, ...r];
  if (e.nextItem)
    return [e, ...r, ...s(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...r, ...s(e.parentItem, t, !0)].filter((d) => d.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function a(e, t) {
  return s(e, t);
}
function w(e) {
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
function f(e, t) {
  function i(r) {
    if (r.id == t)
      return r;
    let n;
    return r.firstChildItem && (n || (n = i(r.firstChildItem))), r.nextItem && (n || (n = i(r.nextItem))), n;
  }
  return i(e);
}
function m(e, t, i) {
  var n, d;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = t && f(t, e.id);
  if (r == null || ((n = r.parentItem) == null ? void 0 : n.id) != e.parentId || ((d = r.previousItem) == null ? void 0 : d.id) != e.previousId)
    if (r == null || r.remove(), r == null && (r = i(e)), t == null)
      t = r;
    else if (e.previousId) {
      const o = f(t, e.previousId);
      if (!o)
        throw new Error("Failed to render item, previous item is not rendered");
      o.after(r);
    } else if (e.parentId) {
      const o = f(t, e.parentId);
      if (!o)
        throw new Error("Failed to render item, parent item is not rendered");
      o.append(r);
    } else
      throw new Error("Failed to render item");
  return r.update(e), t;
}
function p(e, t, i) {
  const r = e.find((n) => n.parentId == t && n.previousId == i);
  return r ? (e = e.filter((n) => n.id != r.id), 1 + p(e, r.id, void 0) + p(e, t, r.id)) : 0;
}
function v(e) {
  if (e.filter((o) => o.parentId == null && o.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((o) => o.id).some((o, u, l) => l.indexOf(o) != u))
    throw new Error("Found duplicated instances of ids");
  if (e.map((o) => o.previousId + "_" + o.parentId).some((o, u, l) => l.indexOf(o) != u))
    throw new Error("Some of the items have the same previousId");
  if (p(e) != e.length)
    throw new Error("Linked list is not valid");
}
function h(e, t, i) {
  const r = e.find((n) => n.parentId == t && n.previousId == i);
  return r ? (e = e.filter((n) => n.id != r.id), [
    r,
    ...h(e, r.id, void 0),
    ...h(e, t, r.id)
  ]) : [];
}
function g(e) {
  return v(e), h(e, void 0, void 0);
}
const x = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: I,
  getItemsBetween: a,
  getNextItem: w,
  getNextOrChildById: f,
  getNextSiblings: c,
  sortList: g,
  upsertAndReturnRoot: m,
  validateList: v
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as linkedList
};
