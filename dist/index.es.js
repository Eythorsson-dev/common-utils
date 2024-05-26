var Y = Object.defineProperty;
var $ = (e, t, n) => t in e ? Y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var b = (e, t, n) => ($(e, typeof t != "symbol" ? t + "" : t, n), n), j = (e, t, n) => {
  if (!t.has(e))
    throw TypeError("Cannot " + n);
};
var s = (e, t, n) => (j(e, t, "read from private field"), n ? n.call(e) : t.get(e)), c = (e, t, n) => {
  if (t.has(e))
    throw TypeError("Cannot add the same private member more than once");
  t instanceof WeakSet ? t.add(e) : t.set(e, n);
}, u = (e, t, n, r) => (j(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
var M = (e, t, n) => (j(e, t, "access private method"), n);
function V(e) {
  return e.nextItem ? [e.nextItem, ...V(e.nextItem)] : [];
}
function z(e) {
  return e.firstChildItem ? [
    e.firstChildItem,
    ...z(e.firstChildItem),
    ...V(e.firstChildItem).flatMap((t) => [t, ...z(t)])
  ] : [];
}
function H(e, t, n = !1) {
  var i;
  if (e == null)
    return [];
  if (e.id == t.id)
    return [t];
  const r = n ? [] : H(e.firstChildItem, t);
  if (((i = r.slice(-1)[0]) == null ? void 0 : i.id) == t.id)
    return [e, ...r];
  if (e.nextItem)
    return [e, ...r, ...H(e.nextItem, t)];
  if (e.parentItem)
    return [e, ...r, ...H(e.parentItem, t, !0)].filter((h) => h.id != e.parentItem.id);
  throw Error("Something went wrong. Please make sure that the start, and the end has a common parent");
}
function tt(e, t) {
  return H(e, t);
}
function Z(e, t) {
  if (e.firstChildItem && (t == null ? void 0 : t.ignoreChildren) != !0)
    return e.firstChildItem;
  if (e.nextItem)
    return e.nextItem;
  function n(r) {
    if (r.nextItem)
      return r.nextItem;
    if (r.parentItem)
      return n(r.parentItem);
  }
  return n(e);
}
function S(e, t) {
  function n(r) {
    if (r.id == t)
      return r;
    let i;
    return r.firstChildItem && (i || (i = n(r.firstChildItem))), r.nextItem && (i || (i = n(r.nextItem))), i;
  }
  return n(e);
}
function G(e, t) {
  if (t.contains(e.target))
    return;
  function n(r) {
    let i;
    return r.firstChildItem && (i || (i = n(r.firstChildItem))), r.nextItem && (i || (i = n(r.nextItem))), r.target.contains(t) && (i || (i = r)), i;
  }
  return n(e);
}
function P(e) {
  if (!e)
    return [];
  const t = [
    e.getDetails()
  ];
  return e.firstChildItem && t.push(...P(e.firstChildItem)), e.nextItem && t.push(...P(e.nextItem)), t;
}
function et(e) {
  function t(n) {
    return n != null && n.nextItem ? t(n.nextItem) : n != null && n.firstChildItem ? t(n.firstChildItem) : n;
  }
  return t(e == null ? void 0 : e.firstChildItem);
}
function J(e, t, n) {
  var i, h;
  if (t == null && (e.parentId || e.previousId))
    throw new Error("the initial upsert must be the root window");
  let r = t && S(t, e.id);
  if (r == null || ((i = r.parentItem) == null ? void 0 : i.id) != e.parentId || ((h = r.previousItem) == null ? void 0 : h.id) != e.previousId) {
    if (t && r && t.id == r.id)
      if (r.firstChildItem)
        t = r.firstChildItem;
      else if (r.nextItem)
        t = r.nextItem;
      else
        throw new Error("Failed to render block, a new rootBlock could not be determined");
    if (r == null && (r = n(e)), r == null || r.remove(), t == null)
      t = r;
    else if (e.previousId) {
      const d = S(t, e.previousId);
      if (!d)
        throw new Error("Failed to render item, previous item is not rendered");
      d.after(r);
    } else if (e.parentId) {
      const d = S(t, e.parentId);
      if (!d)
        throw new Error("Failed to render item, parent item is not rendered");
      d.append(r);
    } else
      t.before(r), t = r;
  }
  return r.update(e.data), t;
}
var D, B, m, A, a, p, C;
class rt {
  constructor(t, n) {
    c(this, D, void 0);
    c(this, B, void 0);
    c(this, m, void 0);
    // set parentItem(item: TItem | undefined) { this.#parent = item; }
    c(this, A, void 0);
    // set firstChildItem(item: TItem | undefined) { this.#firstChild = item; }
    c(this, a, void 0);
    // set nextItem(item: TItem | undefined) { this.#next = item; }
    c(this, p, void 0);
    c(this, C, void 0);
    if (((t == null ? void 0 : t.trim()) ?? "").length == 0)
      throw new Error("id is required");
    if (((n == null ? void 0 : n.trim()) ?? "").length == 0)
      throw new Error("type is required");
    u(this, D, t), u(this, B, n);
  }
  get id() {
    return s(this, D);
  }
  get type() {
    return s(this, B);
  }
  get parentItem() {
    return s(this, m);
  }
  get firstChildItem() {
    return s(this, A);
  }
  get nextItem() {
    return s(this, a);
  }
  get previousItem() {
    return s(this, p);
  }
  get target() {
    if (!s(this, C))
      throw new Error("Failed to get target. Please call the .initialized(data) method before fetching the target");
    return s(this, C);
  }
  init(t) {
    if (s(this, C))
      throw new Error("The target has already been initialized");
    u(this, C, this.render(t));
  }
  getDetails() {
    var t, n;
    return {
      id: this.id,
      type: this.type,
      parentId: (t = this.parentItem) == null ? void 0 : t.id,
      previousId: (n = this.previousItem) == null ? void 0 : n.id,
      data: this.data
    };
  }
  remove() {
    var t, n, r;
    ((n = (t = this.parentItem) == null ? void 0 : t.firstChildItem) == null ? void 0 : n.id) == this.id && u(this.parentItem, A, s(this, a)), this.previousItem && u(this.previousItem, a, s(this, a)), this.nextItem && u(this.nextItem, p, s(this, p)), u(this, m, void 0), u(this, a, void 0), u(this, p, void 0), (r = s(this, C)) == null || r.remove();
  }
  append(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove();
    const n = this.firstChildItem && [this.firstChildItem, ...V(this.firstChildItem)], r = n == null ? void 0 : n.slice(-1)[0];
    u(t, m, this), r ? r.after(t) : (u(this, A, t), this.target.append(t.target));
  }
  before(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), u(t, p, this.previousItem), this.previousItem ? u(this.previousItem, a, t) : this.parentItem && u(this.parentItem, A, t), u(t, m, this.parentItem), u(t, a, this), u(this, p, t), this.target.before(t.target);
  }
  after(t) {
    if (t.id == this.id)
      throw new Error("Cannot append item before itself");
    t.remove(), u(t, a, this.nextItem), this.nextItem && u(this.nextItem, p, t), u(t, m, this.parentItem), u(t, p, this), u(this, a, t), this.target.after(t.target);
  }
}
D = new WeakMap(), B = new WeakMap(), m = new WeakMap(), A = new WeakMap(), a = new WeakMap(), p = new WeakMap(), C = new WeakMap();
function F(e, t, n) {
  const r = e.find((i) => i.parentId == t && i.previousId == n);
  return r ? (e = e.filter((i) => i.id != r.id), 1 + F(e, r.id, void 0) + F(e, t, r.id)) : 0;
}
function K(e) {
  if (e.filter((d) => d.parentId == null && d.previousId == null).length != 1 && e.length > 0)
    throw new Error("Failed to determine the start of the linked list");
  if (e.map((d) => d.id).some((d, x, o) => o.indexOf(d) != x))
    throw new Error("Found duplicated instances of ids");
  if (e.map((d) => d.previousId + "_" + d.parentId).some((d, x, o) => o.indexOf(d) != x))
    throw new Error("Some of the items have the same previousId");
  if (F(e) != e.length)
    throw new Error("Linked list is not valid");
}
function _(e, t, n) {
  const r = e.find((i) => i.parentId == t && i.previousId == n);
  return r ? (e = e.filter((i) => i.id != r.id), [
    r,
    ..._(e, r.id, void 0),
    ..._(e, t, r.id)
  ]) : [];
}
function Q(e) {
  return K(e), _(e, void 0, void 0);
}
var k, f;
class nt {
  constructor(t) {
    c(this, k, void 0);
    c(this, f, void 0);
    u(this, k, t);
  }
  get rootItem() {
    return s(this, f);
  }
  get activeItem() {
    if (document.activeElement != null)
      return G(s(this, f), document.activeElement);
  }
  get value() {
    return P(s(this, f));
  }
  set value(t) {
    if (K(t), Q(t).length != t.length)
      throw new Error("Cannot set value, invalid linked list");
    const r = s(this, f);
    t.forEach((i, h) => {
      this.upsert(i), h == 0 && (s(this, k).replaceChildren(s(this, f).target), r == null || r.remove());
    });
  }
  upsert(t) {
    u(this, f, J(t, s(this, f), () => this.createItem(t.type, t.id, t.data)));
  }
  getItemById(t) {
    return S(s(this, f), t);
  }
  deleteItemById(t) {
    var n, r;
    if (t == s(this, f).id) {
      const i = Z(this.rootItem);
      (n = this.getItemById(t)) == null || n.remove(), u(this, f, i);
    } else
      (r = this.getItemById(t)) == null || r.remove();
  }
}
k = new WeakMap(), f = new WeakMap();
var O;
class it {
  constructor(t) {
    c(this, O, void 0);
    u(this, O, t);
  }
  get context() {
    return s(this, O);
  }
}
O = new WeakMap();
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Command: it,
  ItemContainerElement: nt,
  ItemElement: rt,
  getChildAndNextSiblingData: P,
  getChildItems: z,
  getItemsBetween: tt,
  getLastChild: et,
  getNextItem: Z,
  getNextOrChildById: S,
  getNextOrChildByTarget: G,
  getNextSiblings: V,
  sortList: Q,
  upsertAndReturnRoot: J,
  validateList: K
}, Symbol.toStringTag, { value: "Module" }));
let N;
const ot = new Uint8Array(16);
function st() {
  if (!N && (N = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !N))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return N(ot);
}
const l = [];
for (let e = 0; e < 256; ++e)
  l.push((e + 256).toString(16).slice(1));
