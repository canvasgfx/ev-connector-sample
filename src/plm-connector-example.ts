import {Readable} from 'stream';
import {
    PlmConnectorServiceInterface,
    PlmContextDto,
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
    public discard(context: PlmContextDto, id: string, revision: string): Promise<void> {
        console.log(`discard ${id}, revision ${revision}`);
        return Promise.resolve(undefined);
    }

    /**
     * @See PlmConnectorServiceInterface:list
     */
    public async list(context: PlmContextDto, query: PlmQuery): Promise<Array<PlmObjectDefinition>> {
        console.log(`list, query ${JSON.stringify(query)}`);
        return undefined;
    }

    /**
     * @See PlmConnectorServiceInterface:open
     */
    public async open(context: PlmContextDto, id: string, revision: string, name: string, is_new?: boolean): Promise<void> {
        console.log(`open ${id}, revision ${revision}`);
    }

    /**
     * @See PlmConnectorServiceInterface:readWithMeta
     */
    public readWithMeta(context: PlmContextDto, id: string, revision: string): Promise<[Readable, PlmObjectMetaData]> {
        console.log(`readWithMeta ${id}, revision ${revision}`);
        return Promise.resolve([undefined, undefined]);
    }

    /**
     * @See PlmConnectorServiceInterface:save
     */
    public async save(context: PlmContextDto, id: string, revision: string): Promise<void> {
        console.log(`save ${id}, revision ${revision}`);
    }

    /**
     * @See PlmConnectorServiceInterface:saveAndDone
     */
    public async saveAndDone(context: PlmContextDto, id: string, revision: string): Promise<void> {
        console.log(`saveAndDone ${id}, revision ${revision}`);
    }
}