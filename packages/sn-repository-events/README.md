# @sensenet/repository-events

> This NPM package contains _event observables_ that can be used for tracking sensenet repository events.

[![NPM version](https://img.shields.io/npm/v/@sensenet/repository-events.svg?style=flat)](https://www.npmjs.com/package/@sensenet/repository-events)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/repository-events.svg?style=flat)](https://www.npmjs.com/package/@sensenet/repository-events)
[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

## Install

```bash
# Yarn
yarn add @sensenet/repository-events

# NPM
npm install @sensenet/repository-events
```

## Usage

```ts
const repository = new Repository({})
const eventHub = new EventHub(repository)

// subscribe to a Content Created event
eventHub.onContentCreated.subscribe(createdContent => {
  console.log('New Content created:', createdContent)
})
```

The available events are:

- onContentCreated
- onContentCreateFailed
- onContentModified
- onContentModificationFailed
- onContentLoaded
- onContentDeleted
- onContentDeleteFailed
- onCustomActionExecuted
- onCustomActionFailed
- onContentMoved
- onContentMoveFailed
- onContentCopyFailed
- onUploadFinished
- onUploadFailed
