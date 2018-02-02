import { IDisposable, PathHelper } from "@sensenet/client-utils";
import { IActionModel } from "@sensenet/default-content-types";
import { BypassAuthentication } from "../Authentication/BypassAuthentication";
import { IAuthenticationService } from "../Authentication/IAuthenticationService";
import { IContent } from "../Models/IContent";
import { IODataBatchResponse } from "../Models/IODataBatchResponse";
import { IODataCollectionResponse } from "../Models/IODataCollectionResponse";
import { IODataResponse } from "../Models/IODataResponse";
import { IActionOptions, ICopyOptions, IDeleteOptions, IGetActionOptions, ILoadCollectionOptions, ILoadOptions, IMoveOptions, IPatchOptions, IPostOptions, IPutOptions } from "../Models/IRequestOptions";
import { SchemaStore } from "../Schemas/SchemaStore";
import { ConstantContent } from "./ConstantContent";
import { ODataUrlBuilder } from "./ODataUrlBuilder";
import { RepositoryConfiguration } from "./RepositoryConfiguration";
import { Security } from "./Security";

/**
 * Class that can be used as a main entry point to manipulate a sensenet ECM content repository
 */
export class Repository implements IDisposable {
    /**
     * Disposes the Repository object
     */
    public dispose() {
        this.authentication.dispose();
    }

    /**
     * Authentication service associated with the repository object
     */
    public authentication: IAuthenticationService = new BypassAuthentication();

    /**
     * The configuration for the Repository object
     */
    public readonly configuration: RepositoryConfiguration;

    /**
     * Async method that will be resolved when the Repository is ready to make HTTP calls
     */
    public async awaitReadyState(): Promise<void> {
        await Promise.all([
            this.authentication.checkForUpdate(),
        ]);
    }

    /**
     * Wrapper for a native window.fetch method. The repository's readyState will be awaited and credentials will be included by default
     * @param {RequestInfo} input The RequestInfo object
     * @param {RequestInit} init Optional init parameters
     */
    public async fetch(info: RequestInfo, init?: RequestInit, awaitReadyState: boolean = true): Promise<Response> {
        if (awaitReadyState) {
            await this.awaitReadyState();
        }
        return await this.fetchMethod(info, init || {
            credentials: "include",

        });
    }

    /**
     * Loads a content from the content repository. If used with a fully qualified content path,
     * it will be transformed to an item path.
     * @param options Options for the Load request
     */
    public async load<TContentType extends IContent>(options: ILoadOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        const contentPath = PathHelper.getContentUrl(options.idOrPath);
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath);
        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: "GET",
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Loads a content collection from the repository
     * @param options Options for the Load request
     */
    public async loadCollection<TContentType extends IContent>(options: ILoadCollectionOptions<TContentType>): Promise<IODataCollectionResponse<TContentType>> {
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, options.path);
        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: "GET",
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();

    }

    /**
     * Posts a new content to the content repository
     * @param options Post request Options
     */
    public async post<TContentType extends IContent>(options: IPostOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, options.parentPath);
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const postBody: Partial<TContentType> & {__ContentType: string, __ContentTemplate?: string} = Object.assign({}, options.content) as any;
        postBody.__ContentType = options.contentType;
        postBody.__ContentTemplate = options.contentTemplate;

        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: "POST",
            body: JSON.stringify(postBody),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Updates an existing content in the repository using OData Patch
     * @param options Options for the Patch request
     */
    public async patch<TContentType extends IContent>(options: IPatchOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        const contentPath = PathHelper.getContentUrl(options.idOrPath);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath);
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify(options.content),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Updates an existing content in the repository using OData Put
     * @param options Options for the Put request
     */
    public async put<TContentType extends IContent>(options: IPutOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        const contentPath = PathHelper.getContentUrl(options.idOrPath);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contentPath);
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: "PUT",
            body: JSON.stringify(options.content),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    private createArray<T>(param: T[] | T): T[] {
        if (!(param instanceof Array)) {
            return [param];
        }
        return param;
    }

    /**
     * Deletes a content or a content collection from the Repository
     * @param options Options for the Delete request
     */
    public async delete(options: IDeleteOptions): Promise<IODataBatchResponse<IContent>> {
        return await this.executeAction<{}, IODataBatchResponse<IContent>>({
            idOrPath: ConstantContent.PORTAL_ROOT.Path,
            method: "POST",
            name: "DeleteBatch",
            body: JSON.stringify({
                paths: this.createArray(options.idOrPath),
                permanent: options.permanent,
            }),
        });
    }

    /**
     * Moves a content or content collection to a specified location
     * @param options Options for the Move request
     */
    public async move(options: IMoveOptions): Promise<IODataBatchResponse<IContent>> {
        return await this.executeAction<{}, IODataBatchResponse<IContent>>({
            idOrPath: ConstantContent.PORTAL_ROOT.Path,
            method: "POST",
            name: "MoveBatch",
            body: JSON.stringify({
                paths: this.createArray(options.idOrPath),
                targetPath: options.targetPath,
            }),
        });
    }

    /**
     * Copies a content or content collection to a specified location
     * @param options Options for the Copy request
     */
    public async copy(options: ICopyOptions): Promise<IODataBatchResponse<IContent>> {
        return await this.executeAction<{}, IODataBatchResponse<IContent>>({
            idOrPath: ConstantContent.PORTAL_ROOT.Path,
            method: "POST",
            name: "CopyBatch",
            body: JSON.stringify({
                paths: this.createArray(options.idOrPath),
                targetPath: options.targetPath,
            }),
        });
    }

    /**
     * Retrieves a list of content actions for a specified content
     * @param options Options for fetching the Custom Actions
     */
    public async getActions(options: IGetActionOptions): Promise<{d: IActionModel[]}> {
        const contextPath = PathHelper.getContentUrl(options.idOrPath);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl,
            this.configuration.oDataToken,
            contextPath,
            "Actions",
            options.scenario ? `$scenario=${options.scenario}` : "");
        const response = await this.fetch(`${path}`, {
            credentials: "include",
            method: "GET",
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Executes a specified custom OData action
     * @param options Options for the Custom Action
     */
    public async executeAction<TBodyType, TReturns>(options: IActionOptions<TBodyType, any>,
    ): Promise<TReturns> {
        const contextPath = PathHelper.getContentUrl(options.idOrPath);
        const params = ODataUrlBuilder.buildUrlParamString(this.configuration, options.oDataOptions);
        const path = PathHelper.joinPaths(this.configuration.repositoryUrl, this.configuration.oDataToken, contextPath, options.name);
        const response = await this.fetch(`${path}?${params}`, {
            credentials: "include",
            method: options.method,
            body: JSON.stringify(options.body),
        });
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return await response.json();
    }

    /**
     * Shortcut for security- and permission-related custom actions
     */
    public security: Security = new Security(this);

    constructor(
        config?: Partial<RepositoryConfiguration>,
        private fetchMethod: GlobalFetch["fetch"] = window && window.fetch && window.fetch.bind(window),
        public schemas: SchemaStore = new SchemaStore(),
    ) {
        this.configuration = new RepositoryConfiguration(config);
    }
}
