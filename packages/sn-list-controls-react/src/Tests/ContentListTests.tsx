import { GenericContent, SchemaStore } from '@sensenet/default-content-types'
import { expect } from 'chai'
import * as React from 'react'
import * as renderer from 'react-test-renderer'
import { ActionsCell } from '../ContentList/CellTemplates/ActionsCell'
import { DateCell } from '../ContentList/CellTemplates/DateCell'
import { ReferenceCell } from '../ContentList/CellTemplates/ReferenceCell'
import { ContentList } from '../ContentList/ContentList'

const genericSchema = SchemaStore[1]

/**
 * ContentList Component tests
 */
export const contentListTests: Mocha.Suite = describe('ContentList component', () => {

    describe('Initialization', () => {
        it('Should render without crashing with bare minimum props', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)
            component.unmount()
        })

        it('Should render with a few content', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)
            component.unmount()
        })

    })

    describe('Selection and active item changes', () => {
        it('Should render with a selected content and the corresponding class should be appear', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)

            const selected = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && typeof instance.props.className === 'string' && instance.props.className.indexOf('selected') > -1)
            expect(selected.length).to.be.equal(1)

            component.unmount()
        })

        it('Clicking on a selection box should default behavior', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[
                    { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
                    { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
                ]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'Checkbox' && instance.props.className !== 'select-all')[0]
            selected.props.onChange()
            component.unmount()
        })

        it('Clicking on a selection box should add a content to the selection if not selected', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[
                    { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
                    { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
                ]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestSelectionChange={(items) => {
                    expect(items.length).to.be.equal(1)
                    expect(items[0].Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'Checkbox' && instance.props.className !== 'select-all')[0]
            selected.props.onChange()
        })

        it('Clicking on a selection box should remove a content from the selection if selected', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[
                    { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
                    { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
                ]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestSelectionChange={(items) => {
                    expect(items.length).to.be.equal(0)
                    expect(items).to.be.deep.equal([])
                    component.unmount()
                    done()
                }}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'Checkbox' && instance.props.className !== 'select-all')[0]
            selected.props.onChange()
        })

        it('Clicking on a select all box should add all content to the selection, if not all is selected', (done: MochaDone) => {
            const items = [
                { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
                { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
            ]
            const component = renderer.create(<ContentList<GenericContent>
                items={items}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestSelectionChange={(selection) => {
                    expect(selection.length).to.be.equal(2)
                    expect(selection).to.be.deep.eq(selection)
                    component.unmount()
                    done()
                }}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'Checkbox' && instance.props.className === 'select-all')[0]
            selected.props.onChange()
        })

        it('Clicking on a select all box should clear the selection if all content are selected', (done: MochaDone) => {
            const items = [
                { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
                { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
            ]
            const component = renderer.create(<ContentList<GenericContent>
                items={items}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={items}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestSelectionChange={(selection) => {
                    expect(selection.length).to.be.equal(0)
                    expect(selection).to.be.deep.eq([])
                    component.unmount()
                    done()
                }}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'Checkbox' && instance.props.className === 'select-all')[0]
            selected.props.onChange()
        })

        it('Should render with an active content and the corresponding class should be appear', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)
            const selected = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && typeof instance.props.className === 'string' && instance.props.className.indexOf('active') > -1)
            expect(selected.length).to.be.equal(1)
            component.unmount()
        })

        it('Clicking on a row should trigger an active item change, if the callback is provided', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestActiveItemChange={(item) => {
                    expect(item.Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && instance.props.className && instance.props.className.indexOf('type-folder') !== -1)[0]
            row.props.onClick()
        })
    })

    describe('Actions', () => {
        it('Actions component shouldn\'t be added by if actions are selected but not expanded on the content', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['Actions', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)

            const actionsComponent = component.root.findAllByType(ActionsCell)
            expect(actionsComponent.length).to.be.equal(0)

            component.unmount()
        })

        it('Actions component should be added by if actions are selected and expanded on the content', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [] }]}
                schema={genericSchema}
                fieldsToDisplay={['Actions', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
            />)
            const actionsComponent = component.root.findAllByType(ActionsCell)
            expect(actionsComponent.length).to.be.equal(1)

            component.unmount()
        })

        it('onRequestActionsMenu should be triggered on click if actions are expanded', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [] }]}
                schema={genericSchema}
                fieldsToDisplay={['Actions', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onRequestActionsMenu={(ev) => {
                    component.unmount()
                    done()
                }}
            />)
            const actionsComponent = component.root.findAllByType(ActionsCell)
            actionsComponent[0].props.openActionMenu()
        })
    })

    describe('Date field', () => {
        it('Should be added for modification date', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', ModificationDate: '2018-02-03T11:11Z' }]}
                schema={genericSchema}
                fieldsToDisplay={['ModificationDate']}
                selected={[]}
                orderBy="ModificationDate"
                orderDirection="asc"
                icons={{}}
            />)
            const actionsComponent = component.root.findAllByType(DateCell)
            expect(actionsComponent.length).to.be.equal(1)

            component.unmount()
        })
    })

    describe('Reference field', () => {
        it('Should be added for referemces', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', CreatedBy: { Id: 3, Path: '/', Type: 'User', Name: 'Batman', DisplayName: 'Batman' } }]}
                schema={genericSchema}
                fieldsToDisplay={['CreatedBy']}
                selected={[]}
                orderBy="ModificationDate"
                orderDirection="asc"
                icons={{}}
            />)
            const actionsComponent = component.root.findAllByType(ReferenceCell)
            expect(actionsComponent.length).to.be.equal(1)

            component.unmount()
        })
    })

    describe('Field with a custom field component', () => {
        it('Should be added for referemces', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Name']}
                selected={[]}
                orderBy="ModificationDate"
                orderDirection="asc"
                icons={{}}
                fieldComponent={(props) => {
                    if (props.field === 'Name') {
                        return (<div className="custom-field">{props.content[props.field]}</div>)
                    }
                    return null
                }}
            />)
            const actionsComponent = component.root.findAll((instance) => instance.props.className && instance.props.className === 'custom-field')
            expect(actionsComponent.length).to.be.equal(1)

            component.unmount()
        })
    })

    describe('Event bindings', () => {
        it('should fire onItemClick when the row is clicked', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onItemClick={(ev, item) => {
                    expect(item.Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && instance.props.className && instance.props.className.indexOf('type-folder') !== -1)[0]
            row.props.onClick()
        })

        it('should fire onItemDoubleClick  when the row is double-clicked', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onItemDoubleClick={(ev, item) => {
                    expect(item.Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && instance.props.className && instance.props.className.indexOf('type-folder') !== -1)[0]
            row.props.onDoubleClick()
        })

        it('should fire onItemTap when the row is tapped', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onItemTap={(ev, item) => {
                    expect(item.Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && instance.props.className && instance.props.className.indexOf('type-folder') !== -1)[0]
            row.props.onTouchEnd()
        })

        it('should fire onItemContextMenu  when the context menu is triggered', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                onItemContextMenu={(ev, item) => {
                    expect(item.Id).to.be.equal(1)
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableRow' && instance.props.className && instance.props.className.indexOf('type-folder') !== -1)[0]
            row.props.onContextMenu()
        })

        it('should request order change when the header is clicked', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="Type"
                orderDirection="asc"
                icons={{}}
                onRequestOrderChange={(field, direction) => {
                    expect(field).to.be.equal('DisplayName')
                    expect(direction).to.be.equal('desc')
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableSortLabel')[0]
            row.props.onClick()
        })

        it('should request order change and invert the direction', (done: MochaDone) => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName', 'Type']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="desc"
                icons={{}}
                onRequestOrderChange={(field, direction) => {
                    expect(field).to.be.equal('DisplayName')
                    expect(direction).to.be.equal('asc')
                    component.unmount()
                    done()
                }}
            />)
            const row = component.root.findAll((instance) => (instance.type as any).name === 'TableSortLabel')[0]
            row.props.onClick()
        })
        it('should render without crashing with setting displayRowCheckbox to false', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                displayRowCheckbox={false}
            />)
            component.unmount()
        })
        it('should render without crashing without selected', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render without crashing without selected undefined', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                selected={undefined}
                fieldsToDisplay={['DisplayName']}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render with custom selection control', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                selected={undefined}
                fieldsToDisplay={['DisplayName']}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                getSelectionControl={() => <div></div>}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })

        it('should render with custom selection control and selection', () => {
            const content = { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }
            const component = renderer.create(<ContentList<GenericContent>
                items={[content]}
                schema={genericSchema}
                selected={[content]}
                fieldsToDisplay={['DisplayName']}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                getSelectionControl={() => <div></div>}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render without crashing without orderBy', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderDirection="asc"
                icons={{}}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render without crashing without orderDirection', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderBy="DisplayName"
                icons={{}}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render without crashing without icons', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                fieldsToDisplay={['DisplayName']}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
        it('should render without crashing without fieldsToDisplay', () => {
            const component = renderer.create(<ContentList<GenericContent>
                items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
                schema={genericSchema}
                selected={[]}
                orderBy="DisplayName"
                orderDirection="asc"
                icons={{}}
                displayRowCheckbox={true}
            />)
            component.unmount()
        })
    })
})
