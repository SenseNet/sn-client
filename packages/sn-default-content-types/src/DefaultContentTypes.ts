/**
 * The Content Repository contains many different types of *Content*. *Content* vary in structure and even in function.
 *
 * Different types of content contain different fields, are displayed with different views, and may also implement different business logic. The fields, views and business logic of a content is defined by its type - the Content Type.
 *
 * Content Types are defined in a type hierarchy: a Content Type may be inherited from another Content Type - thus automatically inheriting its fields.
 *
 * This module represents the above mentioned type hierarchy by Typescript classes with the Content Types' Fields as properties. With Typescript classes we can derive types from another
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
  User)

/**
 * A content type is a reusable set of fields you want to apply to certain content.
 */
export class ContentType {
  /* A unique ID for the Content. */
  public Id!: number
  /* A unique ID for the Content. */
  public ParentId?: number
  public VersionId?: number
  public Name!: string
  public CreatedById?: number
  public ModifiedById?: number
  /* Latest version number. */
  public Version?: string
  /* Content type path. */
  public Path!: string
  public Depth?: number
  /* This field is true if content is in a system folder/trash or the content is a system folder/file. */
  public IsSystemContent?: boolean
  /* Fully Qualified Name. */
  public HandlerName?: string
  /* Name of the parent content type. */
  public ParentTypeName?: string
  /* User friendly name of the content type. */
  public DisplayName?: string
  /* Longer description of the content type. */
  public Description?: string
  /* Content type icon. */
  public Icon?: string
  /* The content type definition in XML format. */
  public Binary?: ComplexTypes.MediaResourceObject
  /* Content creator. */
  public CreatedBy?: ContentReferenceField<GenericContent>
  /* Content creation date. */
  public CreationDate?: string
  /* Content was last modified by the given user. */
  public ModifiedBy?: ContentReferenceField<GenericContent>
  /* Content was last modified on the given date. */
  public ModificationDate?: string
  public EnableLifespan?: boolean

  public Actions?: ContentListReferenceField<ActionModel>
  public Type!: string
}

/**
 * This type is the base content type of the sensenet.
 */
