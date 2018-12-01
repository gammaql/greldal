"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MappedDataSource_1 = require("./MappedDataSource");
test("name mapping", () => {
    const user = MappedDataSource_1.mapDataSource({
        name: "User",
    });
    expect(user.storedName).toEqual("users");
    expect(user.mappedName).toEqual("User");
    const productDetails = MappedDataSource_1.mapDataSource({
        name: "productDetails",
    });
    expect(productDetails.storedName).toEqual("product_details");
    expect(productDetails.mappedName).toEqual("ProductDetail");
});
//# sourceMappingURL=MappedDataSource.spec.js.map