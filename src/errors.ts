export const getTypeAccessorError = (name: string, parent: string) => new Error(
    `Property ${name} must not be accessed directly. ` +
    `Use typeof ${parent}Instance.${name} to get the ${name} type for this ${parent}`
);
