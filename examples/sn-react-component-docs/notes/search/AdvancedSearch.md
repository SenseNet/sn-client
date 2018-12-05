### Advanced Search

The ```AdvancedSearch``` component is a container for building advanced search forms. You have to provide a ```schema``` and a factory method to create ```fields``` and you can use the ```onQueryChanged``` callback to track the state of your query.


```tsx
<AdvancedSearch
    ...
    schema={...}
    onQueryChanged={...}
    fields={(options) => <div>
        <button 
            onClick={() => options.updateQuery("Property", new Query(...))}>Update Query</button>
    </div>}
    ...
/>
```