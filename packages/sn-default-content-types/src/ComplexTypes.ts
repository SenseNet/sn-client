/**
 * @module ComplexTypes
 * @preferred
 *
 * @description Module containing complex data types like HyperLink or ChoiceOption.
 *
 * This module is autogenerated from Sense/Net ContentRepository.
 *
 * ```
 * let link = new Fields.HyperlinkData({
 *   Href: 'http://sensenet.com',
 *   Text: 'Link to sensenet.com',
 *   Title: 'Go to sensenet.com',
 *   Target: '_blank'
 * });
 *
 * let webContent = new ContentTypes.WebContentDemo({
 *   Id: 1,
 *   Name: 'MyContent',
 *   DisplayName: 'My Content',
 *   Type: 'WebContentDemo',
 *   Details: link
 * });
 *
 * ```
 */ /** */

export type ChoiceOption = {
  Value: string
  Text?: string
  Enabled?: boolean
  Selected?: boolean
}

export type DeferredUriObject = {
  uri: string
}

export type DeferredObject = Object & {
  __deferred: DeferredUriObject
}

export type MediaObject = {
  edit_media: string
  media_src: string
  content_type: string
  media_etag: string
}

export type MediaResourceObject = Object & {
  __mediaresource: MediaObject
}
