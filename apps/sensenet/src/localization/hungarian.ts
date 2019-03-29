import { DeepPartial } from '@sensenet/client-utils'

const values: DeepPartial<typeof import('./default').default> = {
  commandPalette: {
    title: 'Command palette megnyitása',
  },
  contentContextMenu: {
    copy: 'Másolás',
    delete: 'Törlés',
    editProperties: 'Tulajdonságok szerkesztése',
    move: 'Áthelyezés',
    open: 'Megnyitás',
  },
  login: {
    loginTitle: 'Bejelentkezés',
    loginButtonTitle: 'Bejelentkezés',
    greetings: 'Üdvözlet, {0}!',
    loggingInTo: 'Bejelentkezés ide: {0}...',
    loginFailed: 'A bejelentkezés nem sikerült.',
    userNameLabel: 'Felhasználónév',
    userNameHelperText: 'A rendszerben tárolt felhasználónév',
    passwordLabel: 'Jelszó',
    passwordHelperText: 'A felhasználóhoz tartozó jelszó',
    repositoryLabel: 'Elérési út',
    repositoryHelperText: 'A repository teljes elérési útja (pl.: https://my-sensenet.com)',
  },
  personalSettings: {
    languageTitle: 'A választott nyelv megnevezése',
    themeTitle: 'Sötét vagy világot színséma beállítása',
    commandPaletteTitle: 'Command palette beállításai',
    commandPaletteEnable: 'Command palette endedélyezése vagy tiltása',
    commandPaletteWrapQuery: 'Command palette lekérdezés sablonok beállítása',
    contentTitle: 'Tartalom böngészésére vonatkozó beállíátsok',
    contentFields: 'Megjelenítendő mezők beállítása',
    contentBrowseType:
      'Böngészés típus kiválasztása: simple (egyszerű), explore (lista és fa) vagy commander (dupla paneles)',
    drawer: 'Oldalsó menüsáv beállíátsai',
    drawerEnable: 'Menüsáv engedélyezése / tiltása',
    drawerItems: 'Megjelenítendő elemek',
    drawerType: 'Menüsáv típusa: mini-variant (összecsukható), permanent (mindig kibonttott), temporary (ideiglenes) ',
    lastRepository: 'A legutóbb használt repository url',
    platformDependentTitle: 'Platform függő beállítások',
    repositoryTitle: 'Repository beállítások',
    repositoryUrl: 'A repository elérési útvonala, pl.: https://my-sensenet-repository.org',
    repositoryLoginName: 'A legutóbb használt bejelentkezési név',
    repositoryDisplayName: 'Egy tetszőleges megjelenítendő név',
  },
}

export default values
