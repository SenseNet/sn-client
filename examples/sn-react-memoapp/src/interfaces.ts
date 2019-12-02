export interface NewMemo {
  DisplayName: string
  Description: string
}

export interface AddNewprops {
  show: boolean
  onCreate: (memo: NewMemo) => void
  onClose: () => void
}
