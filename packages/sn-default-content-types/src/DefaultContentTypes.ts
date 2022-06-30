/**
 * The Content Repository contains many different types of *Content*. *Content* vary in structure and even in function.
 *
 * Different types of content contain different fields, are displayed with different views, and may also implement different business logic. The fields, views and business logic of a content is defined by its type - the Content Type.
 *
 * Content Types are defined in a type hierarchy: a Content Type may be inherited from another Content Type - thus automatically inheriting its fields.
 *
 * This module represents the above mentioned type hierarchy by Typescript types with the Content Types' Fields as properties. With Typescript classes we can derive types from another
 * inheriting its properties just like Content Types in the Content Repository. This module provides us to create an objects with a type so that we can validate on its properties by their
 * types or check the required ones.
 *
 */ /** */

import { ActionModel } from './ActionModel'
import * as ComplexTypes from './ComplexTypes'
import * as Enums from './Enums'

export type ContentReferenceField<T> = ComplexTypes.DeferredObject | T | number
export type ContentListReferenceField<T> = ComplexTypes.DeferredObject | T[] | number[]

export type BinaryField = ComplexTypes.MediaResourceObject

export type AllFieldNames = keyof (ContentType &
  GenericContent &
  ContentLink &
  File &
  DynamicJsonContent &
  ExecutableFile &
  HtmlTemplate &
  Image &
  PreviewImage &
  Settings &
  IndexingSettings &
  LoggingSettings &
  PortalSettings &
  SystemFile &
  Resource &
  Folder &
  ContentList &
  Aspect &
  ItemList &
  CustomList &
  MemoList &
  TaskList &
  Library &
  DocumentLibrary &
  ImageLibrary &
  Device &
  Domain &
  Domains &
  Email &
  OrganizationalUnit &
  PortalRoot &
  ProfileDomain &
  Profiles &
  RuntimeContentContainer &
  Sites &
  SmartFolder &
  SystemFolder &
  Resources &
  TrashBag &
  Workspace &
  Site &
  TrashBin &
  UserProfile &
  Group &
  ListItem &
  CustomListItem &
  Memo &
  Task &
  Query &
  User &
  Article &
  ArticleSection &
  CalendarEvent &
  EventList &
  Link &
  LinkList)

/**
 * A content type is a reusable set of fields you want to apply to certain content.
 */
export type ContentType = {
  /* A unique ID for the Content. */
  Id: number
  /* A unique ID for the Content. */
  ParentId?: number
  VersionId?: number
  Name: string
  CreatedById?: number
  ModifiedById?: number
  /* Latest version number. */
  Version?: string
  /* Content type path. */
  Path: string
  Depth?: number
  /* This field is true if content is in a system folder/trash or the content is a system folder/file. */
  IsSystemContent?: boolean
  /* Fully Qualified Name. */
  HandlerName?: string
  /* Name of the parent content type. */
  ParentTypeName?: string
  /* User friendly name of the content type. */
  DisplayName?: string
  /* Longer description of the content type. */
  Description?: string
  /* Content type icon. */
  Icon?: string
  /* The content type definition in XML format. */
  Binary?: ComplexTypes.MediaResourceObject
  /* Content creator. */
  CreatedBy?: ContentReferenceField<GenericContent>
  /* Content creation date. */
  CreationDate?: string
  /* Content was last modified by the given user. */
  ModifiedBy?: ContentReferenceField<GenericContent>
  /* Content was last modified on the given date. */
  ModificationDate?: string
  EnableLifespan?: boolean
  Actions?: ContentListReferenceField<ActionModel>
  Type: string
}

/**
 * This type is the base content type of the sensenet.
 */
