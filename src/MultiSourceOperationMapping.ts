// import { OperationMapping } from "./OperationMapping";
// import * as Knex from "knex";
// import { MappedDataSource } from "./MappedDataSource";
// import { Dict, MultiSelection, MultiSelectionItem } from "./util-types";
// import { AliasHierarchyVisitor } from "./AliasHierarchyVisitor";
// import { MappedAssociation } from "./MappedAssociation";
// import { MappedMultiSourceOperation } from "./MappedMultiSourceOperation";
// import { ResolverContext } from "./ResolverContext";

// export interface MultiSourceOperationMapping<
//     TCtx extends ResolverContext<
//         any,
//         TSrc,
//         MultiSourceOperationMapping<TCtx, TSrc, TGQLArgs, TGQLSource, TGQLContext>,
//         TGQLArgs,
//         TGQLSource,
//         TGQLContext
//     >,
//     TSrc extends MappedDataSource,
//     TGQLArgs extends {},
//     TGQLSource = any,
//     TGQLContext = any
// > extends OperationMapping<TGQLArgs> {
//     dataSources: MultiSelection<
//         TSrc,
//         TCtx,
//         MultiSelectionItem<TSrc, TCtx> & {
//             rootQuery<T extends MultiSourceOperationMapping<TCtx, TSrc, TGQLArgs, TGQLSource, TGQLContext>>(
//                 this: MappedMultiSourceOperation<TSrc, TGQLArgs, T>,
//                 dataSource: TSrc,
//                 args: TGQLArgs,
//                 aliasHierarchyVisitor: AliasHierarchyVisitor,
//             ): Knex.QueryBuilder;
//             deriveWhereParams<T extends MultiSourceOperationMapping<TCtx, TSrc, TGQLArgs, TGQLSource, TGQLContext>>(
//                 this: MappedMultiSourceOperation<TSrc, TGQLArgs, T>,
//                 args: TGQLArgs,
//                 association?: MappedAssociation,
//             ): Dict;
//         }
//     >;
// }
