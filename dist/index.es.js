function d(t) {
  return t.nextItem ? [t.nextItem, ...d(t.nextItem)] : [];
}
function u(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...u(t.firstChildItem),
    ...d(t.firstChildItem).flatMap((e) => [e, ...u(e)])
  ] : [];
}
function f(t, e, n = !1) {
  var i;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = n ? [] : f(t.firstChildItem, e);
  if (((i = r.slice(-1)[0]) == null ? void 0 : i.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...f(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...f(t.parentItem, e, !0)].filter((s) => s.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function o(t, e) {
  return f(t, e);
}
function a(t) {
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
function I(t, e, n) {
  const r = t.find((i) => i.parentId == e && i.previousId == n);
  return r ? (t = t.filter((i) => i.id != r.id), [
    r,
    ...I(t, r.id, void 0),
    ...I(t, e, r.id)
  ]) : [];
}
const l = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: u,
  getItemsBetween: o,
  getNextItem: a,
  getNextSiblings: d,
  sortList: I
}, Symbol.toStringTag, { value: "Module" }));
export {
  l as linkedList
};
