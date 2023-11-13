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
	public discard(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<void> {
		console.log(`discard ${datasourceObj.id}, revision ${datasourceObj.revision}`);
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
	public readWithMeta(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<[Readable, EvConnectorObjectMetaData]> {
		console.log(`readWithMeta ${datasourceObj.id}, revision ${datasourceObj.revision}`);
		return Promise.resolve([undefined, undefined]);
	}

	/**
	 * @See EvConnectorServiceInterface:requestRead
	 */
	public requestRead(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<boolean> {
		console.log(`requestRead ${datasourceObj.id}, revision ${datasourceObj.revision}`);
		return Promise.resolve(false); // Note: returns true if workflow is async
	}

	/**
	 * @See EvConnectorServiceInterface:save
	 */
	public async save(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<boolean> {
		console.log(`save ${datasourceObj.id}, revision ${datasourceObj.revision}`);
		return Promise.resolve(false); // Note: returns true if workflow is async
	}

	/**
	 * @See EvConnectorServiceInterface:saveAndDone
	 */
	public async saveAndDone(context: EvConnectorContextDto, datasourceObj: EvConnectorObjectDefinition): Promise<boolean> {
		console.log(`saveAndDone ${datasourceObj.id}, revision ${datasourceObj.revision}`);
		return Promise.resolve(false); // Note: returns true if workflow is async
	}
}
