import { NotificationDispatcher } from "../universal";
import { noop, sortBy } from "lodash";

describe("NotificationDispatcher", () => {
    afterEach(() => {
        NotificationDispatcher.resetConfig();
    });
    test("Single interceptor function", async () => {
        const intercepted: any[] = [];
        const published = new Promise(resolve => {
            NotificationDispatcher.configure({
                intercept(n) {
                    intercepted.push(n);
                    return n;
                },
                publish: resolve,
            });
        });
        const notif = {
            type: "test",
            entities: {},
        };
        NotificationDispatcher.publish(notif);
        await published;
        expect(intercepted).toEqual([[notif]]);
    });
    test("Single interceptor configuration", async () => {
        const intercepted: any[] = [];
        const delivered: any[] = [];
        const published = new Promise(resolve => {
            NotificationDispatcher.configure({
                intercept: {
                    type: "test1",
                    intercept(n) {
                        intercepted.push(n);
                        return n;
                    },
                },
                publish: n => {
                    delivered.push(n);
                    if (n.type == "test2") resolve();
                },
            });
        });
        const notif1 = {
            type: "test1",
            entities: {},
        };
        const notif2 = {
            type: "test2",
            entities: {},
        };
        NotificationDispatcher.publish(notif1);
        NotificationDispatcher.publish(notif2);
        await published;
        expect(intercepted).toEqual([[notif1]]);
        expect(sortBy(delivered, "type")).toEqual([notif1, notif2]);
    });
    test("Chain of interceptors", async () => {
        const intercepted: any[] = [[], [], []];
        const delivered: any[] = [];
        const published = new Promise(resolve => {
            NotificationDispatcher.configure({
                intercept: [
                    {
                        type: "test1",
                        intercept(n) {
                            intercepted[0].push(n);
                            return n;
                        },
                    },
                    {
                        type: "test1",
                        source: /^test2*/,
                        intercept(n) {
                            intercepted[1].push(n);
                            return n;
                        },
                    },
                    {
                        type: /^test2$/,
                        retainRest: false,
                        intercept(n) {
                            intercepted[2].push(n);
                            return n;
                        },
                    },
                ],
                publish: n => {
                    delivered.push(n);
                    if (n.type == "test2") resolve();
                },
            });
        });
        const notifs = [
            {
                type: "test1",
                entities: {},
            },
            {
                type: "test1",
                source: "test2",
                entities: {},
            },
            {
                type: "test2",
                entities: {},
            },
        ];
        notifs.forEach(n => NotificationDispatcher.publish(n));
        await published;
        expect(intercepted).toMatchInlineSnapshot(`
            Array [
              Array [
                Array [
                  Object {
                    "entities": Object {},
                    "type": "test1",
                  },
                ],
                Array [
                  Object {
                    "entities": Object {},
                    "source": "test2",
                    "type": "test1",
                  },
                ],
              ],
              Array [],
              Array [
                Array [
                  Object {
                    "entities": Object {},
                    "type": "test2",
                  },
                ],
              ],
            ]
        `);
        expect(delivered).toMatchInlineSnapshot(`
            Array [
              Object {
                "entities": Object {},
                "type": "test2",
              },
            ]
        `);
    });
});
