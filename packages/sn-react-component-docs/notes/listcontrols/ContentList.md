### Content List

This is a component to display items in a grid with a row for every item and with columns for the given fields of the content.

The cells can have templates to display the related data. There're some Field types which have a default template in the list-controls package (```ActionsCell```, ```DateCell```, ```DisplayNameCell```), all the other types are displayed with the ```DefaultCell```. It is also possible to create and set a fully custom celltemplate based on your needs through the ```fieldComponent``` param. This param has the list component properties as an input so that you are able to reach all the fields, match them by their names and set a custom component to display the related cell.

```tsx
<ContentList
    ...
    fieldComponent={(props) => {
        switch(props.field) {
            case 'DisplayName':
                return (<a href={props.content.Path}>
                    {props.content.DisplayName}
                </a>)
            default:
                return null
        }
    }}
    ...
</>
```