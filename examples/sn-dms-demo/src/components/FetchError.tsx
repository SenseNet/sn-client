import Button from 'material-ui/Button'
import * as React from 'react'

export interface FetchErrorProps {
    message: string,
    onRetry: any
}

export class FetchError extends React.Component<FetchErrorProps, {}> {
    public render() {
        return (
            <div>
                <p>Could not fetch content. {this.props.message}</p>
                <Button  onClick={this.props.onRetry}>Retry</Button>
            </div>
        )
    }
}
