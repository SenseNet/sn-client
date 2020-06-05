import { DeltaStatic } from 'quill'
import { Quill } from 'react-quill'

const BlockEmbed = Quill.import('blots/block/embed')

export default class QuillOEmbedModule {
  private quill: Quill

  constructor(quill: Quill) {
    this.quill = quill
    quill.clipboard.addMatcher(Node.TEXT_NODE, this.pasteHandler.bind(this))
  }

  public pasteHandler(node: any, delta: DeltaStatic): DeltaStatic {
    if (delta.ops && QuillOEmbedModule.isValidUrl(node.data) && node.data.toLowerCase().indexOf('oembed') > -1) {
      this.processRequest(node).then(() => {})
    }

    return delta
  }

  public async processRequest(node: any) {
    const { index } = this.quill.getSelection(true)

    const formatParam = '&format=json'
    const sizeParam = '&maxwidth=500&maxheight=500'

    try {
      const response = await fetch(node.data + formatParam + sizeParam, {
        headers: {
          Accept: 'application/json',
        },
      })
      const json = await response.json()
      const removeOriginal = this.insertEmbedFromJson(json, index)
      if (removeOriginal) this.quill.deleteText(index + 1, node.data.length)
    } catch (e) {
      const targetUrl = new URL(node.data).searchParams.get('url')

      if (targetUrl && QuillOEmbedModule.isValidUrl(targetUrl)) {
        this.quill.deleteText(index, node.data.length)
        this.quill.insertText(index, targetUrl)
      }
    }
  }

  private static isValidUrl(potentialUrl: string): boolean {
    try {
      new URL(potentialUrl)
      return true
    } catch (e) {
      return false
    }
  }

  private insertEmbedFromJson(oEmbed: any, index: number): boolean {
    switch (oEmbed.type) {
      case 'photo':
        this.quill.insertEmbed(index, 'image', oEmbed.url, 'api')
        return true
      case 'video':
      case 'rich': {
        const data: OEmbedData = QuillOEmbedModule.getOEmbedData(oEmbed)
        this.quill.insertEmbed(index, 'oembed-wrapper', data, 'api')
        return true
      }
      default:
        return false
    }
  }

  private static getOEmbedData(oEmbed: any): OEmbedData {
    if (oEmbed.width || oEmbed.height) {
      return { html: oEmbed.html, height: oEmbed.height, width: oEmbed.width }
    }

    if (oEmbed.thumbnail_width || oEmbed.thumbnail_height) {
      return { html: oEmbed.html, height: oEmbed.thumbnail_height, width: oEmbed.thumbnail_width }
    }

    return { html: oEmbed.html, height: 500, width: 500 }
  }
}

interface OEmbedData {
  html: string
  width: number
  height: number
}

/**
 * Extension of the BlockEmbed class to allow Quill-sided creation of an iframe with the content we want.
 *
 * Also allows for width and height of the resulting iframe to be set.
 */
class OEmbedWrapper extends BlockEmbed {
  public static create(value: OEmbedData) {
    const { html, width, height } = value

    const node = super.create(html)

    node.setAttribute('srcdoc', html)
    node.setAttribute('width', width.toString())
    node.setAttribute('height', height.toString())

    node.setAttribute('frameborder', '0')
    node.setAttribute('allowfullscreen', 'true')
    return node
  }

  public static value(node: any) {
    return node.getAttribute('srcdoc')
  }
}

//Name for Quill to find this embed under
OEmbedWrapper.blotName = 'oembed-wrapper'

//Tag to create by Quill
OEmbedWrapper.tagName = 'iframe'

Quill.register(OEmbedWrapper, true)
