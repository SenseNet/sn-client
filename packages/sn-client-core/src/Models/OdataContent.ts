import { ContentReferenceField, GenericContent, DeferredObject } from '@sensenet/default-content-types'
import { RepositoryConfiguration } from '../Repository/RepositoryConfiguration'
import { ODataParams } from './ODataParams'

export type SelectableFieldTypes = string | number | boolean | Date | undefined

export type SelectableFields<T> = Array<keyof T>

export type ExpandableFields<T> = Array<
  {
    [K in keyof T]: T[K] extends SelectableFieldTypes ? never : K
  }[keyof T]
>

export type ExpandedValue<T, K extends ExpandableFields<T>[number]> = T[K] extends ContentReferenceField<infer U>
  ? U extends number[]
    ? never
    : U
  : never

export const b: ExpandableFields<GenericContent> = ['Owner', 'AllowedChildTypes']

export type ODataContent<T, TSelect extends SelectableFields<T>, TExpand extends ExpandableFields<T>> = {
  [K in TSelect[number]]: K extends TExpand[number]
    ? NonNullable<ExpandedValue<T, K>>
    : T[K] extends SelectableFieldTypes
    ? NonNullable<T[K]>
    : DeferredObject
} &
  {
    [K in TExpand[number]]: NonNullable<ExpandedValue<T, K>>
  }

export const c: ODataContent<GenericContent, ['Id'], ['Versions', 'Actions']> = {
  Id: 2,
  Versions: [],
  Actions: [],
  // Workspace: {},
}

export type FromOdataParams<T, TParams extends ODataParams<T>> = TParams extends { select: infer S; expand: infer X }
  ? S extends Array<keyof T>
    ? X extends ExpandableFields<T>
      ? ODataContent<T, S, X>
      : unknown
    : unknown
  : TParams extends { select: infer U }
  ? U extends Array<keyof T>
    ? ODataContent<T, U, []>
    : unknown
  : (TParams extends { expand: infer U2 }
      ? (U2 extends ExpandableFields<T> ? ODataContent<T, [], U2> : never)
      : unknown)

export const a: FromOdataParams<
  GenericContent,
  {
    select: ['Id', 'Path', 'Name', 'Actions']
    // expand: ['Actions']
  }
> = {
  Id: 3,
  Path: 'alma',
  Name: 'asd',
  Actions: [],
}

export type FromRepositoryConfig<T, TConfig extends RepositoryConfiguration> = TConfig extends {
  requiredSelect: infer S
  defaultExpand: infer X
}
  ? S extends Array<keyof T>
    ? X extends ExpandableFields<T>
      ? ODataContent<T, S, X>
      : unknown
    : unknown
  : never

const cfg: RepositoryConfiguration = { defaultExpand: ['AllowedChildTypes'], requiredSelect: ['Id', 'Path'] } as any
export const r: FromRepositoryConfig<GenericContent, typeof cfg> = {
  Actions: [],
  Id: 3,
  Path: 2345,
}