export class GenericContent {
  /* Unique Id for the content. */
  public Id!: number
  /* Id of the parent content. */
  public ParentId?: number
  /* Id of the owner. */
  public OwnerId?: number
  /* Content owner. */
  public Owner?: ContentReferenceField<GenericContent>
  /* Database row Id of current version. */
  public VersionId?: number
  /* Icon */
  public Icon?: string
  /* Specify a name that will appear in the address bar of the browser. */
  public Name!: string
  /* Id of creator. */
  public CreatedById?: number
  /* Id of last modifier. */
  public ModifiedById?: number
  /* Version number. */
  public Version?: string
  /* Content path in the repository. */
  public Path!: string
  /* Content level in the tree. Root level is 0. */
  public Depth?: number
  /* This field is true if content is in a system folder/trash or the content is a system folder/file. */
  public IsSystemContent?: boolean
  /* This field is true if content can contain other content. */
  public IsFolder?: boolean
  /* Content name. You can set any name you prefer without any restrictions. */
  public DisplayName?: string
  /* Description of the content. */
  public Description?: string
  /* If checked, content will not show up in navigation. */
  public Hidden?: boolean
  /* Content order in navigation. Numbers closer to 0 will appear first. */
  public Index?: number
  /* Specify whether you want to define starting and end date for the validity of this content. */
  public EnableLifespan?: boolean
  /* This content will appear on the date you set if lifespan handling is enabled for this content. */
  public ValidFrom?: string
  /* This content will disappear on the date you set if lifespan handling is enabled for this content. */
  public ValidTill?: string
  /* You can get and set which content types are explicitly allowed to be created under this content. It is a local setting. */
  public AllowedChildTypes?: ContentListReferenceField<GenericContent>
  /* You can get which content types are effective allowed to be created under this content. If there is no local setting, the global setting takes effect. */
  public EffectiveAllowedChildTypes?: ContentListReferenceField<GenericContent>
  /* It shows the versioning mode of the current content. */
  public VersioningMode?: Enums.VersioningMode[]
  /* Specify whether the system should create a new version whenever you create or modify a content below this content. */
  public InheritableVersioningMode?: Enums.InheritableVersioningMode[]
  /* Content creator. */
  public CreatedBy?: ContentReferenceField<GenericContent>
  /* Content creation date. */
  public CreationDate?: string
  /* Content was last modified by this user. */
  public ModifiedBy?: ContentReferenceField<GenericContent>
  /* Content was last modified on this date. */
  public ModificationDate?: string
  /* It shows the approval mode of the current content. */
  public ApprovingMode?: Enums.ApprovingMode[]
  /* Specify whether new or changed content below the current one should remain in a draft state until they have been approved. */
  public InheritableApprovingMode?: Enums.InheritableApprovingMode[]
  /* It shows whether the content is checked out or not. */
  public Locked?: boolean
  /* The user currently locking the content. */
  public CheckedOutTo?: ContentReferenceField<GenericContent>
  /* You can disable trash for this content and its children. If set, you can not restore deleted content. */
  public TrashDisabled?: boolean
  /* State of multi-step saving. */
  public SavingState?: Enums.SavingState[]
  /* You can set extra data in this field which is useful when extending a content. */
  public ExtensionData?: string
  /* Set this, if you would like to override the default browse application. */
  public BrowseApplication?: ContentReferenceField<GenericContent>
  /* This fileld is true if the content is in 'pending' state and can be approved by the current user. */
  public Approvable?: boolean
  /* Specify whether you would like to enable tagging capability for this content. */
  public IsTaggable?: boolean
  /* List of tags and creators of them separated by commas. */
  public Tags?: string
  /* Specify whether you would like to enable rating capability for this content. */
  public IsRateable?: boolean
  public RateStr?: string
  /* Average rate of the content. */
  public RateAvg?: number
  /* Count of rates. */
  public RateCount?: number
  public Rate?: string
  /* This fileld is true if the content can be published by the current user. */
  public Publishable?: boolean
  /* Content version history. */
  public Versions?: ContentListReferenceField<GenericContent>
  /* Comments for a new version. */
  public CheckInComments?: string
  /* The reason why the content was rejected. */
  public RejectReason?: string
  /* The container workspace of the content. */
  public Workspace?: ContentReferenceField<Workspace>
  public BrowseUrl?: string

  public Actions?: ContentListReferenceField<ActionModel>
  public Type!: string
  public VersionModifiedBy?: ContentReferenceField<User>
  public VersionModificationDate?: Date
  public VersionCreatedBy?: ContentReferenceField<User>
  public VersionCreationDate?: Date
}

/**
 * A content that propagates most of the Fields of another content.
 */
export class ContentLink extends GenericContent {
  /* Set this reference to the Content to link. */
  public Link?: ContentReferenceField<GenericContent>
}

/**
 * A type for binary documents, images, etc.
 */
export class File extends GenericContent {
  /* The binary content of the document. */
  public Binary?: ComplexTypes.MediaResourceObject
  /* Size of the binary document. */
  public Size?: number
  /* The total amount of space the Document occupies, counting all versions. */
  public FullSize?: number
  /* Read-only field for storing the number of pages in the document. It is filled by the document preview generator. */
  public PageCount?: number
  public MimeType?: string
  /* Stores data used for document preview (redaction, highlight, annotation shapes). This value can be modified by the document preview plugin. */
  public Shapes?: string
  /* Stores data used for document preview (for example page rotation). This value can be modified by the document preview plugin. */
  public PageAttributes?: string
  /* The text that is displayed as a watermark on the document preview. The format can be set by modifying the Document Preview settings. */
  public Watermark?: string
}

/**
 */
export class DynamicJsonContent extends File {}

/**
 * Only content of this type can be executed directly (e.g. aspx files).
 */
export class ExecutableFile extends File {}

/**
 * HTML file containing a template html fragment for various controls, e.g. action links.
 */
export class HtmlTemplate extends File {
  /* Shows the contents of the html file as a text. */
  public TemplateText?: string
}

/**
 * A special Document type for storing images.
 */
