/**
 * @class `Viewport`
 * A scrollable container containing multiple observers that
 * are checked each time the viewport is manipulated
 */
export function Viewport(container, observerCollection) {
  this.container = container
  this.observers = []
  this.lastX = 0
  this.lastY = 0

  let scheduled = false
  const _handler = () => {
    if (!scheduled) {
      scheduled = true
      requestAnimationFrame(() => {
        const { observers } = this
        const state = this.getState()
        for (let i = observers.length; i--; ) observers[i].check(state)
        this.lastX = state.positionX
        this.lastY = state.positionY
        scheduled = false
      })
    }
  }

  const customHandleScrollResize = observerCollection.handleScrollResize
  const handler = (this.handler = customHandleScrollResize ? customHandleScrollResize(_handler) : _handler)

  const createMutationObserver = () => {
    const mutationObserver = (this.mutationObserver = new MutationObserver(_handler))
    mutationObserver.observe(document, { attributes: true, childList: true, subtree: true })
  }

  addEventListener('scroll', handler, true)
  addEventListener('resize', handler, true)

  if (document.readyState !== 'loading') {
    createMutationObserver()
  } else {
    addEventListener('DOMContentLoaded', createMutationObserver)
  }
}

Viewport.prototype = {
  getState() {
    const { container, lastX, lastY } = this
    let width, height, positionX, positionY, directionX, directionY

    if (container === document.body) {
      width = window.innerWidth
      height = window.innerHeight
      positionX = window.pageXOffset
      positionY = window.pageYOffset
    } else {
      width = container.offsetWidth
      height = container.offsetHeight
      positionX = container.scrollLeft
      positionY = container.scrollTop
    }

    if (lastX < positionX) directionX = 'right'
    else if (lastX > positionX) directionX = 'left'
    else directionX = 'none'

    if (lastY < positionY) directionY = 'down'
    else if (lastY > positionY) directionY = 'up'
    else directionY = 'none'

    return { width, height, positionX, positionY, directionX, directionY }
  },

  destroy() {
    const { handler, mutationObserver } = this
    removeEventListener('scroll', handler)
    removeEventListener('resize', handler)
    if (mutationObserver) mutationObserver.disconnect()
  }
}
