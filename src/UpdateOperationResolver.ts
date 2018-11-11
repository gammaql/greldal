import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";

export class UpdateOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    resolve(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
