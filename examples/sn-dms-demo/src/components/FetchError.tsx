import * as React from 'react';
import Button from 'material-ui/Button';

export interface FetchErrorProps {
    message: string,
    onRetry: any
}

export class FetchError extends React.Component<FetchErrorProps, {}> {
    render() {
        return (
            <div>
                <p>Could not fetch content. {this.props.message}</p>
                <Button  onClick={this.props.onRetry}>Retry</Button>
            </div>
        );
    }
}
