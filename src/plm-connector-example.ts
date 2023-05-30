import {Readable} from 'stream';
import {
    ContextDto,
    PlmConnectorServiceInterface,
    PlmObjectDefinition,
    PlmObjectMetaData,
    PlmQuery
} from './plm-connector-helper.types';

/**
 * This is an example of implementation for the PLM Connector Service for Envision
 * @See PlmConnectorServiceInterface
 */
export default class PlmConnectorExample implements PlmConnectorServiceInterface {
    /**
     * @See PlmConnectorServiceInterface:discard
     */
    public discard(context: ContextDto, id: string, revision: string): Promise<void> {
        console.log(`discard ${id}, revision ${revision}`);
        return Promise.resolve(undefined);
    }

    /**
     * @See PlmConnectorServiceInterface:list
     */
    public async list(context: ContextDto, query: PlmQuery): Promise<Array<PlmObjectDefinition>> {
        console.log(`list, query ${JSON.stringify(query)}`);
        return undefined;
    }

    /**
     * @See PlmConnectorServiceInterface:open
     */
    public async open(context: ContextDto, id: string, revision: string): Promise<void> {
        console.log(`open ${id}, revision ${revision}`);
    }

    /**
     * @See PlmConnectorServiceInterface:readWithMeta
     */
    public readWithMeta(context: ContextDto, id: string, revision: string): Promise<[Readable, PlmObjectMetaData]> {
        console.log(`readWithMeta ${id}, revision ${revision}`);
        return Promise.resolve([undefined, undefined]);
    }

    /**
     * @See PlmConnectorServiceInterface:save
     */
    public async save(context: ContextDto, id: string, revision: string): Promise<void> {
        console.log(`save ${id}, revision ${revision}`);
    }

    /**
     * @See PlmConnectorServiceInterface:saveAndDone
     */
    public async saveAndDone(context: ContextDto, id: string, revision: string): Promise<void> {
        console.log(`saveAndDone ${id}, revision ${revision}`);
    }
}