export type GenericContent = {
  /* Unique Id for the content. */
  Id: number
  /* Id of the parent content. */
  ParentId?: number
  /* Id of the owner. */
  OwnerId?: number
  /* Content owner. */
  Owner?: ContentReferenceField<GenericContent>
  /* Database row Id of current version. */
  VersionId?: number
  /* Icon */
  Icon?: string
  /* Specify a name that will appear in the address bar of the browser. */
  Name: string
  /* Id of creator. */
  CreatedById?: number
  /* Id of last modifier. */
  ModifiedById?: number
  /* Version number. */
  Version?: string
  /* Content path in the repository. */
  Path: string
  /* Content level in the tree. Root level is 0. */
  Depth?: number
  /* This field is true if content is in a system folder/trash or the content is a system folder/file. */
  IsSystemContent?: boolean
  /* This field is true if the content is a file. */
  IsFile?: boolean
  /* This field is true if content can contain other content. */
  IsFolder?: boolean
  /* Content name. You can set any name you prefer without any restrictions. */
  DisplayName?: string
  /* Description of the content. */
  Description?: string
  /* If checked, content will not show up in navigation. */
  Hidden?: boolean
  /* Content order in navigation. Numbers closer to 0 will appear first. */
  Index?: number
  /* Specify whether you want to define starting and end date for the validity of this content. */
  EnableLifespan?: boolean
  /* This content will appear on the date you set if lifespan handling is enabled for this content. */
  ValidFrom?: string
  /* This content will disappear on the date you set if lifespan handling is enabled for this content. */
  ValidTill?: string
  /* You can get and set which content types are explicitly allowed to be created under this content. It is a local setting. */
  AllowedChildTypes?: ContentListReferenceField<GenericContent>
  /* You can get which content types are effective allowed to be created under this content. If there is no local setting, the global setting takes effect. */
  EffectiveAllowedChildTypes?: ContentListReferenceField<GenericContent>
  /* It shows the versioning mode of the current content. */
  VersioningMode?: Enums.VersioningMode[]
  /* Specify whether the system should create a new version whenever you create or modify a content below this content. */
  InheritableVersioningMode?: Enums.InheritableVersioningMode[]
  /* Content creator. */
  CreatedBy?: ContentReferenceField<GenericContent>
  /* Content creation date. */
  CreationDate?: string
  /* Content was last modified by this user. */
  ModifiedBy?: ContentReferenceField<GenericContent>
  /* Content was last modified on this date. */
  ModificationDate?: string
  /* It shows the approval mode of the current content. */
  ApprovingMode?: Enums.ApprovingMode[]
  /* Specify whether new or changed content below the current one should remain in a draft state until they have been approved. */
  InheritableApprovingMode?: Enums.InheritableApprovingMode[]
  /* It shows whether the content is checked out or not. */
  Locked?: boolean
  /* The user currently locking the content. */
  CheckedOutTo?: ContentReferenceField<GenericContent>
  /* You can disable trash for this content and its children. If set, you can not restore deleted content. */
  TrashDisabled?: boolean
  /* State of multi-step saving. */
  SavingState?: Enums.SavingState[]
  /* You can set extra data in this field which is useful when extending a content. */
  ExtensionData?: string
  /* Set this, if you would like to override the default browse application. */
  BrowseApplication?: ContentReferenceField<GenericContent>
  /* This fileld is true if the content is in 'pending' state and can be approved by the current user. */
  Approvable?: boolean
  /* Specify whether you would like to enable tagging capability for this content. */
  IsTaggable?: boolean
  /* List of tags and creators of them separated by commas. */
  Tags?: string
  /* Specify whether you would like to enable rating capability for this content. */
  IsRateable?: boolean
  RateStr?: string
  /* Average rate of the content. */
  RateAvg?: number
  /* Count of rates. */
  RateCount?: number
  Rate?: string
  /* This fileld is true if the content can be published by the current user. */
  Publishable?: boolean
  /* Content version history. */
  Versions?: ContentListReferenceField<GenericContent>
  /* Comments for a new version. */
  CheckInComments?: string
  /* The reason why the content was rejected. */
  RejectReason?: string
  /* The container workspace of the content. */
  Workspace?: ContentReferenceField<Workspace>
  BrowseUrl?: string

  Actions?: ContentListReferenceField<ActionModel>
  Type: string
  VersionModifiedBy?: ContentReferenceField<User>
  VersionModificationDate?: Date
  VersionCreatedBy?: ContentReferenceField<User>
  VersionCreationDate?: Date
}

