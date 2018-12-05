### Reference field

The reference field can be used as an autocomplete field to pick from a list of content.

```tsx
<AdvancedSearch
    schema={null as any}
    fields={(options) => <ReferenceField<GenericContent>
        fieldName="CreatedBy"
        fieldSetting={{
            Name: "Created By",
            Type: "User",
            FieldClassName: "",
            AllowedTypes: ['User'],
        }}
        fetchItems={async (query) => {
            /** your logic to retrieve the fetched content based on the provided query */
            return [...]
        }}
        onQueryChange={options.updateQuery}
        helperText={'Type something to filter'}
        id="reference-filter"
    />}
/>
```