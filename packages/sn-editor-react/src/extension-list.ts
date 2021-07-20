import { Blockquote } from '@tiptap/extension-blockquote'
import { Bold } from '@tiptap/extension-bold'
import { BulletList } from '@tiptap/extension-bullet-list'
import { Code } from '@tiptap/extension-code'
import { CodeBlock } from '@tiptap/extension-code-block'
import { Document } from '@tiptap/extension-document'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { Gapcursor } from '@tiptap/extension-gapcursor'
import { HardBreak } from '@tiptap/extension-hard-break'
import { Heading } from '@tiptap/extension-heading'
import { History } from '@tiptap/extension-history'
import { Italic } from '@tiptap/extension-italic'
import { Link } from '@tiptap/extension-link'
import { ListItem } from '@tiptap/extension-list-item'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Placeholder, PlaceholderOptions } from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { Text } from '@tiptap/extension-text'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { SensenetImage } from './extensions'

interface ExtensionOptions {
  placeholder: Partial<PlaceholderOptions>
}

export const createExtensions = (options?: ExtensionOptions) => [
  Blockquote.configure(),
  Bold.configure(),
  BulletList.configure(),
  Code.configure(),
  CodeBlock.configure(),
  Document.configure(),
  Dropcursor.configure(),
  Gapcursor.configure(),
  HardBreak.configure(),
  Heading.configure(),
  History.configure(),
  Italic.configure(),
  Link.configure({
    openOnClick: false,
  }),
  ListItem.configure(),
  OrderedList.configure(),
  Paragraph.configure(),
  Placeholder.configure(options?.placeholder),
  SensenetImage.configure(),
  Table.configure(),
  TableCell.configure(),
  TableHeader.configure(),
  TableRow.configure(),
  Text.configure(),
  TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
  Underline.configure(),
]
