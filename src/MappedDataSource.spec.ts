import {dataSource} from "./MappedDataSource";

test("name mapping", () => {
    const user = dataSource({
        name: "User"
    });
    expect(user.storedName).toEqual("users");
    expect(user.mappedName).toEqual("User");
    const productDetails = dataSource({
        name: "productDetails"
    });
    expect(productDetails.storedName).toEqual("product_details");
    expect(productDetails.mappedName).toEqual("ProductDetail");
});
