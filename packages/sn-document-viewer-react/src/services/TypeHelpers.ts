import { MapStateToProps } from 'react-redux'
import { RootReducerType } from '../store'

/**
 * Helper type to combine the mapStateToProps and mapDispatchToProps methods and the ownProps types
 * Usage example in a React component definition:
 *
 * ```ts
 * class DocumentViewerLoadingComponent extends React.Component<componentType<typeof mapStateToProps, typeof mapDispatchToProps, undefined>>{
 *  // class definition
 * }
 * ```
 */
export type componentType<
    TStateToProps extends MapStateToProps<TState, TOwnProps, State>,
    TDispatchToProps,
    TOwnProps = undefined,
    TState = ReturnType<TStateToProps>,
    State = RootReducerType,
    > = (
        ReturnType<TStateToProps> &
        TDispatchToProps &
        TOwnProps
    )
