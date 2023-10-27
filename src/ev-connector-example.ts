import {Readable} from 'stream';
import {
	EvConnectorContextDto,
	EvConnectorObjectDefinition,
	EvConnectorObjectMetaData,
	EvConnectorQuery,
	EvConnectorServiceInterface
} from './ev-connector-helper.types';

/**
 * This is an example of implementation for the Connector Service for Envision
 * @See EvConnectorServiceInterface
 */
export default class EvConnectorExample implements EvConnectorServiceInterface {
	/**
	 * @See EvConnectorServiceInterface:discard
	 */
	public discard(context: EvConnectorContextDto, id: string, revision: string): Promise<void> {
		console.log(`discard ${id}, revision ${revision}`);
		return Promise.resolve(undefined);
	}

	/**
	 * @See EvConnectorServiceInterface:list
	 */
	public async list(context: EvConnectorContextDto, query: EvConnectorQuery): Promise<Array<EvConnectorObjectDefinition>> {
		console.log(`list, query ${JSON.stringify(query)}`);
		return undefined;
	}

	/**
	 * @See EvConnectorServiceInterface:open
	 */
	public async open(context: EvConnectorContextDto, id: string, revision: string, name: string, is_new?: boolean): Promise<void> {
		console.log(`open ${id}, revision ${revision}`);
	}

	/**
	 * @See EvConnectorServiceInterface:readWithMeta
	 */
	public readWithMeta(context: EvConnectorContextDto, id: string, revision: string): Promise<[Readable, EvConnectorObjectMetaData]> {
		console.log(`readWithMeta ${id}, revision ${revision}`);
		return Promise.resolve([undefined, undefined]);
	}

	/**
	 * @See EvConnectorServiceInterface:save
	 */
	public async save(context: EvConnectorContextDto, id: string, revision: string): Promise<void> {
		console.log(`save ${id}, revision ${revision}`);
	}

	/**
	 * @See EvConnectorServiceInterface:saveAndDone
	 */
	public async saveAndDone(context: EvConnectorContextDto, id: string, revision: string): Promise<void> {
		console.log(`saveAndDone ${id}, revision ${revision}`);
	}
}
