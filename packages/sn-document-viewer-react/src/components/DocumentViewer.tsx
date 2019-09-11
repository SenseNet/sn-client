import { SlideProps } from '@material-ui/core/Slide'
import { Theme } from '@material-ui/core/styles'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import loaderImage from '../../assets/loader.gif'
import { defaultTheme, DocumentViewerApiSettings } from '../models'
import { PreviewState } from '../Enums'
import { DocumentViewerApiSettingsProvider } from '../context/api-settings'
import { ViewerSettingsContext } from '../context/viewer-settings'
import { DocumentDataContext, DocumentDataProvider } from '../context/document-data'
import { defaultLocalization, LocalizationContext, LocalizationType } from '../context/localization-context'
import { DocumentPermissionsContextProvider } from '../context/document-permissions'
import { ViewerState } from '../models/viewer-state'
import { ViewerStateProvider } from '../context/viewer-state'
import { PreviewImageDataContextProvider } from '../context/preview-image-data'
import { DocumentViewerError } from './DocumentViewerError'
import { DocumentViewerLayout } from './DocumentViewerLayout'
import { DocumentViewerLoading } from './DocumentViewerLoading'
import { DocumentViewerRegeneratePreviews } from './DocumentViewerRegeneratePreviews'

/**
 * Defined the component's own properties
 */
export interface DocumentViewerProps {
  /**
   * The Sensenet Host's URL (e.g.: https://my-sensenet-instance.net)
   */
  hostName: string
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
  api?: DocumentViewerApiSettings

  /**
   * Overrideable localized string resources
   */
  localization?: LocalizationType

  /**
   * The default state of the Document Viewer
   */
  defaultState?: ViewerState
}

export const DocumentViewer: React.FC<DocumentViewerProps> = props => {
  return (
    <DocumentViewerApiSettingsProvider options={props.api}>
      <LocalizationContext.Provider
        value={{
          ...defaultLocalization,
          ...props.localization,
        }}>
        <ViewerSettingsContext.Provider value={props}>
          <ThemeProvider theme={props.theme || defaultTheme}>
            <DocumentDataProvider>
              <DocumentPermissionsContextProvider>
                <PreviewImageDataContextProvider>
                  <DocumentDataContext.Consumer>
                    {docData => {
                      if (docData.pageCount === PreviewState.Loading)
                        return <DocumentViewerLoading image={props.loaderImage || loaderImage} />
                      if (docData.pageCount === PreviewState.Postponed) {
                        return <DocumentViewerRegeneratePreviews />
                      } else if (docData.pageCount < 0 || docData.error) {
                        return <DocumentViewerError />
                      }
                      return (
                        <ViewerStateProvider options={props.defaultState}>
                          <DocumentViewerLayout drawerSlideProps={props.drawerSlideProps}>
                            {props.children}
                          </DocumentViewerLayout>
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
