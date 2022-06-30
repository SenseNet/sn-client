import { Table, TableBody } from '@material-ui/core'
import React from 'react'
import { CollapsibleTableRow, WebhookStatInput } from '.'

export interface CollapsibleTableProps {
  webhooks: WebhookStatInput[]
}

export function CollapsibleTable({ webhooks }: CollapsibleTableProps) {
  return (
    <Table aria-label="collapsible table">
      <TableBody>
        {webhooks.map((webhookItem) => (
          <CollapsibleTableRow key={webhookItem.CreationTime} row={webhookItem} />
        ))}
      </TableBody>
    </Table>
  )
}
