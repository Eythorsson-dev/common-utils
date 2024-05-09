function I(t) {
  return t.nextItem ? [t.nextItem, ...I(t.nextItem)] : [];
}
function u(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...u(t.firstChildItem),
    ...I(t.firstChildItem).flatMap((e) => [e, ...u(e)])
  ] : [];
}
function o(t, e, n = !1) {
  var i;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = n ? [] : o(t.firstChildItem, e);
  if (((i = r.slice(-1)[0]) == null ? void 0 : i.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...o(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...o(t.parentItem, e, !0)].filter((l) => l.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function h(t, e) {
  return o(t, e);
}
function c(t) {
  if (t.firstChildItem)
    return t.firstChildItem;
  if (t.nextItem)
    return t.nextItem;
  function e(n) {
    if (n.nextItem)
      return n.nextItem;
    if (n.parentItem)
      return e(n.parentItem);
  }
  return e(t);
}
function p(t, e) {
  function n(r) {
    if (r.id == e)
      return r;
    let i;
    return r.firstChildItem && (i || (i = n(r.firstChildItem))), r.nextItem && (i || (i = n(r.nextItem))), i;
  }
  return n(t);
}
function a(t, e, n) {
  const r = t.find((i) => i.parentId == e && i.previousId == n);
  return r ? (t = t.filter((i) => i.id != r.id), [
    r,
    ...a(t, r.id, void 0),
    ...a(t, e, r.id)
  ]) : [];
}
function v(t) {
  if (t.filter((d) => d.parentId == null && d.previousId == null).length != 1 && t.length > 0)
    throw new Error("Cannot set value, failed to determine the start of the linked list");
  if (t.map((d) => d.id).some((d, f, s) => s.indexOf(d) != f))
    throw new Error("Cannot set value, found duplicated instances of ids");
  if (t.map((d) => d.previousId + "_" + d.parentId).some((d, f, s) => s.indexOf(d) != f))
    throw new Error("Cannot set value, some of the blocks have the same prevId");
}
const x = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: u,
  getItemsBetween: h,
  getNextItem: c,
  getNextOrChildById: p,
  getNextSiblings: I,
  sortList: a,
  validateList: v
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as linkedList
};
