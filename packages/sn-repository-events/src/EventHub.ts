import { IContent, Repository } from "@sensenet/client-core";
import { ICopyOptions, IDeleteOptions, IPatchOptions, IPostOptions, IPutOptions } from "@sensenet/client-core/dist/Models/IRequestOptions";
import { ObservableValue, Trace } from "@sensenet/client-utils";
import { IDisposable } from "@sensenet/client-utils/dist/Disposable";
import { ValueObserver } from "@sensenet/client-utils/dist/ValueObserver";
import { IContentMoved, IContentMoveFailed, ICreated, ICreateFailed, ICustomActionExecuted, ICustomActionFailed, IDeleted, IDeleteFailed, ILoaded, IModificationFailed, IModified } from "./IEventModels";

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
    /**
     * Triggered after a succesful Content creation
     */
    public readonly onContentCreated = new ObservableValue<ICreated>();

    /**
     * Triggered after Content creation has been failed
     */
    public readonly onContentCreateFailed = new ObservableValue<ICreateFailed>();
    /**
     * Triggered after modifying a Content
     */

    public readonly onContentModified = new ObservableValue<IModified>();
    /**
     * Triggered when failed to modify a Content
     */
    public readonly onContentModificationFailed = new ObservableValue<IModificationFailed>();

    /**
     * Triggered when a Content is loaded from the Repository
     */
    public readonly onContentLoaded = new ObservableValue<ILoaded>();

    /**
     * Triggered after deleting a Content
     */
    public readonly onContentDeleted = new ObservableValue<IDeleted>();

    /**
     * Triggered after deleting a content has been failed
     */
    public readonly onContentDeleteFailed = new ObservableValue<IDeleteFailed>();

    /**
     * Triggered after a custom OData Action has been executed
     */
    public readonly onCustomActionExecuted = new ObservableValue<ICustomActionExecuted<IContent>>();
    /**
     * Triggered after a custom OData Action has been failed
     */
    public readonly onCustomActionFailed = new ObservableValue<ICustomActionFailed<IContent>>();

    /**
     * Triggered after moving a content to another location
     */
    public readonly onContentMoved = new ObservableValue<IContentMoved>();

    /**
     * Triggered after moving a content has been failed
     */
    public readonly onContentMoveFailed = new ObservableValue<IContentMoveFailed>();

    // ToDo
    // private readonly onUploadProgressObservableValue = new ObservableValue<UploadProgressInfo<IContent>>();

    constructor(private readonly repository: Repository) {
        this.initializeMappings();
    }

    private traceObservers: IDisposable[] = [];
    private initializeMappings() {
        this.traceObservers.push(
            Trace.method({
                object: this.repository,
                method: this.repository.post,
                isAsync: true,
                // Post finished to Content Create
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    const content = response.d;
                    this.onContentCreated.setValue({
                        content: content as IContent,
                    });
                },
                // Post errored to content create failed
                onError: (err) => {
                    this.onContentCreateFailed.setValue({
                        content: (err.arguments[0] as IPostOptions<IContent>).content as IContent,
                        error: err.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.patch,
                isAsync: true,
                // Patch finished to ContentModified
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    this.onContentModified.setValue({
                        changes: (finished.arguments[0] as IPatchOptions<IContent>).content as IContent,
                        content: response.d as IContent,
                    });
                },
                // Patch error to ContentModificationFailed
                onError: (error) => {
                    this.onContentModificationFailed.setValue({
                        content: (error.arguments[0] as IPatchOptions<IContent>).content as IContent,
                        error: error.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.put,
                isAsync: true,
                // Put finished to ContentModified
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    this.onContentModified.setValue({
                        changes: (finished.arguments[0] as IPutOptions<IContent>).content as IContent,
                        content: response.d as IContent,
                    });
                },
                // Patch error to ContentModificationFailed
                onError: (error) => {
                    this.onContentModificationFailed.setValue({
                        content: (error.arguments[0] as IPutOptions<IContent>).content as IContent,
                        error: error.error,
                    });
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.delete,
                isAsync: true,
                // handle DeleteBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const deleted of response.d.results) {
                            this.onContentDeleted.setValue({
                                permanently: (finished.arguments[0] as IDeleteOptions).permanent || false,
                                contentData: deleted as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.onContentDeleteFailed.setValue({
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
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)} as IContent;
                    });
                    for (const c of contents) {
                        this.onContentDeleteFailed.setValue({
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
                isAsync: true,
                // handle CopyBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const copied of response.d.results) {
                            this.onContentCreated.setValue({
                                content: copied as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.onContentCreateFailed.setValue({
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
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)} as IContent;
                    });
                    for (const c of contents) {
                        this.onContentCreateFailed.setValue({
                            content: c as IContent,
                            error: error.error,
                        });
                    }
                },
            }),
            Trace.method({
                object: this.repository,
                method: this.repository.move,
                isAsync: true,
                // handle CopyBatch finished based on the response value
                onFinished: async (finished) => {
                    const response = await finished.returned;
                    if (response.d.results.length) {
                        for (const copied of response.d.results) {
                            this.onContentMoved.setValue({
                                content: copied as IContent,
                            });
                        }
                    }

                    if (response.d.errors.length) {
                        for (const failed of response.d.errors) {
                            this.onContentMoveFailed.setValue({
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
                        return isNaN(v as number) ? {Path: v} : {Id: parseInt(v as string, 10)} as IContent;
                    });
                    for (const c of contents) {
                        this.onContentMoveFailed.setValue({
                            content: c as IContent,
                            error,
                        });
                    }
                },
            }),
        );
    }

}
