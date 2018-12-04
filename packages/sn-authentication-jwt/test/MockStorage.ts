export class MockStorage implements Storage {
  private innerStorage: Map<string, string>

  constructor() {
    this.innerStorage = new Map()
  }

  [index: number]: string
  [key: string]: any
  public get length(): number {
    return this.innerStorage.size
  }
  public clear(): void {
    this.innerStorage.clear()
  }
  public getItem(key: string): string | null {
    return this.innerStorage.get(key) || null
  }
  public key(): string {
    throw new Error('Method not implemented.')
  }
  public removeItem(key: string): void {
    this.innerStorage.delete(key)
  }
  public setItem(key: string, data: string): void {
    this.innerStorage.set(key, data)
  }
}
