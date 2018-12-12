export declare const createList: (filter: any) => import("redux").Reducer<{
    ids: any;
    isFetching: boolean;
    errorMessage: any;
}, import("redux").AnyAction>;
export declare const listByFilter: import("redux").Reducer<{
    All: {
        ids: any;
        isFetching: any;
        errorMessage: any;
    };
    Active: {
        ids: any;
        isFetching: any;
        errorMessage: any;
    };
    Completed: {
        ids: any;
        isFetching: any;
        errorMessage: any;
    };
    VisibilityFilter: any;
}, import("redux").AnyAction>;
export declare const getVisibleTodos: (state: any, filter: any) => any;
export declare const getIsFetching: (state: any, filter: any) => any;
export declare const getErrorMessage: (state: any, filter: any) => any;
export declare const getVisibilityFilter: (state: any) => any;
export declare const setVisibilityFilter: (filter: any) => {
    type: string;
    filter: any;
};
//# sourceMappingURL=filtering.d.ts.map