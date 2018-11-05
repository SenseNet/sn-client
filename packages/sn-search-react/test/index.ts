// tslint:disable:no-unused-variable
(global as any).addEventListener = () => undefined;
(global as any).removeEventListener = () => undefined;
(global as any).querySelector = () => ({ scrollTop: () => undefined, addEventListener: () => undefined, removeEventListener: () => undefined });
(global as any).document = global;
(global as any).innerWidth = 1024;
(global as any).navigator = { userAgent: '' };
(global as any).window = global;
(global as any).document.parentWindow = global;
(global as any).document.body = {
    children: [],
    style: {
        overflow: 'auto',
        paddingRight: '0',
    },
    nodeType: 1,
    nodeValue: ' react-mount-point-unstable ',
};
(global as any).getElementById = () => ({
    getBoundingClientRect: () => ({}),
    style: {},
});
(global as any).getComputedStyle = () => ({
    getBoundingClientRect: () => ({}),
    getPropertyValue: () => 5,
});

(() => {
    const window: any = (global as any).window
    let lastTime = 0
    const vendors = ['ms', 'moz', 'webkit', 'o']
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame']
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (callback: (...args: any[]) => any) => {
            const currTime = new Date().getTime()
            const timeToCall = Math.max(0, 16 - (currTime - lastTime))
            const id = window.setTimeout(() => { callback(currTime + timeToCall) },
                timeToCall)
            lastTime = currTime + timeToCall
            return id
        }
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = (id: any) => {
            clearTimeout(id)
        }
    }
})()

export * from './AdvancedSearchTests'
export * from './PresetFieldTests'
export * from './ReferenceFieldTests'
export * from './TextFieldTests'
export * from './TypeFieldTests'
