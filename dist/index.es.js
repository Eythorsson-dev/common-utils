function l(t) {
  return t.nextItem ? [t.nextItem, ...l(t.nextItem)] : [];
}
function a(t) {
  return t.firstChildItem ? [
    t.firstChildItem,
    ...a(t.firstChildItem),
    ...l(t.firstChildItem).flatMap((e) => [e, ...a(e)])
  ] : [];
}
function d(t, e, i = !1) {
  var o;
  if (t == null)
    return [];
  if (t.id == e.id)
    return [e];
  const r = i ? [] : d(t.firstChildItem, e);
  if (((o = r.slice(-1)[0]) == null ? void 0 : o.id) == e.id)
    return [t, ...r];
  if (t.nextItem)
    return [t, ...r, ...d(t.nextItem, e)];
  if (t.parentItem)
    return [t, ...r, ...d(t.parentItem, e, !0)].filter((I) => I.id != t.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function p(t, e) {
  return d(t, e);
}
function h(t) {
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
function u(t, e, i) {
  const r = t.find((o) => o.parentId == e && o.previousId == i);
  return r ? (t = t.filter((o) => o.id != r.id), [
    r,
    ...u(t, r.id, void 0),
    ...u(t, e, r.id)
  ]) : [];
}
function c(t) {
  if (t.filter((n) => n.parentId == null && n.previousId == null).length != 1 && t.length > 0)
    throw new Error("Cannot set value, failed to determine the start of the linked list");
  if (t.map((n) => n.id).some((n, s, f) => f.indexOf(n) != s))
    throw new Error("Cannot set value, found duplicated instances of ids");
  if (t.map((n) => n.previousId + "_" + n.parentId).some((n, s, f) => f.indexOf(n) != s))
    throw new Error("Cannot set value, some of the blocks have the same prevId");
}
const v = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: a,
  getItemsBetween: p,
  getNextItem: h,
  getNextSiblings: l,
  sortList: u,
  validateList: c
}, Symbol.toStringTag, { value: "Module" }));
export {
  v as linkedList
};