function ht(e, t = 0) {
  return l[e[t + 0]] + l[e[t + 1]] + l[e[t + 2]] + l[e[t + 3]] + "-" + l[e[t + 4]] + l[e[t + 5]] + "-" + l[e[t + 6]] + l[e[t + 7]] + "-" + l[e[t + 8]] + l[e[t + 9]] + "-" + l[e[t + 10]] + l[e[t + 11]] + l[e[t + 12]] + l[e[t + 13]] + l[e[t + 14]] + l[e[t + 15]];
}
const ut = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), q = {
  randomUUID: ut
};
function dt(e, t, n) {
  if (q.randomUUID && !t && !e)
    return q.randomUUID();
  e = e || {};
  const r = e.random || (e.rng || st)();
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, ht(r);
}
function W() {
  return dt();
}
var I;
class Ut {
  constructor() {
    c(this, I, {});
  }
  On(t, n) {
    let r = W();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({ Id: r, Execute: n }), r;
  }
  Once(t, n, r) {
    var i = W();
    return s(this, I)[t] = (s(this, I)[t] ?? []).concat({
      Id: i,
      Execute: (h) => {
        r && r(h) != !0 || (this.Off(t, i), n(h));
      }
    }), i;
  }
  Off(t, n) {
    var i;
    const r = (i = s(this, I)[t]) == null ? void 0 : i.findIndex((h) => h.Id == n);
    r >= 0 && s(this, I)[t].splice(r, 1);
  }
  Emit(t, n) {
    var i;
    var r = { preventDefault: !1 };
    return (i = s(this, I)[t]) == null || i.slice().forEach((h) => h.Execute({
      ...n,
      preventDefault() {
        r.preventDefault = !0;
      }
    })), r;
  }
}
I = new WeakMap();
function ct(e) {
  const t = [];
  var n = -1;
  function r() {
    var w, v;
    if (!x())
      return;
    const o = t[n];
    n--, (w = o.BeforeRedo) == null || w.call(o), o.Undo(), (v = o.OnUndo) == null || v.call(o);
  }
  function i() {
    var w, v;
    if (d()) {
      n++;
      var o = t[n];
      (w = o.BeforeRedo) == null || w.call(o), o.Redo(), (v = o.OnRedo) == null || v.call(o);
    }
  }
  function h(o) {
    var w, v;
    n < t.length - 1 && t.splice(n, t.length - n), t.push({
      Undo: () => o.Undo(),
      BeforeUndo: () => {
        var g;
        return (g = o.BeforeUndo) == null ? void 0 : g.call(o);
      },
      OnUndo: () => {
        var g;
        return (g = o.OnUndo) == null ? void 0 : g.call(o);
      },
      Redo: () => o.Action(),
      BeforeRedo: () => {
        var g;
        return (g = o.BeforeAction) == null ? void 0 : g.call(o);
      },
      OnRedo: () => {
        var g;
        return (g = o.OnAction) == null ? void 0 : g.call(o);
      }
    }), n = t.length - 1, (w = o.BeforeAction) == null || w.call(o), o.Action(), (v = o.OnAction) == null || v.call(o);
  }
  function d() {
    return n < t.length - 1;
  }
  function x() {
    return n >= 0;
  }
  return {
    get HistoryIndex() {
      return n;
    },
    //AddHistory,
    Execute: h,
    Undo: r,
    Redo: i,
    CanUndo: x,
    CanRedo: d
  };
}
class yt {
  constructor(t) {
    b(this, "UndoAPI");
    b(this, "BeforeChanged");
    b(this, "OnChanged");
    b(this, "Insert");
    b(this, "Update");
    b(this, "Delete");
    this.UndoAPI = ct(), this.BeforeChanged = t.BeforeChanged ?? (() => {
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
    t.items.forEach((n) => ({ insert: this.Insert, update: this.Update, delete: this.Delete })[n.Action](n.Data));
  }
}
function X(e, t, n, r) {
  return [
    e && "ctrl",
    t && "shift",
    n && "alt",
    r
  ].filter((i) => i).join("+");
}
function lt(e) {
  return e.toLowerCase().split(" ").join("").split(",").map((t) => {
    const n = t.split("+");
    if (n.filter((r) => r.length == 1).length != 1)
      throw new Error("shortcut must contain one letter");
    if (n.some((r) => r != "ctrl" && r != "shift" && r != "alt" && r.length != 1))
      throw new Error("The shortcut string contains unrecognizable characters");
    return X(
      n.some((r) => r == "ctrl"),
      n.some((r) => r == "shift"),
      n.some((r) => r == "alt"),
      n.find((r) => r.length == 1)
    );
  }).join(",");
}
function ft(e) {
  return e.reduce(
    (t, n) => {
      const r = t.findIndex(
        (i) => i[0].shortcut == n.shortcut && i.some((h) => h.target.contains(n.target) || n.target.contains(h.target))
      );
      return r == -1 ? t.push([n]) : t[r].some((h) => h.target.contains(n.target)) && (t[r] = t[r].filter((h) => h.target.contains(n.target) == !1 && n.target.contains(h.target) == !1).concat(n)), t;
    },
    []
  ).flat();
}
var R, L, E, T, U, y;
class St {
  constructor(t = 1e3) {
    c(this, E);
    c(this, R, []);
    c(this, L, void 0);
    c(this, U, []);
    c(this, y, void 0);
    u(this, L, t);
  }
  registerShortcut(t, n, r, i) {
    s(this, R).push({
      target: t,
      shortcut: lt(n),
      action: r,
      get disabled() {
        return (i == null ? void 0 : i()) ?? !1;
      }
    });
  }
  handleKeystroke(t, n) {
    s(this, U).push(X(n.ctrl, n.shift, n.alt, n.key));
    const r = s(this, U).join(",");
    let i = ft(
      s(this, R).filter(
        (h) => h.shortcut.startsWith(r) && h.disabled == !1 && h.target.contains(t)
      )
    );
    if (clearTimeout(s(this, y)), i.length == 0) {
      M(this, E, T).call(this);
      return;
    }
    i.length == 1 ? (M(this, E, T).call(this), i[0].action()) : u(this, y, setTimeout(() => {
      i = i.filter((h) => h.shortcut == r), M(this, E, T).call(this), i.length == 1 && i[0].action();
    }, s(this, L)));
  }
}
R = new WeakMap(), L = new WeakMap(), E = new WeakSet(), T = function() {
  clearTimeout(s(this, y)), u(this, U, []);
}, U = new WeakMap(), y = new WeakMap();
function at() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M9 18L15 12L9 6"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
function gt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M6 9L12 15L18 9"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const pt = {
  "arrow-chevron-right": at,
  "arrow-chevron-down": gt
};
function It() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("width", "100%"), e.setAttribute("height", "100%"), e.setAttribute("viewBox", "0 0 24 24"), e.setAttribute("fill", "none");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), e.appendChild(t), e;
}
const wt = {
  "file-document": It
};
function vt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-bold"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"), e.appendChild(t), e;
}
function mt() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-italic"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"), e.appendChild(t), e;
}
function Ct() {
  const e = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  e.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.setAttribute("width", "16"), e.setAttribute("height", "16"), e.setAttribute("fill", "currentColor"), e.setAttribute("class", "bi bi-type-underline"), e.setAttribute("viewBox", "0 0 16 16");
  const t = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return t.setAttribute("d", "M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z"), e.appendChild(t), e;
}
const bt = {
  "text-bold": vt,
  "text-italic": mt,
  "text-underline": Ct
}, At = {
  ...bt,
  ...pt,
  ...wt
};
function Dt(e) {
  return At[e]();
}
function Bt(e, t) {
  function n(r) {
    e.contains(r.target) || (document.removeEventListener("click", n), t(r));
  }
  document.addEventListener("click", n);
}
export {
  Ut as EventManager,
  St as KeyboardShortcut,
  yt as SaveManager,
  W as generateUId,
  Dt as getIcon,
  X as getShortcutString,
  Et as linkedList,
  Bt as onceClickOutside
};
//# sourceMappingURL=index.es.js.map
