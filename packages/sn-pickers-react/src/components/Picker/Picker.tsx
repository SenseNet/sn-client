import { ConstantContent } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import AccountTree from '@material-ui/icons/AccountTree'
import React, { useCallback, useEffect, useState } from 'react'
import { SelectionContext, SelectionProvider } from '../../context/selection'
import { ListPicker } from '../ListPicker'
import { SaveButton } from '../SaveButton'
import { SearchPicker } from '../SearchPicker'
import { SelectionList } from '../SelectionList'
import { ShowSelectedButton } from '../ShowSelectedButton'
import { PickerProps } from './PickerProps'

enum PickerModes {
  TREE,
  SEARCH,
  SELECTION,
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    treeActive: {
      color: theme.palette.common.black,
    },
    showSelected: {
      marginTop: '0.5rem',
      textAlign: 'right',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
    },
  })
})

export const Picker: React.FunctionComponent<PickerProps<GenericContent>> = (props) => {
  const [term, setTerm] = useState<string>()
  const [result, setResult] = useState<GenericContent[]>([])
  const [, setError] = useState<string>()
  const [mode, setMode] = useState(PickerModes.TREE)
  const classes = useStyles()

  const PickerContainer = props.pickerContainer || 'div'
  const ActionsContainer = props.actionsContainer || 'div'

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
            q.query((q2) => q2.equals('Name', `*${term}*`).or.equals('DisplayName', `*${term}*`)),
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

        const response = await props.repository.loadCollection({
          path: ConstantContent.PORTAL_ROOT.Path,
          oDataOptions: {
            query: getQueryFromTerm().toString(),
          },
          requestInit: { signal: ac.signal },
        })
        setError('')
        setResult(response.d.results)
      } catch (e) {
        if (!ac.signal.aborted) {
          setError(e.message)
          setResult([])
        }
      }
    }

    fetchResult()
    return () => ac.abort()
  }, [term, props.repository, props.selectionRoots])

  return (
    <SelectionProvider
      allowMultiple={props.allowMultiple}
      selectionChangeCallback={props.onSelectionChanged}
      defaultValue={props.defaultValue}>
      <PickerContainer>
        <Box className={classes.toolbar}>
          <IconButton
            title={props.localization?.treeViewButton ?? 'Tree view'}
            onClick={() => setMode(PickerModes.TREE)}
            className={mode === PickerModes.TREE ? classes.treeActive : ''}>
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
        </Box>
        <ShowSelectedButton
          className={classes.showSelected}
          handleClick={() => setMode(PickerModes.SELECTION)}
          localization={{ label: props.localization?.showSelected ?? 'Show selected' }}
        />
        {mode === PickerModes.SELECTION && <SelectionList {...props} />}
        {mode === PickerModes.SEARCH && <SearchPicker {...props} items={result} />}
        {mode === PickerModes.TREE && <ListPicker {...props} />}
      </PickerContainer>
      <SelectionContext.Consumer>
        {({ selection }) =>
          props.renderActions ? (
            props.renderActions(selection)
          ) : (
            <ActionsContainer>
              <Button
                aria-label={props.localization?.cancelButton ?? 'Cancel'}
                // className={props.classes.cancelButton}
                disabled={!!props.isExecInProgress}
                onClick={() => props.handleCancel?.()}>
                {props.localization?.cancelButton ?? 'Cancel'}
              </Button>
              <SaveButton
                disabled={!!props.isExecInProgress}
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
