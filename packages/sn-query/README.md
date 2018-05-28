# sn-query
Client side content query builder package for sensenet

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-query.svg?branch=master)](https://travis-ci.org/SenseNet/sn-query)
[![codecov](https://codecov.io/gh/SenseNet/sn-query/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-query)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-query.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/@sensenet/query.svg?style=flat)](https://www.npmjs.com/package/@sensenet/query)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/query.svg?style=flat)](https://www.npmjs.com/package/@sensenet/query)
[![License](https://img.shields.io/github/license/SenseNet/sn-query.svg?style=flat)](https://github.com/sn-query/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

## Installation

```shell
npm install @sensenet/query
```

## Usage

The package allows you to create strongly typed content queries that will be evaluated into sensenet ECM queries

Usage example:

```ts
const query = new Query((q) =>
        q.typeIs<Task>(Task)   // adds '+TypeIs:Task' and Typescript type cast
            .and
            .equals("DisplayName", "Unicorn")	// adds +Title:Unicorn
            .and
            .between("ModificationDate", "2017-01-01T00:00:00", "2017-02-01T00:00:00")
            .or
            .query((sub) => sub // Grouping
                .notEquals("Approvable", true)
                .and
                .notEquals("Description", "*alma*"), // Contains with wildcards
        )
            .sort("DisplayName")
            .top(5)			// adds .TOP:5
            .skip(10),		// adds .SKIP:10
    );

console.log(query.toString());
// "TypeIs:Task AND DisplayName:'Unicorn' AND ModificationDate:{'2017-01-01T00\\:00\\:00' TO '2017-02-01T00\\:00\\:00'} OR (NOT(Approvable:'true') AND NOT(Description:'*alma*')) .SORT:DisplayName .TOP:5 .SKIP:10"

```
