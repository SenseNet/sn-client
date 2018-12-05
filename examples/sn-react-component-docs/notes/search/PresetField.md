### PresetField

With the ```PresetField``` component, You can define multiple name / query pairs and they will be displayed in a select control


```tsx
<AdvancedSearch 
    schema={...}
    fields={() =>
        <PresetField
            fieldName="CreationDate"
            presets={[
                { text: '-', value: new Query((a) => a) },
                { text: 'Today', value: new Query((a) => a.term('CreationDate:>@@Today@@')) },
                { text: 'Yesterday', value: new Query((a) => a.term('CreationDate:>@@Yesterday@@').and.term('CreationDate:<@@Today@@')) },
            ]}
            onQueryChange={...}
        />}
    />
```