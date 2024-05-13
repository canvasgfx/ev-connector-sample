import {Readable} from 'stream';

export interface EvAccessTokenInfo {
	/**
	 * This is the Envision OAuth2 Access token used by Envision application to authenticate the current user on Envision app.
	 * This token is useful if the datasource needs to call Envision API. The Access Token is always valid as
	 * Envision App renews expired token automatically, before using EV-Connector
	 */
	token: string;
}

/**
 * DTO to get the request context
 */
export class EvConnectorContextDto {

	/**
	 * This is the current center id of the opened document. Useful for Envision API calls.
	 */
	center_id?: number;

	/**
	 * this is a JSON config data, that contains everything needed to connect to the datasource.
	 * It could be for example, the name of the datasource database, or the URL to connect to it.
	 * This can be configured on Envision side in the UI (by a workspace administrator) with any configuration JSON data.
	 */
	connector_config: ConnectorConfig;

	/**
	 * This is the Datasource OAuth2 access token used to authenticate requests to Datasource.
	 * The access token is acquired using an OAuth2 workflow, before any Connector operation is initiated.
	 * The Oauth2 workflow starts on Envision side when user clicks on a button that is related with the Connector.
	 * If users is already authenticated to the datasource, Envision uses the existing known Datasource token.
	 */
	connector_token?: string;

	/**
	 * This is the IPv4 address of the user
	 */
	ip_address?: string;

	/**
	 * used to log error on Envision server
	 */
	logger: LoggerService;

	/**
	 * This is the Envision OAuth token used by Envision to authenticate the user
	 */
	token_info?: EvAccessTokenInfo;

	/**
	 * There is only one context Type for Connector, which is USER
	 */
	type: ContextType;

	/**
	 * The current user that is authenticated on Envision side
	 */
	user?: Partial<UserEntity>;

	/**
	 * The current workspace id. Useful for Envision API calls.
	 */
	workspace_id?: number;
}

/**
 * A unique identifier of the Datasource object (image, text, document...)
 */
export type EvConnectorObjectIdentifier = string;


/**
 * The current datasource object types that are supported on Envision side
 */
export enum EvConnectorObjectType {
	ASSET_3D = 1,
	IMAGE,
	TABLE,
	EVDOC,
	/**
	 * Multi 3D asset is a composed asset of multiple sub-files on Datasource side
	 */
	MULTI_ASSET_3D
}

export interface EvConnectorQuery {
	/**
	 * filter specific Datasource object ids. Optional
	 */
	ids?: Array<EvConnectorObjectIdentifier>;

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
	id?: EvConnectorObjectIdentifier;

	/**
	 * specific identifier on datasource side
	 */
	item_number?: string;

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
	item_number?: string;

	revision: string;
}

export interface EvConnectorObjectDefinition {
	id: EvConnectorObjectIdentifier;

	/**
	 * is it an evdoc with Graphic?
	 */
	is_graphic?: boolean;

	name: string;

	/** this is an extra parameter that can be used to identify a file on datasource side. **/
	plm_file_id?: string;

	/** in case something was not correctly synchronized, reason explains why **/
	reason?: string;

	revision: string;

	/** size in byte */
	size?: number;

	/** type of object in datasource **/
	type?: EvConnectorObjectType;

	/**  updated date in UTC */
	updated?: Date;
}

export interface EvConnectorAsset {
	id: EvConnectorObjectIdentifier;

	item_type: EvConnectorItemType;
}

export enum EvConnectorItemType {
	ASSET_3D = 'CAD',
	IMAGE = 'tp_image',
	TABLE = 'Part'
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
	 * @param datasourceObj the datasource object info to get the file content
	 */
	discard(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<void>;

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
	 * @param datasourceObj the datasource object info to get the file content
	 */
	readWithMeta(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<[Readable, EvConnectorObjectMetaData]>;

	/**
	 * This command notifies datasource system that the document/asset will be downloaded from datasource.
	 * When it's ready to be downloaded, datasource system needs to notify it with PlmObjectStatus.DOWNLOAD_READY
	 *
	 * @param context context of the call (user id, center id...)
	 * @param datasourceObj the datasource object info to get the file content
	 *
	 * @return true if it needs async read (which requires to poll the status of the object), false otherwise
	 */
	requestRead(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<boolean>;

	/**
	 * This command notifies datasource system that the connector document is ready to be saved
	 * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on datasource side)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param datasourceObj the datasource object info to get the file content
	 * @param content the content to save in datasource (if async call, this field is not used. See doc).
	 * @param assets the list of assets attached to this document
	 *
	 * @return true if it needs async write (which requires to poll the status of the object), false otherwise
	 */
	save(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition, content?: Readable, assets?: Array<EvConnectorAsset>): Promise<boolean>;

	/**
	 * This command notifies Connector system that the Connector document is ready to be saved and committed
	 * (the document on WebCreator will be in PENDING_SAVE status until the operation is finished on Connector side)
	 *
	 * @param context context of the call (user id, center id...)
	 * @param datasourceObj the datasource object info to get the file content
	 * @param content the content to save in datasource (if async call, this field is not used. See doc).
	 * @param assets the list of assets attached to this document
	 *
	 * @return true if it needs async write (which requires to poll the status of the object), false otherwise
	 */
	saveAndDone(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition, content?: Readable, assets?: Array<EvConnectorAsset>): Promise<boolean>;
}

/***********************************************************************************
  Common interfaces
 **********************************************************************************/

export enum ContextType {
	USER = 'user'
}

export type ConnectorConfig = Record<string, unknown>; // Note: this is configured in the admin section of Envision

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

/***********************************************************************************
  Exceptions
 **********************************************************************************/

const UNPROCESSABLE = 422;
const BAD_REQUEST = 400;

export class BadRequestException extends Error {
	/**
	 * Instantiate an `BadRequestException` Exception.
	 *
	 * @example
	 * `throw new BadRequestException()`
	 *
	 * @usageNotes
	 * The HTTP response status code will be 400.
	 * This error is used to tell Envision to display an explicit error message in the UI
	 */
	constructor(message: string) {
		super();
		this.message = message;
	}

	public get status(): number {
		return BAD_REQUEST;
	}
}

export class UnprocessableEntityException extends Error {
	/**
	 * Instantiate an `UnprocessableEntityException` Exception.
	 *
	 * @example
	 * `throw new UnprocessableEntityException()`
	 *
	 * @usageNotes
	 * The HTTP response status code will be 422.
	 * This error is used to tell Envision to refresh the token
	 */
	constructor() {
		super();
	}

	public get status(): number {
		return UNPROCESSABLE;
	}
}

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

export interface LoggerService {
	/**
	 * Write a 'debug' level log.
	 */
	debug?(message: any, ...optionalParams: any[]): any;

	/**
	 * Write an 'error' level log.
	 */
	error(message: any, ...optionalParams: any[]): any;

	/**
	 * Write a 'log' level log.
	 */
	log(message: any, ...optionalParams: any[]): any;

	/**
	 * Set log levels.
	 * @param levels log levels
	 */
	setLogLevels?(levels: LogLevel[]): any;

	/**
	 * Write a 'verbose' level log.
	 */
	verbose?(message: any, ...optionalParams: any[]): any;

	/**
	 * Write a 'warn' level log.
	 */
	warn(message: any, ...optionalParams: any[]): any;
}