export class Image extends File {
  /* Keywords describing the image. */
  public Keywords?: string
  /* Date the photo was taken, if applicable. */
  public DateTaken?: string
  public Width?: number
  public Height?: number
}

/**
 * A special content type for storing preview images.
 */
export class PreviewImage extends Image {}

/**
 * Content type for storing application or module settings in text format or in custom fields.
 */
export class Settings extends File {
  /* Switching this ON will prevent the creation of local settings with the same name preventing others to gain access to the contents of this settings file through inheritance. */
  public GlobalOnly?: boolean
}

/**
 */
export class IndexingSettings extends Settings {
  /* Dynamically generated text extractor instance collection. */
  public TextExtractorInstances?: string
}

/**
 */
export class LoggingSettings extends Settings {}

/**
 */
export class PortalSettings extends Settings {}

/**
 * A special file for internal use in the system.
 */
export class SystemFile extends File {}

/**
 * String or binary resource used to localize the system. Its format is the same as the internal part of a standard .Net resx file.
 */
export class Resource extends SystemFile {
  /* The number of downloads. */
  public Downloads?: number
}

/**
 * Use folders to group content.
 */
export class Folder extends GenericContent {}

/**
 * Generic Content List type.
 */
export class ContentList extends Folder {
  /* XML definition for additional fields. */
  public ContentListDefinition?: string
  /* The default View to use. */
  public DefaultView?: string
  /* Select global content list views here that you want to offer users to choose from. */
  public AvailableViews?: ContentListReferenceField<GenericContent>
  public FieldSettingContents?: ContentListReferenceField<GenericContent>
  public AvailableContentTypeFields?: ContentListReferenceField<GenericContent>
  /* Emails sent to this address will be imported as Email content into the Document Library. */
  public ListEmail?: string
  /* Ctd-ContentListen-USExchangeSubscriptionId-Descriptione */
  public ExchangeSubscriptionId?: string
  /* If checked new emails and attachments with the same name will overwrite existing items in list. Otherwise increment suffix is used in the name of new mail items. */
  public OverwriteFiles?: boolean
  /* Select the appropriate option to group attachment files under folders or email content or not. */
  public GroupAttachments?: Enums.GroupAttachments[]
  /* A separate .eml file will be created for every incoming email. */
  public SaveOriginalEmail?: boolean
  /* Select the workflow to be executed on every incoming email. */
  public IncomingEmailWorkflow?: ContentReferenceField<GenericContent>
  /* If set, only users that are members of any local group are able to send e-mails to this library. */
  public OnlyFromLocalGroups?: boolean
  /* A relative path of a folder to store incoming e-mails. */
  public InboxFolder?: string
  /* If a Visitor adds content to this list, this user will be set as the creator instead of the Visitor. This prevents visitors see each others' content. */
  public OwnerWhenVisitor?: ContentReferenceField<User>
}

/**
 * Aspect base type.
 */
export class Aspect extends ContentList {
  /* Definition of the extension in XML format. */
  public AspectDefinition?: string
}

/**
 * Base type for item lists. Choose a type inheriting from this to create list of items.
 */
export class ItemList extends ContentList {}

/**
 * Use this type to create custom Lists of content with user-defined columns.
 */
export class CustomList extends ItemList {}

/**
 * A List type for storing Memos.
 */
export class MemoList extends ItemList {}

/**
 * A List type for storing Tasks.
 */
export class TaskList extends ItemList {}

/**
 * A base class for special List types for storing documents such as Document Library or Image Library.
 */
export class Library extends ContentList {}

/**
 * A special List for storing documents.
 */
export class DocumentLibrary extends Library {}

/**
 * A special List for storing images.
 */
export class ImageLibrary extends Library {
  /* Select cover image */
  public CoverImage?: ContentReferenceField<Image>
}

/**
 * This content type is for defining different devices to browse the portal from - e.g. tablet or different phone types.
 */
export class Device extends Folder {
  /* A regular expression to match the user agent string of the browser. */
  public UserAgentPattern?: string
}

/**
 * A centrally-managed group of users and/or computers. sensenet has a built-in domain (BuiltIn), but you can syncronyze external LDAP directories as well.
 */
