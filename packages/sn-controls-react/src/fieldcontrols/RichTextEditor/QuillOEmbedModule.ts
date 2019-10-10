import { Quill } from 'react-quill'
import { DeltaStatic } from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

export default class QuillOEmbedModule {
  private quill: Quill

  constructor(quill: Quill) {
    this.quill = quill
    quill.clipboard.addMatcher(Node.TEXT_NODE, this.pasteHandler.bind(this))
  }

  private pasteHandler(node: any, delta: DeltaStatic): DeltaStatic {
    if (delta.ops && QuillOEmbedModule.isValidUrl(node.data) && node.data.toLowerCase().indexOf('oembed') > -1) {
      const { index } = this.quill.getSelection(true)

      const formatParam = '&format=json'
      const sizeParam = '&maxwidth=500&maxheight=500'

      fetch(node.data + formatParam + sizeParam, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json())
        .then(json => this.insertEmbedFromJson(json, index))
        .then(removeOriginal => {
          if (removeOriginal) this.quill.deleteText(index + 1, node.data.length)
        })
        .catch(() => {
          const targetUrl = new URL(node.data).searchParams.get('url')

          if (targetUrl && QuillOEmbedModule.isValidUrl(targetUrl)) {
            this.quill.deleteText(index, node.data.length)
            this.quill.insertText(index, targetUrl)
          }
        })
    }

    return delta
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
        const data: OEmbedData = { html: oEmbed.html, height: oEmbed.height, width: oEmbed.width }
        this.quill.insertEmbed(index, 'oembed-wrapper', data, 'api')
        return true
      }
      default:
        return false
    }
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
