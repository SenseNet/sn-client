# ✨ sensenet app

**sensenet app** is a single page application that contains the most important CMS and the most useful admin functions.

## 🔑 Login, change repository

To manage a repository, you have to login in first. You have to provide

- Your username (e.g. _my-domain\\my-user_ or _myprofile@myorganization.com_)
- The password for the user
- The repository URL that you want to manage (e.g. _https://my-sensenet-installation.com_)
  Once you've logged in, the repository and the last username will be saved into your _personal settings_.

If you want to use an another repository, you can switch with the repository selector on the top left corner. (or login to a new repository with the **Another repository** link)

Your repository sessions will be managed individually, you can use multiple repositories simultaneously. The repository selector will also indicates the current session state.

If you want to log out from the current repository, you can do that with the 'Log out' button at the bottom of the left drawer.

## ⚙ Personal settings

The application stores several settings in your browser's _local storage_ - like your repository history or some of your UI customizations.
You can edit these with the "Personal settings" button at the bottom left of the drawer. The settings are stored in a JSON format, but you can ask for code completition with _ctrl+space_

### Responsive settings

You can use the application on a _desktop_ PC, _tablet_ or _mobile_ and you can customize most of the settings on each device in the corresponding settings section. You will also have a _default_ section - undefined settings will fall back to it.

### Repositories, last repository

The repositories you've visited will be also saved in your Personal Settings - you can add a meaningful _"displayName"_ to them here

## 🌍 Content

You can browse the whole repository with the **Content** menu.
You can adjust the Content view in the personal setting's _"content"_ section.

## 🌈 Command palette

The command palette is useful is you want to search in the repository, navigate to a specific page or execute a specific command on the current content.
You can activate the command palette from the top right **">\_"** icon - or the **ctrl-p** shortcut.

### Search by path

You can search content by its path if you start typing with "/Root", you will get completition with one level below

### Search using a content query

If you start typing a Content query term (that starts with a '+' sign), the term will be executed as a content query.

## 🔍 Search

(Coming soon...)

## 🔧 Settings

(Coming soon...)

## ℹ Version info

(Coming soon...)
