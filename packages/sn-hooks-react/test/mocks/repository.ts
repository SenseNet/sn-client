/* eslint-disable @typescript-eslint/explicit-member-accessibility */
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
  move() {
    console.log('move')
  }
  executeAction() {
    console.log('executeAction')
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
