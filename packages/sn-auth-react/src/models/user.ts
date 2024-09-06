export interface User {
  Id: number
  Path: string
  FullName: string
  LoginName: string
  Avatar: Avatar
  DisplayName: string
  Name: string
  Email: string
}

export interface Avatar {
  Url: string
}