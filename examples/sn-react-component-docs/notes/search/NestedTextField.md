### Nested Text field

You can search for a simple text in a specified nested field of another reference field on the content (e.g. search for Name of the content Owner).

```tsx
<AdvancedSearch
        schema={...}
        onQueryChanged={...}
        fields={(options) =>
            <NestedTextField
                fieldName="Owner"
                nestedFieldName="DisplayName"
                onQueryChange={options.updateQuery}
            />
        }
    />
```