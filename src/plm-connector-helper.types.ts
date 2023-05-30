import {Readable} from 'stream';

/**
 * DTO to get the request context
 */
export class ContextDto {

    center_id?: number;

    ip_address?: string;

    // store request token, to use it as a cache key
    token?: string;

    type: ContextType;

    user?: Partial<UserEntity>;

    workspace_id?: number;
}

export enum ContextType {
    USER = 'user'
}

export enum PlmObjectType {
    ASSET_3D,
    IMAGE,
    TABLE,
    EVDOC,
}

export interface PlmQuery {
    ids?: Array<string>;

    /**
     * pagination number (starting at 1)
     */
    page: number;

    query?: PlmSearchQuery;

    sort: Array<QuerySort>;

    type?: PlmObjectType;

}

export interface PlmSearchQuery {

    /**
     * PLM asset id
     */
    id?: string;

    /**
     *  should we return only the latest revision?
     */
    latest_revision?: boolean;

    /**
     * PLM asset name
     */
    name?: string;

    /**
     * PLM asset revision number
     */
    revision?: string;
}

export interface PlmObjectMetaData extends StorageMetaData {
    revision: string;
}

export interface PlmObjectDefinition {
    id: string;

    name: string;

    revision: string;

    /** size in byte */
    size?: number;

    /**  updated date in UTC */
    updated?: Date;
}

/**
 * PLM Connector Service interface used by Envision to communicate with PLM system
 */
export interface PlmConnectorServiceInterface {

    /**
     * This command discards the local changes in Envision WebCreator, and notifies PLM system of this action
     * (this will typically release the PLM document lock, on PLM side)
     *
     * @param context context of the call (user id, center id...)
     * @param id PLM document identifier
     * @param revision PLM document revision number
     */
    discard(context: ContextDto, id: string, revision: string): Promise<void>;

    /**
     * This command will list all the assets in the PLM system, based on the query
     *
     * @param context context of the call (user id, center id...)
     * @param query PLM query, @see: PlmQuery
     */
    list(context: ContextDto, query: PlmQuery): Promise<Array<PlmObjectDefinition>>;

    /**
     * This command notifies PLM system that the document has opened in WebCreator
     * (it typically will lock the document in PLM system)
     *
     * @param context context of the call (user id, center id...)
     * @param id PLM document identifier
     * @param revision PLM document revision number
     */
    open(context: ContextDto, id: string, revision: string): Promise<void>;

    /**
     * This command reads PLM asset (binary) with metadata (last update date...)
     *
     * @param context context of the call (user id, center id...)
     * @param id PLM document identifier
     * @param revision PLM document revision number
     */
    readWithMeta(context: ContextDto, id: string, revision: string): Promise<[Readable, PlmObjectMetaData]>;

    /**
     * This command notifies PLM system that the PLM document is ready to be saved
     * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on PLM side)
     *
     * @param context context of the call (user id, center id...)
     * @param id PLM document identifier
     * @param revision PLM document revision number
     */
    save(context: ContextDto, id: string, revision: string): Promise<void>;

    /**
     * This command notifies PLM system that the PLM document is ready to be saved and committed
     * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on PLM side)
     *
     * @param context context of the call (user id, center id...)
     * @param id PLM document identifier
     * @param revision PLM document revision number
     */
    saveAndDone(context: ContextDto, id: string, revision: string): Promise<void>;
}

export declare type QuerySort = {
    field: string;
    order: QuerySortOperator;
};

export declare type QuerySortOperator = 'ASC' | 'DESC';

export interface StorageMetaData {
    /** creation date in UTC */
    created?: Date;

    /** is the object a folder? */
    folder: boolean;

    /** the object id in the storage */
    id: string;

    /** name of the object in the storage */
    name: string;

    /** path of the object in the storage */
    path: string;

    /** size in byte */
    size?: number;

    /** update date in UTC */
    updated?: Date;
}

export interface UserEntity {
    id: number;
}