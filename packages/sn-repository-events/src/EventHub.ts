import { IContent, Repository } from "@sensenet/client-core";
import { ICopyOptions, IDeleteOptions, IPatchOptions, IPostOptions, IPutOptions } from "@sensenet/client-core/dist/Models/IRequestOptions";
import { ObservableValue, Trace } from "@sensenet/client-utils";
import { IDisposable } from "@sensenet/client-utils/dist/Disposable";
import { ValueObserver } from "@sensenet/client-utils/dist/ValueObserver";
import { IContentMoved, IContentMoveFailed, ICreated, ICreateFailed, ICustomActionExecuted, ICustomActionFailed, IDeleted, IDeleteFailed, ILoaded, IModificationFailed, IModified } from "./EventModels";

/**
 * Event hub for sensenet Repository Events
 */
export class EventHub implements IDisposable {
    /**
     * Disposes the event hub and all of its ObservableValues
     */
    public dispose() {
        for (const key in this) {
            // tslint:disable:no-string-literal
            if (this.hasOwnProperty(key) && typeof this[key]["dispose"] === "function") {
                this[key]["dispose"]();
            }
            // tslint:enable:no-string-literal
        }
    }
    private readonly onContentCreatedObservableValue = new ObservableValue<ICreated>();
    private readonly onContentCreateFailedObservableValue = new ObservableValue<ICreateFailed>();
    private readonly onContentModifiedObservableValue = new ObservableValue<IModified>();
    private readonly onContentModificationFailedObservableValue = new ObservableValue<IModificationFailed>();
    private readonly onContentLoadedObservableValue = new ObservableValue<ILoaded>();
    private readonly onContentDeletedObservableValue = new ObservableValue<IDeleted>();
    private readonly onContentDeleteFailedObservableValue = new ObservableValue<IDeleteFailed>();
    private readonly onCustomActionExecutedObservableValue = new ObservableValue<ICustomActionExecuted<IContent>>();
    private readonly onCustomActionFailedObservableValue = new ObservableValue<ICustomActionFailed<IContent>>();
    private readonly onContentMovedObservableValue = new ObservableValue<IContentMoved>();
    private readonly onContentMoveFailedObservableValue = new ObservableValue<IContentMoveFailed>();

    // ToDo
    // private readonly onUploadProgressObservableValue = new ObservableValue<UploadProgressInfo<IContent>>();

    /**
     * Method group for triggering Repository events
     */
    private trigger = {
        ContentCreated: (ev: ICreated) => this.onContentCreatedObservableValue.setValue(ev),
        ContentCreateFailed: (ev: ICreateFailed) => this.onContentCreateFailedObservableValue.setValue(ev),

        ContentModified: (ev: IModified) => this.onContentModifiedObservableValue.setValue(ev),
        ContentModificationFailed: (ev: IModificationFailed) => this.onContentModificationFailedObservableValue.setValue(ev),

        ContentLoaded: (ev: ILoaded) => this.onContentLoadedObservableValue.setValue(ev),

        ContentDeleted: (ev: IDeleted) => this.onContentDeletedObservableValue.setValue(ev),
        ContentDeleteFailed: (ev: IDeleteFailed) => this.onContentDeleteFailedObservableValue.setValue(ev),

        CustomActionExecuted: (ev: ICustomActionExecuted<any>) => this.onCustomActionExecutedObservableValue.setValue(ev),
        CustomActionFailed: (ev: ICustomActionFailed<any>) => this.onCustomActionFailedObservableValue.setValue(ev),

        ContentMoved: (ev: IContentMoved) => this.onContentMovedObservableValue.setValue(ev),
        ContentMoveFailed: (ev: IContentMoveFailed) => this.onContentMoveFailedObservableValue.setValue(ev),

        // ToDo
        // UploadProgress: (ev: UploadProgressInfo<any>) => this.onUploadProgressObservableValue.setValue(ev),
    };

    /**
     * Triggered after a succesful Content creation
     */
    public onContentCreated: (...args: any[]) => ValueObserver<ICreated> = this.onContentCreatedObservableValue.subscribe;

    /**
     * Triggered after Content creation has been failed
     */
    public onContentCreateFailed = this.onContentCreateFailedObservableValue.subscribe;

    /**
     * Triggered after modifying a Content
     */
    public onContentModified = this.onContentModifiedObservableValue.subscribe;

    /**
     * Triggered when failed to modify a Content
     */
    public onContentModificationFailed = this.onContentModificationFailedObservableValue.subscribe;

    /**
     * Triggered when a Content is loaded from the Repository
     */
    public onContentLoaded = this.onContentLoadedObservableValue.subscribe;

    /**
     * Triggered after deleting a Content
     */
    public onContentDeleted = this.onContentDeletedObservableValue.subscribe;

    /**
     * Triggered after deleting a content has been failed
     */
    public onContentDeleteFailed = this.onContentDeleteFailedObservableValue.subscribe;

