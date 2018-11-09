import { failure } from 'io-ts/lib/PathReporter'
import * as t from "io-ts";

export const assertType = (type: t.Type<any>, value: any) => {
    return type.decode(value).getOrElseL(errors => {
        throw new Error(failure(errors).join('\n'))
    })
}
