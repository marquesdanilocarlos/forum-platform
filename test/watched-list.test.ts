import { WatchedList } from '@/core/entities/watched-list'

export class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Testes de watched list', () => {
  it('Deve permitir adicionar um item à lista', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    expect(list.getItems()).toHaveLength(4)
    expect(list.getNewItems()).toEqual([4])
  })

  it('Deve permitir remover um item da lista', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(2)
    expect(list.getItems()).toHaveLength(2)
    expect(list.getRemovedItems()).toEqual([2])
  })

  it('Deve permitir adicionar um item à lista mesmo que ele já tenha sido adicionado anteriormente', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.remove(2)
    list.add(2)

    expect(list.getItems()).toHaveLength(3)
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('Deve permitir remover um item da lista mesmo que ele já tenha sido removido anteriormente', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.add(4)
    list.remove(4)

    expect(list.getItems()).toHaveLength(3)
    expect(list.getNewItems()).toEqual([])
    expect(list.getRemovedItems()).toEqual([])
  })

  it('Deve atualizar itens da lista', () => {
    const list = new NumberWatchedList([1, 2, 3])
    list.update([3, 5, 7])

    expect(list.getItems()).toHaveLength(3)
    expect(list.getNewItems()).toEqual([5, 7])
    expect(list.getRemovedItems()).toEqual([1, 2])
  })
})
