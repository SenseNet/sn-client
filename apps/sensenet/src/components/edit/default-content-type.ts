export const defaultContentType = `<ContentType name="MyType" parentType="GenericContent" handler="SenseNet.ContentRepository.GenericContent" xmlns="http://schemas.sensenet.com/SenseNet/ContentRepository/ContentTypeDefinition">
  <DisplayName>MyType</DisplayName>
  <Description></Description>
  <Icon>Content</Icon>
  <AllowIncrementalNaming>true</AllowIncrementalNaming>
  <AllowedChildTypes></AllowedChildTypes>
  <Fields>
  </Fields>
</ContentType>`

// type defaultFieldSettingsType = {
//   [key: string]: {
//     title: string
//     value: string
//   }
// }

// object which will contain the field settings from textfields. There will be a title for button and a value which will be the field setting itself
export const defaultFieldSettings = [
  {
    name: 'shorttextfield',
    title: 'Short TextField',
    value: `  <Field name="ShortTextField" type="ShortText">
      <DisplayName>ShortTextField</DisplayName>
      <Description></Description>
      <Configuration>
        <MaxLength>100</MaxLength>
        <MinLength>0</MinLength>
        <Regex>[a-zA-Z0-9]*$</Regex>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'longtextfield',
    title: 'Long TextField',
    value: `  <Field name="LongTextField" type="LongText">
      <DisplayName>LongTextField</DisplayName>
      <Description></Description>
      <Configuration>
        <MaxLength>100</MaxLength>
        <MinLength>0</MinLength>
        <TextType>LongText|RichText|AdvancedRichText</TextType>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'numberfield',
    title: 'NumberField',
    value: `  <Field name="NumberField" type="Number">
      <DisplayName>NumberField</DisplayName>
      <Description></Description>
      <Configuration>
        <MinValue>0</MinValue>
        <MaxValue>100.5</MaxValue>
        <Digits>2</Digits>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'integerfield',
    title: 'IntegerField',
    value: `  <Field name="IntegerField" type="Integer">
      <DisplayName>IntegerField</DisplayName>
      <Description></Description>
      <Configuration>
        <MinValue>0</MinValue>
        <MaxValue>100</MaxValue>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'booleanfield',
    title: 'BooleanField',
    value: `  <Field name="BooleanField" type="Boolean">
      <DisplayName>BooleanField</DisplayName>
      <Description></Description>
      <Configuration>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'choicefield',
    title: 'ChoiceField',
    value: `  <Field name="ChoiceField" type="Choice">
      <DisplayName>ChoiceField</DisplayName>
      <Description></Description>
      <Configuration>
        <AllowMultiple>false</AllowMultiple>
        <AllowExtraValue>false</AllowExtraValue>
        <Options>
          <Option selected="true">1</Option>
          <Option>2</Option>
        </Options>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'datetimefield',
    title: 'DateTime Field',
    value: `  <Field name="DateTimeField" type="DateTime">
      <DisplayName>DateTimeField</DisplayName>
      <Description></Description>
      <Configuration>
        <DateTimeMode>DateAndTime</DateTimeMode>
        <Precision>Second</Precision>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'referencefield',
    title: 'Reference Field',
    value: `  <Field name="ReferenceField" type="Reference">
      <DisplayName>ReferenceField</DisplayName>
      <Description></Description>
      <Configuration>
        <AllowMultiple>true</AllowMultiple>
        <AllowedTypes>
          <Type>Type1</Type>
          <Type>Type2</Type>
        </AllowedTypes>
        <SelectionRoot>
          <Path>/Root/Path1</Path>
          <Path>/Root/Path2</Path>
        </SelectionRoot>
        <DefaultValue>/Root/Path1,/Root/Path2</DefaultValue>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
      </Configuration>
    </Field>
  `,
  },
  {
    name: 'binaryfield',
    title: 'Binary Field',
    value: `  <Field name="BinaryField" type="Binary">
      <DisplayName>BinaryField</DisplayName>
      <Description></Description>
      <Configuration>
        <IsText>true</IsText>
        <ReadOnly>false</ReadOnly>
        <Compulsory>false</Compulsory>
        <DefaultValue></DefaultValue>
        <VisibleBrowse>Show|Hide|Advanced</VisibleBrowse>
        <VisibleEdit>Show|Hide|Advanced</VisibleEdit>
        <VisibleNew>Show|Hide|Advanced</VisibleNew>
        </Configuration>
    </Field>
  `,
  },
] as const
