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
function a(t, e) {
  return f(t, e);
}
function m(t) {
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
function d(t, e, n) {
  const r = t.find((i) => i.parentId == e && i.previousId == n);
  return r ? (t = t.filter((i) => i.id != r.id), [
    r,
    ...d(t, r.id, void 0),
    ...d(t, e, r.id)
  ]) : [];
}
const h = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: u,
  getItemsBetween: a,
  getNextBlock: m,
  getNextSiblings: I,
  sortList: d
}, Symbol.toStringTag, { value: "Module" }));
export {
  h as linkedList
};