    /**
     * Triggered after moving a content to another location
     */
    public onContentMoved = this.onContentMovedObservableValue.subscribe;

    /**
     * Triggered after moving a content has been failed
     */
    public onContentMoveFailed = this.onContentMoveFailedObservableValue.subscribe;

    /**
     * Triggered after a custom OData Action has been executed
     */
    public onCustomActionExecuted = this.onCustomActionExecutedObservableValue.subscribe;

    /**
     * Triggered after a custom OData Action has been failed
     */
    public onCustomActionFailed = this.onCustomActionFailedObservableValue.subscribe;

    /**
     * Triggered on Upload progress
     */
    //  ToDo
    // public onUploadProgress = this.onUploadProgressObservableValue.subscribe;

    constructor(private readonly repository: Repository) {
        this.initializeMappings();
    }

    private traceObservers: IDisposable[] = [];
    private initializeMappings() {
        this.traceObservers.push(
            Trace.method({
                object: this.repository,
                method: this.repository.post,
                // Post finished to Content Create
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    const content = response.d;
                    this.trigger.ContentCreated({
                        content: content as IContent,
                    });
                },
                // Post errored to content create failed
                onError: (err) => {
                    this.trigger.ContentCreateFailed({
                        content: (err.arguments[0] as IPostOptions<IContent>).content as IContent,
                        error: err.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.patch,
                // Patch finished to ContentModified
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    this.trigger.ContentModified({
                        changes: (finished.arguments[0] as IPatchOptions<IContent>).content as IContent,
                        content: response.d as IContent,
                    });
                },
                // Patch error to ContentModificationFailed
                onError: (error) => {
                    this.trigger.ContentModificationFailed({
                        content: (error.arguments[0] as IPatchOptions<IContent>).content as IContent,
                        error: error.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.put,
                // Put finished to ContentModified
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    this.trigger.ContentModified({
                        changes: (finished.arguments[0] as IPutOptions<IContent>).content as IContent,
                        content: response.d as IContent,
                    });
                },
                // Patch error to ContentModificationFailed
                onError: (error) => {
                    this.trigger.ContentModificationFailed({
                        content: (error.arguments[0] as IPutOptions<IContent>).content as IContent,
                        error: error.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.delete,
                // handle DeleteBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const deleted of response.d.results) {
                            this.trigger.ContentDeleted({
                                permanently: (finished.arguments[0] as IDeleteOptions).permanent || false,
                                contentData: deleted as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.trigger.ContentDeleteFailed({
                                permanently: (finished.arguments[0] as IDeleteOptions).permanent || false,
                                content: failed.content as IContent,
                                error: failed.error,
                            });
                        }
                    }
                },
                // Handle DeleteBatch errors
                onError: (error) => {
                    let contentArgs: Array<string | number> = (error.arguments[0] as IDeleteOptions).idOrPath as any;
                    if (!(contentArgs instanceof Array)) {
                        contentArgs = [contentArgs];
                    }
                    const contents = contentArgs.map((v) => {
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)};
                    });
                    for (const c of contents) {
                        this.trigger.ContentDeleteFailed({
                            content: c as IContent,
                            permanently: (error.arguments[0] as IDeleteOptions).permanent || false,
                            error: error.error,
                        });
                    }
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.copy,
                // handle CopyBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const copied of response.d.results) {
                            this.trigger.ContentCreated({
                                content: copied as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.trigger.ContentCreateFailed({
                                content: failed.content as IContent,
                                error: failed.error,
                            });
                        }
                    }
                },
                // Handle CopyBatch errors
                onError: (error) => {
                    let contentArgs: Array<string | number> = (error.arguments[0] as ICopyOptions).idOrPath as any;
                    if (!(contentArgs instanceof Array)) {
                        contentArgs = [contentArgs];
                    }
                    const contents = contentArgs.map((v) => {
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)};
                    });
                    for (const c of contents) {
                        this.trigger.ContentCreateFailed({
                            content: c as IContent,
                            error: error.error,
                        });
                    }
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.move,
                // handle CopyBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const copied of response.d.results) {
                            this.trigger.ContentMoved({
                                content: copied as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.trigger.ContentCreateFailed({
                                content: failed.content as IContent,
                                error: failed.error,
                            });
                        }
                    }
                },
                // Handle CopyBatch errors
                onError: (error) => {
                    let contentArgs: Array<string | number> = (error.arguments[0] as IDeleteOptions).idOrPath as any;
                    if (!(contentArgs instanceof Array)) {
                        contentArgs = [contentArgs];
                    }
                    const contents = contentArgs.map((v) => {
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)};
                    });
                    for (const c of contents) {
                        this.trigger.ContentCreateFailed({
                            content: c as IContent,
                            error: error.error,
                        });
                    }
                },
            }),
        );
    }

}
