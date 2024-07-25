var rt = Object.defineProperty;
var nt = (e, t, r) => t in e ? rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var E = (e, t, r) => (nt(e, typeof t != "symbol" ? t + "" : t, r), r), j = (e, t, r) => {
  if (!t.has(e))
    throw TypeError("Cannot " + r);
};
var d = (e, t, r) => (j(e, t, "read from private field"), r ? r.call(e) : t.get(e)), l = (e, t, r) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, r);
}, h = (e, t, r, n) => (j(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
var M = (e, t, r) => (j(e, t, "access private method"), r);
function V(e) {
  return e.nextItem ? [e.nextItem, ...V(e.nextItem)] : [];
}
function F(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...F(e.firstChildItem),
    ...V(e.firstChildItem).flatMap((t) => [t, ...F(t)])
  ] : [];
}
function H(e, t, r = !1) {
  var i;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const n = r ? [] : H(e.firstChildItem, t);
  if (((i = n.slice(-1)[0]) == null ? void 0 : i.id) == t.id)
    return [e, ...n];
  if (e.nextItem)
    return [e, ...n, ...H(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...n, ...H(e.parentItem, t, !0)].filter((o) => o.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function it(e, t) {
  return H(e, t);
}
function Q(e, t) {
  if (e.firstChildItem && (t == null ? void 0 : t.ignoreChildren) != !0)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function r(n) {
    if (n.nextItem)
      return n.nextItem;
    if (n.parentItem)
      return r(n.parentItem);
  }
  return r(e);
}
function O(e, t) {
  function r(n) {
    if (n.id == t)
      return n;
    let i;
    return n.firstChildItem && (i || (i = r(n.firstChildItem))), n.nextItem && (i || (i = r(n.nextItem))), i;
  }
  return r(e);
}
function X(e, t) {
  if (t.contains(e.target))
    return;
  function r(n) {
    let i;
    return n.firstChildItem && (i || (i = r(n.firstChildItem))), n.nextItem && (i || (i = r(n.nextItem))), n.target.contains(t) && (i || (i = n)), i;
  }
  return r(e);
}
function z(e) {
  if (!e)
    return [];
  const t = [
    e.getDetails()
  ];
  return e.firstChildItem && t.push(...z(e.firstChildItem)), e.nextItem && t.push(...z(e.nextItem)), t;
}
function ot(e) {
  function t(r) {
    return r != null && r.nextItem ? t(r.nextItem) : r != null && r.firstChildItem ? t(r.firstChildItem) : r;
  }
  return t(e == null ? void 0 : e.firstChildItem);
}
function Y(e, t, r) {
  var i, o;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let n = t && O(t, e.id);
  if (n == null || ((i = n.parentItem) == null ? void 0 : i.id) != e.parentId || ((o = n.previousItem) == null ? void 0 : o.id) != e.previousId) {
    if (t && n && t.id == n.id)
      if (n.firstChildItem)
        t = n.firstChildItem;
      else if (n.nextItem)
        t = n.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (n == null && (n = r(e)), n == null || n.remove(), t == null)
      t = n;
    else if (e.previousId) {
      const s = O(t, e.previousId);
      if (!s)
        throw new Error("Failed to render item, previous item is not rendered");
      s.after(n);
    } else if (e.parentId) {
      const s = O(t, e.parentId);
      if (!s)
        throw new Error("Failed to render item, parent item is not rendered");
      s.append(n);
    } else
      t.before(n), t = n;
  }
  return n.update(e.data), t;
}
var S, D, b, x, p, v, A;
class st {
  constructor(t, r) {
    l(this, S, void 0);
    l(this, D, void 0);
    l(this, b, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    l(this, x, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    l(this, p, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    l(this, v, void 0);
    l(this, A, void 0);
    var n, i;
    if ((((n = t == null ? void 0 : t.toString()) == null ? void 0 : n.trim()) ?? "").length == 0)
      throw new Error("id is required");
    if ((((i = r == null ? void 0 : r.toString()) == null ? void 0 : i.trim()) ?? "").length == 0)
      throw new Error("type is required");
    h(this, S, t), h(this, D, r);
  }
  get id() {
    return d(this, S);
  }
  get type() {
    return d(this, D);
  }
  get parentItem() {
    return d(this, b);
  }
  get firstChildItem() {
    return d(this, x);
  }
  get nextItem() {
    return d(this, p);
  }
  get previousItem() {
    return d(this, v);
  }
  get target() {
    if (!d(this, A))
      throw new Error("Failed to get target. Please call the .initialized(data) method before fetching the target");
    return d(this, A);
  }
  init(t) {
    if (d(this, A))
      throw new Error("The target has already been initialized");
    h(this, A, this.render(t));
  }
  getDetails() {
    var t, r;
    return {
      id: this.id,
      type: this.type,
      parentId: (t = this.parentItem) == null ? void 0 : t.id,
      previousId: (r = this.previousItem) == null ? void 0 : r.id,
      data: this.data
    };
  }
  remove() {
    var t, r, n;
    ((r = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : r.id) == this.id && h(this.parentItem, x, d(this, p)), this.previousItem && h(this.previousItem, p, d(this, p)), this.nextItem && h(this.nextItem, v, d(this, v)), h(this, b, void 0), h(this, p, void 0), h(this, v, void 0), (n = d(this, A)) == null || n.remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    if (t.target.contains(this.target))
      throw new Error("Cannot append a parent into one of its children");
    t.remove();
    const r = this.firstChildItem && [this.firstChildItem, ...V(this.firstChildItem)], n = r == null ? void 0 : r.slice(-1)[0];
    h(t, b, this), n ? n.after(t) : (h(this, x, t), this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    if (t.target.contains(this.target))
      throw new Error("Cannot append a parent into one of its children");
    t.remove(), h(t, v, this.previousItem), this.previousItem ? h(this.previousItem, p, t) : this.parentItem && h(this.parentItem, x, t), h(t, b, this.parentItem), h(t, p, this), h(this, v, t), this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    if (t.target.contains(this.target))
      throw new Error("Cannot append a parent into one of its children");
    t.remove(), h(t, p, this.nextItem), this.nextItem && h(this.nextItem, v, t), h(t, b, this.parentItem), h(t, v, this), h(this, p, t), this.target.after(t.target);
  }
}
S = new WeakMap(), D = new WeakMap(), b = new WeakMap(), x = new WeakMap(), p = new WeakMap(), v = new WeakMap(), A = new WeakMap();
function K(e, t, r) {
  const n = e.find((i) => i.parentId == t && i.previousId == r);
  return n ? (e = e.filter((i) => i.id != n.id), 1 + K(e, n.id, void 0) + K(e, t, n.id)) : 0;
}
function q(e) {
  if (e.filter((s) => s.parentId == null && s.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((s) => s.id).some((s, c, g) => g.indexOf(s) != c))
    throw new Error("Found duplicated instances of ids");
  if (e.map((s) => s.previousId + "_" + s.parentId).some((s, c, g) => g.indexOf(s) != c))
    throw new Error("Some of the items have the same previousId");
  if (K(e) != e.length)
    throw new Error("Linked list is not valid");
}
function W(e, t, r) {
  const n = e.find((i) => i.parentId == t && i.previousId == r);
  return n ? (e = e.filter((i) => i.id != n.id), [
    n,
    ...W(e, n.id, void 0),
    ...W(e, t, n.id)
  ]) : [];
}
function $(e) {
  return q(e), W(e, void 0, void 0);
}
var P, a;
class dt {
  constructor(t) {
    l(this, P, void 0);
    l(this, a, void 0);
    h(this, P, t);
  }
  get rootItem() {
    return d(this, a);
  }
  set rootItem(t) {
    h(this, a, t);
  }
  get activeItem() {
    if (document.activeElement != null)
      return X(d(this, a), document.activeElement);
  }
  get value() {
    return z(d(this, a));
  }
  set value(t) {
    q(t);
    const r = $(t);
    if (r.length != t.length)
      throw new Error("Cannot set value, invalid linked list");
    const n = d(this, a);
    r.forEach((i, o) => {
      this.upsert(i), o == 0 && (d(this, P).replaceChildren(d(this, a).target), n == null || n.remove());
    });
  }
  upsert(t) {
    h(this, a, Y(t, d(this, a), () => this.createItem(t.type, t.id, t.data)));
  }
  getItemById(t) {
    return O(d(this, a), t);
  }
  deleteItemById(t) {
    var r, n;
    if (t == d(this, a).id) {
      const i = Q(this.rootItem);
      (r = this.getItemById(t)) == null || r.remove(), h(this, a, i);
    } else
      (n = this.getItemById(t)) == null || n.remove();
  }
}
P = new WeakMap(), a = new WeakMap();
var T;
class ut {
  constructor(t) {
    l(this, T, void 0);
    h(this, T, t);
  }
  get context() {
    return d(this, T);
  }
}
T = new WeakMap();
const Nt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Command: ut,
  ItemContainerElement: dt,
  ItemElement: st,
  getChildAndNextSiblingData: z,
  getChildItems: F,
  getItemsBetween: it,
  getLastChild: ot,
  getNextItem: Q,
  getNextOrChildById: O,
  getNextOrChildByTarget: X,
  getNextSiblings: V,
  sortList: $,
  upsertAndReturnRoot: Y,
  validateList: q
}, Symbol.toStringTag, { value: "Module" }));
let k;
const ht = new Uint8Array(16);
function ct() {
  if (!k && (k = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !k))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return k(ht);
}
const f = [];
for (let e = 0; e < 256; ++e)
  f.push((e + 256).toString(16).slice(1));
function lt(e, t = 0) {
  return f[e[t + 0]] + f[e[t + 1]] + f[e[t + 2]] + f[e[t + 3]] + "-" + f[e[t + 4]] + f[e[t + 5]] + "-" + f[e[t + 6]] + f[e[t + 7]] + "-" + f[e[t + 8]] + f[e[t + 9]] + "-" + f[e[t + 10]] + f[e[t + 11]] + f[e[t + 12]] + f[e[t + 13]] + f[e[t + 14]] + f[e[t + 15]];
}
const ft = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Z = {
  randomUUID: ft
};
function at(e, t, r) {
  if (Z.randomUUID && !t && !e)
    return Z.randomUUID();
  e = e || {};
  const n = e.random || (e.rng || ct)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, lt(n);
}
function G() {
  return at();
}
var w;
class Lt {
  constructor() {
    l(this, w, {});
  }
  On(t, r) {
    let n = G();
    return d(this, w)[t] = (d(this, w)[t] ?? []).concat({ Id: n, Execute: r }), n;
  }
  Once(t, r, n) {
    var i = G();
    return d(this, w)[t] = (d(this, w)[t] ?? []).concat({
      Id: i,
      Execute: (o) => {
        n && n(o) != !0 || (this.Off(t, i), r(o));
      }
    }), i;
  }
  Off(t, r) {
    var i;
    const n = (i = d(this, w)[t]) == null ? void 0 : i.findIndex((o) => o.Id == r);
    n >= 0 && d(this, w)[t].splice(n, 1);
  }
  Emit(t, r) {
    var i;
    var n = { preventDefault: !1 };
    return (i = d(this, w)[t]) == null || i.slice().forEach((o) => o.Execute({
      ...r,
      preventDefault() {
        n.preventDefault = !0;
      }
    })), n;
  }
}
w = new WeakMap();
function gt(e) {
  const t = [];
  var r = -1;
  const n = (e == null ? void 0 : e.OnAction) ?? (() => {
  });
  function i() {
    var m, C;
    if (!g())
      return;
    const u = t[r];
    r--, (m = u.BeforeRedo) == null || m.call(u), u.Undo(), (C = u.OnUndo) == null || C.call(u), n();
  }
  function o() {
    var m, C;
    if (c()) {
      r++;
      var u = t[r];
      (m = u.BeforeRedo) == null || m.call(u), u.Redo(), (C = u.OnRedo) == null || C.call(u), n();
    }
  }
  function s(u) {
    var m, C;
    r < t.length - 1 && t.splice(r, t.length - r), t.push({
      Undo: () => u.Undo(),
      BeforeUndo: () => {
        var I;
        return (I = u.BeforeUndo) == null ? void 0 : I.call(u);
      },
      OnUndo: () => {
        var I;
        return (I = u.OnUndo) == null ? void 0 : I.call(u);
      },
      Redo: () => u.Action(),
      BeforeRedo: () => {
        var I;
        return (I = u.BeforeAction) == null ? void 0 : I.call(u);
      },
      OnRedo: () => {
        var I;
        return (I = u.OnAction) == null ? void 0 : I.call(u);
      }
    }), r = t.length - 1, (m = u.BeforeAction) == null || m.call(u), u.Action(), (C = u.OnAction) == null || C.call(u), n();
  }
  function c() {
    return r < t.length - 1;
  }
  function g() {
    return r >= 0;
  }
  return {
    get HistoryIndex() {
      return r;
    },
    //AddHistory,
    Execute: s,
    Undo: i,
    Redo: o,
    CanUndo: g,
    CanRedo: c
  };
}
class Mt {
  constructor(t) {
    E(this, "UndoAPI");
    E(this, "BeforeChanged");
    E(this, "OnChanged");
    E(this, "Insert");
    E(this, "Update");
    E(this, "Delete");
    this.UndoAPI = gt(), this.BeforeChanged = t.BeforeChanged ?? (() => {
    }), this.OnChanged = t.OnChanged, this.Insert = t.Insert, this.Update = t.Update, this.Delete = t.Delete;
  }
  CanUndo() {
    return this.UndoAPI.CanUndo();
  }
  Undo() {
    this.UndoAPI.Undo();
  }
  CanRedo() {
    return this.UndoAPI.CanRedo();
  }
  Redo() {
    this.UndoAPI.Redo();
  }
  get HistoryIndex() {
    return this.UndoAPI.HistoryIndex;
  }
  Save(t) {
    if (!(t != null && t.Data) || !(t != null && t.UndoData))
      throw new Error("Invalid data or undoData");
    this.UndoAPI.Execute({
      Undo: () => {
        this.Execute(t.UndoData);
      },
      BeforeUndo: () => {
        this.BeforeChanged(t.UndoData);
      },
      OnUndo: () => {
        this.OnChanged(t.UndoData);
      },
      Action: () => {
        this.Execute(t.Data);
      },
      BeforeAction: () => {
        this.BeforeChanged(t.Data);
      },
      OnAction: () => {
        this.OnChanged(t.Data);
      }
    });
  }
  Execute(t) {
    t.items.forEach((r) => ({ Insert: this.Insert, Update: this.Update, Delete: this.Delete })[r.Action](r.Data));
  }
}
function pt(e) {
  return e.reduce(
    (t, r) => {
      const n = t.findIndex(
        (i) => i[0].shortcut == r.shortcut && i.some((o) => o.target.contains(r.target) || r.target.contains(o.target))
      );
      return n == -1 ? t.push([r]) : t[n].some((o) => o.target.contains(r.target)) && (t[n] = t[n].filter((o) => o.target.contains(r.target) == !1 && r.target.contains(o.target) == !1).concat(r)), t;
    },
    []
  ).flat();
}
function J(e) {
  return [e].flat().map(
    (t) => [
      t.ctrl && "ctrl",
      t.shift && "shift",
      t.alt && "alt",
      t.key
    ].filter((r) => r).join("+")
  ).join(",");
}
var N, L, y, R, U, B;
class kt {
  constructor(t = 1e3) {
    l(this, y);
    l(this, N, []);
    l(this, L, void 0);
    l(this, U, []);
    l(this, B, void 0);
    h(this, L, t);
  }
  registerShortcut(t, r, n, i) {
    d(this, N).push({
      target: t,
      shortcut: J(r),
      action: n,
      get disabled() {
        return (i == null ? void 0 : i()) ?? !1;
      }
    });
  }
  handleKeystroke(t, r) {
    d(this, U).push(J(r));
    const n = d(this, U).join(",");
    let i = pt(
      d(this, N).filter(
        (o) => o.shortcut.startsWith(n) && o.disabled == !1 && o.target.contains(t)
      )
    );
    if (clearTimeout(d(this, B)), i.length == 0) {
      M(this, y, R).call(this);
      return;
    }
    i.length == 1 ? (M(this, y, R).call(this), i[0].action()) : h(this, B, setTimeout(() => {
      i = i.filter((o) => o.shortcut == n), M(this, y, R).call(this), i.length == 1 && i[0].action();
    }, d(this, L)));
  }
}
N = new WeakMap(), L = new WeakMap(), y = new WeakSet(), R = function() {
  clearTimeout(d(this, B)), h(this, U, []);
}, U = new WeakMap(), B = new WeakMap();
function It() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M9 18L15 12L9 6"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
function vt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M6 9L12 15L18 9"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const wt = {
  "arrow-chevron-right": It,
  "arrow-chevron-down": vt
};
function mt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const Ct = {
  "file-document": mt
};
function bt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-bold"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), e.appendChild(t), e;
}
function At() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-italic"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), e.appendChild(t), e;
}
function Et() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-underline"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), e.appendChild(t), e;
}
const xt = {
  "text-bold": bt,
  "text-italic": At,
  "text-underline": Et
}, yt = {
  ...xt,
  ...wt,
  ...Ct
};
function Ht(e) {
  return yt[e]();
}
function Rt(e, t) {
  function r(i) {
    e.contains(i.target) || (n(), t(i));
  }
  function n() {
    document.removeEventListener("click", r);
  }
  return document.addEventListener("click", r), n;
}
var Ut = /* @__PURE__ */ ((e) => (e.TOP = "top", e.BOTTOM = "bottom", e))(Ut || {}), Bt = /* @__PURE__ */ ((e) => (e.START = "start", e.CENTER = "center", e.END = "end", e))(Bt || {});
function _(e) {
  return {
    direction: "bottom",
    align: "start",
    useMinWidth: !1,
    autoReposition: !0,
    popOver: !1,
    useBacksplash: !0,
    closeOnEsc: !0,
    ...e
  };
}
function Ot(e, t, r) {
  r = _(r);
  const n = t.getBoundingClientRect();
  et(e, r, n), r.useMinWidth && e.style.setProperty("min-width", n.width + "px");
  let i;
  if (r.useBacksplash && (i = tt(i, e, r)), r != null && r.autoReposition) {
    const o = setInterval(() => {
      if (!document.body.contains(e)) {
        clearInterval(o);
        return;
      }
      const s = t.getBoundingClientRect();
      s.top == n.top && s.left == n.left || (clearInterval(o), i == null || i.remove(), Ot(e, t, r));
    }, 100);
  }
  return {
    element: e,
    backsplash: i
  };
}
function St(e, t, r, n) {
  n = _(n), et(e, n, { top: r, left: t, height: 0, width: 0 });
  let o;
  if (n.useBacksplash && (o = tt(o, e, n)), n != null && n.autoReposition) {
    const s = document.body.getBoundingClientRect(), c = setInterval(() => {
      if (!document.body.contains(e)) {
        clearInterval(c);
        return;
      }
      const g = document.body.getBoundingClientRect();
      g.top == s.top && g.left == s.left || (clearInterval(c), o == null || o.remove(), St(e, t, r, n));
    }, 100);
  }
  return {
    element: e,
    backsplash: o
  };
}
function tt(e, t, r) {
  return e = document.createElement("div"), e.className = r.backsplachClassName ?? "", e.style.setProperty("position", "absolute"), e.style.setProperty("top", "0"), e.style.setProperty("right", "0"), e.style.setProperty("bottom", "0"), e.style.setProperty("left", "0"), e.style.setProperty("z-index", "10"), e.tabIndex = -1, e.addEventListener("click", (n) => {
    var i;
    t.contains(n.target) || (t.remove(), (i = r.onBacksplashClick) == null || i.call(r));
  }), r.closeOnEsc && e.addEventListener("keydown", (n) => {
    n.key == "Escape" && (t.remove(), n.stopPropagation());
  }), document.body.append(e), e.append(t), t.remove = /* @__PURE__ */ ((n) => function() {
    n.call(this), e == null || e.remove();
  })(t.remove), e;
}
function et(e, t, r) {
  document.contains(e) || document.body.append(e), e.style.setProperty("position", "absolute");
  const n = e.getBoundingClientRect(), { bottom: i, top: o } = Pt(t, r, n), { left: s, right: c } = Dt(t, r, n);
  o > 0 ? e.style.setProperty("top", o + "px") : i > 0 && e.style.setProperty("bottom", i + "px"), s > 0 ? e.style.setProperty("left", s + "px") : c > 0 && e.style.setProperty("right", c + "px"), t.closeOnEsc && e.addEventListener("keydown", (g) => {
    g.key == "Escape" && (e.remove(), g.stopPropagation());
  });
}
function Dt(e, t, r) {
  let n = 0, i = 0;
  if ([
    "start",
    "end",
    "center"
    /* CENTER */
  ].includes(e.align)) {
    const s = t.left, c = window.innerWidth - (t.left + t.width);
    var o = e.align;
    o == "center" && s >= r.width / 2 && c >= r.width / 2 ? o = "center" : o == "end" && s >= r.width ? o = "end" : o == "start" && c >= r.width || s < c ? o = "start" : s > c && (o = "end"), o == "center" ? n = t.left + t.width / 2 - r.width / 2 : o == "start" ? n = t.left : i = window.innerWidth - (t.left + t.width);
  } else
    throw "Invalid PopupAlign: " + e.align;
  return { left: n, right: i };
}
function Pt(e, t, r) {
  let n = 0, i = 0;
  if ([
    "top",
    "bottom"
    /* BOTTOM */
  ].includes(e.direction)) {
    const s = t.top - r.height, c = window.innerHeight - (t.top + t.height + r.height);
    var o = e.direction;
    o == "bottom" && c < r.height && s > c ? o = "top" : o == "top" && s < r.height && s < c ? o = "bottom" : s <= 0 && c <= 0 && s > c ? o = "top" : s <= 0 && c <= 0 && s < c && (o = "bottom"), o == "top" ? i = window.innerHeight - t.top : n = t.top + t.height, e.popOver && o == "top" ? i -= t.height : e.popOver && (n -= t.height);
  } else
    throw "Invalid PopupDirection: " + e.direction;
  return { bottom: i, top: n };
}
function zt(e, t = "bg-zinc-700 rounded p-1 z-10") {
  const r = document.createElement("div");
  return t && (r.className += " " + t), r.append(...[e ?? []].flat().filter((n) => n)), r;
}
function Vt(e, t, r, n = 200, i = 300) {
  var o, s;
  [e].flat().forEach((c) => c.addEventListener("mouseenter", () => {
    clearTimeout(o), s = setTimeout(() => t(), n);
  })), [e].flat().forEach((c) => c.addEventListener("mouseleave", () => {
    clearTimeout(s), o = setTimeout(() => r(), i);
  }));
}
export {
  Lt as EventManager,
  kt as KeyboardShortcut,
  Bt as PopupAlign,
  Ut as PopupDirection,
  Mt as SaveManager,
  gt as UndoManager,
  G as generateUId,
  Ht as getIcon,
  J as getShortcutString,
  Nt as linkedList,
  Vt as onHover,
  Rt as onceClickOutside,
  zt as popupContainer,
  St as popupPosition,
  Ot as popupRelative
};
//# sourceMappingURL=index.es.js.map
