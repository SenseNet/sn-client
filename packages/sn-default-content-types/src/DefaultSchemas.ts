/**
 * @module Schemas
 * @preferred
 * @description Module for ContentType schemas.
 *
 * A Content Type Definition in Sense/Net is an xml-format configuration file for defining Content Types. The xml configuration (CTD) holds information about the types name and description
 * properties that control how content of this type look and behave (icon, preview generation, indexing), set of fields, etc. This information about the type and its Fields helps us for example
 * building forms. Based on the Field definitions we can render a Field with its DisplayName as a label or validate the Field on save by its validation related configs.
 *
 * This module provides us description of this Content schemas in Typesript.
 *
 * The ```Schema``` class represents an object that holds the basic information about the Content Type (name, icon, ect.) and an array of its ```FieldSettings``` and their full configuration.
 */ /** */

 import * as FieldSettings from './FieldSettings';

 export const isSchema: (schema: Schema) => boolean = (schema: Schema): schema is Schema => {
    return schema && schema.ContentTypeName && schema.FieldSettings && schema.FieldSettings instanceof Array || false;
};

 /**
  * Class that represents a Schema.
  *
  * It represents an object that holds the basic information about the Content Type (name, icon, ect.) and an array of its ```FieldSettings``` and their full configuration.
  */
 export class Schema {
     public ContentTypeName: string;
     public ParentTypeName?: string;

     public Icon: string;
     public DisplayName: string;
     public Description: string;
     public AllowIndexing: boolean;
     public AllowIncrementalNaming: boolean;
     public AllowedChildTypes: string[];
     public FieldSettings: FieldSettings.FieldSetting[];
 }

 export const SchemaStore: Schema[] = [
     {
         ContentTypeName: 'ContentType',
         DisplayName: '$Ctd-ContentType,DisplayName',
         Description: '$Ctd-ContentType,Description',
         Icon: 'ContentType',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Id',
                 DisplayName: 'Id',
                 Description: 'A unique ID for the Content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'ParentId',
                 DisplayName: 'Id',
                 Description: 'A unique ID for the Content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'VersionId',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Name',
                 DisplayName: 'Uri name',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'CreatedById',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'ModifiedById',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Version',
                 DisplayName: 'Version',
                 Description: 'Latest version number.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Path',
                 DisplayName: 'Path',
                 Description: 'Content type path.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Depth',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsSystemContent',
                 DisplayName: 'System Content',
                 Description: 'This field is true if content is in a system folder/trash or the content is a system folder/file.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'HandlerName',
                 DisplayName: 'Handler Name',
                 Description: 'Fully Qualified Name.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'ParentTypeName',
                 DisplayName: 'Parent Type Name',
                 Description: 'Name of the parent content type.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'DisplayName',
                 DisplayName: 'Name',
                 Description: 'User friendly name of the content type.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Description',
                 DisplayName: 'Description',
                 Description: 'Longer description of the content type.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Icon',
                 DisplayName: 'Icon',
                 Description: 'Content type icon.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'BinaryFieldSetting',
                 IsText: true,
                 Name: 'Binary',
                 DisplayName: 'Binary',
                 Description: 'The content type definition in XML format.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '<?xml version="1.0" encoding="utf-8"?>\<ContentType name="MyType" parentType="GenericContent" handler="SenseNet.ContentRepository.GenericContent" xmlns="http://schemas.sensenet.com/SenseNet/ContentRepository/ContentTypeDefinition">\  <DisplayName>MyType</DisplayName>\  <Description></Description>\  <Icon>Content</Icon>\  <AllowIncrementalNaming>true</AllowIncrementalNaming>\  <AllowedChildTypes>ContentTypeName1,ContentTypeName2</AllowedChildTypes>\  <Fields>\    <Field name="ShortTextField" type="ShortText">\      <DisplayName>ShortTextField</DisplayName>\      <Description></Description>\      <Configuration>\        <MaxLength>100</MaxLength>\        <MinLength>0</MinLength>\        <Regex>[a-zA-Z0-9]*$</Regex>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="LongTextField" type="LongText">\      <DisplayName>LongTextField</DisplayName>\      <Description></Description>\      <Configuration>\        <MaxLength>100</MaxLength>\        <MinLength>0</MinLength>\        <TextType>LongText|RichText|AdvancedRichText</TextType>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="NumberField" type="Number">\      <DisplayName>NumberField</DisplayName>\      <Description></Description>\      <Configuration>\        <MinValue>0</MinValue>\        <MaxValue>100.5</MaxValue>\        <Digits>2</Digits>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="IntegerField" type="Integer">\      <DisplayName>IntegerField</DisplayName>\      <Description></Description>\      <Configuration>\        <MinValue>0</MinValue>\        <MaxValue>100</MaxValue>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="BooleanField" type="Boolean">\      <DisplayName>BooleanField</DisplayName>\      <Description></Description>\      <Configuration>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="ChoiceField" type="Choice">\      <DisplayName>ChoiceField</DisplayName>\      <Description></Description>\      <Configuration>\        <AllowMultiple>false</AllowMultiple>\        <AllowExtraValue>false</AllowExtraValue>\        <Options>\          <Option selected="true">1</Option>\          <Option>2</Option>\        </Options>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="DateTimeField" type="DateTime">\      <DisplayName>DateTimeField</DisplayName>\      <Description></Description>\      <Configuration>\        <DateTimeMode>DateAndTime</DateTimeMode>\        <Precision>Second</Precision>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="ReferenceField" type="Reference">\      <DisplayName>ReferenceField</DisplayName>\      <Description></Description>\      <Configuration>\        <AllowMultiple>true</AllowMultiple>\        <AllowedTypes>\          <Type>Type1</Type>\          <Type>Type2</Type>\        </AllowedTypes>\        <SelectionRoot>\          <Path>/Root/Path1</Path>\          <Path>/Root/Path2</Path>\        </SelectionRoot>\        <DefaultValue>/Root/Path1,/Root/Path2</DefaultValue>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\    <Field name="BinaryField" type="Binary">\      <DisplayName>BinaryField</DisplayName>\      <Description></Description>\      <Configuration>\        <IsText>true</IsText>\        <ReadOnly>false</ReadOnly>\        <Compulsory>false</Compulsory>\        <DefaultValue></DefaultValue>\        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>\        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>\        <VisibleNew>Show|Hide|Advanced</VisibleNew>\      </Configuration>\    </Field>\  </Fields>\</ContentType>',
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.BinaryFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'CreatedBy',
                 DisplayName: 'Created by',
                 Description: 'Content creator.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'CreationDate',
                 DisplayName: 'Creation date',
                 Description: 'Content creation date.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'ModifiedBy',
                 DisplayName: 'Modified by',
                 Description: 'Content was last modified by the given user.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 Name: 'ModificationDate',
                 DisplayName: 'Modification date',
                 Description: 'Content was last modified on the given date.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'EnableLifespan',
                 DisplayName: 'Enable Lifespan handling',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'GenericContent',
         DisplayName: '$Ctd-GenericContent,DisplayName',
         Description: '$Ctd-GenericContent,Description',
         Icon: 'Content',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Id',
                 DisplayName: 'Id',
                 Description: 'Unique Id for the content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'ParentId',
                 DisplayName: 'Parent Id',
                 Description: 'Id of the parent content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'OwnerId',
                 DisplayName: 'Owner Id',
                 Description: 'Id of the owner.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'Owner',
                 DisplayName: 'Owner',
                 Description: 'Content owner.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'VersionId',
                 DisplayName: 'Version Id',
                 Description: 'Database row Id of current version.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Icon',
                 DisplayName: 'Icon',
                 Description: 'Icon',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Name',
                 DisplayName: 'Name',
                 Description: 'Specify a name that will appear in the address bar of the browser.',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:Name'
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'CreatedById',
                 DisplayName: 'Created By (Id)',
                 Description: 'Id of creator.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'ModifiedById',
                 DisplayName: 'Last Modified By (Id)',
                 Description: 'Id of last modifier.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Version',
                 DisplayName: 'Version',
                 Description: 'Version number.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Path',
                 DisplayName: 'Path',
                 Description: 'Content path in the repository.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Depth',
                 DisplayName: 'Tree Depth',
                 Description: 'Content level in the tree. Root level is 0.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsSystemContent',
                 DisplayName: 'System Content',
                 Description: 'This field is true if content is in a system folder/trash or the content is a system folder/file.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsFolder',
                 DisplayName: 'Folder',
                 Description: 'This field is true if content can contain other content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'DisplayName',
                 DisplayName: 'Display Name',
                 Description: 'Content name. You can set any name you prefer without any restrictions.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:DisplayName'
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Description',
                 DisplayName: 'Description',
                 Description: 'Description of the content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:RichText'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Hidden',
                 DisplayName: 'Hidden',
                 Description: 'If checked, content will not show up in navigation.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Index',
                 DisplayName: 'Index',
                 Description: 'Content order in navigation. Numbers closer to 0 will appear first.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'EnableLifespan',
                 DisplayName: 'Enable Lifespan',
                 Description: 'Specify whether you want to define starting and end date for the validity of this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'ValidFrom',
                 DisplayName: 'Valid From',
                 Description: 'This content will appear on the date you set if lifespan handling is enabled for this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'ValidTill',
                 DisplayName: 'Valid Till',
                 Description: 'This content will disappear on the date you set if lifespan handling is enabled for this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'AllowedChildTypes',
                 DisplayName: 'Allowed child types',
                 Description: 'You can get and set which content types are explicitly allowed to be created under this content. It is a local setting.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'EffectiveAllowedChildTypes',
                 DisplayName: 'Effective allowed child types',
                 Description: 'You can get which content types are effective allowed to be created under this content. If there is no local setting, the global setting takes effect.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Inherited', Enabled: true, Selected: true },
                     {Value: '1', Text: 'None', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Major only', Enabled: true, Selected: false },
                     {Value: '3', Text: 'Major and minor', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'VersioningMode',
                 DisplayName: 'Versioning Mode For Current Content',
                 Description: 'It shows the versioning mode of the current content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Inherited', Enabled: true, Selected: true },
                     {Value: '1', Text: 'None', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Major only', Enabled: true, Selected: false },
                     {Value: '3', Text: 'Major and minor', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'InheritableVersioningMode',
                 DisplayName: 'Version history',
                 Description: 'Specify whether the system should create a new version whenever you create or modify a content below this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0,
                 ControlHint: 'sn:VersioningModeChoice'
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'CreatedBy',
                 DisplayName: 'Created by',
                 Description: 'Content creator.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'CreationDate',
                 DisplayName: 'Creation date',
                 Description: 'Content creation date.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'ModifiedBy',
                 DisplayName: 'Modified By',
                 Description: 'Content was last modified by this user.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'ModificationDate',
                 DisplayName: 'Modification Date',
                 Description: 'Content was last modified on this date.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Inherited', Enabled: true, Selected: true },
                     {Value: '1', Text: 'Off', Enabled: true, Selected: false },
                     {Value: '2', Text: 'On', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'ApprovingMode',
                 DisplayName: 'Content Approval For Current Content',
                 Description: 'It shows the approval mode of the current content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Inherited', Enabled: true, Selected: true },
                     {Value: '1', Text: 'Off', Enabled: true, Selected: false },
                     {Value: '2', Text: 'On', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'InheritableApprovingMode',
                 DisplayName: 'Content approval',
                 Description: 'Specify whether new or changed content below the current one should remain in a draft state until they have been approved.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0,
                 ControlHint: 'sn:ApprovingModeChoice'
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Locked',
                 DisplayName: 'Locked',
                 Description: 'It shows whether the content is checked out or not.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 Name: 'CheckedOutTo',
                 DisplayName: 'Checked Out To',
                 Description: 'The user currently locking the content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'TrashDisabled',
                 DisplayName: 'Disable Trash',
                 Description: 'You can disable trash for this content and its children. If set, you can not restore deleted content.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: 'false',
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Finalized', Enabled: true, Selected: false },
                     {Value: '1', Text: 'Creating', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Modifying', Enabled: true, Selected: false },
                     {Value: '3', Text: 'ModifyingLocked', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: 'SenseNet.ContentRepository.Storage.ContentSavingState',
                 Name: 'SavingState',
                 DisplayName: 'Saving state',
                 Description: 'State of multi-step saving.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'ExtensionData',
                 DisplayName: 'Extension data',
                 Description: 'You can set extra data in this field which is useful when extending a content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 Name: 'BrowseApplication',
                 DisplayName: 'Reference To Browse Application',
                 Description: 'Set this, if you would like to override the default browse application.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Approvable',
                 DisplayName: 'Approvable By Current User',
                 Description: 'This fileld is true if the content is in \'pending\' state and can be approved by the current user.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsTaggable',
                 DisplayName: 'Enable Tagging',
                 Description: 'Specify whether you would like to enable tagging capability for this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: 'false',
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Tags',
                 DisplayName: 'Tags',
                 Description: 'List of tags and creators of them separated by commas.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0,
                 ControlHint: 'sn:TagList'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsRateable',
                 DisplayName: 'Enable Rating',
                 Description: 'Specify whether you would like to enable rating capability for this content.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: 'false',
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'RateStr',
                 DisplayName: 'Raw value of rating',
                 Description: '',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'NumberFieldSetting',
                 Name: 'RateAvg',
                 DisplayName: 'Average rate',
                 Description: 'Average rate of the content.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NumberFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'RateCount',
                 DisplayName: 'Rate count',
                 Description: 'Count of rates.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'RatingFieldSetting',
                 Range: 5,
                 Split: 1,
                 Name: 'Rate',
                 DisplayName: 'Rate',
                 Description: '',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.RatingFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Publishable',
                 DisplayName: 'Publishable By Current User',
                 Description: 'This fileld is true if the content can be published by the current user.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 Name: 'Versions',
                 DisplayName: 'Versions',
                 Description: 'Content version history.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'CheckInComments',
                 DisplayName: 'Checkin comments',
                 Description: 'Comments for a new version.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'RejectReason',
                 DisplayName: 'Reject reason',
                 Description: 'The reason why the content was rejected.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['Workspace'],
                 Name: 'Workspace',
                 DisplayName: 'Workspace',
                 Description: 'The container workspace of the content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'BrowseUrl',
                 DisplayName: 'Browse url',
                 Description: '',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'ContentLink',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-ContentLink,DisplayName',
         Description: '$Ctd-ContentLink,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 Name: 'Link',
                 DisplayName: 'Linked content',
                 Description: 'Set this reference to the Content to link.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'File',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-File,DisplayName',
         Description: '$Ctd-File,Description',
         Icon: 'File',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'BinaryFieldSetting',
                 Name: 'Binary',
                 DisplayName: 'Binary',
                 Description: 'The binary content of the document.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.BinaryFieldSetting,
             {
                 Type: 'NumberFieldSetting',
                 Name: 'Size',
                 DisplayName: 'Size',
                 Description: 'Size of the binary document.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NumberFieldSetting,
             {
                 Type: 'NumberFieldSetting',
                 Name: 'FullSize',
                 DisplayName: 'Full size',
                 Description: 'The total amount of space the Document occupies, counting all versions.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NumberFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'PageCount',
                 DisplayName: 'Page count',
                 Description: 'Read-only field for storing the number of pages in the document. It is filled by the document preview generator.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '-4',
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'MimeType',
                 DisplayName: 'Document MIME type',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Shapes',
                 DisplayName: 'Shapes',
                 Description: 'Stores data used for document preview (redaction, highlight, annotation shapes). This value can be modified by the document preview plugin.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'PageAttributes',
                 DisplayName: 'Page attributes',
                 Description: 'Stores data used for document preview (for example page rotation). This value can be modified by the document preview plugin.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Watermark',
                 DisplayName: 'Watermark',
                 Description: 'The text that is displayed as a watermark on the document preview. The format can be set by modifying the Document Preview settings.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'DynamicJsonContent',
         ParentTypeName: 'File',
         DisplayName: 'Dynamic JSON content',
         Description: '',
         Icon: 'Settings',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'ExecutableFile',
         ParentTypeName: 'File',
         DisplayName: '$Ctd-ExecutableFile,DisplayName',
         Description: '$Ctd-ExecutableFile,Description',
         Icon: 'Application',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'HtmlTemplate',
         ParentTypeName: 'File',
         DisplayName: '$Ctd-HtmlTemplate,DisplayName',
         Description: '$Ctd-HtmlTemplate,Description',
         Icon: 'File',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'TemplateText',
                 DisplayName: 'Template text',
                 Description: 'Shows the contents of the html file as a text.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Image',
         ParentTypeName: 'File',
         DisplayName: '$Ctd-Image,DisplayName',
         Description: '$Ctd-Image,Description',
         Icon: 'Image',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Keywords',
                 DisplayName: 'Keywords',
                 Description: 'Keywords describing the image.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'DateTaken',
                 DisplayName: 'Date taken',
                 Description: 'Date the photo was taken, if applicable.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Width',
                 DisplayName: 'Width',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'Height',
                 DisplayName: 'Height',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
         ]
         },

     {
         ContentTypeName: 'PreviewImage',
         ParentTypeName: 'Image',
         DisplayName: '$Ctd-PreviewImage,DisplayName',
         Description: '$Ctd-PreviewImage,Description',
         Icon: 'Image',
         AllowIndexing: false,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Settings',
         ParentTypeName: 'File',
         DisplayName: '$Ctd-Settings,DisplayName',
         Description: '$Ctd-Settings,Description',
         Icon: 'Settings',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'NullFieldSetting',
                 Name: 'GlobalOnly',
                 DisplayName: 'Global only',
                 Description: 'Switching this ON will prevent the creation of local settings with the same name preventing others to gain access to the contents of this settings file through inheritance.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'IndexingSettings',
         ParentTypeName: 'Settings',
         DisplayName: '$Ctd-IndexingSettings,DisplayName',
         Description: '$Ctd-IndexingSettings,Description',
         Icon: 'Settings',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'NullFieldSetting',
                 Name: 'TextExtractorInstances',
                 DisplayName: 'Text extractor instances',
                 Description: 'Dynamically generated text extractor instance collection.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'LoggingSettings',
         ParentTypeName: 'Settings',
         DisplayName: '$Ctd-LoggingSettings,DisplayName',
         Description: '$Ctd-LoggingSettings,Description',
         Icon: 'Settings',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'PortalSettings',
         ParentTypeName: 'Settings',
         DisplayName: '$Ctd-PortalSettings,DisplayName',
         Description: '$Ctd-PortalSettings,Description',
         Icon: 'Settings',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'SystemFile',
         ParentTypeName: 'File',
         DisplayName: '$Ctd-SystemFile,DisplayName',
         Description: '$Ctd-SystemFile,Description',
         Icon: 'File',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Resource',
         ParentTypeName: 'SystemFile',
         DisplayName: '$Ctd-Resource,DisplayName',
         Description: '$Ctd-Resource,Description',
         Icon: 'Resource',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'NumberFieldSetting',
                 Name: 'Downloads',
                 DisplayName: 'Downloads',
                 Description: 'The number of downloads.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NumberFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Folder',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-Folder,DisplayName',
         Description: '$Ctd-Folder,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'ContentList',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-ContentList,DisplayName',
         Description: '$Ctd-ContentList,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'ContentListDefinition',
                 DisplayName: 'List Definition',
                 Description: 'XML definition for additional fields.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'DefaultView',
                 DisplayName: 'Default view',
                 Description: 'The default View to use.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['ListView'],
                 Name: 'AvailableViews',
                 DisplayName: 'Available views',
                 Description: 'Select global content list views here that you want to offer users to choose from.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['FieldSettingContent'],
                 Name: 'FieldSettingContents',
                 DisplayName: 'FieldSetting content',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['FieldSettingContent'],
                 Name: 'AvailableContentTypeFields',
                 DisplayName: 'Available ContentType Field content.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'ListEmail',
                 DisplayName: 'Email address of Content List',
                 Description: 'Emails sent to this address will be imported as Email content into the Document Library.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'ExchangeSubscriptionId',
                 DisplayName: 'Exchange Subscription Id',
                 Description: 'Ctd-ContentListen-USExchangeSubscriptionId-Descriptione',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'OverwriteFiles',
                 DisplayName: 'Overwrite files with same name',
                 Description: 'If checked new emails and attachments with the same name will overwrite existing items in list. Otherwise increment suffix is used in the name of new mail items.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'email', Text: 'Save all attachments as children of separate Email content', Enabled: true, Selected: true },
                     {Value: 'root', Text: 'Save all attachments in root', Enabled: true, Selected: false },
                     {Value: 'subject', Text: 'Save all attachments in folders grouped by subject', Enabled: true, Selected: false },
                     {Value: 'sender', Text: 'Save all attachments in folders grouped by sender', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'GroupAttachments',
                 DisplayName: 'Group attachments',
                 Description: 'Select the appropriate option to group attachment files under folders or email content or not.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'SaveOriginalEmail',
                 DisplayName: 'Save original email',
                 Description: 'A separate .eml file will be created for every incoming email.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 SelectionRoots: ['/Root/System/Schema/ContentTypes/GenericContent/Workflow/MailProcessorWorkflow'],
                 Name: 'IncomingEmailWorkflow',
                 DisplayName: 'Incoming email workflow',
                 Description: 'Select the workflow to be executed on every incoming email.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '/Root/System/Schema/ContentTypes/GenericContent/Workflow/MailProcessorWorkflow',
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'OnlyFromLocalGroups',
                 DisplayName: 'Accept e-mails only from users in local groups',
                 Description: 'If set, only users that are members of any local group are able to send e-mails to this library.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'InboxFolder',
                 DisplayName: 'Inbox folder',
                 Description: 'A relative path of a folder to store incoming e-mails.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['User'],
                 SelectionRoots: ['/Root/IMS'],
                 Name: 'OwnerWhenVisitor',
                 DisplayName: 'Owner of items created by visitor',
                 Description: 'If a Visitor adds content to this list, this user will be set as the creator instead of the Visitor. This prevents visitors see each others\' content.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '/Root/IMS/BuiltIn/Portal/Admin',
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Aspect',
         ParentTypeName: 'ContentList',
         DisplayName: '$Ctd-Aspect,DisplayName',
         Description: '$Ctd-Aspect,Description',
         Icon: 'Aspect',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'AspectDefinition',
                 DisplayName: 'Aspect definition',
                 Description: 'Definition of the extension in XML format.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.LongTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'ItemList',
         ParentTypeName: 'ContentList',
         DisplayName: '$Ctd-ItemList,DisplayName',
         Description: '$Ctd-ItemList,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'CustomList',
         ParentTypeName: 'ItemList',
         DisplayName: '$Ctd-CustomList,DisplayName',
         Description: '$Ctd-CustomList,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['ListItem'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'MemoList',
         ParentTypeName: 'ItemList',
         DisplayName: '$Ctd-MemoList,DisplayName',
         Description: '$Ctd-MemoList,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Memo'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'TaskList',
         ParentTypeName: 'ItemList',
         DisplayName: '$Ctd-TaskList,DisplayName',
         Description: '$Ctd-TaskList,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Task'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Library',
         ParentTypeName: 'ContentList',
         DisplayName: '$Ctd-Library,DisplayName',
         Description: '$Ctd-Library,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'DocumentLibrary',
         ParentTypeName: 'Library',
         DisplayName: '$Ctd-DocumentLibrary,DisplayName',
         Description: '$Ctd-DocumentLibrary,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Folder', 'File'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'ImageLibrary',
         ParentTypeName: 'Library',
         DisplayName: '$Ctd-ImageLibrary,DisplayName',
         Description: '$Ctd-ImageLibrary,Description',
         Icon: 'ContentList',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Folder', 'Image'],
         FieldSettings: [
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['Image'],
                 Name: 'CoverImage',
                 DisplayName: 'Cover image',
                 Description: 'Select cover image',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Device',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Device,DisplayName',
         Description: '$Ctd-Device,Description',
         Icon: 'Device',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'UserAgentPattern',
                 DisplayName: 'User agent string',
                 Description: 'A regular expression to match the user agent string of the browser.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Domain',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Domain,DisplayName',
         Description: '$Ctd-Domain,Description',
         Icon: 'Domain',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['User', 'Group', 'OrganizationalUnit'],
         FieldSettings: [
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'SyncGuid',
                 DisplayName: 'SyncGuid',
                 Description: 'GUID of corresponding AD object.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'LastSync',
                 DisplayName: 'LastSync',
                 Description: 'Date of last synchronization.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Domains',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Domains,DisplayName',
         Description: '$Ctd-Domains,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Domain'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Email',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Email,DisplayName',
         Description: '$Ctd-Email,Description',
         Icon: 'Document',
         AllowIndexing: true,
         AllowIncrementalNaming: true,
         AllowedChildTypes: ['File'],
         FieldSettings: [
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'From',
                 DisplayName: 'From',
                 Description: 'Sender name and address.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 TextType: FieldSettings.TextType.RichText,
                 Name: 'Body',
                 DisplayName: 'Body',
                 Description: 'Body of email.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:RichText'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'Sent',
                 DisplayName: 'Sent',
                 Description: 'Date of sending.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
         ]
         },

     {
         ContentTypeName: 'OrganizationalUnit',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-OrganizationalUnit,DisplayName',
         Description: '$Ctd-OrganizationalUnit,Description',
         Icon: 'OrgUnit',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['User', 'Group', 'OrganizationalUnit'],
         FieldSettings: [
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'SyncGuid',
                 DisplayName: 'SyncGuid',
                 Description: 'GUID of corresponding AD object.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'LastSync',
                 DisplayName: 'LastSync',
                 Description: 'Date of last synchronization.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
         ]
         },

     {
         ContentTypeName: 'PortalRoot',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-PortalRoot,DisplayName',
         Description: '$Ctd-PortalRoot,Description',
         Icon: 'PortalRoot',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Folder', 'SystemFolder', 'TrashBin', 'ContentList', 'CustomList', 'Sites', 'Domains', 'Profiles', 'Resources', 'Workspace'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'ProfileDomain',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-ProfileDomain,DisplayName',
         Description: '$Ctd-ProfileDomain,Description',
         Icon: 'Domain',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['UserProfile'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Profiles',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Profiles,DisplayName',
         Description: '$Ctd-Profiles,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['ProfileDomain'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'RuntimeContentContainer',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-RuntimeContentContainer,DisplayName',
         Description: '$Ctd-RuntimeContentContainer,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Sites',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Sites,DisplayName',
         Description: '$Ctd-Sites,Description',
         Icon: 'Site',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Site'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'SmartFolder',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-SmartFolder,DisplayName',
         Description: '$Ctd-SmartFolder,Description',
         Icon: 'SmartFolder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Query',
                 DisplayName: 'Query',
                 Description: 'Please give a query here that you want to use for collecting the children of this smart folder.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:QueryBuilder'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Default', Enabled: true, Selected: false },
                     {Value: '1', Text: 'Enabled', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Disabled', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: 'SenseNet.Search.FilterStatus',
                 Name: 'EnableAutofilters',
                 DisplayName: 'Enable autofilters',
                 Description: 'If autofilters are enabled, system content will be filtered from the query.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '0', Text: 'Default', Enabled: true, Selected: false },
                     {Value: '1', Text: 'Enabled', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Disabled', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: 'SenseNet.Search.FilterStatus',
                 Name: 'EnableLifespanFilter',
                 DisplayName: 'Enable lifespan filter',
                 Description: 'If lifespan filter is enabled, only valid content will be in the result.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'SystemFolder',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-SystemFolder,DisplayName',
         Description: '$Ctd-SystemFolder,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'Resources',
         ParentTypeName: 'SystemFolder',
         DisplayName: '$Ctd-Resources,DisplayName',
         Description: '$Ctd-Resources,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Resource'],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'TrashBag',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-TrashBag,DisplayName',
         Description: '$Ctd-TrashBag,Description',
         Icon: 'Folder',
         AllowIndexing: true,
         AllowIncrementalNaming: true,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'DateTimeFieldSetting',
                 Name: 'KeepUntil',
                 DisplayName: 'Keep until',
                 Description: 'The bag must be kept until this date.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'OriginalPath',
                 DisplayName: 'Original path',
                 Description: 'The path where the bag content were deleted from.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'WorkspaceRelativePath',
                 DisplayName: 'Ctd-TrashBagen-USWorkspaceRelativePath-DisplayName',
                 Description: 'Ctd-TrashBagen-USWorkspaceRelativePath-Description',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'WorkspaceId',
                 DisplayName: 'Ctd-TrashBagen-USWorkspaceId-DisplayName',
                 Description: 'Ctd-TrashBagen-USWorkspaceId-Description',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 Name: 'DeletedContent',
                 DisplayName: 'Deleted content',
                 Description: 'The actual deleted content inside this trash bag.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Workspace',
         ParentTypeName: 'Folder',
         DisplayName: '$Ctd-Workspace,DisplayName',
         Description: '$Ctd-Workspace,Description',
         Icon: 'Workspace',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Folder', 'DocumentLibrary', 'ImageLibrary', 'MemoList', 'TaskList', 'CustomList', 'Workspace'],
         FieldSettings: [
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['User'],
                 SelectionRoots: ['/Root/IMS', '/Root'],
                 Name: 'Manager',
                 DisplayName: 'Project manager',
                 Description: 'The person responsible for the project.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'Deadline',
                 DisplayName: 'Project deadline',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsActive',
                 DisplayName: 'Active',
                 Description: 'This workspace is currently active.',
                 ReadOnly: false,
                 Compulsory: true,
                 DefaultValue: 'true',
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['Skin'],
                 SelectionRoots: ['/Root/Skins'],
                 Name: 'WorkspaceSkin',
                 DisplayName: 'Skin',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsCritical',
                 DisplayName: 'Is critical',
                 Description: 'This workspace is currently in a critical status.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsWallContainer',
                 DisplayName: 'Wall Container',
                 Description: 'This workspace is configured to contain a wall - this indicates that posts are created under this workspace if Content are shared anywhere below this path.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'IsFollowed',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Site',
         ParentTypeName: 'Workspace',
         DisplayName: '$Ctd-Site,DisplayName',
         Description: '$Ctd-Site,Description',
         Icon: 'Site',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Folder', 'Workspace', 'Profiles', 'Image', 'DocumentLibrary', 'ImageLibrary', 'MemoList', 'TaskList', 'CustomList', 'SmartFolder'],
         FieldSettings: [
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'en', Text: 'English', Enabled: true, Selected: true },
                     {Value: 'hu', Text: 'Hungarian', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'Language',
                 DisplayName: 'Language',
                 Description: 'Please define the default language of this site.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'EnableClientBasedCulture',
                 DisplayName: 'Enable client-based culture',
                 Description: 'Enable this to allow user browser settings override default site language settings.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'EnableUserBasedCulture',
                 DisplayName: 'Enable user-based culture',
                 Description: 'Enable this to allow user language settings override default site language settings.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'UrlList',
                 DisplayName: 'URL list',
                 Description: 'Select the URLs to associate with this Site.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 SelectionRoots: ['.'],
                 Name: 'StartPage',
                 DisplayName: 'Alternative start page',
                 Description: 'If set, the site will use this start page instead of the default.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 SelectionRoots: ['.'],
                 Name: 'LoginPage',
                 DisplayName: 'Login page',
                 Description: 'The login page to display when a user tries to access restricted Content (Forms authentication only).',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['Skin'],
                 SelectionRoots: ['/Root/Skins'],
                 Name: 'SiteSkin',
                 DisplayName: 'Skin',
                 Description: '',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'DenyCrossSiteAccess',
                 DisplayName: 'Deny cross-site access',
                 Description: 'If set, content under this site can only be accessed via this site and not via other sites using a Root relative path.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'TrashBin',
         ParentTypeName: 'Workspace',
         DisplayName: '$Ctd-TrashBin,DisplayName',
         Description: '$Ctd-TrashBin,Description',
         Icon: 'trash',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['TrashBag'],
         FieldSettings: [
             {
                 Type: 'IntegerFieldSetting',
                 MinValue: 0,
                 Name: 'MinRetentionTime',
                 DisplayName: 'Minimum retention time (in days)',
                 Description: '',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 MinValue: 0,
                 Name: 'SizeQuota',
                 DisplayName: 'Size quota',
                 Description: 'Set the size quote for the trash bin (Megabytes).',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 MinValue: 0,
                 Name: 'BagCapacity',
                 DisplayName: 'Trashbag capacity',
                 Description: 'The maximum number of nodes accepted for trash in a single operation.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '100',
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
         ]
         },

     {
         ContentTypeName: 'UserProfile',
         ParentTypeName: 'Workspace',
         DisplayName: '$Ctd-UserProfile,DisplayName',
         Description: '$Ctd-UserProfile,Description',
         Icon: 'UserProfile',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['DocumentLibrary', 'MemoList', 'TaskList', 'ImageLibrary', 'CustomList'],
         FieldSettings: [
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['User'],
                 SelectionRoots: ['/Root/IMS'],
                 Name: 'User',
                 DisplayName: 'User',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Group',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-Group,DisplayName',
         Description: '$Ctd-Group,Description',
         Icon: 'Group',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['User', 'Group'],
                 SelectionRoots: ['/Root/IMS', '/Root'],
                 Name: 'Members',
                 DisplayName: 'Members',
                 Description: 'The members of this group.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'SyncGuid',
                 DisplayName: 'Sync Guid',
                 Description: 'GUID of corresponding AD object.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'LastSync',
                 DisplayName: 'Last synchronization',
                 Description: 'Date of last synchronization.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
         ]
         },

     {
         ContentTypeName: 'ListItem',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-ListItem,DisplayName',
         Description: '$Ctd-ListItem,Description',
         Icon: 'FormItem',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
         ]
         },

     {
         ContentTypeName: 'CustomListItem',
         ParentTypeName: 'ListItem',
         DisplayName: '$Ctd-CustomListItem,DisplayName',
         Description: '$Ctd-CustomListItem,Description',
         Icon: 'FormItem',
         AllowIndexing: true,
         AllowIncrementalNaming: true,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'NullFieldSetting',
                 Name: 'WorkflowsRunning',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Memo',
         ParentTypeName: 'ListItem',
         DisplayName: '$Ctd-Memo,DisplayName',
         Description: '$Ctd-Memo,Description',
         Icon: 'Document',
         AllowIndexing: true,
         AllowIncrementalNaming: true,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'Date',
                 DisplayName: 'Date',
                 Description: 'Please set the due date of the memo.',
                 ReadOnly: false,
                 Compulsory: false,
                 DefaultValue: '[Script:jScript] DateTime.UtcNow; [/Script]',
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: true,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'generic', Text: 'Generic', Enabled: true, Selected: true },
                     {Value: 'iso', Text: 'ISO', Enabled: true, Selected: false },
                     {Value: 'iaudit', Text: 'Internal audit', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'MemoType',
                 DisplayName: 'Memo type',
                 Description: 'Type of the memo.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 Name: 'SeeAlso',
                 DisplayName: 'See also...',
                 Description: 'A list of content this memo pertains to.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Task',
         ParentTypeName: 'ListItem',
         DisplayName: '$Ctd-Task,DisplayName',
         Description: '$Ctd-Task,Description',
         Icon: 'FormItem',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'StartDate',
                 DisplayName: 'Start date',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'DueDate',
                 DisplayName: 'Due date',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['User'],
                 SelectionRoots: ['/Root/IMS', '/Root'],
                 Name: 'AssignedTo',
                 DisplayName: 'Assigned to',
                 Description: 'List of internal stakeholders.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '1', Text: 'Urgent', Enabled: true, Selected: false },
                     {Value: '2', Text: 'Normal', Enabled: true, Selected: true },
                     {Value: '3', Text: 'Not urgent', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'Priority',
                 DisplayName: 'Priority',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'pending', Text: 'Pending', Enabled: true, Selected: false },
                     {Value: 'active', Text: 'Active', Enabled: true, Selected: true },
                     {Value: 'completed', Text: 'Completed', Enabled: true, Selected: false },
                     {Value: 'deferred', Text: 'Deferred', Enabled: true, Selected: false },
                     {Value: 'waiting', Text: 'Waiting', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'Status',
                 DisplayName: 'Status',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 MinValue: 0,
                 MaxValue: 100,
                 ShowAsPercentage: true,
                 Name: 'TaskCompletion',
                 DisplayName: 'Completion',
                 Description: 'Completion percentage of the task.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'IntegerFieldSetting',
                 Name: 'RemainingDays',
                 DisplayName: 'Remaining days',
                 Description: 'Number of remaining days.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.IntegerFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'DueText',
                 DisplayName: 'DueText',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'DueCssClass',
                 DisplayName: 'Due style',
                 Description: 'Css class',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
         ]
         },

     {
         ContentTypeName: 'Query',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-Query,DisplayName',
         Description: '$Ctd-Query,Description',
         Icon: 'Query',
         AllowIndexing: true,
         AllowIncrementalNaming: true,
         AllowedChildTypes: [],
         FieldSettings: [
             {
                 Type: 'LongTextFieldSetting',
                 Name: 'Query',
                 DisplayName: 'Query',
                 Description: 'Query text.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:QueryBuilder'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'Public', Text: 'Public', Enabled: true, Selected: true },
                     {Value: 'Private', Text: 'Private', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.RadioButtons,
                 EnumTypeName: '',
                 Name: 'QueryType',
                 DisplayName: 'Query type',
                 Description: 'Public queries are stored under the workspace, private queries are stored under the user profile.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
         ]
         },

     {
         ContentTypeName: 'User',
         ParentTypeName: 'GenericContent',
         DisplayName: '$Ctd-User,DisplayName',
         Description: '$Ctd-User,Description',
         Icon: 'User',
         AllowIndexing: true,
         AllowIncrementalNaming: false,
         AllowedChildTypes: ['Image'],
         FieldSettings: [
             {
                 Type: 'ShortTextFieldSetting',
                 MaxLength: 100,
                 Name: 'LoginName',
                 DisplayName: 'Login name',
                 Description: 'The name that the user has to type in on login forms (in some cases along with the domain name). It has to be unique under a domain.',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'JobTitle',
                 DisplayName: 'Job title',
                 Description: '',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Enabled',
                 DisplayName: 'Enabled',
                 Description: 'User account is enabled.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Domain',
                 DisplayName: 'Domain',
                 Description: 'The domain of the user.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Regex: '^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$',
                 Name: 'Email',
                 DisplayName: 'E-mail',
                 Description: 'The e-mail of the user.',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Regex: '[^<]+',
                 Name: 'FullName',
                 DisplayName: 'Full name',
                 Description: 'Full name of the user (e.g. John Smith).',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 Name: 'ImageRef',
                 DisplayName: 'Cover image (reference)',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'BinaryFieldSetting',
                 Name: 'ImageData',
                 DisplayName: 'Cover image (binarydata)',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.BinaryFieldSetting,
             {
                 Type: 'NullFieldSetting',
                 Name: 'Avatar',
                 DisplayName: 'Avatar',
                 Description: 'Avatar image of user.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0,
                 ControlHint: 'sn:Image'
             } as FieldSettings.NullFieldSetting,
             {
                 Type: 'PasswordFieldSetting',
                 ReenterTitle: 'Re-enter password',
                 ReenterDescription: 'Re-enter password.',
                 PasswordHistoryLength: 0,
                 Name: 'Password',
                 DisplayName: 'Password',
                 Description: 'User password.',
                 ReadOnly: false,
                 Compulsory: true,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.PasswordFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'SyncGuid',
                 DisplayName: 'SyncGuid',
                 Description: 'GUID of corresponding AD object.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.DateAndTime,
                 Name: 'LastSync',
                 DisplayName: 'LastSync',
                 Description: 'Date of last synchronization.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'CaptchaFieldSetting',
                 Name: 'Captcha',
                 DisplayName: 'Captcha text',
                 Description: 'Captcha text entered by the user.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.CaptchaFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: false,
                 AllowedTypes: ['User'],
                 SelectionRoots: ['/Root/IMS'],
                 Name: 'Manager',
                 DisplayName: 'Manager',
                 Description: 'Manager of the user.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Department',
                 DisplayName: 'Department',
                 Description: 'Department of employee.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'Languages',
                 DisplayName: 'Languages',
                 Description: 'Spoken languages.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Regex: '(^\\d*([-\\s\\+\\(\\)]\\d*)*$)?',
                 Name: 'Phone',
                 DisplayName: 'Phone',
                 Description: 'Phone number. (e.g. +123456789 or 1234).',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '...', Text: '...', Enabled: true, Selected: false },
                     {Value: 'Female', Text: 'Female', Enabled: true, Selected: false },
                     {Value: 'Male', Text: 'Male', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'Gender',
                 DisplayName: 'Gender',
                 Description: 'Select one.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: '...', Text: '...', Enabled: true, Selected: false },
                     {Value: 'Single', Text: 'Single', Enabled: true, Selected: false },
                     {Value: 'Married', Text: 'Married', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'MaritalStatus',
                 DisplayName: 'Marital status',
                 Description: 'Select one.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'DateTimeFieldSetting',
                 DateTimeMode: FieldSettings.DateTimeMode.Date,
                 Name: 'BirthDate',
                 DisplayName: 'Birth date',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.DateTimeFieldSetting,
             {
                 Type: 'LongTextFieldSetting',
                 TextType: FieldSettings.TextType.LongText,
                 Name: 'Education',
                 DisplayName: 'Education',
                 Description: 'List of educations - e.g. high school, university.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0,
                 ControlHint: 'sn:EducationEditor'
             } as FieldSettings.LongTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'TwitterAccount',
                 DisplayName: 'Twitter account',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'FacebookURL',
                 DisplayName: 'Facebook URL',
                 Description: 'http://www.facebook.com/USERNAME.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'LinkedInURL',
                 DisplayName: 'LinkedIn URL',
                 Description: 'http://www.linkedin.com/USERNAME.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
             {
                 Type: 'ChoiceFieldSetting',
                 AllowExtraValue: false,
                 AllowMultiple: false,
                 Options: [
                     {Value: 'en', Text: 'English', Enabled: true, Selected: true },
                     {Value: 'hu', Text: 'Hungarian', Enabled: true, Selected: false }
                 ],
                 DisplayChoice: FieldSettings.DisplayChoice.DropDown,
                 EnumTypeName: '',
                 Name: 'Language',
                 DisplayName: 'Selected language',
                 Description: 'Language used to display texts on the site, if it is available.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Show,
                 VisibleEdit: FieldSettings.FieldVisibility.Show,
                 VisibleNew: FieldSettings.FieldVisibility.Show,
                 DefaultOrder: 0
             } as FieldSettings.ChoiceFieldSetting,
             {
                 Type: 'ReferenceFieldSetting',
                 AllowMultiple: true,
                 AllowedTypes: ['Workspace'],
                 Name: 'FollowedWorkspaces',
                 DisplayName: 'Followed workspaces',
                 Description: 'List of workspaces followed by the user.',
                 ReadOnly: false,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Advanced,
                 VisibleEdit: FieldSettings.FieldVisibility.Advanced,
                 VisibleNew: FieldSettings.FieldVisibility.Advanced,
                 DefaultOrder: 0
             } as FieldSettings.ReferenceFieldSetting,
             {
                 Type: 'ShortTextFieldSetting',
                 Name: 'ProfilePath',
                 DisplayName: 'Profile path',
                 Description: 'Path of the user\'s personal workspace.',
                 ReadOnly: true,
                 Compulsory: false,
                 VisibleBrowse: FieldSettings.FieldVisibility.Hide,
                 VisibleEdit: FieldSettings.FieldVisibility.Hide,
                 VisibleNew: FieldSettings.FieldVisibility.Hide,
                 DefaultOrder: 0
             } as FieldSettings.ShortTextFieldSetting,
         ]
         },
];
