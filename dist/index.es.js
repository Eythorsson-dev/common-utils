function s(t) {
  return t.next ? [t.next, ...s(t.next)] : [];
}
function u(t) {
  return t.firstChild ? [
    t.firstChild,
    ...u(t.firstChild),
    ...s(t.firstChild).flatMap((r) => [r, ...u(r)])
  ] : [];
}
function f(t, r, n = !1) {
  var i;
  if (t == null)
    return [];
  if (t.id == r.id)
    return [r];
  const e = n ? [] : f(t.firstChild, r);
  if (((i = e.slice(-1)[0]) == null ? void 0 : i.id) == r.id)
    return [t, ...e];
  if (t.next)
    return [t, ...e, ...f(t.next, r)];
  if (t.parent)
    return [t, ...e, ...f(t.parent, r, !0)].filter((a) => a.id != t.parent.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function h(t, r) {
  return f(t, r);
}
function o(t) {
  if (t.firstChild)
    return t.firstChild;
  if (t.next)
    return t.next;
  function r(n) {
    if (n.next)
      return n.next;
    if (n.parent)
      return r(n.parent);
  }
  return r(t);
}
function d(t, r, n) {
  const e = t.find((i) => i.parentId == r && i.previousId == n);
  return e ? (t = t.filter((i) => i.id != e.id), [
    e,
    ...d(t, e.id, void 0),
    ...d(t, r, e.id)
  ]) : [];
}
const x = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getChildItems: u,
  getItemsBetween: h,
  getNextBlock: o,
  getNextSiblings: s,
  sortList: d
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as linkedList
};
