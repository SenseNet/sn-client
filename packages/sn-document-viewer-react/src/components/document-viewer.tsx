import { deepMerge } from '@sensenet/client-utils'
import { SlideProps } from '@material-ui/core/Slide'
import { Theme } from '@material-ui/core/styles'
import React, { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import loaderImage from '../../assets/loader.gif'
import {
  CommentsContextProvider,
  CommentStateProvider,
  defaultLocalization,
  DocumentDataContext,
  DocumentDataProvider,
  DocumentPermissionsContextProvider,
  DocumentViewerApiSettingsProvider,
  LocalizationContext,
  LocalizationType,
  PreviewImageDataContextProvider,
  ViewerSettingsContext,
  ViewerStateProvider,
} from '../context'
import { PreviewState } from '../enums'
import { defaultTheme, DocumentViewerApiSettings, ViewerState } from '../models'
import { DocumentViewerError } from './document-viewer-error'
import { DocumentViewerLayout } from './document-viewer-layout'
import { DocumentViewerLoading } from './document-viewer-loading'
import { DocumentViewerRegeneratePreviews } from './document-viewer-regenerate-previews'

export const POLLING_INTERVAL = 5000

/**
 * Defined the component's own properties
 */
export interface DocumentViewerProps {
  /**
   * The document's Id or Path to preview
   */
  documentIdOrPath: string | number
  /**
   * An optional document version value
   */
  version?: string

  /**
   * Props for the Slider
   */
  drawerSlideProps?: Partial<SlideProps>

  /**
   * An overrideable Loader image
   */
  loaderImage?: string

  /**
   * The Material theme
   */
  theme?: Theme

  /**
   * Optional API method overrides if you have to use custom API
   */
  api?: Partial<DocumentViewerApiSettings>

  /**
   * Overrideable localized string resources
   */
  localization?: Partial<LocalizationType>

  /**
   * The default state of the Document Viewer
   */
  defaultState?: ViewerState

  /**
   * Toolbar to be rendered
   */
  renderAppBar: () => JSX.Element | ReactNode
}

export const DocumentViewer: React.FC<DocumentViewerProps> = (props) => {
  return (
    <DocumentViewerApiSettingsProvider options={props.api}>
      <LocalizationContext.Provider value={deepMerge(defaultLocalization, props.localization)}>
        <ViewerSettingsContext.Provider value={props}>
          <ThemeProvider theme={props.theme || defaultTheme}>
            <DocumentDataProvider>
              <DocumentPermissionsContextProvider>
                <PreviewImageDataContextProvider>
                  <DocumentDataContext.Consumer>
                    {({ documentData }) => {
                      if (documentData.pageCount === PreviewState.Loading)
                        return <DocumentViewerLoading image={props.loaderImage || loaderImage} />
                      if (documentData.pageCount === PreviewState.Postponed) {
                        return <DocumentViewerRegeneratePreviews />
                      } else if (documentData.pageCount < 0 || documentData.error) {
                        return <DocumentViewerError />
                      }
                      return (
                        <ViewerStateProvider options={props.defaultState}>
                          <CommentStateProvider>
                            <CommentsContextProvider>
                              <DocumentViewerLayout />
                            </CommentsContextProvider>
                          </CommentStateProvider>
                        </ViewerStateProvider>
                      )
                    }}
                  </DocumentDataContext.Consumer>
                </PreviewImageDataContextProvider>
              </DocumentPermissionsContextProvider>
            </DocumentDataProvider>
          </ThemeProvider>
        </ViewerSettingsContext.Provider>
      </LocalizationContext.Provider>
    </DocumentViewerApiSettingsProvider>
  )
}
