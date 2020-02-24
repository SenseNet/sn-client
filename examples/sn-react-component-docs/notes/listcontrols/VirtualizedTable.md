### Virtualized Table

Virtualized Table is similar to Content List, but helps with performance issues if you have lots of items.
You can use it like the Content List component except onItemTap and onItemContextMenu props. These are not implemented in virtualized table.
It has some other differencies as well:

<b><u>onRowDoubleClick</u></b>

It should be in a tableProps prop

```tsx
tableProps={{
  onRowDoubleClick: //what to do on double click,
}}
```

<b><u>fieldComponent</u></b>

I has been renamed to `cellRenderer`

<b><u>onRequestActiveItemChange</u></b>

This prop is not available in the Virtualized Table component, but you can define what should happen in the `onRowClick`

```tsx
onRowClick: rowMouseEventHandlerParams => {
  //what to do
}
```

<b><u>onItemClick</u></b>

This prop is not available in the Virtualized Table component, but you can define what should happen in the `onRowClick` as in the previous example

<b><u>onAction</u></b>

Not available in Virtualized Table component

<b><u>hideHeader</u></b>

This prop has been renamed to `disableHeader`, you can add it in the tableProps prop

```tsx
tableProps={{
  disableHeader: false,
}}
```

For tableProps rowCount,rowHeight, headerHeight and rowGetter attributes are mandatory
