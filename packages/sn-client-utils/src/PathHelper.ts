/**
 * Helper class for path-related methods
 */
export class PathHelper {

    /**
     * Method that tells if a path is an item path.
     * @param path {string} Path that you want to test.
     * @returns {boolean} Returns if the given path is a path of a Content or not.
     */
    public static isItemPath(path: string): boolean {
        return path.indexOf("('") >= 0 && path.indexOf("')") === path.length - 2;
    }

    /**
     * Method that gets the URL that refers to a single item in the Sense/Net Content Repository
     * @param {string} path Path that you want to format.
     * @returns {string} Path in entity format e.g. /workspaces('project') from /workspaces/project
     */
    public static getContentUrlByPath(path: string): string {
        if (typeof path === "undefined" || path.indexOf("/") < 0 || path.length <= 1) {
            throw new Error("This is not a valid path.");
        }
        if (this.isItemPath(path)) {
            return path;
        }

        const lastSlashPosition = path.lastIndexOf("/");
        const name = path.substring(lastSlashPosition + 1);
        const parentPath = path.substring(0, lastSlashPosition);

        let url;
        if (name.indexOf("Root") > -1) {
            url = `${parentPath}/('${name}')`;
        } else {
            url = `${parentPath}('${name}')`;
        }
        return url;
    }

    /**
     * Method that gets the URL that refers to a single item in the Sense/Net Content Repository by its Id
     * @param id {number} Id of the Content.
     * @returns {string} e.g. /content(123)
     */
    public static getContentUrlbyId(id: number): string {
        return `/content(${id})`;
    }

    /**
     * Method that allows to join paths without multiple or missing slashes
     * @param args The list of the paths to join
     */
    public static joinPaths(...args: string[]) {
        const trimSlashes = (path: string) => {
            if (path.endsWith("/")) {
                path = path.substring(0, path.length - 1);
            }
            if (path.startsWith("/")) {
                path = path.substring(1, path.length);
            }
            return path;
        };

        return args.map(trimSlashes).join("/");
    }

    /**
     * Checks if the ancestorPath is really the ancestor of the descendantPath
     * @param {string} ancestorPath the ancestor path
     * @param {string} descendantPath the descendant path
     * @returns {boolean} if the provided path is the ancestor of the descendant
     */
    public static isAncestorOf(ancestorPath: string, descendantPath: string): boolean {
        return descendantPath.indexOf(this.joinPaths(ancestorPath) + "/") === 0;
    }
}
