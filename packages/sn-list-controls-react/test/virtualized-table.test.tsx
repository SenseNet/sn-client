import { SchemaStore } from '@sensenet/default-content-types'
import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { Paper } from '@material-ui/core'
import { mount, shallow } from 'enzyme'
import { ActionsCell, DateCell, ReferenceCell } from '../src/ContentList/CellTemplates'
import { VirtualizedTable } from '../src/ContentList/virtualized-table'

const genericSchema = SchemaStore[1]

/**
 * Virtualized Table Component tests
 */
describe('Virtualized Table component', () => {
  describe('Initialization', () => {
    it('Should render without crashing with bare minimum props', () => {
      const component = shallow(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={[]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            tableProps={{ rowCount: 0, rowHeight: 57, headerHeight: 42, rowGetter: () => [] }}
          />
        </Paper>,
      )
      component.unmount()
    })

    it('Should render with a few content', () => {
      const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

      const component = shallow(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            tableProps={{
              rowCount: items.length,
              rowHeight: 57,
              headerHeight: 42,
              rowGetter: ({ index }) => items[index],
            }}
          />
        </Paper>,
      )
      component.unmount()
    })
  })

  describe('Selection and active item changes', () => {
    it('Should render with a selected content and the corresponding class should be appear', () => {
      const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

      const component = shallow(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            tableProps={{
              rowCount: items.length,
              rowHeight: 57,
              headerHeight: 42,
              rowGetter: ({ index }) => items[index],
            }}
          />
        </Paper>,
      )

      const selected = component.findWhere(
        (instance) =>
          instance.type() === TableRow &&
          typeof instance.props().className === 'string' &&
          instance.props().className.indexOf('selected') > -1,
      )
      expect(selected).toBeTruthy()

      component.unmount()
    })

    it('Clicking on a selection box should default behavior', () => {
      const items = [
        { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
        { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
      ]

      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                height: 400,
                width: 800,
                headerHeight: 42,
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )

      const selected = component
        .update()
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className !== 'select-all')
        .first()
      selected.props().onChange()
      component.unmount()
    })

    it('Clicking on a selection box should add a content to the selection if not selected', (done: jest.DoneCallback) => {
      const items = [
        { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
        { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
      ]

      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
            onRequestSelectionChange={(content) => {
              expect(content.length).toBe(1)
              expect(content[0].Id).toBe(1)
              component.unmount()
              done()
            }}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                height: 400,
                width: 800,
                headerHeight: 42,
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className !== 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Clicking on a selection box should remove a content from the selection if selected', (done: jest.DoneCallback) => {
      const items = [
        { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
        { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
      ]

      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
            onRequestSelectionChange={(contents) => {
              expect(contents.length).toBe(0)
              expect(contents).toEqual([])
              component.unmount()
              done()
            }}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                height: 400,
                width: 800,
                headerHeight: 42,
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className !== 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Clicking on a select all box should add all content to the selection, if not all is selected', (done: jest.DoneCallback) => {
      const items = [
        { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
        { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
      ]
      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
            onRequestSelectionChange={(selection) => {
              expect(selection.length).toBe(2)
              expect(selection).toEqual(selection)
              component.unmount()
              done()
            }}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                height: 400,
                width: 800,
                headerHeight: 42,
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className === 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Clicking on a select all box should clear the selection if all content are selected', (done: jest.DoneCallback) => {
      const items = [
        { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' },
        { Id: 2, Name: '2', Path: '2', DisplayName: 'B', Type: 'Folder' },
      ]
      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={items}
            active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
            onRequestSelectionChange={(selection) => {
              expect(selection.length).toBe(0)
              expect(selection).toEqual([])
              component.unmount()
              done()
            }}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                height: 400,
                width: 800,
                headerHeight: 42,
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className === 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Clicking on a row should trigger an active item change, if the callback is provided', (done: jest.DoneCallback) => {
      const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

      const component = mount(
        <Paper style={{ height: 400, width: '100%' }}>
          <VirtualizedTable
            items={items}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            tableProps={
              {
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                height: 400,
                width: 800,
                onRowClick: (rowMouseEventHandlerParams: any) => {
                  expect(rowMouseEventHandlerParams.rowData.Id).toBe(1)
                  component.unmount()
                  done()
                },
                rowGetter: ({ index }: any) => items[index],
              } as any
            }
          />
        </Paper>,
      )

      const row = component.find('.ReactVirtualized__Table__row').first()
      row.simulate('click')
    })

    describe('Actions', () => {
      it("Actions component shouldn't be added by if actions are selected but not expanded on the content", () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['Actions', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        const actionsComponent = component.find(ActionsCell)
        expect(actionsComponent.length).toBe(0)
        component.unmount()
      })

      it('Actions component should be added by if actions are selected and expanded on the content', () => {
        const items = [
          { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [{ Name: 'Example' } as any] },
        ]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['Actions', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  height: 400,
                  width: 800,
                  headerHeight: 42,
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const actionsComponent = component.find(ActionsCell)
        expect(actionsComponent.length).toBe(1)
        component.unmount()
      })
      it('onRequestActionsMenu should be triggered on click if actions are expanded', (done: jest.DoneCallback) => {
        const items = [
          { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [{ Name: 'Example' } as any] },
        ]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['Actions', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              onRequestActionsMenu={() => {
                component.unmount()
                done()
              }}
              tableProps={
                {
                  rowCount: items.length,
                  height: 400,
                  width: 800,
                  rowHeight: 57,
                  headerHeight: 42,
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const actionsComponent = component.find(ActionsCell)
        actionsComponent
          .first()
          .props()
          .openActionMenu(null as any)
      })
    })

    describe('Date field', () => {
      it('Should be added for modification date', () => {
        const items = [
          { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', ModificationDate: '2018-02-03T11:11Z' },
        ]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['ModificationDate']}
              selected={[]}
              orderBy="ModificationDate"
              orderDirection="asc"
              icons={{}}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  height: 400,
                  width: 800,
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const actionsComponent = component.find(DateCell)
        expect(actionsComponent.length).toBe(1)

        component.unmount()
      })
    })

    describe('Reference field', () => {
      it('Should be added for referemces', () => {
        const items = [
          {
            Id: 1,
            Name: '1',
            Path: '1',
            DisplayName: 'A',
            Type: 'Folder',
            CreatedBy: { Id: 3, Path: '/', Type: 'User', Name: 'Batman', DisplayName: 'Batman' },
          },
        ]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['CreatedBy']}
              selected={[]}
              orderBy="ModificationDate"
              orderDirection="asc"
              icons={{}}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  height: 400,
                  width: 800,
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const actionsComponent = component.find(ReferenceCell)
        expect(actionsComponent.length).toBe(1)

        component.unmount()
      })
    })

    describe('Field with a custom field component', () => {
      it('Should be added for references', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['DisplayName', 'Name']}
              selected={[]}
              orderBy="ModificationDate"
              orderDirection="asc"
              icons={{}}
              cellRenderer={(props) => {
                if (props.tableCellProps.dataKey === 'Name') {
                  return (
                    <span className="custom-field">{props.tableCellProps.rowData[props.tableCellProps.dataKey]}</span>
                  )
                }
                return null
              }}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  width: 800,
                  height: 400,
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const actionsComponent = component.findWhere(
          (instance) => instance.props().className && instance.props().className === 'custom-field',
        )
        expect(actionsComponent.length).toBe(1)

        component.unmount()
      })
    })

    describe('Event bindings', () => {
      it('should fire onItemClick when the row is clicked', (done: jest.DoneCallback) => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['DisplayName', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  height: 400,
                  width: 800,
                  onRowClick: (rowMouseEventHandlerParams: any) => {
                    expect(rowMouseEventHandlerParams.rowData.Id).toBe(1)
                    component.unmount()
                    done()
                  },
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )
        const row = component.find('.ReactVirtualized__Table__row').first()
        row.simulate('click')
      })

      it('should fire onItemDoubleClick  when the row is double-clicked', (done: jest.DoneCallback) => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['DisplayName', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              tableProps={
                {
                  rowCount: items.length,
                  rowHeight: 57,
                  headerHeight: 42,
                  height: 400,
                  width: 800,
                  onRowDoubleClick: (param: any) => {
                    expect(param.rowData.Id).toBe(1)
                    component.unmount()
                    done()
                  },
                  rowGetter: ({ index }: any) => items[index],
                } as any
              }
            />
          </Paper>,
        )

        const row = component.find('.ReactVirtualized__Table__row').first()

        row.simulate('doubleclick')
      })
      it('should request order change when the header is clicked', (done: jest.DoneCallback) => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['DisplayName', 'Type']}
              selected={[]}
              orderBy="Type"
              orderDirection="asc"
              icons={{}}
              onRequestOrderChange={(field, direction) => {
                expect(field).toBe('DisplayName')
                expect(direction).toBe('desc')
                component.unmount()
                done()
              }}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => {
                  return items[index]
                },
              }}
            />
          </Paper>,
        )
        const row = component.find(TableSortLabel).first()
        row.simulate('click')
      })
      it('should request order change and invert the direction', (done: jest.DoneCallback) => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = mount(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema}
              fieldsToDisplay={['DisplayName', 'Type']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="desc"
              icons={{}}
              onRequestOrderChange={(field, direction) => {
                expect(field).toBe('DisplayName')
                expect(direction).toBe('asc')
                component.unmount()
                done()
              }}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        const row = component.find(TableSortLabel).first()
        row.simulate('click')
      })
      it('should render without crashing with setting displayRowCheckbox to false', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              fieldsToDisplay={['DisplayName']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              displayRowCheckbox={false}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without selected', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              fieldsToDisplay={['DisplayName']}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing if selected is undefined', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              selected={undefined}
              fieldsToDisplay={['DisplayName']}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render with custom selection control', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              selected={undefined}
              fieldsToDisplay={['DisplayName']}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              getSelectionControl={() => <div />}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render with custom selection control and selection', () => {
        const content = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]
        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={content}
              schema={genericSchema.DisplayName as any}
              selected={content}
              fieldsToDisplay={['DisplayName']}
              orderBy="DisplayName"
              orderDirection="asc"
              icons={{}}
              getSelectionControl={() => <div />}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: content.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => content[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without orderBy', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              fieldsToDisplay={['DisplayName']}
              selected={[]}
              orderDirection="asc"
              icons={{}}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without orderDirection', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              fieldsToDisplay={['DisplayName']}
              selected={[]}
              orderBy="DisplayName"
              icons={{}}
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without icons', () => {
        const items = [{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]

        const component = shallow(
          <Paper style={{ height: 400, width: '100%' }}>
            <VirtualizedTable
              items={items}
              schema={genericSchema.DisplayName as any}
              fieldsToDisplay={['DisplayName']}
              selected={[]}
              orderBy="DisplayName"
              orderDirection="asc"
              displayRowCheckbox={true}
              tableProps={{
                rowCount: items.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => items[index],
              }}
            />
          </Paper>,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
    })
  })
})
