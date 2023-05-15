/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  AgeRangeEnum: "above_fortyfive" | "eighteen_to_twentyfour" | "thirtyfive_to_fortyfour" | "twentyfive_to_thirtyfour" | "under_18"
  GenderEnum: "female" | "male" | "nonbinary" | "other"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  AthleteData: { // root type
    description?: string | null; // String
    display_name?: string | null; // String
    id?: number | null; // Int
    image_url?: string | null; // String
    incentives?: Array<string | null> | null; // [String]
    sport?: string | null; // String
  }
  AuthData: { // root type
    athlete_data?: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    athletes?: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    completion_status?: string | null; // String
    content_data?: Array<NexusGenRootTypes['UserContent'] | null> | null; // [UserContent]
    email?: string | null; // String
    incentives?: Array<string | null> | null; // [String]
    max_id?: number | null; // Int
    sports?: Array<string | null> | null; // [String]
    suggestions?: Array<NexusGenRootTypes['SuggestionsData'] | null> | null; // [SuggestionsData]
    token?: string | null; // String
  }
  Mutation: {};
  MutationResponse: { // root type
    data?: NexusGenRootTypes['AuthData'] | null; // AuthData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  Query: {};
  SuggestionsData: { // root type
    display_name?: string | null; // String
    id?: number | null; // Int
    image_url?: string | null; // String
    sport?: string | null; // String
  }
  UserContent: { // root type
    athlete_display_name?: string | null; // String
    athlete_image_url?: string | null; // String
    content_caption?: string | null; // String
    content_media_url?: string | null; // String
    distance?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  AthleteData: { // field return type
    description: string | null; // String
    display_name: string | null; // String
    id: number | null; // Int
    image_url: string | null; // String
    incentives: Array<string | null> | null; // [String]
    sport: string | null; // String
  }
  AuthData: { // field return type
    athlete_data: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    athletes: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    completion_status: string | null; // String
    content_data: Array<NexusGenRootTypes['UserContent'] | null> | null; // [UserContent]
    email: string | null; // String
    incentives: Array<string | null> | null; // [String]
    max_id: number | null; // Int
    sports: Array<string | null> | null; // [String]
    suggestions: Array<NexusGenRootTypes['SuggestionsData'] | null> | null; // [SuggestionsData]
    token: string | null; // String
  }
  Mutation: { // field return type
    add_content: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    athlete_signin: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    athlete_signup: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    interests: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    signin: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    signup: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    waitlist: NexusGenRootTypes['MutationResponse']; // MutationResponse!
  }
  MutationResponse: { // field return type
    data: NexusGenRootTypes['AuthData'] | null; // AuthData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  Query: { // field return type
    athletes: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    fetch_user_content: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    fetch_user_suggestions: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    user_fetch_incentives: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    user_fetch_sports: NexusGenRootTypes['MutationResponse']; // MutationResponse!
  }
  SuggestionsData: { // field return type
    display_name: string | null; // String
    id: number | null; // Int
    image_url: string | null; // String
    sport: string | null; // String
  }
  UserContent: { // field return type
    athlete_display_name: string | null; // String
    athlete_image_url: string | null; // String
    content_caption: string | null; // String
    content_media_url: string | null; // String
    distance: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  AthleteData: { // field return type name
    description: 'String'
    display_name: 'String'
    id: 'Int'
    image_url: 'String'
    incentives: 'String'
    sport: 'String'
  }
  AuthData: { // field return type name
    athlete_data: 'AthleteData'
    athletes: 'AthleteData'
    completion_status: 'String'
    content_data: 'UserContent'
    email: 'String'
    incentives: 'String'
    max_id: 'Int'
    sports: 'String'
    suggestions: 'SuggestionsData'
    token: 'String'
  }
  Mutation: { // field return type name
    add_content: 'MutationResponse'
    athlete_signin: 'MutationResponse'
    athlete_signup: 'MutationResponse'
    interests: 'MutationResponse'
    signin: 'MutationResponse'
    signup: 'MutationResponse'
    waitlist: 'MutationResponse'
  }
  MutationResponse: { // field return type name
    data: 'AuthData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  Query: { // field return type name
    athletes: 'MutationResponse'
    fetch_user_content: 'MutationResponse'
    fetch_user_suggestions: 'MutationResponse'
    user_fetch_incentives: 'MutationResponse'
    user_fetch_sports: 'MutationResponse'
  }
  SuggestionsData: { // field return type name
    display_name: 'String'
    id: 'Int'
    image_url: 'String'
    sport: 'String'
  }
  UserContent: { // field return type name
    athlete_display_name: 'String'
    athlete_image_url: 'String'
    content_caption: 'String'
    content_media_url: 'String'
    distance: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    add_content: { // args
      caption: string; // String!
      media_url?: string | null; // String
    }
    athlete_signin: { // args
      email: string; // String!
      password: string; // String!
    }
    athlete_signup: { // args
      display_name: string; // String!
      email: string; // String!
      incentives: Array<string | null>; // [String]!
      name: string; // String!
      password: string; // String!
      phone: string; // String!
      sports: Array<string | null>; // [String]!
    }
    interests: { // args
      athletes: Array<number | null>; // [Int]!
      incentives: Array<string | null>; // [String]!
      sports: Array<string | null>; // [String]!
    }
    signin: { // args
      email: string; // String!
      password: string; // String!
    }
    signup: { // args
      age_range?: NexusGenEnums['AgeRangeEnum'] | null; // AgeRangeEnum
      email: string; // String!
      gender?: NexusGenEnums['GenderEnum'] | null; // GenderEnum
      name: string; // String!
      password: string; // String!
      phone: string; // String!
    }
    waitlist: { // args
      email: string; // String!
    }
  }
  Query: {
    athletes: { // args
      limit: number; // Int!
      next_min_id?: number | null; // Int
      sports: Array<string | null>; // [String]!
    }
    fetch_user_content: { // args
      athlete_select_id?: number | null; // Int
      limit: number; // Int!
      next_min_id?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}