import {Readable} from 'stream';

/**
 * DTO to get the request context
 */
export class EvConnectorContextDto {

	center_id?: number;

	/**
	 * this is a JSON config data, that contains everything needed to connect to the datasource.
	 * It could be for example, the name of the datasource database, or the URL to connect to it.
	 * This can be configured on Envision side with any configuration JSON data.
	 */
	connector_config: Record<string, unknown>;

	ip_address?: string;

	/**
	 * This is the OAuth token used to connect to datasource system
	 */
	token?: string;

	type: ContextType;

	user?: Partial<UserEntity>;

	workspace_id?: number;
}

export enum ContextType {
	USER = 'user'
}

export enum EvConnectorObjectType {
	ASSET_3D,
	IMAGE,
	TABLE,
	EVDOC,
}

export interface EvConnectorQuery {
	ids?: Array<string>;

	/**
	 * pagination number (starting at 1)
	 */
	page: number;

	query?: EvConnectorSearchQuery;

	sort: Array<QuerySort>;

	type?: EvConnectorObjectType;

}

export interface EvConnectorSearchQuery {

	/**
	 * Connector asset id
	 */
	id?: string;

	/**
	 *  should we return only the latest revision?
	 */
	latest_revision?: boolean;

	/**
	 * Connector asset name
	 */
	name?: string;

	/**
	 * Connector asset revision number
	 */
	revision?: string;
}

export interface EvConnectorObjectMetaData extends StorageMetaData {
	revision: string;
}

export interface EvConnectorObjectDefinition {
	id: string;

	name: string;

	revision: string;

	/** size in byte */
	size?: number;

	/**  updated date in UTC */
	updated?: Date;
}

/**
 * Connector Service interface used by Envision to communicate with datasource system
 */
export interface EvConnectorServiceInterface {

	/**
	 * This command discards the local changes in Envision WebCreator, and notifies datasource system of this action
	 * (this will typically release the datasource document lock, on datasource side)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param id datasource document identifier
	 * @param revision datasource document revision number
	 */
	discard(context: EvConnectorContextDto, id: string, revision: string): Promise<void>;

	/**
	 * This command will list all the assets in the datasource system, based on the query
	 *
	 * @param context context of the call (user id, center id...)
	 * @param query connector query, @see: EvConnectorQuery
	 */
	list(context: EvConnectorContextDto, query: EvConnectorQuery): Promise<Array<EvConnectorObjectDefinition>>;

	/**
	 * This command notifies datasource system that the document has opened in WebCreator
	 * (it typically will lock the document in datasource system)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param id connector document identifier
	 * @param revision connector document revision number
	 * @param name connector document name. This field is important when we first create the document in Envision
	 * @param is_new is it a new connector document? If yes, we recommend to create an empty file on datasource system to avoid any problem in
	 * other workflows.
	 */
	open(context: EvConnectorContextDto, id: string, revision: string, name: string, is_new?: boolean): Promise<void>;

	/**
	 * This command reads connector asset (binary) with metadata (last update date...)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param id connector document identifier
	 * @param revision connector document revision number
	 */
	readWithMeta(context: EvConnectorContextDto, id: string, revision: string): Promise<[Readable, EvConnectorObjectMetaData]>;

	/**
	 * This command notifies datasource system that the connector document is ready to be saved
	 * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on datasource side)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param id connector document identifier
	 * @param revision connector document revision number
	 */
	save(context: EvConnectorContextDto, id: string, revision: string): Promise<void>;

	/**
	 * This command notifies Connector system that the Connector document is ready to be saved and committed
	 * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on Connector side)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param id Connector document identifier
	 * @param revision Connector document revision number
	 */
	saveAndDone(context: EvConnectorContextDto, id: string, revision: string): Promise<void>;
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