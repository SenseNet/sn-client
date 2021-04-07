export class Repository {
  content = [{ Id: 1, Name: 'name' }]
  post(content: any) {
    this.content = [...this.content, content]
    return { d: content }
  }
  patch(content: any) {
    this.content = [content]
    return { d: this.content[0] }
  }
  put() {
    console.log('put')
  }
  delete(content: any) {
    this.content = this.content.filter((c) => c.Id !== content.Id)
    return { d: { results: [content], errors: [] } }
  }
  copy() {
    console.log('copy')
  }
  move(content: any) {
    this.content = this.content.filter((c) => c.Id !== content.Id)
    return { d: { results: [content], errors: [] } }
  }
  executeAction(options: any) {
    const restored = { Id: 2, Name: 'restored' }
    if (options.name === 'Restore') {
      this.content = [...this.content, restored]
    }
  }
  load() {
    return { d: this.content[0] }
  }
  loadCollection() {
    return { d: { results: this.content } }
  }
  upload = {
    uploadChunked() {
      console.log('uploadChunked')
    },
    uploadNonChunked() {
      return { Url: '/Root/path' }
    },
  }
}
