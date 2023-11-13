import { Box, Button, createStyles, IconButton, Link, makeStyles, TextField, Theme } from '@material-ui/core'
import { AccountTree } from '@material-ui/icons'
import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { SelectionContext, SelectionProvider } from '../../context/selection'
import { SaveButton } from '../save-button'
import { SearchPicker } from '../search-picker'
import { SelectionList } from '../selection-list'
import { ShowSelectedButton } from '../show-selected-button'
import { TreePicker } from '../tree-picker'
import { CopyMoveTreePicker } from '../tree-picker/copy-move-tree-picker'
import { PickerProps, TReferemceSelectionHelperPath } from './picker-props'

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

type ReferenceFieldHelperProps = {
  contextPath?: string
  handleJumpToCurrentPath: (path: string) => void
  styles?: string
  getPath?: () => Promise<TReferemceSelectionHelperPath[]>
  currentContentText?: string
}

const ReferenceFieldHelper = ({
  handleJumpToCurrentPath,
  contextPath,
  styles,
  getPath,
  currentContentText,
}: ReferenceFieldHelperProps) => {
  const memorizedGetPath = useMemo(() => getPath, [getPath])

  const [helperPaths, setHelperPaths] = useState<TReferemceSelectionHelperPath[]>([])

  useEffect(() => {
    const fetchResult = async () => {
      if (!memorizedGetPath) {
        return
      }

      const response = await memorizedGetPath()

      setHelperPaths(response)
    }

    fetchResult()
  }, [memorizedGetPath])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        rowGap: '10px',
        paddingTop: '15px',
        width: '240px',
        paddingInline: '10px',
      }}>
      <Link
        data-test="current-content"
        variant="body2"
        onClick={() => handleJumpToCurrentPath(contextPath || '')}
        className={styles}>
        {currentContentText || 'Current Content'}
      </Link>

      {helperPaths.length > 0 && (
        <div data-test="path-helpers">
          {helperPaths.map((path) => {
            return (
              <Link
                key={path.Path}
                variant="body2"
                onClick={() => handleJumpToCurrentPath(path.Path)}
                className={styles}>
                {path.DisplayName || path.Name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

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
          <Suspense fallback={<div>Loading...</div>}>
            <ReferenceFieldHelper
              handleJumpToCurrentPath={handleJumpToCurrentPath}
              contextPath={props.contextPath}
              styles={classes.jumpCurrentPath}
              getPath={props.getReferencePickerHelperData}
              currentContentText={props.localization?.currentContentText}
            />
          </Suspense>

          <PickerContainer style={{ height: '545px', paddingTop: 0, position: 'relative', top: '-7px' }}>
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
