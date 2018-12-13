// tslint:disable:no-unused-variable
;(global as any).addEventListener = () => undefined
;(global as any).removeEventListener = () => undefined
;(global as any).querySelector = () => ({
  scrollTop: () => undefined,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
})
;(global as any).document = global
;(global as any).innerWidth = 1024
;(global as any).navigator = { userAgent: '' }
;(global as any).window = global
;(global as any).document.parentWindow = global
;(global as any).getElementById = () => ({
  getBoundingClientRect: () => ({}),
})
;(global as any).getComputedStyle = () => ({
  getBoundingClientRect: () => ({}),
})
