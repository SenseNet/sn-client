import { renderHtml } from '../src/utils'

describe('utils', () => {
  it('rendetHtml should convert editor state to html', () => {
    const output = renderHtml({
      content: [
        {
          attrs: { textAlign: 'left' },
          content: [
            {
              marks: [{ attrs: { href: 'https://sensenet.com', target: '_blank' }, type: 'link' }],
              text: 'Hello',
              type: 'text',
            },
            { text: ' world', type: 'text' },
          ],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    })

    expect(output).toBe(
      '<p><a target="_blank" rel="noopener noreferrer nofollow" href="https://sensenet.com">Hello</a> world</p>',
    )
  })
})
