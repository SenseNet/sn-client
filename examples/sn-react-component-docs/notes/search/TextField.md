### Text field

You can search for a simple text in a specified field of the content.

```tsx
<AdvancedSearch
        schema={...}
        onQueryChanged={...}
        fields={(options) =>
            <TextField
                fieldName="DisplayName"
                onQueryChange={options.updateQuery}
            />
        }
    />
```