export class Domain extends Folder {
  /* GUID of corresponding AD object. */
  public SyncGuid?: string
  /* Date of last synchronization. */
  public LastSync?: string
}
/**
 * This is the container type for Domains. Only a single instance is allowed at /Root/IMS.
 */
export class Domains extends Folder {}

/**
 * Email content type containing attachments as children content.
 */
export class Email extends Folder {
  /* Sender name and address. */
  public From?: string
  /* Body of email. */
  public Body?: string
  /* Date of sending. */
  public Sent?: string
}

/**
 * Organizational Unit (OU) provides a way of classifying objects located in directories.
 */
export class OrganizationalUnit extends Folder {
  /* GUID of corresponding AD object. */
  public SyncGuid?: string
  /* Date of last synchronization. */
  public LastSync?: string
}

/**
 * Sense/Net Content Repository Master node. One installation can have only one Portal Root.
 */
export class PortalRoot extends Folder {}

/**
 * Container for user profiles.
 */
export class ProfileDomain extends Folder {}

/**
 * This is the container type for profiles. Only a single instance is allowed at /Root/Profiles.
 */
export class Profiles extends Folder {}

/**
 * For internal use only.
 */
export class RuntimeContentContainer extends Folder {}

/**
 * This is the container type for sites. Only a single instance is allowed at /Root/Sites.
 */
export class Sites extends Folder {}

/**
 * Use smart folders to group information (content) by Repository query.
 */
export class SmartFolder extends Folder {
  /* Please give a query here that you want to use for collecting the children of this smart folder. */
  public Query?: string
  /* If autofilters are enabled, system content will be filtered from the query. */
  public EnableAutofilters?: Enums.EnableAutofilters[]
  /* If lifespan filter is enabled, only valid content will be in the result. */
  public EnableLifespanFilter?: Enums.EnableLifespanFilter[]
}

/**
 * System Folders provide a way to store configuration and logic.
 */
export class SystemFolder extends Folder {}

/**
 * This is the container type for resources. Only a single instance is allowed at /Root/Localization.
 */
export class Resources extends SystemFolder {}

/**
 * An atomic container for deleted items stored for undeletion.
 */
export class TrashBag extends Folder {
  /* The bag must be kept until this date. */
  public KeepUntil?: string
  /* The path where the bag content were deleted from. */
  public OriginalPath?: string
  /* Ctd-TrashBagen-USWorkspaceRelativePath-Description */
  public WorkspaceRelativePath?: string
  /* Ctd-TrashBagen-USWorkspaceId-Description */
  public WorkspaceId?: number
  /* The actual deleted content inside this trash bag. */
  public DeletedContent?: ContentReferenceField<GenericContent>
}

/**
 * Collaborative workspace root.
 */
export class Workspace extends Folder {
  /* The person responsible for the project. */
  public Manager?: ContentReferenceField<User>
  public Deadline?: string
  /* This workspace is currently active. */
  public IsActive?: boolean
  public WorkspaceSkin?: ContentReferenceField<GenericContent>
  /* This workspace is currently in a critical status. */
  public IsCritical?: boolean
  /* This workspace is configured to contain a wall - this indicates that posts are created under this workspace if Content are shared anywhere below this path. */
  public IsWallContainer?: boolean
  public IsFollowed?: boolean
}

/**
 * The Site provides a primary entry point to your Portal.
 */
export class Site extends Workspace {
  /* Please define the default language of this site. */
  public Language?: Enums.Language[]
  /* Enable this to allow user browser settings override default site language settings. */
  public EnableClientBasedCulture?: boolean
  /* Enable this to allow user language settings override default site language settings. */
  public EnableUserBasedCulture?: boolean
  /* Select the URLs to associate with this Site. */
  public UrlList?: string
  /* If set, the site will use this start page instead of the default. */
  public StartPage?: ContentReferenceField<GenericContent>
  /* The login page to display when a user tries to access restricted Content (Forms authentication only). */
  public LoginPage?: ContentReferenceField<GenericContent>
  public SiteSkin?: ContentReferenceField<GenericContent>
  /* If set, content under this site can only be accessed via this site and not via other sites using a Root relative path. */
  public DenyCrossSiteAccess?: boolean
}

