/**
 * Construct an error to be thrown if a getter intended solely for exposing a derived type is accessed at runtime 
 * 
 * @param name property name on parent class
 * @param parent parent/owner name
 */
export const getTypeAccessorError = (name: string, parent: string) =>
    new Error(
        `Property ${name} must not be accessed directly. ` +
            `Use typeof ${parent}Instance.${name} to get the ${name} type for this ${parent}`,
    );

export const expectedOverride = () => new Error("Expected to be overriden in child class");
