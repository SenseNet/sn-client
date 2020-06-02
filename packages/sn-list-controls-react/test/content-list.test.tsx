import { SchemaStore } from '@sensenet/default-content-types'
import Checkbox from '@material-ui/core/Checkbox'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { mount, shallow } from 'enzyme'
import React from 'react'
import { ActionsCell, DateCell, ReferenceCell } from '../src/ContentList/CellTemplates'
import { ContentList } from '../src/ContentList/ContentList'

const genericSchema = SchemaStore[1]

/**
 * ContentList Component tests
 */
describe('ContentList component', () => {
  describe('Initialization', () => {
    it('Should render without crashing with bare minimum props', () => {
      const component = shallow(
        <ContentList
          items={[]}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName']}
          selected={[]}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
        />,
      )
      component.unmount()
    })

    it('Should render with a few content', () => {
      const component = shallow(
        <ContentList
          items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName']}
          selected={[]}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
        />,
      )
      component.unmount()
    })
  })

  describe('Selection and active item changes', () => {
    it('Should render with a selected content and the corresponding class should be appear', () => {
      const component = shallow(
        <ContentList
          items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName']}
          selected={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
        />,
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
      const component = shallow(
        <ContentList
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
        />,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className !== 'select-all')
        .first()
      selected.props().onChange()
      component.unmount()
    })

    it('Clicking on a selection box should add a content to the selection if not selected', (done: jest.DoneCallback) => {
      const component = shallow(
        <ContentList
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
            expect(items.length).toBe(1)
            expect(items[0].Id).toBe(1)
            component.unmount()
            done()
          }}
        />,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className !== 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Clicking on a selection box should remove a content from the selection if selected', (done: jest.DoneCallback) => {
      const component = shallow(
        <ContentList
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
            expect(items.length).toBe(0)
            expect(items).toEqual([])
            component.unmount()
            done()
          }}
        />,
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
      const component = shallow(
        <ContentList
          items={items}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName', 'Type']}
          selected={[]}
          active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
          onRequestSelectionChange={(selection) => {
            expect(selection.length).toBe(2)
            expect(selection).toEqual(selection)
            component.unmount()
            done()
          }}
        />,
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
      const component = shallow(
        <ContentList
          items={items}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName', 'Type']}
          selected={items}
          active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
          onRequestSelectionChange={(selection) => {
            expect(selection.length).toBe(0)
            expect(selection).toEqual([])
            component.unmount()
            done()
          }}
        />,
      )
      const selected = component
        .findWhere((instance) => instance.type() === Checkbox && instance.props().className === 'select-all')
        .first()
      selected.props().onChange()
    })

    it('Should render with an active content and the corresponding class should be appear', () => {
      const component = shallow(
        <ContentList
          items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName', 'Type']}
          selected={[]}
          active={{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
        />,
      )
      const selected = component.findWhere(
        (instance) =>
          instance.type() === TableRow &&
          typeof instance.props().className === 'string' &&
          instance.props().className.indexOf('active') > -1,
      )
      expect(selected.length).toBe(1)
      component.unmount()
    })

    it('Clicking on a row should trigger an active item change, if the callback is provided', (done: jest.DoneCallback) => {
      const component = shallow(
        <ContentList
          items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
          schema={genericSchema}
          fieldsToDisplay={['DisplayName', 'Type']}
          selected={[]}
          orderBy="DisplayName"
          orderDirection="asc"
          icons={{}}
          onRequestActiveItemChange={(item) => {
            expect(item.Id).toBe(1)
            component.unmount()
            done()
          }}
        />,
      )
      const row = component
        .findWhere(
          (instance) =>
            instance.type() === TableRow &&
            instance.props().className &&
            instance.props().className.indexOf('type-folder') !== -1,
        )
        .first()
      row.props().onClick()
    })

    describe('Actions', () => {
      it("Actions component shouldn't be added by if actions are selected but not expanded on the content", () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['Actions', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
          />,
        )
        const actionsComponent = component.find(ActionsCell)
        expect(actionsComponent.length).toBe(0)
        component.unmount()
      })

      it('Actions component should be added by if actions are selected and expanded on the content', () => {
        const component = mount(
          <ContentList
            items={[
              { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [{ Name: 'Example' } as any] },
            ]}
            schema={genericSchema}
            fieldsToDisplay={['Actions', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
          />,
        )
        const actionsComponent = component.find(ActionsCell)
        expect(actionsComponent.length).toBe(1)
        component.unmount()
      })
      it('onRequestActionsMenu should be triggered on click if actions are expanded', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[
              { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', Actions: [{ Name: 'Example' } as any] },
            ]}
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
          />,
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
        const component = mount(
          <ContentList
            items={[
              { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder', ModificationDate: '2018-02-03T11:11Z' },
            ]}
            schema={genericSchema}
            fieldsToDisplay={['ModificationDate']}
            selected={[]}
            orderBy="ModificationDate"
            orderDirection="asc"
            icons={{}}
          />,
        )
        const actionsComponent = component.find(DateCell)
        expect(actionsComponent.length).toBe(1)

        component.unmount()
      })
    })

    describe('Reference field', () => {
      it('Should be added for referemces', () => {
        const component = mount(
          <ContentList
            items={[
              {
                Id: 1,
                Name: '1',
                Path: '1',
                DisplayName: 'A',
                Type: 'Folder',
                CreatedBy: { Id: 3, Path: '/', Type: 'User', Name: 'Batman', DisplayName: 'Batman' },
              },
            ]}
            schema={genericSchema}
            fieldsToDisplay={['CreatedBy']}
            selected={[]}
            orderBy="ModificationDate"
            orderDirection="asc"
            icons={{}}
          />,
        )
        const actionsComponent = component.find(ReferenceCell)
        expect(actionsComponent.length).toBe(1)

        component.unmount()
      })
    })

    describe('Field with a custom field component', () => {
      it('Should be added for references', () => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Name']}
            selected={[]}
            orderBy="ModificationDate"
            orderDirection="asc"
            icons={{}}
            fieldComponent={(props) => {
              if (props.field === 'Name') {
                return (
                  <td>
                    <div className="custom-field">{props.content[props.field]}</div>
                  </td>
                )
              }
              return null
            }}
          />,
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
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            onItemClick={(_ev, item) => {
              expect(item.Id).toBe(1)
              component.unmount()
              done()
            }}
          />,
        )
        const row = component
          .findWhere(
            (instance) =>
              instance.type() === TableRow &&
              instance.props().className &&
              instance.props().className.indexOf('type-folder') !== -1,
          )
          .first()
        row.simulate('click')
      })

      it('should fire onItemDoubleClick  when the row is double-clicked', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            onItemDoubleClick={(_ev, item) => {
              expect(item.Id).toBe(1)
              component.unmount()
              done()
            }}
          />,
        )
        const row = component
          .findWhere(
            (instance) =>
              instance.type() === TableRow &&
              instance.props().className &&
              instance.props().className.indexOf('type-folder') !== -1,
          )
          .first()
        row.simulate('doubleclick')
      })
      it('should fire onItemTap when the row is tapped', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            onItemTap={(_ev, item) => {
              expect(item.Id).toBe(1)
              component.unmount()
              done()
            }}
          />,
        )
        const row = component
          .findWhere(
            (instance) =>
              instance.type() === TableRow &&
              instance.props().className &&
              instance.props().className.indexOf('type-folder') !== -1,
          )
          .first()
        row.simulate('touchend')
      })
      it('should fire onItemContextMenu  when the context menu is triggered', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName', 'Type']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            onItemContextMenu={(_ev, item) => {
              expect(item.Id).toBe(1)
              component.unmount()
              done()
            }}
          />,
        )
        const row = component
          .findWhere(
            (instance) =>
              instance.type() === TableRow &&
              instance.props().className &&
              instance.props().className.indexOf('type-folder') !== -1,
          )
          .first()
        row.simulate('contextmenu')
      })
      it('should request order change when the header is clicked', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
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
          />,
        )
        const row = component.find(TableSortLabel).first()
        row.simulate('click')
      })
      it('should request order change and invert the direction', (done: jest.DoneCallback) => {
        const component = mount(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
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
          />,
        )
        const row = component.find(TableSortLabel).first()
        row.simulate('click')
      })
      it('should render without crashing with setting displayRowCheckbox to false', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={false}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without selected', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without selected undefined', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            selected={undefined}
            fieldsToDisplay={['DisplayName']}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render with custom selection control', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            selected={undefined}
            fieldsToDisplay={['DisplayName']}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            getSelectionControl={() => <div />}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render with custom selection control and selection', () => {
        const content = { Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }
        const component = shallow(
          <ContentList
            items={[content]}
            schema={genericSchema}
            selected={[content]}
            fieldsToDisplay={['DisplayName']}
            orderBy="DisplayName"
            orderDirection="asc"
            icons={{}}
            getSelectionControl={() => <div />}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without orderBy', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderDirection="asc"
            icons={{}}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without orderDirection', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderBy="DisplayName"
            icons={{}}
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
      it('should render without crashing without icons', () => {
        const component = shallow(
          <ContentList
            items={[{ Id: 1, Name: '1', Path: '1', DisplayName: 'A', Type: 'Folder' }]}
            schema={genericSchema}
            fieldsToDisplay={['DisplayName']}
            selected={[]}
            orderBy="DisplayName"
            orderDirection="asc"
            displayRowCheckbox={true}
          />,
        )
        expect(component).toMatchSnapshot()
        component.unmount()
      })
    })
  })
})
