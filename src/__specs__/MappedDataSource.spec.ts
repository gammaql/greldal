import { mapDataSource } from "../MappedDataSource";

export const mapEmptyDataSource = (name: string) => mapDataSource({ name });

test("name mapping", () => {
    const user = mapEmptyDataSource("User");
    expect(user.storedName).toEqual("users");
    expect(user.mappedName).toEqual("User");
    const productDetails = mapEmptyDataSource("productDetails");
    expect(productDetails.storedName).toEqual("product_details");
    expect(productDetails.mappedName).toEqual("ProductDetail");
});

test("field mapping", () => {});
