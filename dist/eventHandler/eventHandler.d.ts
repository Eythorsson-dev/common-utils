export type EventFunctions = {
    preventDefault: () => void;
};
export interface BaseEvent extends EventFunctions {
}
type Event<EventMap, Key extends keyof EventMap, TBaseEvent = BaseEvent> = EventMap[Key] extends TBaseEvent ? EventMap[Key] : never;
export type EventListenerId = string;
export interface EventHandlerAPI<EventMap extends {
    [key in keyof EventMap]: Omit<Event<EventMap, key, TBaseEvent>, "preventDefault">;
}, TBaseEvent extends EventFunctions = BaseEvent> {
    On<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId;
    Once<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId;
    Off<Key extends keyof EventMap>(type: Key, listener: EventListenerId): void;
    Emit<Key extends keyof EventMap>(type: Key, event: Omit<Event<EventMap, Key, TBaseEvent>, "preventDefault">): {
        preventDefault: boolean;
    };
}
export declare class EventManager<EventMap extends {
    [key in keyof EventMap]: Omit<Event<EventMap, key, TBaseEvent>, "preventDefault">;
}, TBaseEvent extends EventFunctions = BaseEvent> implements EventHandlerAPI<EventMap, TBaseEvent> {
    #private;
    constructor();
    On<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId;
    Once<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void, condition?: (event: Event<EventMap, Key, TBaseEvent>) => boolean): EventListenerId;
    Off<Key extends keyof EventMap>(type: Key, listenerId: EventListenerId): void;
    Emit<Key extends keyof EventMap>(type: Key, event: Omit<Event<EventMap, Key, TBaseEvent>, "preventDefault">): {
        preventDefault: boolean;
    };
}
export {};
