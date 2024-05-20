import { generateUId } from "../utils";

export type EventFunctions = { preventDefault: () => void };
export interface BaseEvent extends EventFunctions { }

type Event<EventMap, Key extends keyof EventMap, TBaseEvent = BaseEvent> = EventMap[Key] extends TBaseEvent ? EventMap[Key] : never

type Subscriptions<EventMap, TBaseEvent = BaseEvent> = {
    [key in keyof EventMap]: {
        Id: EventListenerId,
        Execute(data: Omit<Event<EventMap, key, TBaseEvent>, "preventDefault">): void
    }[]
}

export type EventListenerId = string;

export interface EventHandlerAPI<
    EventMap extends { [key in keyof EventMap]: Omit<Event<EventMap, key, TBaseEvent>, "preventDefault"> },
    TBaseEvent extends EventFunctions = BaseEvent
> {

    On<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId;
    Once<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId;
    Off<Key extends keyof EventMap>(type: Key, listener: EventListenerId): void;

    Emit<Key extends keyof EventMap>(type: Key, event: Omit<Event<EventMap, Key, TBaseEvent>, "preventDefault">): { preventDefault: boolean };
}

export class EventManager<
    EventMap extends { [key in keyof EventMap]: Omit<Event<EventMap, key, TBaseEvent>, "preventDefault"> },
    TBaseEvent extends EventFunctions = BaseEvent
>
    implements EventHandlerAPI<EventMap, TBaseEvent> {

    #listeners = <Subscriptions<EventMap, TBaseEvent>>{}


    constructor() {

    }

    On<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void): EventListenerId {
        let id = generateUId();

        this.#listeners[type] = (this.#listeners[type] ?? [])
            .concat({ Id: id, Execute: handler });

        return id;
    }

    Once<Key extends keyof EventMap>(type: Key, handler: (event: Event<EventMap, Key, TBaseEvent>) => void, condition?: (event: Event<EventMap, Key, TBaseEvent>) => boolean): EventListenerId {
        var id = generateUId();
        this.#listeners[type] = (this.#listeners[type] ?? [])
            .concat({
                Id: id,
                Execute: (data: Event<EventMap, Key, TBaseEvent>) => {
                    if (condition && condition(data) != true) return;

                    this.Off(type, id);
                    handler(data);
                }
            });
        return id;
    }

    Off<Key extends keyof EventMap>(type: Key, listenerId: EventListenerId): void {
        const index = this.#listeners[type]?.findIndex(x => x.Id == listenerId);
        if (index >= 0) this.#listeners[type].splice(index, 1);
    }

    Emit<Key extends keyof EventMap>(type: Key, event: Omit<Event<EventMap, Key, TBaseEvent>, "preventDefault">): { preventDefault: boolean } {
        var response = { preventDefault: false };

        this.#listeners[type]
            ?.slice()
            .forEach(x => x.Execute({
                ...event,
                preventDefault() { response.preventDefault = true }
            }));

        return response;
    }
}
