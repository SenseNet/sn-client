import { IContent, Repository } from "@sensenet/client-core";
import { FieldSetting, FieldVisibility, Schema, SchemaStore } from "@sensenet/default-content-types";
import { ControlSchema } from "./ControlSchema";

/**
 * Type that defines an action name for control schema generation
 */
export type ActionName = "new" | "edit" | "view";

/**
 * Class that handles control mappings between a sensenet ECM Repository schemas and a generic control set
 */
export class ControlMapper<TControlBaseType, TClientControlSettings> {

    constructor(
        private readonly repository: Repository,
        public readonly controlBaseType: { new(...args: any[]): TControlBaseType },
        private readonly clientControlSettingsFactory:
            (fieldSetting: FieldSetting) => TClientControlSettings,
        private readonly defaultControlType?: { new(...args: any[]): TControlBaseType },
        private readonly defaultFieldSettingControlType?: { new(...args: any[]): TControlBaseType },
    ) {
    }

    /**
     * Method for getting a specified Schema object for a content type.
     * The FieldSettings will be filtered based on the provided actionName.
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param actionName The name of the action. Can be 'new' / 'view' / 'edit'
     */
    private getTypeSchema(contentTypeName: string, actionName: ActionName): Schema {
        const schema = this.repository.schemas.getSchemaByName(contentTypeName);

        schema.FieldSettings = schema.FieldSettings.filter((s) => {
            switch (actionName) {
                case "new":
                    return s.VisibleNew !== FieldVisibility.Hide;
                case "edit":
                    return s.VisibleEdit !== FieldVisibility.Hide;
                case "view":
                    return s.VisibleBrowse !== FieldVisibility.Hide;
            }
        });
        return schema;
    }

    private contentTypeControlMaps: Map<string, { new(...args: any[]): TControlBaseType }> = new Map();

    /**
     * Maps a specified Control to a Content type
     * @param contentTypeName The Content type to be mapped
     * @param control The Control for the content
     * @returns {ControlMapper}
     */
    public mapContentTypeToControl(contentTypeName: string, control: { new(...args: any[]): TControlBaseType }) {
        this.contentTypeControlMaps.set(contentTypeName, control);
        return this;
    }

    /**
     * Gets the mapped control for a specified content type.
     * @param content The content to get the control for.
     * @returns {TControlBaseType} The mapped control, Default if nothing is mapped.
     */
    public getControlForContentType(contentTypeName: string): { new(...args: any[]): TControlBaseType } {
        const control = this.contentTypeControlMaps.get(contentTypeName) || this.defaultControlType;
        return control as ({ new(...args: any[]): TControlBaseType });
    }

    private fieldSettingDefaults: Map<string, ((fieldSetting: FieldSetting) => { new(...args: any[]): TControlBaseType })> = new Map();

    /**
     * Sets up default field settings object
     * @param fieldSetting The FieldSetting to get the control for.
     * @param setupControl Callback method that returns a Control Type based on the provided FieldSetting
     * @returns the Mapper instance (can be used fluently)
     */
    public setupFieldSettingDefault<TFieldSettingType extends FieldSetting>(
        fieldSetting: { new(...args: any[]): TFieldSettingType },
        setupControl: (fieldSetting: TFieldSettingType) => { new(...args: any[]): TControlBaseType },
    ) {
        this.fieldSettingDefaults.set(fieldSetting.name, setupControl as (fieldSetting: FieldSetting) => { new(...args: any[]): TControlBaseType });
        return this;
    }

    /**
     * Gets an associated control for a specific field setting object
     * @returns {TControlBaseType} The specified FieldSetting control
     * @param fieldSetting The FieldSetting to get the control class.
     */
    public getControlForFieldSetting<TFieldSettingType extends FieldSetting>(fieldSetting: TFieldSettingType): { new(...args: any[]): TControlBaseType } {
        const fieldSettingSetup = this.fieldSettingDefaults.get(fieldSetting.Type) as (fieldSetting: any) => { new(...args: any[]): TControlBaseType };
        return fieldSettingSetup && fieldSettingSetup(fieldSetting) || this.defaultFieldSettingControlType;
    }

