import { Query } from '../src'

class Task {
  public Id!: number
  public Name!: string
  public Path!: string
  public DisplayName!: string
  public ModificationDate?: string
  public Approvable!: boolean
  public Description!: string
}
describe('Query', () => {
  it('Can be constructed', () => {
    const query = new Query(q => q)
    expect(query).toBeInstanceOf(Query)
  })

  it('can execute the provided example', () => {
    const query = new Query(
      q =>
        q
          .typeIs<Task>(Task) // adds '+TypeIs:Document' and Typescript type cast
          .and.equals('DisplayName', 'Unicorn') // adds +Title:Unicorn (TBD: fuzzy/Proximity)
          .and.between('ModificationDate', '2017-01-01T00:00:00', '2017-02-01T00:00:00')
          .or.query(
            sub =>
              sub // Grouping
                .notEquals('Approvable', true)
                .and.notEquals('Description', '*alma*'), // Contains with wildcards
          )
          .sort('DisplayName')
          .top(5) // adds .TOP:5
          .skip(10), // adds .SKIP:10
    )

    expect(query.toString()).toBe(
      "TypeIs:Task AND DisplayName:'Unicorn' AND ModificationDate:{'2017-01-01T00\\:00\\:00' TO '2017-02-01T00\\:00\\:00'} OR (NOT(Approvable:'true') AND NOT(Description:'*alma*')) .SORT:DisplayName .TOP:5 .SKIP:10",
    )
  })

  describe('Segment syntaxes', () => {
    it('Term', () => {
      const queryInstance = new Query(q => q.term('test term'))
      expect(queryInstance.toString()).toBe('test term')
    })

    it('TypeIs', () => {
      const queryInstance = new Query(q => q.typeIs<Task>(Task))
      expect(queryInstance.toString()).toBe('TypeIs:Task')
    })

    it('Type', () => {
      const queryInstance = new Query(q => q.type<Task>(Task))
      expect(queryInstance.toString()).toBe('Type:Task')
    })

    it('InFolder', () => {
      const queryInstance = new Query(q => q.inFolder('a/b/c'))
      expect(queryInstance.toString()).toBe('InFolder:"a/b/c"')
    })

    it('InTree', () => {
      const queryInstance = new Query(q => q.inTree('a/b/c'))
      expect(queryInstance.toString()).toBe('InTree:"a/b/c"')
    })

    it('Equals', () => {
      const queryInstance = new Query(q => q.equals('DisplayName', 'test'))
      expect(queryInstance.toString()).toBe("DisplayName:'test'")
    })
    it('NotEquals', () => {
      const queryInstance = new Query(q => q.notEquals('DisplayName', 'test'))
      expect(queryInstance.toString()).toBe("NOT(DisplayName:'test')")
    })
    it('EqualsNested', () => {
      const queryInstance = new Query(q => q.equalsNested('Owner', 'DisplayName', 'test'))
      expect(queryInstance.toString()).toBe('Owner:{{DisplayName:test}}')
    })
    it('NotEqualsNested', () => {
      const queryInstance = new Query(q => q.notEqualsNested('Owner', 'DisplayName', 'test'))
      expect(queryInstance.toString()).toBe('NOT(Owner:{{DisplayName:test}})')
    })
    it('Between exclusive', () => {
      const queryInstance = new Query(q => q.between('Index', 1, 5))
      expect(queryInstance.toString()).toBe("Index:{'1' TO '5'}")
    })

    it('Between inclusive', () => {
      const queryInstance = new Query(q => q.between('Index', 10, 50, true, true))
      expect(queryInstance.toString()).toBe("Index:['10' TO '50']")
    })

    it('GreatherThan exclusive', () => {
      const queryInstance = new Query(q => q.greatherThan('Index', 10))
      expect(queryInstance.toString()).toBe("Index:>'10'")
    })

    it('GreatherThan inclusive', () => {
      const queryInstance = new Query(q => q.greatherThan('Index', 10, true))
      expect(queryInstance.toString()).toBe("Index:>='10'")
    })

    it('LessThan exclusive', () => {
      const queryInstance = new Query(q => q.lessThan('Index', 10))
      expect(queryInstance.toString()).toBe("Index:<'10'")
    })

    it('LessThan inclusive', () => {
      const queryInstance = new Query(q => q.lessThan('Index', 10, true))
      expect(queryInstance.toString()).toBe("Index:<='10'")
    })

    it('AND syntax', () => {
      const queryInstance = new Query(q => q.equals('Index', 1).and.equals('DisplayName', 'Test'))
      expect(queryInstance.toString()).toBe("Index:'1' AND DisplayName:'Test'")
    })

    it('OR syntax', () => {
      const queryInstance = new Query(q => q.equals('Index', 1).or.equals('DisplayName', 'Test'))
      expect(queryInstance.toString()).toBe("Index:'1' OR DisplayName:'Test'")
    })

    it('inner query syntax', () => {
      const queryInstance = new Query(q => q.equals('DisplayName', 'Test').and.query(inner => inner.equals('Index', 1)))
      expect(queryInstance.toString()).toBe("DisplayName:'Test' AND (Index:'1')")
    })

    it('inner query syntax with sub query', () => {
      const queryInstance = new Query(q =>
        q.equals('DisplayName', 'Test').and.query(new Query(inner => inner.equals('Index', 1))),
      )
      expect(queryInstance.toString()).toBe("DisplayName:'Test' AND (Index:'1')")
    })

    it('NOT syntax', () => {
      const queryInstance = new Query(q => q.equals('DisplayName', 'Test').and.not(inner => inner.equals('Index', 1)))
      expect(queryInstance.toString()).toBe("DisplayName:'Test' AND NOT(Index:'1')")
    })

    it('NOT syntax with sub query', () => {
      const queryInstance = new Query(q =>
        q.equals('DisplayName', 'Test').and.not(new Query(inner => inner.equals('Index', 1))),
      )
      expect(queryInstance.toString()).toBe("DisplayName:'Test' AND NOT(Index:'1')")
    })

    it('OrderBy syntax', () => {
      const queryInstance = new Query(q => q.sort('DisplayName'))
      expect(queryInstance.toString()).toBe(' .SORT:DisplayName')
    })

    it('OrderBy reserve', () => {
      const queryInstance = new Query(q => q.sort('DisplayName', true))
      expect(queryInstance.toString()).toBe(' .REVERSESORT:DisplayName')
    })

    it('Top syntax', () => {
      const queryInstance = new Query(q => q.top(50))
      expect(queryInstance.toString()).toBe(' .TOP:50')
    })

    it('Skip syntax', () => {
      const queryInstance = new Query(q => q.skip(10))
      expect(queryInstance.toString()).toBe(' .SKIP:10')
    })
  })
})
