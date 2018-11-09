import {mapDataSource} from "./MappedDataSource";

test("name mapping", () => {
    const user = mapDataSource({
        name: "User"
    });
    expect(user.storedName).toEqual("users");
    expect(user.mappedName).toEqual("User");
    const productDetails = mapDataSource({
        name: "productDetails"
    });
    expect(productDetails.storedName).toEqual("product_details");
    expect(productDetails.mappedName).toEqual("ProductDetail");
});