    private contentTypeBoundfieldSettings: Map<string, ((fieldSetting: FieldSetting) => { new(...args: any[]): TControlBaseType })> = new Map();

    /**
     * Sets up a specified control for a field setting
     * @param contentType The Content Type
     * @param fieldName The name of the field on the Content Type
     * @param setupControl The callback function that will setup the Control
     * @param fieldSetting Optional type hint for the FieldSetting
     */

    public setupFieldSettingForControl<TFieldSettingType extends FieldSetting, TContentType, TField extends keyof TContentType>(
        contentType: { new(...args: any[]): TContentType },
        fieldName: TField,
        setupControl: (fieldSetting: TFieldSettingType) => { new(...args: any[]): TControlBaseType },
        fieldSetting?: { new(...args: any[]): TFieldSettingType },

    ) {
        this.contentTypeBoundfieldSettings.set(`${contentType.name}-${fieldName}`, setupControl as any);
        return this;
    }

    /**
     * Retrieves an assigned Control constructor for a specified content's specified field
     * @param contentType The type of the content (e.g. ContentTypes.Task)
     * @param fieldName The name of the field (must be one of the ContentType's fields), e.g. 'DisplayName'
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns The assigned Control constructor or the default Field control
     */
    public getControlForContentField(
        contentTypeName: string,
        fieldName: string,
        actionName: ActionName,
    ): { new(...args: any[]): TControlBaseType } {

        const fieldSetting = this.getTypeSchema(contentTypeName, actionName).FieldSettings.filter((s) => s.Name === fieldName)[0];

        if (this.contentTypeBoundfieldSettings.has(`${contentTypeName}-${fieldName}`)) {
            return (this.contentTypeBoundfieldSettings.get(`${contentTypeName}-${fieldName}`) as any)(fieldSetting);
        } else {
            return this.getControlForFieldSetting(fieldSetting);
        }
    }

    private fieldSettingBoundClientSettingFactories: Map<string, ((setting: FieldSetting) => TClientControlSettings)> = new Map();

    /**
     * Sets up a Factory method to create library-specific settings from FieldSettings per type
     * @param fieldSettingType The type of the FieldSetting (e.g. FieldSettings.ShortTextFieldSetting)
     * @param factoryMethod The factory method that constructs or transforms the Settings object
     */
    public setClientControlFactory<TFieldSetting extends FieldSetting>(fieldSettingType: { new(...args: any[]): TFieldSetting }, factoryMethod: (setting: TFieldSetting) => TClientControlSettings) {
        this.fieldSettingBoundClientSettingFactories.set(fieldSettingType.name, factoryMethod as any);
        return this;
    }

    /**
     * Creates a ClientSetting from a specified FieldSetting based on the assigned Factory method
     * @param fieldSetting The FieldSetting object that should be used for creating the new Setting entry
     * @returns the created or transformed Client Setting
     */
    public createClientSetting<TFieldSetting extends FieldSetting>(fieldSetting: TFieldSetting) {
        const factoryMethod =
            this.fieldSettingBoundClientSettingFactories.get(fieldSetting.Type) || this.clientControlSettingsFactory;
        return factoryMethod(fieldSetting);
    }

    /**
     * Gets the full ControlSchema object for a specific ContentType
     * @param contentType The type of the Content (e.g. ContentTypes.Task)
     * @param actionName The name of the Action (can be 'new' / 'edit' / 'view')
     * @returns the fully created ControlSchema
     */
    public getFullSchemaForContentType(
        contentTypeName: string,
        actionName: ActionName):
        ControlSchema<TControlBaseType, TClientControlSettings> {
        const schema = this.getTypeSchema(contentTypeName, actionName);
        const mappings = schema.FieldSettings.map((f) => {
            const clientSetting: TClientControlSettings = this.createClientSetting(f);
            const control: { new(...args: any[]): TControlBaseType } =
                this.getControlForContentField(contentTypeName, f.Name, actionName);
            return {
                fieldSettings: f,
                clientSettings: clientSetting,
                controlType: control,
            };
        });
        return {
            schema,
            contentTypeControl: this.getControlForContentType(contentTypeName),
            fieldMappings: mappings,
        };
    }
}
