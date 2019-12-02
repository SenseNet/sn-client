export const fakeClick = (obj: EventTarget) => {
  const ev = document.createEvent('MouseEvents')
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  obj.dispatchEvent(ev)
}

export const downloadFile = (name: string, repositoryUrl: string) => {
  const saveLink = document.createElement('a')
  saveLink.href = `${repositoryUrl}${name}?download`
  fakeClick(saveLink)
}
