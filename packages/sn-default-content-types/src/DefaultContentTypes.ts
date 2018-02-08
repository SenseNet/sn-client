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
 *//** */

// tslint:disable:naming-convention

import { DeferredObject, MediaResourceObject } from "./ComplexTypes";
import {
    ApprovingMode, EnableAutofilters, EnableLifespanFilter, Gender, GroupAttachments,
    InheritableApprovingMode, InheritableVersioningMode, Language,
    MaritalStatus, MemoType, Priority, QueryType,
    SavingState, Status, VersioningMode
} from "./Enums";
import { IActionModel } from "./index";

export type ContentReferenceField<T> = DeferredObject | T | number;
export type ContentListReferenceField<T> = DeferredObject | T[] | number[];

export type BinaryField = MediaResourceObject;

/**
 * Class representing a ContentType
 * @class ContentType
 */
export class ContentType {
    public Id!: number;
    public ParentId?: number;
    public VersionId?: number;
    public Name!: string;
    public CreatedById?: number;
    public ModifiedById?: number;
    public Version?: string;
    public Path!: string;
    public Depth?: number;
    public IsSystemContent?: boolean;
    public HandlerName?: string;
    public ParentTypeName?: string;
    public DisplayName?: string;
    public Description?: string;
    public Icon?: string;
    public Binary?: MediaResourceObject;
    public CreatedBy?: ContentReferenceField<GenericContent>;
    public CreationDate?: string;
    public ModifiedBy?: ContentReferenceField<GenericContent>;
    public ModificationDate?: string;
    public EnableLifespan?: boolean;
    public Actions?: ContentListReferenceField<IActionModel>;
}

/**
 * Class representing a GenericContent
 * @class GenericContent
 */
export class GenericContent {
    public Id!: number;
    public ParentId?: number;
    public OwnerId?: number;
    public Owner?: ContentReferenceField<GenericContent>;
    public VersionId?: number;
    public Icon?: string;
    public Name!: string;
    public CreatedById?: number;
    public ModifiedById?: number;
    public Version?: string;
    public Path!: string;
    public Depth?: number;
    public IsSystemContent?: boolean;
    public IsFolder?: boolean;
    public DisplayName?: string;
    public Description?: string;
    public Hidden?: boolean;
    public Index?: number;
    public EnableLifespan?: boolean;
    public ValidFrom?: string;
    public ValidTill?: string;
    public AllowedChildTypes?: ContentListReferenceField<GenericContent>;
    public EffectiveAllowedChildTypes?: ContentListReferenceField<GenericContent>;
    public VersioningMode?: VersioningMode;
    public InheritableVersioningMode?: InheritableVersioningMode;
    public CreatedBy?: ContentReferenceField<GenericContent>;
    public CreationDate?: string;
    public ModifiedBy?: ContentReferenceField<GenericContent>;
    public ModificationDate?: string;
    public ApprovingMode?: ApprovingMode;
    public InheritableApprovingMode?: InheritableApprovingMode;
    public Locked?: boolean;
    public CheckedOutTo?: ContentReferenceField<GenericContent>;
    public TrashDisabled?: boolean;
    public SavingState?: SavingState;
    public ExtensionData?: string;
    public BrowseApplication?: ContentReferenceField<GenericContent>;
    public Approvable?: boolean;
    public IsTaggable?: boolean;
    public Tags?: string;
    public IsRateable?: boolean;
    public RateStr?: string;
    public RateAvg?: number;
    public RateCount?: number;
    public Rate?: string;
    public Publishable?: boolean;
    public Versions?: ContentListReferenceField<GenericContent>;
    public CheckInComments?: string;
    public RejectReason?: string;
    public Workspace?: ContentReferenceField<Workspace>;
    public BrowseUrl?: string;
    public Actions?: ContentListReferenceField<IActionModel>;
    public Type!: string;
}

/**
 * Class representing a ContentLink
 * @class ContentLink
 * @extends {@link GenericContent}
 */
export class ContentLink extends GenericContent {
    public Link?: ContentReferenceField<GenericContent>;

}

/**
 * Class representing a File
 * @class File
 * @extends {@link GenericContent}
 */
export class File extends GenericContent {
    public Binary!: BinaryField;
    public Size?: number;
    public FullSize?: number;
    public PageCount?: number;
    public MimeType?: string;
    public Shapes?: string;
    public PageAttributes?: string;
    public Watermark?: string;

}

/**
 * Class representing a DynamicJsonContent
 * @class DynamicJsonContent
 * @extends {@link File}
 */
export class DynamicJsonContent extends File {

}

/**
 * Class representing a ExecutableFile
 * @class ExecutableFile
 * @extends {@link File}
 */
export class ExecutableFile extends File {

}

/**
 * Class representing a HtmlTemplate
 * @class HtmlTemplate
 * @extends {@link File}
 */
export class HtmlTemplate extends File {
    public TemplateText?: string;

}

/**
 * Class representing a Image
 * @class Image
 * @extends {@link File}
 */
