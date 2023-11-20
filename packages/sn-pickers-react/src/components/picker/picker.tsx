import { Box, Button, createStyles, IconButton, makeStyles, TextField, Theme } from '@material-ui/core'
import { AccountTree } from '@material-ui/icons'
import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SelectionContext, SelectionProvider } from '../../context/selection'
import { SaveButton } from '../save-button'
import { SearchPicker } from '../search-picker'
import { SelectionList } from '../selection-list'
import { ShowSelectedButton } from '../show-selected-button'
import { TreePicker } from '../tree-picker'
import { CopyMoveTreePicker } from '../tree-picker/copy-move-tree-picker'
import { PickerHelper } from './picker-helper'
import { PickerProps } from './picker-props'

export enum PickerModes {
  TREE,
  COPY_MOVE_TREE,
  SEARCH,
  SELECTION,
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    treeIcon: {
      color: theme.palette.type === 'dark' ? 'rgba(255,255,255,0.5)' : undefined,
    },
    treeActiveIcon: {
      color: theme.palette.type === 'light' ? theme.palette.common.black : theme.palette.common.white,
    },

    showSelected: {
      textAlign: 'right',
      marginLeft: 'auto',
      marginTop: '5px',
    },
    jumpCurrentPath: {
      cursor: 'pointer',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      paddingRight: '24px',
      flexWrap: 'wrap',
      marginBottom: '10px',
      '& .MuiFormControl-root': {
        width: 'calc(100% - 48px)',
      },
    },
    cancelButton: {},
    currentLocationIcon: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: 'blue',
    },
  })
})

export type PickerClassKey = Partial<ReturnType<typeof useStyles>>

export const Picker: React.FunctionComponent<PickerProps<GenericContent>> = (props) => {
  const treePickerMode = props.treePickerMode ?? PickerModes.TREE
  // const contextPath = props.contextPath!

  const [navigationPath, setNavigationPath] = useState(props.currentPath)
  const [term, setTerm] = useState<string>()
  const [result, setResult] = useState<GenericContent[]>([])
  const [searchError, setSearchError] = useState<string>()
  const [mode, setMode] = useState<PickerModes>(treePickerMode)
  const classes = useStyles(props)
  const searchFieldRef = useRef<HTMLInputElement | null>(null)

  const PickerContainer = props.pickerContainer || 'div'
  const ActionsContainer = props.actionsContainer || 'div'

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedQuery = useCallback(
    debounce((a: string) => setTerm(a), 250),
    [],
  )

  useEffect(() => {
    const ac = new AbortController()
    const fetchResult = async () => {
      if (!term) {
        setResult([])
        return
      }

      try {
        const getQueryFromTerm = () => {
          const query = new Query((q) =>
            q.query((q2) => q2.equals('Name', `*${term}*`).or.equals('DisplayName', `*${term}*`).autofilters('OFF')),
          )

          if (props.selectionRoots) {
            new QueryOperators(query).and.query((q2) => {
              props.selectionRoots?.forEach((root, index, array) => {
                new QueryExpression(q2.queryRef).inTree(root)
                if (index < array.length - 1) {
                  return new QueryOperators(q2.queryRef).or
                }
              })
              return q2
            })
          }
          return query
        }

        setSearchError('')

        const response = await props.repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            query: getQueryFromTerm().toString(),
          },
          requestInit: { signal: ac.signal },
        })
        setResult(response.d.results)
      } catch (e) {
        if (!ac.signal.aborted) {
          setSearchError(e.message)
          setResult([])
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [term, props.repository, props.selectionRoots])

  const handleJumpToCurrentPath = (path: string) => {
    setNavigationPath(path)

    if (term?.length && term.length > 0) {
      debouncedQuery('')
    }

    if (mode !== PickerModes.TREE) {
      setMode(PickerModes.TREE)
    }
  }

  return (
    <SelectionProvider
      allowMultiple={props.allowMultiple}
      selectionChangeCallback={props.onSelectionChanged}
      defaultValue={props.defaultValue}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '85%',
          justifyContent: 'space-between',
        }}>
        <Box className={classes.toolbar}>
          <IconButton
            title={props.localization?.treeViewButton ?? 'Tree view'}
            onClick={() => setMode(treePickerMode)}
            className={`${classes.treeIcon} ${mode === treePickerMode ? classes.treeActiveIcon : ''}`}>
            <AccountTree />
          </IconButton>
          <TextField
            ref={searchFieldRef}
            fullWidth={true}
            placeholder={props.localization?.searchPlaceholder ?? 'Search'}
            onFocus={() => setMode(PickerModes.SEARCH)}
            onChange={(ev) => {
              debouncedQuery(ev.target.value)
            }}
          />
          <ShowSelectedButton
            className={classes.showSelected}
            handleClick={() => setMode(PickerModes.SELECTION)}
            localization={{ label: props.localization?.showSelected ?? 'Show selected' }}
          />
        </Box>

        <div className="selection-container" style={{ width: '100%', display: 'flex' }}>
          <PickerHelper
            handleJumpToCurrentPath={handleJumpToCurrentPath}
            contextPath={props.contextPath}
            styles={classes.jumpCurrentPath}
            repository={props.repository}
            selectionRoots={props.selectionRoots}
            currentContentText={props.localization?.currentContentText}
          />

          <PickerContainer style={{ height: '545px', paddingTop: 0, position: 'relative', top: '-7px', width: '100%' }}>
            {mode === PickerModes.TREE && (
              <TreePicker setNavigationPath={setNavigationPath} navigationPath={navigationPath} {...props} />
            )}
            {mode === PickerModes.COPY_MOVE_TREE && <CopyMoveTreePicker {...props} />}
            {mode === PickerModes.SEARCH && <SearchPicker {...props} items={result} error={searchError} />}
            {mode === PickerModes.SELECTION && <SelectionList {...props} />}
          </PickerContainer>
        </div>
      </div>
      <SelectionContext.Consumer>
        {({ selection }) =>
          props.renderActions ? (
            props.renderActions(selection)
          ) : (
            <ActionsContainer style={{ marginLeft: 'auto', width: '100%' }}>
              <Button
                aria-label={props.localization?.cancelButton ?? 'Cancel'}
                className={classes.cancelButton}
                disabled={!!props.isExecInProgress}
                onClick={() => props.handleCancel?.()}>
                {props.localization?.cancelButton ?? 'Cancel'}
              </Button>
              <SaveButton
                data-test="picker-submit"
                disabled={(props.required && selection.length < props.required) || !!props.isExecInProgress}
                localization={{ label: props.localization?.submitButton ?? 'Submit' }}
                onClick={() => props.handleSubmit?.(selection)}
              />
            </ActionsContainer>
          )
        }
      </SelectionContext.Consumer>
    </SelectionProvider>
  )
}
