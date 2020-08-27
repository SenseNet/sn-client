/**
 * Helper class for path-related functions and methods
 *
 * The class contains general helper methods for joining, splitting, modifying and validating paths.
 */
export class PathHelper {
  /**
   * Trims the slash characters from the beginning and from the end of the path to avoid duplicated slashes
   * @param {string} path The source path that should be trimmed
   */
  public static trimSlashes(path: string) {
    while (path.endsWith('/')) {
      path = path.substring(0, path.length - 1)
    }
    while (path.startsWith('/')) {
      path = path.substring(1, path.length)
    }
    return path
  }

  /**
   * Splits a full path into path segments,
   * e.g.: /Root/Example('Content1') will be ["Root", "Example", "('Content1')"]
   * @param path The path to be splitted
   */
  public static getSegments(path: string) {
    if (!path) {
      return []
    }
    // Split path at / and remove empty strings
    const splitted = path.split('/').filter(Boolean)
    const lastItem = splitted.pop()
    if (!lastItem) {
      throw new Error(`Couldn't get the segments for ${path}`)
    }
    // Match if last item is Root/content(123) or Root/Example('content')
    const matches = lastItem.match(/(\('\w+'\)|\(\d+\)$)/g)
    if (!matches) {
      return [...splitted, lastItem]
    }
    // Gets Example from Root/Example(123)
    const lastSegmentBeforeColumn = lastItem.split(matches[0])[0]
    return [...splitted, lastSegmentBeforeColumn, ...matches]
  }

  /**
   * Checks if a specific segment is an Item segment or not (like "('Content1')"" or "(654)")
   * @param segment The segment to be examined
   */
  public static isItemSegment(segment: string): boolean {
    return RegExp(/\('+[\s\S]+'\)$/).test(segment) || RegExp(/\(+\d+\)$/).test(segment)
  }

  /**
   * Method that tells if a path is an item path or an item reference path (e.g. contains an Item segment).
   * @param {string} path Path that you want to test.
   * @returns {boolean} Returns if the given path is a path of a Content or not.
   */
  public static isItemPath(path: string): boolean {
    const segments = this.getSegments(path)
    const itemSegment = segments.find((s) => this.isItemSegment(s))
    return itemSegment && itemSegment.length ? true : false
  }

  /**
   * Returns the full path for a content based on its Id or Path
   * @param {string | number} idOrPath the Id Or Path of the content
   * @returns A full Id or Path-based url of the content (e.g.  *'/content(1)'* or *'/Root/Example/('Content')'*)
   */
  public static getContentUrl(idOrPath: string | number): string {
    const parsed = parseInt(idOrPath as string, 10)
    if (isNaN(parsed)) {
      return this.getContentUrlByPath(idOrPath.toString())
    } else {
      return this.getContentUrlbyId(parsed)
    }
  }

  /**
   * Method that gets the URL that refers to a single item in the Sense/Net Content Repository
   * @param {string} path Path that you want to format.
   * @returns {string} Path in entity format e.g. /workspaces('project') from /workspaces/project
   */
  public static getContentUrlByPath(path: string): string {
    if (!path) {
      throw Error('Path is empty')
    }

    const segments = this.getSegments(path)
    if (!this.isItemPath(path)) {
      segments[segments.length - 1] = `('${segments[segments.length - 1]}')`
    }
    return segments.join('/')
  }

  /**
   * Method that gets the URL that refers to a single item in the Sense/Net Content Repository by its Id
   * @param id {number} Id of the Content.
   * @returns {string} e.g. /content(123)
   */
  public static getContentUrlbyId(id: number): string {
    return `content(${id})`
  }

  /**
   * Method that allows to join paths without multiple or missing slashes
   * @param args The list of the paths to join
   */
  public static joinPaths(...args: string[]) {
    return args.map(this.trimSlashes).join('/')
  }

  /**
   * Checks if the ancestorPath is really the ancestor of the descendantPath
   * @param {string} ancestorPath the ancestor path
   * @param {string} descendantPath the descendant path
   * @returns {boolean} if the provided path is the ancestor of the descendant
   */
  public static isAncestorOf(ancestorPath: string, descendantPath: string): boolean {
    const trimmedDescendantPath = this.trimSlashes(descendantPath)
    const trimmedAncestorPath = this.trimSlashes(ancestorPath)
    return trimmedDescendantPath.indexOf(`${this.joinPaths(trimmedAncestorPath)}/`) === 0
  }

  public static isInSubTree(currentPath: string, treeRoot: string): boolean {
    const regexp = new RegExp(`^${treeRoot}(/|$)`)
    return regexp.test(currentPath)
  }

  /**
   * Returns the parent path from a specified path.
   * e.g. "/Root/Example/Content" will return "/Root/Example"
   *
   * "Root" will always return "Root"
   * @param path The content path
   */
  public static getParentPath(path: string): string {
    const segments = this.getSegments(path)
    if (segments.length > 1) {
      segments.pop()
    }
    return segments.join('/')
  }
}
