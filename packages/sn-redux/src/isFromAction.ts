/**
 * Type guard that checks if the action is instantiated from the expected type
 * @param action The action instance to be checked
 * @param expectedAction The action with type property, created by the *createAction()* helper method
 */
export const isFromAction = <TAction extends ((...args: any[]) => any) & { actionType: string }>(
  action: { type: string },
  expectedAction: TAction,
): action is ReturnType<TAction> => action.type === expectedAction.actionType
