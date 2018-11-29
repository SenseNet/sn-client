import { ObservableValue } from '../src'

/**
 * Observable Value tests
 */
export const observableTests = describe('Observable', () => {
  it('should be constructed without initial value', done => {
    const v = new ObservableValue()
    v.subscribe(value => {
      expect(v.getValue()).toBe(undefined)
      done()
    }, true)
    expect(v).toBeInstanceOf(ObservableValue)
  })

  it('should be constructed with initial value', done => {
    const v = new ObservableValue(1)
    v.subscribe(value => {
      expect(v.getValue()).toBe(1)
      done()
    }, true)
  })

  describe('Subscription callback', () => {
    it('should be triggered only when a value is changed', done => {
      const v = new ObservableValue(1)
      v.subscribe(() => {
        expect(v.getValue()).toBe(2)
        done()
      }, false)
      v.setValue(1)
      v.setValue(1)
      v.setValue(2)
    })

    it('should be triggered only on change when getLast is false', done => {
      const v = new ObservableValue(1)
      v.subscribe(value => {
        expect(value).toBe(2)
        done()
      }, false)
      v.setValue(2)
    })
  })

  describe('Unsubscribe', () => {
    it('should remove the subscription on unsubscribe()', done => {
      const callback1 = () => {
        done(Error('Shouldnt be triggered'))
      }

      const callback2 = (value: number) => {
        expect(value).toBe(2)
        done()
      }
      const v = new ObservableValue(1)
      const observer1 = v.subscribe(callback1)
      v.subscribe(callback2)

      v.unsubscribe(observer1)
      v.setValue(2)
    })

    it('should remove the subscription on Observable dispose', () => {
      const callback1 = () => {
        /** */
      }
      const callback2 = (value: number) => {
        /** */
      }
      const v = new ObservableValue(1)
      v.subscribe(callback1)
      v.subscribe(callback2)
      expect(v.getObservers().length).toBe(2)
      v.dispose()
      expect(v.getObservers().length).toBe(0)
    })

    it('should remove the subscription on Observer dispose', () => {
      const callback1 = () => {
        /** */
      }
      const v = new ObservableValue(1)
      const observer = v.subscribe(callback1)
      expect(v.getObservers().length).toBe(1)
      observer.dispose()
      expect(v.getObservers().length).toBe(0)
    })

    it('should remove the subscription only from the disposed Observer', done => {
      class Alma {
        /**
         * Example mock class for testing
         * @param {number} n example parameter
         */
        public Callback(n: number) {
          done()
        }
      }
      const v = new ObservableValue(1)
      const observer = v.subscribe(new Alma().Callback)
      v.subscribe(new Alma().Callback)
      expect(v.getObservers().length).toBe(2)
      observer.dispose()
      expect(v.getObservers().length).toBe(1)
      v.setValue(3)
    })
  })
})
