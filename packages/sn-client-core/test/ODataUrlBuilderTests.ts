import { GenericContent, Task } from '@sensenet/default-content-types'
import { Query } from '@sensenet/query'
import 'jest'
import { ODataUrlBuilder } from '../src/Repository/ODataUrlBuilder'
import { Repository } from '../src/Repository/Repository'

// tslint:disable:completed-docs

describe('ODataUrlBuilder', () => {
  describe('#buildUrlParamString()', () => {
    let repo: Repository

    beforeEach(() => {
      repo = new Repository()
    })

    it('should return an empty string, if the argument is undefined', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(repo.configuration)
      expect(urlParamString).toBe(
        '$select=Id,Path,Name,Type,DisplayName,Description,Icon&metadata=no&$inlinecount=allpages&$top=10000',
      )
    })
    it("should return a string with only select Id and Type if there's no selected field", () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { defaultSelect: ['Id', 'Type'] } as any,
        { metadata: 'no' },
      )
      expect(urlParamString).toBe('metadata=no&$select=Id,Type')
    })
    it('should return a string with the given field and Id and Type as selected', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { requiredSelect: ['Id', 'Type'], defaultMetadata: 'no' } as any,
        { select: 'DisplayName' },
      )
      expect(urlParamString).toBe('$select=Id,Type,DisplayName&metadata=no')
    })
    it('should return a string without select if requiredSelect is all', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { requiredSelect: 'all', defaultMetadata: 'no' } as any,
        { select: 'DisplayName' },
      )
      expect(urlParamString).toBe('metadata=no')
    })
    it('should return a string with the given fields and Id and Type as selected', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { requiredSelect: ['Id', 'Type'], defaultMetadata: 'no' } as any,
        { select: ['DisplayName', 'Path'] },
      )
      expect(urlParamString).toBe('$select=Id,Type,DisplayName,Path&metadata=no')
    })
    it('should return a string with the given parameters', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { requiredSelect: ['Id', 'Type'], defaultMetadata: 'no' } as any,
        { select: ['DisplayName', 'Path'], orderby: 'DisplayName' },
      )
      expect(urlParamString).toBe('$select=Id,Type,DisplayName,Path&$orderby=DisplayName&metadata=no')
    })
    it('should return a string with the given parameters', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>(
        { requiredSelect: ['Id', 'Type'], defaultMetadata: 'no' } as any,
        {
          select: ['DisplayName', 'Path'],
          orderby: 'DisplayName',
          query: new Query(q => q.typeIs<Task>(Task)).toString(),
        },
      )
      expect(urlParamString).toBe('$select=Id,Type,DisplayName,Path&$orderby=DisplayName&query=TypeIs:Task&metadata=no')
    })
    it('should return a string without select param', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: 'DisplayName',
      })
      expect(urlParamString).toBe('$orderby=DisplayName&metadata=no')
    })

    it('should parse a single orderby expression', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: 'Name',
      })
      expect(urlParamString).toBe('$orderby=Name&metadata=no')
    })

    it('should parse an orderby array with fields expression', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: ['Name', 'DisplayName'],
      })
      expect(urlParamString).toBe('$orderby=Name,DisplayName&metadata=no')
    })

    it('should parse an orderby field expression with order', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: [['Name', 'asc']],
      })
      expect(urlParamString).toBe('$orderby=Name asc&metadata=no')
    })

    it('should parse an orderby array with ordered fields list expression', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: [['Name', 'asc'], ['DisplayName', 'desc']],
      })
      expect(urlParamString).toBe('$orderby=Name asc,DisplayName desc&metadata=no')
    })

    it('should parse an orderby array with ordered fields list expression and field names', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({ defaultMetadata: 'no' } as any, {
        orderby: [['Name', 'asc'], 'DisplayName'],
      })
      expect(urlParamString).toBe('$orderby=Name asc,DisplayName&metadata=no')
    })

    it('should return a string without any param', () => {
      const urlParamString = ODataUrlBuilder.buildUrlParamString<GenericContent>({
        requiredSelect: ['Id', 'Type'],
        defaultMetadata: 'no',
      } as any)
      expect(urlParamString).toBe('$select=Id,Type&metadata=no')
    })
  })
})
