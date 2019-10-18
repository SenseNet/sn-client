import { Injectable, Injector } from '@furystack/inject'
import { IDisposable } from 'monaco-editor'
import { ScopedLogger } from '@furystack/logging'

interface RequestCounterRecord {
  all: number
  GET: number
  POST: number
  sites: {
    [key: string]: {
      all: number
      GET: number
      POST: number
    }
  }
}

@Injectable({ lifetime: 'singleton' })
export class RequestCounterService implements IDisposable {
  private readonly logger: ScopedLogger
  private readonly writeInterval: ReturnType<typeof setInterval>
  public dispose() {
    clearInterval(this.writeInterval)
    this.write()
  }

  private readonly defaultState: RequestCounterRecord = {
    all: 0,
    GET: 0,
    POST: 0,
    sites: {},
  }

  private hasChanged = false

  private currentState: RequestCounterRecord = { ...this.defaultState }

  public reset() {
    this.currentState = { ...this.defaultState }
    this.hasChanged = true
    this.logger.information({ message: 'Request counter reseted.' })
  }

  private getStorageKey() {
    // SN-RequestCounterService-2019-06-17
    return `SN-${this.constructor.name}-${new Date().toISOString().split('T')[0]}`
  }

  public countRequest(site: string, type: 'GET' | 'POST') {
    this.currentState.all += 1
    this.currentState[type] += 1

    if (!this.currentState.sites[site]) {
      this.currentState.sites[site] = {
        all: 0,
        GET: 0,
        POST: 0,
      }
    }

    this.currentState.sites[site].all += 1
    this.currentState.sites[site][type] += 1
    this.hasChanged = true
  }

  public resetToday() {
    localStorage.removeItem(this.getStorageKey())
  }

  private read() {
    try {
      const stored = localStorage.getItem(this.getStorageKey())
      if (stored) {
        this.currentState = JSON.parse(stored)
      }
    } catch (e) {
      // ignore
      this.logger.warning({ message: 'Error reading / parsing request count from local storage' })
    }
  }

  private write() {
    if (this.hasChanged) {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.currentState))
      this.hasChanged = false
      this.logger.verbose({ message: `Request count changes persisted. Total: ${this.currentState.all}` })
    }
  }

  constructor(injector: Injector) {
    this.logger = injector.logger.withScope(this.constructor.name)
    this.read()
    this.writeInterval = setInterval(() => {
      this.write()
    }, 5000)
  }
}
