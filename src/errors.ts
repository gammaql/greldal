export const getTypeAccessorError = (name: string, parent: string) =>
    new Error(
        `Property ${name} must not be accessed directly. ` +
            `Use typeof ${parent}Instance.${name} to get the ${name} type for this ${parent}`,
    );

export const expectedOverride = () => new Error("Expected to be overriden in child class");