/**
 * A content that propagates most of the Fields of another content.
 */
export type ContentLink = GenericContent & {
  /* Set this reference to the Content to link. */
  Link?: ContentReferenceField<GenericContent>
}

/**
 * A type for binary documents, images, etc.
 */
export type File = GenericContent & {
  /* The binary content of the document. */
  Binary?: ComplexTypes.MediaResourceObject
  /* Size of the binary document. */
  Size?: number
  /* The total amount of space the Document occupies, counting all versions. */
  FullSize?: number
  /* Read-only field for storing the number of pages in the document. It is filled by the document preview generator. */
  PageCount?: number
  MimeType?: string
  /* Stores data used for document preview (redaction, highlight, annotation shapes). This value can be modified by the document preview plugin. */
  Shapes?: string
  /* Stores data used for document preview (for example page rotation). This value can be modified by the document preview plugin. */
  PageAttributes?: string
  /* The text that is displayed as a watermark on the document preview. The format can be set by modifying the Document Preview settings. */
  Watermark?: string
}

/**
 */
export type DynamicJsonContent = File

/**
 * Only content of this type can be executed directly (e.g. aspx files).
 */
export type ExecutableFile = File

/**
 * HTML file containing a template html fragment for various controls, e.g. action links.
 */
export type HtmlTemplate = File & {
  /* Shows the contents of the html file as a text. */
  TemplateText?: string
}

/**
 * A special Document type for storing images.
 */
export type Image = File & {
  /* Keywords describing the image. */
  Keywords?: string
  /* Date the photo was taken, if applicable. */
  DateTaken?: string
  Width?: number
  Height?: number
}

/**
 * A special content type for storing preview images.
 */
export type PreviewImage = Image

/**
 * Content type for storing application or module settings in text format or in custom fields.
 */
export type Settings = File & {
  /* Switching this ON will prevent the creation of local settings with the same name preventing others to gain access to the contents of this settings file through inheritance. */
  GlobalOnly?: boolean
}

/**
 */
export type IndexingSettings = Settings & {
  /* Dynamically generated text extractor instance collection. */
  TextExtractorInstances?: string
}

/**
 */
export type LoggingSettings = Settings

/**
 */
export type PortalSettings = Settings

/**
 * A special file for internal use in the system.
 */
export type SystemFile = File

/**
 * String or binary resource used to localize the system. Its format is the same as the internal part of a standard .Net resx file.
 */
export type Resource = SystemFile & {
  /* The number of downloads. */
  Downloads?: number
}

/**
 * Use folders to group content.
 */
export type Folder = GenericContent

/**
 * Generic Content List type.
 */
export type ContentList = Folder & {
  /* XML definition for additional fields. */
  ContentListDefinition?: string
  /* The default View to use. */
  DefaultView?: string
  /* Select global content list views here that you want to offer users to choose from. */
  AvailableViews?: ContentListReferenceField<GenericContent>
  FieldSettingContents?: ContentListReferenceField<GenericContent>
  AvailableContentTypeFields?: ContentListReferenceField<GenericContent>
  /* Emails sent to this address will be imported as Email content into the Document Library. */
  ListEmail?: string
  /* Ctd-ContentListen-USExchangeSubscriptionId-Descriptione */
  ExchangeSubscriptionId?: string
  /* If checked new emails and attachments with the same name will overwrite existing items in list. Otherwise increment suffix is used in the name of new mail items. */
  OverwriteFiles?: boolean
  /* Select the appropriate option to group attachment files under folders or email content or not. */
  GroupAttachments?: Enums.GroupAttachments[]
  /* A separate .eml file will be created for every incoming email. */
  SaveOriginalEmail?: boolean
  /* Select the workflow to be executed on every incoming email. */
  IncomingEmailWorkflow?: ContentReferenceField<GenericContent>
  /* If set, only users that are members of any local group are able to send e-mails to this library. */
  OnlyFromLocalGroups?: boolean
  /* A relative path of a folder to store incoming e-mails. */
  InboxFolder?: string
  /* If a Visitor adds content to this list, this user will be set as the creator instead of the Visitor. This prevents visitors see each others' content. */
  OwnerWhenVisitor?: ContentReferenceField<User>
}

