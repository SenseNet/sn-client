import { SlideProps } from '@material-ui/core/Slide'
import { Theme } from '@material-ui/core/styles'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { deepMerge } from '@sensenet/client-utils'
import loaderImage from '../../assets/loader.gif'
import { DocumentViewerError, DocumentViewerLayout, DocumentViewerLoading, DocumentViewerRegeneratePreviews } from '.'
import {
  CommentStateProvider,
  defaultLocalization,
  defaultTheme,
  DocumentDataContext,
  DocumentDataProvider,
  DocumentPermissionsContextProvider,
  DocumentViewerApiSettings,
  DocumentViewerApiSettingsProvider,
  LocalizationContext,
  LocalizationType,
  PreviewImageDataContextProvider,
  PreviewState,
  ViewerSettingsContext,
  ViewerState,
  ViewerStateProvider,
} from '..'

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
   * Optional API method overrides if you has to use custom API
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
}

export const DocumentViewer: React.FC<DocumentViewerProps> = props => {
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
                            <DocumentViewerLayout drawerSlideProps={props.drawerSlideProps}>
                              {props.children}
                            </DocumentViewerLayout>
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
