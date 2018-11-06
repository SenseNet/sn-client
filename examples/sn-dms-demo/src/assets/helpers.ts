
export const getContentTypeFromUrl = (urlString: string) => {
    const urlTemp = urlString.split('ContentTypeName=')[1]
    const type = urlTemp.indexOf('&') > -1 ? urlTemp.split('&')[0] : urlTemp
    return type.indexOf('ContentTemplates') > -1 ? type.split('/')[3] : type
}

export const getExtensionFromUrl = (urlString: string) => {
    const urlTemp = urlString.split('ContentTypeName=')[1]
    const typeUrl = urlTemp.indexOf('&') > -1 ? urlTemp.split('&')[0] : urlTemp
    const name = typeUrl.split('/')[4]
    return name.split('.')[1]
}

export const fakeClick = (obj) => {
    const ev = document.createEvent('MouseEvents')
    ev.initMouseEvent('click', true, false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null,
    )
    obj.dispatchEvent(ev)
}

export const downloadFile = (name: string, repositoryUrl: string) => {
    const saveLink = document.createElement('a')
    // tslint:disable-next-line:no-string-literal
    saveLink['href'] = `${repositoryUrl}${name}?download`
    fakeClick(saveLink)
}

export const versionName = (versionChar: string) => {
    switch (versionChar) {
        case 'A':
            return 'APPROVED'
        case 'L':
            return 'LOCKED'
        case 'D':
            return 'DRAFT'
        case 'P':
            return 'PENDING'
        case 'R':
            return 'REJECTED'
        default:
            return 'APPROVED'
    }
}