export class Image extends File {
    public Keywords?: string;
    public DateTaken?: string;
    public Width?: number;
    public Height?: number;

}

/**
 * Class representing a PreviewImage
 * @class PreviewImage
 * @extends {@link Image}
 */
export class PreviewImage extends Image {

}

/**
 * Class representing a Settings
 * @class Settings
 * @extends {@link File}
 */
export class Settings extends File {
    public GlobalOnly?: boolean;

}

/**
 * Class representing a IndexingSettings
 * @class IndexingSettings
 * @extends {@link Settings}
 */
export class IndexingSettings extends Settings {
    public TextExtractorInstances?: string;

}

/**
 * Class representing a LoggingSettings
 * @class LoggingSettings
 * @extends {@link Settings}
 */
export class LoggingSettings extends Settings {

}

/**
 * Class representing a PortalSettings
 * @class PortalSettings
 * @extends {@link Settings}
 */
export class PortalSettings extends Settings {

}

/**
 * Class representing a SystemFile
 * @class SystemFile
 * @extends {@link File}
 */
export class SystemFile extends File {

}

/**
 * Class representing a Resource
 * @class Resource
 * @extends {@link SystemFile}
 */
export class Resource extends SystemFile {
    public Downloads?: number;

}

/**
 * Class representing a Folder
 * @class Folder
 * @extends {@link GenericContent}
 */
export class Folder extends GenericContent {

}

/**
 * Class representing a ContentList
 * @class ContentList
 * @extends {@link Folder}
 */
export class ContentList extends Folder {
    public ContentListDefinition?: string;
    public DefaultView?: string;
    //  AvailableViews?: ContentListReferenceField<ListView>;
    //  FieldSettingContents?: ContentListReferenceField<FieldSettingContent>;
    //  AvailableContentTypeFields?: ContentListReferenceField<FieldSettingContent>;
    public ListEmail?: string;
    public ExchangeSubscriptionId?: string;
    public OverwriteFiles?: boolean;
    public GroupAttachments?: GroupAttachments;
    public SaveOriginalEmail?: boolean;
    public IncomingEmailWorkflow?: ContentReferenceField<GenericContent>;
    public OnlyFromLocalGroups?: boolean;
    public InboxFolder?: string;
    public OwnerWhenVisitor?: ContentReferenceField<User>;

}

/**
 * Class representing a Aspect
 * @class Aspect
 * @extends {@link ContentList}
 */
export class Aspect extends ContentList {
    public AspectDefinition?: string;

}

/**
 * Class representing a ItemList
 * @class ItemList
 * @extends {@link ContentList}
 */
export class ItemList extends ContentList {

}

/**
 * Class representing a CustomList
 * @class CustomList
 * @extends {@link ItemList}
 */
export class CustomList extends ItemList {

}

/**
 * Class representing a MemoList
 * @class MemoList
 * @extends {@link ItemList}
 */
export class MemoList extends ItemList {

}

/**
 * Class representing a TaskList
 * @class TaskList
 * @extends {@link ItemList}
 */
export class TaskList extends ItemList {

}

/**
 * Class representing a Library
 * @class Library
 * @extends {@link ContentList}
 */
export class Library extends ContentList {

}

/**
 * Class representing a DocumentLibrary
 * @class DocumentLibrary
 * @extends {@link Library}
 */
export class DocumentLibrary extends Library {

}

/**
 * Class representing a ImageLibrary
 * @class ImageLibrary
 * @extends {@link Library}
 */
export class ImageLibrary extends Library {
    public CoverImage?: ContentReferenceField<Image>;

}

/**
 * Class representing a Device
 * @class Device
 * @extends {@link Folder}
 */
export class Device extends Folder {
    public UserAgentPattern?: string;

}

/**
 * Class representing a Domain
 * @class Domain
 * @extends {@link Folder}
 */
export class Domain extends Folder {
    public SyncGuid?: string;
    public LastSync?: string;

}

/**
 * Class representing a Domains
 * @class Domains
 * @extends {@link Folder}
 */
export class Domains extends Folder {

}

/**
 * Class representing a Email
 * @class Email
 * @extends {@link Folder}
 */
export class Email extends Folder {
    public From?: string;
    public Body?: string;
    public Sent?: string;

}

/**
 * Class representing a OrganizationalUnit
 * @class OrganizationalUnit
 * @extends {@link Folder}
 */
export class OrganizationalUnit extends Folder {
    public SyncGuid?: string;
    public LastSync?: string;

}

/**
 * Class representing a PortalRoot
 * @class PortalRoot
 * @extends {@link Folder}
 */
export class PortalRoot extends Folder {

}

/**
 * Class representing a ProfileDomain
 * @class ProfileDomain
 * @extends {@link Folder}
 */
export class ProfileDomain extends Folder {

}

/**
 * Class representing a Profiles
 * @class Profiles
 * @extends {@link Folder}
 */
export class Profiles extends Folder {

}

/**
 * Class representing a RuntimeContentContainer
 * @class RuntimeContentContainer
 * @extends {@link Folder}
 */
export class RuntimeContentContainer extends Folder {

}

