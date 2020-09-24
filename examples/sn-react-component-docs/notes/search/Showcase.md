### Concepts

The search component can be separated into a container component called `<AdvancedSearch />` and into separate field controls.

#### The <AdvancedSearch< T > /> component

This container component is responsible for aggregating the query (with an AND term by default) and firing the `onQueryChanged()` event.
You can use its generic parameter for code completition on fields and you should provide a schema object that can be used by the field controls.

The component has a `fields` factory method on its props that can be used to generate the field controls and it has an options parameter that can be used to:

- **schema:** _Schema_ - Retrieve the provided schema
- **updateQuery:** _(key: string, query: Query) => void_ - Update a subquery value (based on an unique key that can be the field name by default)

#### The field components

Field components can be used inside the <AdvancedSearch>'s `fields()` factory method and usually call _updateQuery()_ on a specified change
The search component has the following field controls:

- TextField - Checks if the specified _text field_ contains the value entered in a simple text input
- TypeField - Select control for filtering by content type. Allows multiple selection. The types subquery will be aggregated with an `OR` term
- PresetField - Select control for predefined subquery values
- ReferenceField - Autocomplete control for picking a single reference value

### Using the showcase app

In order to get the result, please set up your repository in the Settings section and check that

- Your <a href="https://docs.sensenet.com/guides/setup#portal.settings" target="_blank">CORS</a> settings are correct
- You have logged in / have appropriate rights for the content
