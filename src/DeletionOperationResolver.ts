import { MappedDataSource } from "./MappedDataSource";
import { OperationResolver } from "./OperationResolver";
import { pick } from "lodash";
import { QueryOperationResolver } from ".";
import { MemoizeGetter } from "./utils";

export class DeletionOperationResolver<T extends MappedDataSource = any> extends OperationResolver<T> {
    @MemoizeGetter
    get queryResolver() {
        return new QueryOperationResolver(
            this.operation,
            this.source,
            this.context,
            pick(this.args, "where"),
            this.resolveInfoRoot,
            this.resolveInfoVisitor,
        );
    }

    get storeParams() {
        return pick(this.queryResolver.storeParams, "whereParams");
    }

    async resolve() {
        const mappedRows = await this.queryResolver.resolve();
        await this.rootSource
            .rootQuery(this.queryResolver.rootAlias)
            .where(this.storeParams.whereParams)
            .del();
        return mappedRows;
    }
}