/**
 * Aspect base type.
 */
export type Aspect = ContentList & {
  /* Definition of the extension in XML format. */
  AspectDefinition?: string
}

/**
 * Base type for item lists. Choose a type inheriting from this to create list of items.
 */
export type ItemList = ContentList

/**
 * Use this type to create custom Lists of content with user-defined columns.
 */
export type CustomList = ItemList

/**
 * A List type for storing Memos.
 */
export type MemoList = ItemList

/**
 * A List type for storing Tasks.
 */
export type TaskList = ItemList

/**
 * A base type for special List types for storing documents such as Document Library or Image Library.
 */
export type Library = ContentList

/**
 * A special List for storing documents.
 */
export type DocumentLibrary = Library

/**
 * A special List for storing images.
 */
export type ImageLibrary = Library & {
  /* Select cover image */
  CoverImage?: ContentReferenceField<Image>
}

/**
 * This content type is for defining different devices to browse the portal from - e.g. tablet or different phone types.
 */
export type Device = Folder & {
  /* A regular expression to match the user agent string of the browser. */
  UserAgentPattern?: string
}

/**
 * A centrally-managed group of users and/or computers. sensenet has a built-in domain (BuiltIn), but you can syncronyze external LDAP directories as well.
 */
export type Domain = Folder & {
  /* GUID of corresponding AD object. */
  SyncGuid?: string
  /* Date of last synchronization. */
  LastSync?: string
}
/**
 * This is the container type for Domains. Only a single instance is allowed at /Root/IMS.
 */
export type Domains = Folder

/**
 * Email content type containing attachments as children content.
 */
export type Email = Folder & {
  /* Sender name and address. */
  From?: string
  /* Body of email. */
  Body?: string
  /* Date of sending. */
  Sent?: string
}

/**
 * Organizational Unit (OU) provides a way of classifying objects located in directories.
 */
export type OrganizationalUnit = Folder & {
  /* GUID of corresponding AD object. */
  SyncGuid?: string
  /* Date of last synchronization. */
  LastSync?: string
}

/**
 * Sense/Net Content Repository Master node. One installation can have only one Portal Root.
 */
export type PortalRoot = Folder

/**
 * Container for user profiles.
 */
export type ProfileDomain = Folder

/**
 * This is the container type for profiles. Only a single instance is allowed at /Root/Profiles.
 */
export type Profiles = Folder

/**
 * For internal use only.
 */
export type RuntimeContentContainer = Folder

/**
 * This is the container type for sites. Only a single instance is allowed at /Root/Sites.
 */
export type Sites = Folder

/**
 * Use smart folders to group information (content) by Repository query.
 */
export type SmartFolder = Folder & {
  /* Please give a query here that you want to use for collecting the children of this smart folder. */
  Query?: string
  /* If autofilters are enabled, system content will be filtered from the query. */
  EnableAutofilters?: Enums.EnableAutofilters[]
  /* If lifespan filter is enabled, only valid content will be in the result. */
  EnableLifespanFilter?: Enums.EnableLifespanFilter[]
}

/**
 * System Folders provide a way to store configuration and logic.
 */
export type SystemFolder = Folder

/**
 * This is the container type for resources. Only a single instance is allowed at /Root/Localization.
 */
export type Resources = SystemFolder

/**
 * An atomic container for deleted items stored for undeletion.
 */
