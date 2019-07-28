export const reportErrors = async <T>(cb: () => T | Promise<T>): Promise<T> => {
    try {
        return await cb();
    } catch (e) {
        console.error(e);
        throw e;
    }
};