/**
 * Class representing a Sites
 * @class Sites
 * @extends {@link Folder}
 */
export class Sites extends Folder {

}

/**
 * Class representing a SmartFolder
 * @class SmartFolder
 * @extends {@link Folder}
 */
export class SmartFolder extends Folder {
    public Query?: string;
    public EnableAutofilters?: EnableAutofilters;
    public EnableLifespanFilter?: EnableLifespanFilter;

}

/**
 * Class representing a SystemFolder
 * @class SystemFolder
 * @extends {@link Folder}
 */
export class SystemFolder extends Folder {

}

/**
 * Class representing a Resources
 * @class Resources
 * @extends {@link SystemFolder}
 */
export class Resources extends SystemFolder {

}

/**
 * Class representing a TrashBag
 * @class TrashBag
 * @extends {@link Folder}
 */
export class TrashBag extends Folder {
    public KeepUntil?: string;
    public OriginalPath?: string;
    public WorkspaceRelativePath?: string;
    public WorkspaceId?: number;
    public DeletedContent?: ContentReferenceField<GenericContent>;

}

/**
 * Class representing a Workspace
 * @class Workspace
 * @extends {@link Folder}
 */
export class Workspace extends Folder {
    public Manager?: ContentReferenceField<User>;
    public Deadline?: string;
    public IsActive?: boolean;
    // WorkspaceSkin?: ContentReferenceField<Skin>;
    public IsCritical?: boolean;
    public IsWallContainer?: boolean;
    public IsFollowed?: boolean;

}

/**
 * Class representing a Site
 * @class Site
 * @extends {@link Workspace}
 */
export class Site extends Workspace {
    public Language?: Language;
    public EnableClientBasedCulture?: boolean;
    public EnableUserBasedCulture?: boolean;
    public UrlList?: string;
    public StartPage?: ContentReferenceField<GenericContent>;
    public LoginPage?: ContentReferenceField<GenericContent>;
    // SiteSkin?: ContentReferenceField<Skin>;
    public DenyCrossSiteAccess?: boolean;

}

/**
 * Class representing a TrashBin
 * @class TrashBin
 * @extends {@link Workspace}
 */
export class TrashBin extends Workspace {
    public MinRetentionTime?: number;
    public SizeQuota?: number;
    public BagCapacity?: number;

}

/**
 * Class representing a UserProfile
 * @class UserProfile
 * @extends {@link Workspace}
 */
export class UserProfile extends Workspace {
    public User?: ContentReferenceField<User>;

}

/**
 * Class representing a Group
 * @class Group
 * @extends {@link GenericContent}
 */
export class Group extends GenericContent {
    public Members?: ContentListReferenceField<User | Group>;
    public SyncGuid?: string;
    public LastSync?: string;

}

/**
 * Class representing a ListItem
 * @class ListItem
 * @extends {@link GenericContent}
 */
export class ListItem extends GenericContent {

}

/**
 * Class representing a CustomListItem
 * @class CustomListItem
 * @extends {@link ListItem}
 */
export class CustomListItem extends ListItem {
    public WorkflowsRunning?: boolean;

}

/**
 * Class representing a Memo
 * @class Memo
 * @extends {@link ListItem}
 */
export class Memo extends ListItem {
    public Date?: string;
    public MemoType?: MemoType;
    public SeeAlso?: ContentListReferenceField<GenericContent>;

}

/**
 * Class representing a Task
 * @class Task
 * @extends {@link ListItem}
 */
export class Task extends ListItem {
    public StartDate?: string;
    public DueDate?: string;
    public AssignedTo?: ContentListReferenceField<User>;
    public Priority?: Priority;
    public Status?: Status;
    public TaskCompletion?: number;
    public RemainingDays?: number;
    public DueText?: string;
    public DueCssClass?: string;

}

/**
 * Class representing a Query
 * @class Query
 * @extends {@link GenericContent}
 */
export class Query extends GenericContent {
    public Query?: string;
    public QueryType?: QueryType;

}

/**
 * Class representing a User
 * @class User
 * @extends {@link GenericContent}
 */
export class User extends GenericContent {
    public LoginName?: string;
    public JobTitle?: string;
    public Enabled?: boolean;
    public Domain?: string;
    public Email?: string;
    public FullName?: string;
    public ImageRef?: ContentReferenceField<GenericContent>;
    public ImageData?: MediaResourceObject;
    public Avatar?: DeferredObject;
    public Password?: string;
    public SyncGuid?: string;
    public LastSync?: string;
    public Captcha?: string;
    public Manager?: ContentReferenceField<User>;
    public Department?: string;
    public Languages?: string;
    public Phone?: string;
    public Gender?: Gender;
    public MaritalStatus?: MaritalStatus;
    public BirthDate?: string;
    public Education?: string;
    public TwitterAccount?: string;
    public FacebookURL?: string;
    public LinkedInURL?: string;
    public Language?: Language;
    public FollowedWorkspaces?: ContentListReferenceField<Workspace>;
    public ProfilePath?: string;

}