export type TrashBag = Folder & {
  /* The bag must be kept until this date. */
  KeepUntil?: string
  /* The path where the bag content were deleted from. */
  OriginalPath?: string
  /* Ctd-TrashBagen-USWorkspaceRelativePath-Description */
  WorkspaceRelativePath?: string
  /* Ctd-TrashBagen-USWorkspaceId-Description */
  WorkspaceId?: number
  /* The actual deleted content inside this trash bag. */
  DeletedContent?: ContentReferenceField<GenericContent>
}

/**
 * Collaborative workspace root.
 */
export type Workspace = Folder & {
  /* The person responsible for the project. */
  Manager?: ContentReferenceField<User>
  Deadline?: string
  /* This workspace is currently active. */
  IsActive?: boolean
  WorkspaceSkin?: ContentReferenceField<GenericContent>
  /* This workspace is currently in a critical status. */
  IsCritical?: boolean
  /* This workspace is configured to contain a wall - this indicates that posts are created under this workspace if Content are shared anywhere below this path. */
  IsWallContainer?: boolean
  IsFollowed?: boolean
}

/**
 * The Site provides a primary entry point to your Portal.
 */
export type Site = Workspace & {
  /* Please define the default language of this site. */
  Language?: Enums.Language[]
  /* Enable this to allow user browser settings override default site language settings. */
  EnableClientBasedCulture?: boolean
  /* Enable this to allow user language settings override default site language settings. */
  EnableUserBasedCulture?: boolean
  /* Select the URLs to associate with this Site. */
  UrlList?: string
  /* If set, the site will use this start page instead of the default. */
  StartPage?: ContentReferenceField<GenericContent>
  /* The login page to display when a user tries to access restricted Content (Forms authentication only). */
  LoginPage?: ContentReferenceField<GenericContent>
  SiteSkin?: ContentReferenceField<GenericContent>
  /* If set, content under this site can only be accessed via this site and not via other sites using a Root relative path. */
  DenyCrossSiteAccess?: boolean
}

/**
 * The system trash bin content type.
 */
export type TrashBin = Workspace & {
  MinRetentionTime?: number
  /* Set the size quote for the trash bin (Megabytes). */
  SizeQuota?: number
  /* The maximum number of nodes accepted for trash in a single operation. */
  BagCapacity?: number
}

/**
 * Workspace for handling all information and data for a user.
 */
export type UserProfile = Workspace & {
  User?: ContentReferenceField<User>
}

/**
 * You can categorize users and groups into groups according to any criteria.
 */
export type Group = GenericContent & {
  /* The members of this group. */
  Members?: ContentListReferenceField<User | Group>
  /* GUID of corresponding AD object. */
  SyncGuid?: string
  /* Date of last synchronization. */
  LastSync?: string
}

/**
 * Base content type for list items.
 */
export type ListItem = GenericContent

/**
 * Content type for custom listitems.
 */
export type CustomListItem = ListItem & {
  WorkflowsRunning?: boolean
}

/**
 * A content type for short memos or posts on a subject.
 */
export type Memo = ListItem & {
  /* Please set the due date of the memo. */
  Date?: string
  /* Type of the memo. */
  MemoType?: Enums.MemoType[]
  /* A list of content this memo pertains to. */
  SeeAlso?: ContentListReferenceField<GenericContent>
}
/**
 * A content type for defining tasks.
 */
export type Task = ListItem & {
  StartDate?: string
  DueDate?: string
  /* List of internal stakeholders. */
  AssignedTo?: ContentListReferenceField<User>
  Priority?: Enums.Priority[]
  Status?: Enums.Status[]
  /* Completion percentage of the task. */
  TaskCompletion?: number
  /* Number of remaining days. */
  RemainingDays?: number
  DueText?: string
  /* Css class */
  DueCssClass?: string
}

/**
 * Content Type for storing Content Queries
 */
export type Query = GenericContent & {
  /* Query text. */
  Query?: string
  /* Public queries are stored under the workspace, private queries are stored under the user profile. */
  QueryType?: Enums.QueryType[]
  /* Filters object used by search query builder */
  UiFilters?: string
}