/**
 * The system trash bin content type.
 */
export class TrashBin extends Workspace {
  public MinRetentionTime?: number
  /* Set the size quote for the trash bin (Megabytes). */
  public SizeQuota?: number
  /* The maximum number of nodes accepted for trash in a single operation. */
  public BagCapacity?: number
}

/**
 * Workspace for handling all information and data for a user.
 */
export class UserProfile extends Workspace {
  public User?: ContentReferenceField<User>
}

/**
 * You can categorize users and groups into groups according to any criteria.
 */
export class Group extends GenericContent {
  /* The members of this group. */
  public Members?: ContentListReferenceField<User | Group>
  /* GUID of corresponding AD object. */
  public SyncGuid?: string
  /* Date of last synchronization. */
  public LastSync?: string
}

/**
 * Base content type for list items.
 */
export class ListItem extends GenericContent {}

/**
 * Content type for custom listitems.
 */
export class CustomListItem extends ListItem {
  public WorkflowsRunning?: boolean
}

/**
 * A content type for short memos or posts on a subject.
 */
export class Memo extends ListItem {
  /* Please set the due date of the memo. */
  public Date?: string
  /* Type of the memo. */
  public MemoType?: Enums.MemoType[]
  /* A list of content this memo pertains to. */
  public SeeAlso?: ContentListReferenceField<GenericContent>
}

/**
 * A content type for defining tasks.
 */
export class Task extends ListItem {
  public StartDate?: string
  public DueDate?: string
  /* List of internal stakeholders. */
  public AssignedTo?: ContentListReferenceField<User>
  public Priority?: Enums.Priority[]
  public Status?: Enums.Status[]
  /* Completion percentage of the task. */
  public TaskCompletion?: number
  /* Number of remaining days. */
  public RemainingDays?: number
  public DueText?: string
  /* Css class */
  public DueCssClass?: string
}

/**
 * Content Type for storing Content Queries
 */
export class Query extends GenericContent {
  /* Query text. */
  public Query?: string
  /* Public queries are stored under the workspace, private queries are stored under the user profile. */
  public QueryType?: Enums.QueryType[]
}

/**
 * The basic user type of the sensenet. Use it for intranet and extranet users.
 */
export class User extends GenericContent {
  /* The name that the user has to type in on login forms (in some cases along with the domain name). It has to be unique under a domain. */
  public LoginName?: string
  public JobTitle?: string
  /* User account is enabled. */
  public Enabled?: boolean
  /* The domain of the user. */
  public Domain?: string
  /* The e-mail of the user. */
  public Email?: string
  /* Full name of the user (e.g. John Smith). */
  public FullName?: string
  public ImageRef?: ContentReferenceField<GenericContent>
  public ImageData?: ComplexTypes.MediaResourceObject
  /* Avatar image of user. */
  public Avatar?: { Url: string }
  /* User password. */
  public Password?: string
  /* GUID of corresponding AD object. */
  public SyncGuid?: string
  /* Date of last synchronization. */
  public LastSync?: string
  /* Captcha text entered by the user. */
  public Captcha?: string
  /* Manager of the user. */
  public Manager?: ContentReferenceField<User>
  /* Department of employee. */
  public Department?: string
  /* Spoken languages. */
  public Languages?: string
  /* Phone number. (e.g. +123456789 or 1234). */
  public Phone?: string
  /* Select one. */
  public Gender?: Enums.Gender[]
  /* Select one. */
  public MaritalStatus?: Enums.MaritalStatus[]
  public BirthDate?: string
  /* List of educations - e.g. high school, university. */
  public Education?: string
  public TwitterAccount?: string
  /* http://www.facebook.com/USERNAME. */
  public FacebookURL?: string
  /* http://www.linkedin.com/USERNAME. */
  public LinkedInURL?: string
  /* Language used to display texts on the site, if it is available. */
  public Language?: Enums.Language[]
  /* List of workspaces followed by the user. */
  public FollowedWorkspaces?: ContentListReferenceField<Workspace>
  /* Path of the user's personal workspace. */
  public ProfilePath?: string
  /* Date and time of when the user logged out from all devices. */
  public LastLoggedOut?: string
}
