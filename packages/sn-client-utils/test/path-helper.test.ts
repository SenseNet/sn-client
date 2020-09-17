import { PathHelper } from '../src'

/**
 * Path Helper tests
 */
export const pathHelperTests = describe('PathHelper', () => {
  describe('#isItemSegment()', () => {
    it('Should return true for item segments with string key "(\'Item1\')"', () => {
      expect(PathHelper.isItemSegment("('Item1')")).toBe(true)
    })

    it('Should return true for item segments with numeric key "(42)"', () => {
      expect(PathHelper.isItemSegment('(42)')).toBe(true)
    })

    it('Should return false for string keys w/o quotes', () => {
      expect(PathHelper.isItemSegment('(invalidValue)')).toBe(false)
    })

    it('Should return false for invalid string keys', () => {
      expect(PathHelper.isItemSegment('(123invalidValue)')).toBe(false)
    })

    it('Should return false for non-item segments', () => {
      expect(PathHelper.isItemSegment('Item1')).toBe(false)
    })

    it('Should return false for inconsistent quotation', () => {
      expect(PathHelper.isItemSegment("('123invalidValue)")).toBe(false)
    })
  })

  describe('#trimSlashes()', () => {
    it('should trim from the beginning of the segment', () => {
      expect(PathHelper.trimSlashes('/segment')).toBe('segment')
    })

    it('should trim multiple slashes from the beginning of the segment', () => {
      expect(PathHelper.trimSlashes('//////segment')).toBe('segment')
    })

    it('should trim from the end of the segment', () => {
      expect(PathHelper.trimSlashes('segment/')).toBe('segment')
    })

    it('should trim multiple slashes from the end of the segment', () => {
      expect(PathHelper.trimSlashes('segment///')).toBe('segment')
    })
  })

  describe('#isItemPath()', () => {
    it('should return true for item paths', () => {
      const isAnItem = PathHelper.isItemPath("/workspace('project')")
      expect(isAnItem).toBe(true)
    })

    it('should return false for collection paths', () => {
      const isNotAnItem = PathHelper.isItemPath('/workspace/project')
      expect(isNotAnItem).toBe(false)
    })

    it('should return true for reference paths', () => {
      const isAnItem = PathHelper.isItemPath("/workspace/('project')/CustomAction")
      expect(isAnItem).toBe(true)
    })

    it('should return true for reference paths with ids', () => {
      const isAnItem = PathHelper.isItemPath('/workspaces/(22)/CustomAction')
      expect(isAnItem).toBe(true)
    })
  })

  describe('#getContentUrlbyId()', () => {
    it('should return by path if the provided value is a path', () => {
      const url = PathHelper.getContentUrl('/workspace/project')
      expect(url).toBe("workspace/('project')")
    })

    it('should return by id if the provided value is id', () => {
      const contentUrl = PathHelper.getContentUrl(1)
      expect(contentUrl).toBe('content(1)')
    })
  })

  describe('#getContentUrlbyId()', () => {
    it('should create the path with the correct format', () => {
      const contentUrl = PathHelper.getContentUrlbyId(1)
      expect(contentUrl).toBe('content(1)')
    })
  })

  describe('#getContentUrlByPath()', () => {
    it('should return a proper item path by the given path', () => {
      const contentUrl = PathHelper.getContentUrlByPath('/workspace/project')
      expect(contentUrl).toBe("workspace/('project')")
    })

    it('should return the path itself if it is an item path already', () => {
      const contentUrl = PathHelper.getContentUrlByPath("/workspace('project')")
      expect(contentUrl).toBe("workspace/('project')")
    })

    it('should return the path itself for reference paths', () => {
      const contentUrl = PathHelper.getContentUrlByPath("/workspace('project')/Owner")
      expect(contentUrl).toBe("workspace('project')/Owner")
    })

    it('should return an error message if the given argument is an empty string', () => {
      expect(() => {
        PathHelper.getContentUrlByPath('')
      }).toThrow()
    })

    it('should return a proper item path for Root only', () => {
      const path = PathHelper.getContentUrlByPath('/Root')
      expect(path).toBe("('Root')")
    })
  })

  describe('#joinPaths()', () => {
    it('should join with slashes', () => {
      const joined = PathHelper.joinPaths('path1', 'path2', 'path3')
      expect(joined).toBe('path1/path2/path3')
    })

    it('should remove slashes from the beginning of the segments', () => {
      const joined = PathHelper.joinPaths('path1', 'path2/', 'path3/')
      expect(joined).toBe('path1/path2/path3')
    })

    it('should remove slashes from the end of the segments', () => {
      const joined = PathHelper.joinPaths('/path1', '/path2', 'path3/')
      expect(joined).toBe('path1/path2/path3')
    })
  })

  describe('#isAncestorOf()', () => {
    it('should return true if content is ancestor', () => {
      expect(PathHelper.isAncestorOf('Root/Example', 'Root/Example/Content1')).toBe(true)
      expect(PathHelper.isAncestorOf('/Root/Example', '/Root/Example/Content1')).toBe(true)
    })

    it('should return true if content is ancestor and ends with a slash', () => {
      expect(PathHelper.isAncestorOf('Root/Example/', 'Root/Example/Content1')).toBe(true)
      expect(PathHelper.isAncestorOf('/Root/Example/', '/Root/Example/Content1')).toBe(true)
    })

    it('should return false if content is not an ancestor', () => {
      expect(PathHelper.isAncestorOf('Root/Example/', 'Root/Example2/Content1')).toBe(false)
      expect(PathHelper.isAncestorOf('/Root/Example/', '/Root/Example2/Content1')).toBe(false)
    })
  })

  describe('#isInSubTree', () => {
    it('should return true if content is in subtree', () => {
      expect(PathHelper.isInSubTree('Root/Example/Content1', 'Root/Example')).toBe(true)
      expect(PathHelper.isInSubTree('/Root/Example/Content1', '/Root/Example')).toBe(true)
    })

    it('should return true if content is equal to subtree root', () => {
      expect(PathHelper.isInSubTree('Root/Example', 'Root/Example')).toBe(true)
      expect(PathHelper.isInSubTree('/Root/Example', '/Root/Example')).toBe(true)
    })

    it('should return false if content is not in subtree', () => {
      expect(PathHelper.isInSubTree('Root/Example2/Content1', 'Root/Example')).toBe(false)
      expect(PathHelper.isInSubTree('/Root/Example2/Content1', '/Root/Example')).toBe(false)
    })
  })

  describe('#getSegments()', () => {
    it('Should split the path to segments', () => {
      expect(PathHelper.getSegments("/Root/Example('Content1')")).toEqual(['Root', 'Example', "('Content1')"])
    })
    it('Should split the path to segments', () => {
      expect(PathHelper.getSegments('/Root/Example(123)')).toEqual(['Root', 'Example', '(123)'])
    })
    it('Should split the path to segments', () => {
      expect(PathHelper.getSegments('/Root/Example/100pages(3).pdf')).toEqual(['Root', 'Example', '100pages(3).pdf'])
    })
    it('should throw an error if the path is /', () => {
      expect(() => PathHelper.getSegments('/')).toThrow()
    })
    it('should return empty array if the path is empty', () => {
      expect(PathHelper.getSegments('')).toEqual([])
    })
  })

  describe('#getParentPath()', () => {
    it('Should return the parent path in case of more than 1 segments', () => {
      expect(PathHelper.getParentPath('Root/Example/Content')).toBe('Root/Example')
    })

    it('Should return the parent path in case of more than 1 segments with item path', () => {
      expect(PathHelper.getParentPath("Root/Example('Content')")).toBe('Root/Example')
    })

    it('Should return the path in case of 1 segments', () => {
      expect(PathHelper.getParentPath('Root')).toBe('Root')
    })
  })
})