/**
 * The basic user type of the sensenet. Use it for intranet and extranet users.
 */
export type User = GenericContent & {
  /* The name that the user has to type in on login forms (in some cases along with the domain name). It has to be unique under a domain. */
  LoginName?: string
  JobTitle?: string
  /* User account is enabled. */
  Enabled?: boolean
  /* The domain of the user. */
  Domain?: string
  /* The e-mail of the user. */
  Email?: string
  /* Full name of the user (e.g. John Smith). */
  FullName?: string
  ImageRef?: ContentReferenceField<GenericContent>
  ImageData?: ComplexTypes.MediaResourceObject
  /* Avatar image of user. */
  Avatar?: { Url: string }
  /* User password. */
  Password?: string
  /* GUID of corresponding AD object. */
  SyncGuid?: string
  /* Date of last synchronization. */
  LastSync?: string
  /* Captcha text entered by the user. */
  Captcha?: string
  /* Manager of the user. */
  Manager?: ContentReferenceField<User>
  /* Department of employee. */
  Department?: string
  /* Spoken languages. */
  Languages?: string
  /* Phone number. (e.g. +123456789 or 1234). */
  Phone?: string
  /* Select one. */
  Gender?: Enums.Gender[]
  /* Select one. */
  MaritalStatus?: Enums.MaritalStatus[]
  BirthDate?: string
  /* List of educations - e.g. high school, university. */
  Education?: string
  TwitterAccount?: string
  /* http://www.facebook.com/USERNAME. */
  FacebookURL?: string
  /* http://www.linkedin.com/USERNAME. */
  LinkedInURL?: string
  /* Language used to display texts on the site, if it is available. */
  Language?: Enums.Language[]
  /* List of workspaces followed by the user. */
  FollowedWorkspaces?: ContentListReferenceField<Workspace>
  /* Path of the user's personal workspace. */
  ProfilePath?: string
  /* Date and time of when the user logged out from all devices. */
  LastLoggedOut?: string
}

/**
 * The basic text based content type of the sensenet.
 */
export type Article = GenericContent & {
  /* Subtitle of article */
  Subtitle?: string
  /* Name of the author */
  Author?: string
  /* Lead text of article */
  Lead?: string
  /* Body text of article. */
  Body?: string
  /* This field is true if content is a highlighted article */
  Pinned?: boolean
  /* Keywords describing the article. */
  Keywords?: string
  ImageRef?: ContentReferenceField<GenericContent>
  ImageData?: ComplexTypes.MediaResourceObject
  /* Article lead image. */
  Image?: { Url: string }
}

/**
 * Content type for group articles.
 */
export type ArticleSection = Folder

/* Content type for calendar events */
export type CalendarEvent = ListItem & {
  /* Location of an event */
  Location?: string
  /* Starting date of an event */
  StartDate?: string
  /* End date of an event */
  EndDate?: string
  /* This field is true if content is an all day event */
  AllDay?: boolean
  /* Type of event */
  EventType?: Enums.EventType[]
}

/**
 * Content list type for grouping calendar events
 */
export type EventList = ContentList

/* Content type for external links  */
export type Link = ListItem & {
  Url?: string
}

/**
 * Content list type for grouping external links
 */
export type LinkList = ContentList

/**
 * Defines an event and a 3rd party service that should be called when the event is fired.
 */
export type WebhookSubscription = GenericContent & {
  /* Http method */
  WebHookHttpMethod: Enums.HttpMethod[]
  /* Url */
  WebHookUrl: string
  /* Triggers */
  WebHookFilter: string
  /* HTTP headers */
  WebHookHeaders: string
  /* Status */
  Enabled: boolean

  IsValid: boolean

  InvalidFields: string
  /* % of successful calls */
  SuccessfulCalls: number
  /* Custom payload */
  WebHookPayload: string
}
