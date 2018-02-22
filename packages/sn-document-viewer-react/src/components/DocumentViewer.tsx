import * as React from 'react'

/**
 * Properties for main
 */
export interface MainProps { compiler: string; framework: string }

/**
 * Main document viewer component
 */
export class DocumentViewer extends React.Component<MainProps, {}> {
    /**
     * renders the component
     */
    public render() {
        return <div>
                    Placeholder
                </div>
    }
}
