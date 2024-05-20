import { beforeEach, expect, test, vi } from "vitest";
import { EventManager, BaseEvent } from "../eventHandler";


interface FooEvent extends BaseEvent { }
interface BarEvent extends BaseEvent { }

interface TestEventMap {
    "foo": FooEvent,
    "bar": BarEvent
}

var eventHandler: EventManager<TestEventMap>;

beforeEach(() => {
    eventHandler = new EventManager<TestEventMap>();
})

test("Can Subscribe to one event", () => {
    var fooCallback = vi.fn();

    eventHandler.Once("foo", fooCallback);

    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Emit("foo", { sender: "TEST" });

    expect(fooCallback.mock.calls.length).toBe(1);
})

test("Can Subscribe to all events", () => {
    var fooCallback = vi.fn();

    eventHandler.On("foo", fooCallback);

    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Emit("foo", { sender: "TEST" });

    expect(fooCallback.mock.calls.length).toBe(3);
})

test("Can Unsubscribe from events", () => {
    var fooCallback = vi.fn();

    let listenerId = eventHandler.On("foo", fooCallback);

    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Emit("foo", { sender: "TEST" });
    eventHandler.Off("foo", listenerId);
    eventHandler.Emit("foo", { sender: "TEST" });

    expect(fooCallback.mock.calls.length).toBe(2);
})

test("Invokes correct callback", () => {
    var fooCallback = vi.fn();
    var barCallback = vi.fn();

    eventHandler.On("foo", fooCallback);
    eventHandler.On("bar", barCallback);

    eventHandler.Emit("foo", { sender: "TEST" });

    expect(fooCallback.mock.calls.length).toBe(1);
    expect(barCallback.mock.calls.length).toBe(0);

    eventHandler.Emit("bar", { sender: "TEST" });

    expect(fooCallback.mock.calls.length).toBe(1);
    expect(barCallback.mock.calls.length).toBe(1);
})
test("Can subscribe to one and to all events", () => {
    var onceCallback = vi.fn();
    var onCallback = vi.fn();

    eventHandler.Once("foo", onceCallback);
    var onListenerId = eventHandler.On("foo", onCallback);

    eventHandler.Emit("foo", { sender: "TEST" });

    expect(onceCallback.mock.calls.length).toBe(1);
    expect(onCallback.mock.calls.length).toBe(1);

    eventHandler.Emit("foo", { sender: "TEST" });

    expect(onceCallback.mock.calls.length).toBe(1);
    expect(onCallback.mock.calls.length).toBe(2);

    eventHandler.Off("foo", onListenerId);

    eventHandler.Emit("foo", { sender: "TEST" });

    expect(onceCallback.mock.calls.length).toBe(1);
    expect(onCallback.mock.calls.length).toBe(2);
})