import { IDisposable, PathHelper } from "@sensenet/client-utils";
import { BypassAuthentication } from "../Authentication/BypassAuthentication";
import { IAuthenticationService } from "../Authentication/IAuthenticationService";
import { IContent } from "../Models/IContent";
import { IODataBatchResponse } from "../Models/IODataBatchResponse";
import { IODataCollectionResponse } from "../Models/IOdataCollectionResponse";
import { IODataResponse } from "../Models/IOdataResponse";
import { IActionOptions, ICopyOptions, IDeleteOptions, ILoadCollectionOptions, ILoadOptions, IMoveOptions, IPatchOptions, IPostOptions, IPutOptions } from "../Models/IRequestOptions";
import { ODataUrlBuilder } from "./ODataUrlBuilder";
import { RepositoryConfiguration } from "./RepositoryConfiguration";

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
     * Loads a content from the content repository
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
        /** ToDo: Post content logic */
        return null as any;
    }

    /**
     * Updates an existing content in the repository using OData Patch
     * @param options Options for the Patch request
     */
    public async patch<TContentType extends IContent>(options: IPatchOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        /** ToDo: Post content logic */
        return null as any;
    }

    /**
     * Updates an existing content in the repository using OData Put
     * @param options Options for the Put request
     */
    public async put<TContentType extends IContent>(options: IPutOptions<TContentType>): Promise<IODataResponse<TContentType>> {
        /** ToDo: Post content logic */
        return null as any;
    }

    /**
     * Deletes a content or a content collection from the Repository
     * @param options Options for the Delete request
     */
    public async delete(options: IDeleteOptions): Promise<IODataBatchResponse<IContent>> {
        /** ToDo: delete logic */
        return null as any;
    }

    /**
     * Moves a content or content collection to a specified location
     * @param options Options for the Move request
     */
    public async move(options: IMoveOptions): Promise<IODataBatchResponse<IContent>> {
        return null as any;
    }

    /**
     * Copies a content or content collection to a specified location
     * @param options Options for the Copy request
     */
    public async copy(options: ICopyOptions): Promise<IODataBatchResponse<IContent>> {
        return null as any;
    }

    /**
     * Executes a specified custom OData action
     * @param options Options for the Custom Action
     */
    public async executeAction<TContext, TBodyType, TReturns>(options: IActionOptions<TContext, TBodyType>,
    ): Promise<TReturns> {
        return {} as TReturns;
    }

    constructor(
        config?: Partial<RepositoryConfiguration>,
        private fetchMethod: GlobalFetch["fetch"] = window && window.fetch && window.fetch.bind(window),
    ) {
        this.configuration = new RepositoryConfiguration(config);
    }
}
