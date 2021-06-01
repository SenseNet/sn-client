export const mouseMove = (pageX: number, pageY: number) => {
  const mouseMoveEvent = document.createEvent('Event')
  mouseMoveEvent.initEvent('mousemove', true, true)
  Object.defineProperty(HTMLElement.prototype, 'pageX', { configurable: true, value: pageX })
  Object.defineProperty(HTMLElement.prototype, 'pageY', { configurable: true, value: pageY })
  document.dispatchEvent(mouseMoveEvent)
}

export const mouseUp = (pageX: number, pageY: number) => {
  const mouseUpEvent = document.createEvent('Event')
  mouseUpEvent.initEvent('mouseup', true, true)
  Object.defineProperty(HTMLElement.prototype, 'pageX', { configurable: true, value: pageX })
  Object.defineProperty(HTMLElement.prototype, 'pageY', { configurable: true, value: pageY })
  document.dispatchEvent(mouseUpEvent)
}
