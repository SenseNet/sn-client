### TypeField

```tsx
<AdvancedSearch
    schema={null as any}
    onQueryChanged={action("queryChanged")}
    fields={() =>
        <TypeField
            schemaStore={new Repository().schemas}
            types={[User, Folder, PortalSettings]}
            onQueryChange={action("onQueryChange")}
        />
    }
/>
```