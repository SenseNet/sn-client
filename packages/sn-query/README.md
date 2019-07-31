# @sensenet/query

[![NPM version](https://img.shields.io/npm/v/@sensenet/query.svg?style=flat)](https://www.npmjs.com/package/@sensenet/query)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/query.svg?style=flat)](https://www.npmjs.com/package/@sensenet/query)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/query

# NPM
npm install @sensenet/query
```

## Usage

The package allows you to create strongly typed content queries that will be evaluated into sensenet queries

Usage example:

```ts
const query = new Query(
  q =>
    q
      .typeIs<Task>(Task) // adds '+TypeIs:Task' and Typescript type cast
      .and.equals('DisplayName', 'Unicorn') // adds +Title:Unicorn
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

console.log(query.toString())
// "TypeIs:Task AND DisplayName:'Unicorn' AND ModificationDate:{'2017-01-01T00\\:00\\:00' TO '2017-02-01T00\\:00\\:00'} OR (NOT(Approvable:'true') AND NOT(Description:'*alma*')) .SORT:DisplayName .TOP:5 .SKIP:10"
```
