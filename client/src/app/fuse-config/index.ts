

/**
 * Default Fuse Configuration
 *
 * You can edit these options to change the default options. All these options also can be
 * changed per component basis. See `app/main/pages/authentication/login/login.component.ts`
 * constructor method to learn more about changing these options per component basis.
 */


export const isNullOrEmpty = (arg: any) => {
    if (arg !== null && typeof (arg) === "object") {
        if (typeof arg.getMonth === 'function') {
            return false;
        }
        return Object.keys(arg).length === 0;
    }
    return arg === undefined || arg === null || arg === '';
};
