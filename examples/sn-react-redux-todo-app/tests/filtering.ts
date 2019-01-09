// import { Reducers } from '@sensenet/redux'
// import * as Chai from 'chai'
// import { combineReducers, createStore } from 'redux'
// import { getErrorMessage, getIsFetching, getVisibleTodos, listByFilter } from '../reducers/filtering'
// const expect = Chai.expect

// describe('#filtering', () => {
//   let state: any
//   const sensenet = Reducers.sensenet
//   const myReducer = combineReducers({
//     sensenet,
//     listByFilter,
//   })
//   const store = createStore(myReducer, state)
//   console.log(store)

//   beforeEach(() => {
//     state = {
//       sensenet: {
//         children: {
//           entities: {
//             5145: {
//               DisplayName: 'Duis commodo nunc',
//               Id: 5145,
//               Status: ['active'],
//               Type: 'Task',
//             },
//             5146: {
//               DisplayName: 'Maecenas nec pulvinar',
//               Id: 5146,
//               Status: ['active'],
//               Type: 'Task',
//             },
//             5147: {
//               DisplayName: 'Nulla pharetra',
//               Id: 5147,
//               Status: ['active'],
//               Type: 'Task',
//             },
//           },
//           error: null,
//           ids: [5145, 5146, 5147],
//           isFetching: false,
//         },
//       },
//       listByFilter: {
//         Active: {
//           ids: [5145, 5146, 5147],
//           errorMessage: null,
//           isFetching: false,
//         },
//         All: {
//           ids: [5145, 5146, 5147],
//           errorMessage: null,
//           isFetching: false,
//         },
//         Completed: {
//           ids: [],
//           errorMessage: null,
//           isFetching: false,
//         },
//       },
//     }
//   })

//   describe('#getVisibleTodos', () => {
//     const task = {
//       DisplayName: 'Duis commodo nunc',
//       Id: 5145,
//       Status: ['active'],
//       Type: 'Task',
//     }
//     it('should return the states first item by all filter', () => {
//       expect(getVisibleTodos(state, 'All')[0]).to.be.deep.equal(task)
//     })
//     it('should return the states first item by active filter', () => {
//       expect(getVisibleTodos(state, 'Active')[0]).to.be.deep.equal(task)
//     })
//     it('should return an empty array with completed filter', () => {
//       expect(getVisibleTodos(state, 'Completed')).to.be.deep.equal([])
//     })
//   })
//   describe('#getIsFetching reducer', () => {
//     it('should return the initial state', () => {
//       expect(getIsFetching(state, 'All')).to.be.eq(false)
//     })
//   })
//   describe('#getErrorMessage reducer', () => {
//     it('should return the initial state', () => {
//       expect(getErrorMessage(state, 'All')).to.be.eq(undefined)
//     })
//   })
// })
