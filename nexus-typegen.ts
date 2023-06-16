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
  ActivityTmpl: { // root type
    athlete?: string | null; // String
    distance?: string | null; // String
    id?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    status?: string | null; // String
  }
  AthleteBasicStats: { // root type
    fixed_items_count?: number | null; // Int
    follower_count?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    variable_items_count?: number | null; // Int
  }
  AthleteBio: { // root type
    events_count?: number | null; // Int
    follower_count?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    posts_count?: number | null; // Int
  }
  AthleteData: { // root type
    description?: string | null; // String
    id?: number | null; // Int
    image_url?: string | null; // String
    incentives?: Array<string | null> | null; // [String]
    name?: string | null; // String
    sport?: string | null; // String
  }
  AthleteFetchBasicsResponse: { // root type
    data?: NexusGenRootTypes['AthleteFetchBasicsResponseData'] | null; // AthleteFetchBasicsResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteFetchBasicsResponseData: { // root type
    athlete_bio?: NexusGenRootTypes['AthleteBasicStats'] | null; // AthleteBasicStats
  }
  AthleteProductsFetchData: { // root type
    products?: Array<NexusGenRootTypes['ProductsTmpl'] | null> | null; // [ProductsTmpl]
  }
  AthleteProductsFetchResponse: { // root type
    data?: NexusGenRootTypes['AthleteProductsFetchData'] | null; // AthleteProductsFetchData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteResData: { // root type
    description?: string | null; // String
    id?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    sport?: string | null; // String
  }
  AthleteSalesData: { // root type
    sales?: Array<NexusGenRootTypes['SalesTmpl'] | null> | null; // [SalesTmpl]
  }
  AthleteSalesResponse: { // root type
    data?: NexusGenRootTypes['AthleteSalesData'] | null; // AthleteSalesData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteSettings: { // root type
    description?: string | null; // String
    notifications_preference?: Array<string | null> | null; // [String]
  }
  AthleteSettingsFetchData: { // root type
    settings?: NexusGenRootTypes['SettingsTmpl'] | null; // SettingsTmpl
  }
  AthleteSettingsFetchResponse: { // root type
    data?: NexusGenRootTypes['AthleteSettingsFetchData'] | null; // AthleteSettingsFetchData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteTopFollowersData: { // root type
    top_followers?: Array<NexusGenRootTypes['TopFollowerStats'] | null> | null; // [TopFollowerStats]
  }
  AthleteTopFollowersResponse: { // root type
    data?: NexusGenRootTypes['AthleteTopFollowersData'] | null; // AthleteTopFollowersData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AuthData: { // root type
    athlete_bio?: NexusGenRootTypes['AthleteBio'] | null; // AthleteBio
    athlete_data?: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    athletes?: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    completion_status?: string | null; // String
    content_data?: Array<NexusGenRootTypes['UserContent'] | null> | null; // [UserContent]
    email?: string | null; // String
    incentives?: Array<string | null> | null; // [String]
    max_id?: number | null; // Int
    products?: Array<NexusGenRootTypes['Products'] | null> | null; // [Products]
    sales?: Array<NexusGenRootTypes['Sales'] | null> | null; // [Sales]
    settings?: NexusGenRootTypes['AthleteSettings'] | null; // AthleteSettings
    signed_url?: string | null; // String
    sports?: Array<string | null> | null; // [String]
    suggestions?: Array<NexusGenRootTypes['SuggestionsData'] | null> | null; // [SuggestionsData]
    token?: string | null; // String
    top_followers?: Array<NexusGenRootTypes['TopFollowers'] | null> | null; // [TopFollowers]
  }
  BaseResponse: { // root type
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  Mutation: {};
  MutationResponse: { // root type
    data?: NexusGenRootTypes['AuthData'] | null; // AuthData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  NotifsTmpl: { // root type
    id?: number | null; // Int
    message?: string | null; // String
    status?: string | null; // String
  }
  Products: { // root type
    currency?: string | null; // String
    media_url?: string | null; // String
    name?: string | null; // String
    price?: number | null; // Float
    quantity?: number | null; // Int
  }
  ProductsTmpl: { // root type
    currency?: string | null; // String
    id?: number | null; // Int
    media_url?: string | null; // String
    name?: string | null; // String
    price?: number | null; // Float
    quantity?: number | null; // Int
  }
  Query: {};
  Sales: { // root type
    month?: string | null; // String
    total_sales?: number | null; // Float
    year?: number | null; // Int
  }
  SalesTmpl: { // root type
    month?: string | null; // String
    total_sales?: number | null; // Float
    year?: number | null; // Int
  }
  SettingsTmpl: { // root type
    description?: string | null; // String
    notifications_preference?: Array<string | null> | null; // [String]
  }
  SuggestionsData: { // root type
    id?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    sport?: string | null; // String
  }
  SuggestionsResData: { // root type
    id?: number | null; // Int
    image_url?: string | null; // String
    name?: string | null; // String
    sport?: string | null; // String
  }
  TokenData: { // root type
    token?: string | null; // String
  }
  TokenResponse: { // root type
    data?: NexusGenRootTypes['TokenData'] | null; // TokenData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  TopFollowerStats: { // root type
    email?: string | null; // String
    id?: number | null; // Int
    name?: string | null; // String
  }
  TopFollowers: { // root type
    email?: string | null; // String
    id?: number | null; // Int
    name?: string | null; // String
  }
  UserContent: { // root type
    athlete_image_url?: string | null; // String
    athlete_name?: string | null; // String
    content_caption?: string | null; // String
    content_media_url?: string | null; // String
    distance?: string | null; // String
  }
  UserFetchActivityResponse: { // root type
    data?: NexusGenRootTypes['UserFetchFollowingData'] | null; // UserFetchFollowingData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchAthletesResponse: { // root type
    data?: NexusGenRootTypes['UserFetchAthletesResponseData'] | null; // UserFetchAthletesResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchAthletesResponseData: { // root type
    athlete_data?: Array<NexusGenRootTypes['AthleteResData'] | null> | null; // [AthleteResData]
    max_id?: number | null; // Int
  }
  UserFetchFollowingData: { // root type
    activity?: Array<NexusGenRootTypes['ActivityTmpl'] | null> | null; // [ActivityTmpl]
    max_id?: number | null; // Int
    points?: number | null; // Int
  }
  UserFetchIncentivesData: { // root type
    incentives?: Array<string | null> | null; // [String]
  }
  UserFetchIncentivesResponse: { // root type
    data?: NexusGenRootTypes['UserFetchIncentivesData'] | null; // UserFetchIncentivesData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchNotifSettingsData: { // root type
    notifications_preference?: Array<string | null> | null; // [String]
  }
  UserFetchNotifSettingsResponse: { // root type
    data?: NexusGenRootTypes['UserFetchNotifSettingsData'] | null; // UserFetchNotifSettingsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchNotificationsData: { // root type
    notifications?: Array<NexusGenRootTypes['NotifsTmpl'] | null> | null; // [NotifsTmpl]
  }
  UserFetchNotificationsResponse: { // root type
    data?: NexusGenRootTypes['UserFetchNotificationsData'] | null; // UserFetchNotificationsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSportsData: { // root type
    sports?: Array<string | null> | null; // [String]
  }
  UserFetchSportsResponse: { // root type
    data?: NexusGenRootTypes['UserFetchSportsData'] | null; // UserFetchSportsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSuggestionsResponse: { // root type
    data?: NexusGenRootTypes['UserFetchSuggestionsResponseData'] | null; // UserFetchSuggestionsResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSuggestionsResponseData: { // root type
    suggestions?: Array<NexusGenRootTypes['SuggestionsResData'] | null> | null; // [SuggestionsResData]
  }
  UserSigninData: { // root type
    completion_status?: string | null; // String
    token?: string | null; // String
  }
  UserSigninResponse: { // root type
    data?: NexusGenRootTypes['UserSigninData'] | null; // UserSigninData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  ActivityTmpl: { // field return type
    athlete: string | null; // String
    distance: string | null; // String
    id: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    status: string | null; // String
  }
  AthleteBasicStats: { // field return type
    fixed_items_count: number | null; // Int
    follower_count: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    variable_items_count: number | null; // Int
  }
  AthleteBio: { // field return type
    events_count: number | null; // Int
    follower_count: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    posts_count: number | null; // Int
  }
  AthleteData: { // field return type
    description: string | null; // String
    id: number | null; // Int
    image_url: string | null; // String
    incentives: Array<string | null> | null; // [String]
    name: string | null; // String
    sport: string | null; // String
  }
  AthleteFetchBasicsResponse: { // field return type
    data: NexusGenRootTypes['AthleteFetchBasicsResponseData'] | null; // AthleteFetchBasicsResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteFetchBasicsResponseData: { // field return type
    athlete_bio: NexusGenRootTypes['AthleteBasicStats'] | null; // AthleteBasicStats
  }
  AthleteProductsFetchData: { // field return type
    products: Array<NexusGenRootTypes['ProductsTmpl'] | null> | null; // [ProductsTmpl]
  }
  AthleteProductsFetchResponse: { // field return type
    data: NexusGenRootTypes['AthleteProductsFetchData'] | null; // AthleteProductsFetchData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteResData: { // field return type
    description: string | null; // String
    id: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    sport: string | null; // String
  }
  AthleteSalesData: { // field return type
    sales: Array<NexusGenRootTypes['SalesTmpl'] | null> | null; // [SalesTmpl]
  }
  AthleteSalesResponse: { // field return type
    data: NexusGenRootTypes['AthleteSalesData'] | null; // AthleteSalesData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteSettings: { // field return type
    description: string | null; // String
    notifications_preference: Array<string | null> | null; // [String]
  }
  AthleteSettingsFetchData: { // field return type
    settings: NexusGenRootTypes['SettingsTmpl'] | null; // SettingsTmpl
  }
  AthleteSettingsFetchResponse: { // field return type
    data: NexusGenRootTypes['AthleteSettingsFetchData'] | null; // AthleteSettingsFetchData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AthleteTopFollowersData: { // field return type
    top_followers: Array<NexusGenRootTypes['TopFollowerStats'] | null> | null; // [TopFollowerStats]
  }
  AthleteTopFollowersResponse: { // field return type
    data: NexusGenRootTypes['AthleteTopFollowersData'] | null; // AthleteTopFollowersData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  AuthData: { // field return type
    athlete_bio: NexusGenRootTypes['AthleteBio'] | null; // AthleteBio
    athlete_data: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    athletes: Array<NexusGenRootTypes['AthleteData'] | null> | null; // [AthleteData]
    completion_status: string | null; // String
    content_data: Array<NexusGenRootTypes['UserContent'] | null> | null; // [UserContent]
    email: string | null; // String
    incentives: Array<string | null> | null; // [String]
    max_id: number | null; // Int
    products: Array<NexusGenRootTypes['Products'] | null> | null; // [Products]
    sales: Array<NexusGenRootTypes['Sales'] | null> | null; // [Sales]
    settings: NexusGenRootTypes['AthleteSettings'] | null; // AthleteSettings
    signed_url: string | null; // String
    sports: Array<string | null> | null; // [String]
    suggestions: Array<NexusGenRootTypes['SuggestionsData'] | null> | null; // [SuggestionsData]
    token: string | null; // String
    top_followers: Array<NexusGenRootTypes['TopFollowers'] | null> | null; // [TopFollowers]
  }
  BaseResponse: { // field return type
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  Mutation: { // field return type
    athlete_signin: NexusGenRootTypes['TokenResponse']; // TokenResponse!
    athlete_signup: NexusGenRootTypes['TokenResponse']; // TokenResponse!
    athlete_update_info: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    athlete_update_settings: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    create_fixed_product: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    create_variable_product: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    interests: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    s3_upload: NexusGenRootTypes['MutationResponse']; // MutationResponse!
    signin: NexusGenRootTypes['UserSigninResponse']; // UserSigninResponse!
    signup: NexusGenRootTypes['TokenResponse']; // TokenResponse!
    user_create_sale: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    user_follow_athlete: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    user_logout: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    user_update_notif_settings: NexusGenRootTypes['BaseResponse']; // BaseResponse!
    waitlist: NexusGenRootTypes['BaseResponse']; // BaseResponse!
  }
  MutationResponse: { // field return type
    data: NexusGenRootTypes['AuthData'] | null; // AuthData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  NotifsTmpl: { // field return type
    id: number | null; // Int
    message: string | null; // String
    status: string | null; // String
  }
  Products: { // field return type
    currency: string | null; // String
    media_url: string | null; // String
    name: string | null; // String
    price: number | null; // Float
    quantity: number | null; // Int
  }
  ProductsTmpl: { // field return type
    currency: string | null; // String
    id: number | null; // Int
    media_url: string | null; // String
    name: string | null; // String
    price: number | null; // Float
    quantity: number | null; // Int
  }
  Query: { // field return type
    athlete_fetch_settings: NexusGenRootTypes['AthleteSettingsFetchResponse']; // AthleteSettingsFetchResponse!
    athletes: NexusGenRootTypes['UserFetchAthletesResponse']; // UserFetchAthletesResponse!
    fetch_athlete_basics: NexusGenRootTypes['AthleteFetchBasicsResponse']; // AthleteFetchBasicsResponse!
    fetch_athlete_sales: NexusGenRootTypes['AthleteSalesResponse']; // AthleteSalesResponse!
    fetch_athlete_top_followers: NexusGenRootTypes['AthleteTopFollowersResponse']; // AthleteTopFollowersResponse!
    fetch_products: NexusGenRootTypes['AthleteProductsFetchResponse']; // AthleteProductsFetchResponse!
    fetch_user_suggestions: NexusGenRootTypes['UserFetchSuggestionsResponse']; // UserFetchSuggestionsResponse!
    user_activity: NexusGenRootTypes['UserFetchActivityResponse']; // UserFetchActivityResponse!
    user_fetch_incentives: NexusGenRootTypes['UserFetchIncentivesResponse']; // UserFetchIncentivesResponse!
    user_fetch_notif_settings: NexusGenRootTypes['UserFetchNotifSettingsResponse']; // UserFetchNotifSettingsResponse!
    user_fetch_notifications: NexusGenRootTypes['UserFetchNotificationsResponse']; // UserFetchNotificationsResponse!
    user_fetch_sports: NexusGenRootTypes['UserFetchSportsResponse']; // UserFetchSportsResponse!
    user_following: NexusGenRootTypes['UserFetchAthletesResponse']; // UserFetchAthletesResponse!
  }
  Sales: { // field return type
    month: string | null; // String
    total_sales: number | null; // Float
    year: number | null; // Int
  }
  SalesTmpl: { // field return type
    month: string | null; // String
    total_sales: number | null; // Float
    year: number | null; // Int
  }
  SettingsTmpl: { // field return type
    description: string | null; // String
    notifications_preference: Array<string | null> | null; // [String]
  }
  SuggestionsData: { // field return type
    id: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    sport: string | null; // String
  }
  SuggestionsResData: { // field return type
    id: number | null; // Int
    image_url: string | null; // String
    name: string | null; // String
    sport: string | null; // String
  }
  TokenData: { // field return type
    token: string | null; // String
  }
  TokenResponse: { // field return type
    data: NexusGenRootTypes['TokenData'] | null; // TokenData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  TopFollowerStats: { // field return type
    email: string | null; // String
    id: number | null; // Int
    name: string | null; // String
  }
  TopFollowers: { // field return type
    email: string | null; // String
    id: number | null; // Int
    name: string | null; // String
  }
  UserContent: { // field return type
    athlete_image_url: string | null; // String
    athlete_name: string | null; // String
    content_caption: string | null; // String
    content_media_url: string | null; // String
    distance: string | null; // String
  }
  UserFetchActivityResponse: { // field return type
    data: NexusGenRootTypes['UserFetchFollowingData'] | null; // UserFetchFollowingData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchAthletesResponse: { // field return type
    data: NexusGenRootTypes['UserFetchAthletesResponseData'] | null; // UserFetchAthletesResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchAthletesResponseData: { // field return type
    athlete_data: Array<NexusGenRootTypes['AthleteResData'] | null> | null; // [AthleteResData]
    max_id: number | null; // Int
  }
  UserFetchFollowingData: { // field return type
    activity: Array<NexusGenRootTypes['ActivityTmpl'] | null> | null; // [ActivityTmpl]
    max_id: number | null; // Int
    points: number | null; // Int
  }
  UserFetchIncentivesData: { // field return type
    incentives: Array<string | null> | null; // [String]
  }
  UserFetchIncentivesResponse: { // field return type
    data: NexusGenRootTypes['UserFetchIncentivesData'] | null; // UserFetchIncentivesData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchNotifSettingsData: { // field return type
    notifications_preference: Array<string | null> | null; // [String]
  }
  UserFetchNotifSettingsResponse: { // field return type
    data: NexusGenRootTypes['UserFetchNotifSettingsData'] | null; // UserFetchNotifSettingsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchNotificationsData: { // field return type
    notifications: Array<NexusGenRootTypes['NotifsTmpl'] | null> | null; // [NotifsTmpl]
  }
  UserFetchNotificationsResponse: { // field return type
    data: NexusGenRootTypes['UserFetchNotificationsData'] | null; // UserFetchNotificationsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSportsData: { // field return type
    sports: Array<string | null> | null; // [String]
  }
  UserFetchSportsResponse: { // field return type
    data: NexusGenRootTypes['UserFetchSportsData'] | null; // UserFetchSportsData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSuggestionsResponse: { // field return type
    data: NexusGenRootTypes['UserFetchSuggestionsResponseData'] | null; // UserFetchSuggestionsResponseData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
  UserFetchSuggestionsResponseData: { // field return type
    suggestions: Array<NexusGenRootTypes['SuggestionsResData'] | null> | null; // [SuggestionsResData]
  }
  UserSigninData: { // field return type
    completion_status: string | null; // String
    token: string | null; // String
  }
  UserSigninResponse: { // field return type
    data: NexusGenRootTypes['UserSigninData'] | null; // UserSigninData
    error: boolean; // Boolean!
    message: string; // String!
    status: number; // Int!
  }
}

export interface NexusGenFieldTypeNames {
  ActivityTmpl: { // field return type name
    athlete: 'String'
    distance: 'String'
    id: 'Int'
    image_url: 'String'
    name: 'String'
    status: 'String'
  }
  AthleteBasicStats: { // field return type name
    fixed_items_count: 'Int'
    follower_count: 'Int'
    image_url: 'String'
    name: 'String'
    variable_items_count: 'Int'
  }
  AthleteBio: { // field return type name
    events_count: 'Int'
    follower_count: 'Int'
    image_url: 'String'
    name: 'String'
    posts_count: 'Int'
  }
  AthleteData: { // field return type name
    description: 'String'
    id: 'Int'
    image_url: 'String'
    incentives: 'String'
    name: 'String'
    sport: 'String'
  }
  AthleteFetchBasicsResponse: { // field return type name
    data: 'AthleteFetchBasicsResponseData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  AthleteFetchBasicsResponseData: { // field return type name
    athlete_bio: 'AthleteBasicStats'
  }
  AthleteProductsFetchData: { // field return type name
    products: 'ProductsTmpl'
  }
  AthleteProductsFetchResponse: { // field return type name
    data: 'AthleteProductsFetchData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  AthleteResData: { // field return type name
    description: 'String'
    id: 'Int'
    image_url: 'String'
    name: 'String'
    sport: 'String'
  }
  AthleteSalesData: { // field return type name
    sales: 'SalesTmpl'
  }
  AthleteSalesResponse: { // field return type name
    data: 'AthleteSalesData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  AthleteSettings: { // field return type name
    description: 'String'
    notifications_preference: 'String'
  }
  AthleteSettingsFetchData: { // field return type name
    settings: 'SettingsTmpl'
  }
  AthleteSettingsFetchResponse: { // field return type name
    data: 'AthleteSettingsFetchData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  AthleteTopFollowersData: { // field return type name
    top_followers: 'TopFollowerStats'
  }
  AthleteTopFollowersResponse: { // field return type name
    data: 'AthleteTopFollowersData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  AuthData: { // field return type name
    athlete_bio: 'AthleteBio'
    athlete_data: 'AthleteData'
    athletes: 'AthleteData'
    completion_status: 'String'
    content_data: 'UserContent'
    email: 'String'
    incentives: 'String'
    max_id: 'Int'
    products: 'Products'
    sales: 'Sales'
    settings: 'AthleteSettings'
    signed_url: 'String'
    sports: 'String'
    suggestions: 'SuggestionsData'
    token: 'String'
    top_followers: 'TopFollowers'
  }
  BaseResponse: { // field return type name
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  Mutation: { // field return type name
    athlete_signin: 'TokenResponse'
    athlete_signup: 'TokenResponse'
    athlete_update_info: 'BaseResponse'
    athlete_update_settings: 'BaseResponse'
    create_fixed_product: 'BaseResponse'
    create_variable_product: 'BaseResponse'
    interests: 'BaseResponse'
    s3_upload: 'MutationResponse'
    signin: 'UserSigninResponse'
    signup: 'TokenResponse'
    user_create_sale: 'BaseResponse'
    user_follow_athlete: 'BaseResponse'
    user_logout: 'BaseResponse'
    user_update_notif_settings: 'BaseResponse'
    waitlist: 'BaseResponse'
  }
  MutationResponse: { // field return type name
    data: 'AuthData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  NotifsTmpl: { // field return type name
    id: 'Int'
    message: 'String'
    status: 'String'
  }
  Products: { // field return type name
    currency: 'String'
    media_url: 'String'
    name: 'String'
    price: 'Float'
    quantity: 'Int'
  }
  ProductsTmpl: { // field return type name
    currency: 'String'
    id: 'Int'
    media_url: 'String'
    name: 'String'
    price: 'Float'
    quantity: 'Int'
  }
  Query: { // field return type name
    athlete_fetch_settings: 'AthleteSettingsFetchResponse'
    athletes: 'UserFetchAthletesResponse'
    fetch_athlete_basics: 'AthleteFetchBasicsResponse'
    fetch_athlete_sales: 'AthleteSalesResponse'
    fetch_athlete_top_followers: 'AthleteTopFollowersResponse'
    fetch_products: 'AthleteProductsFetchResponse'
    fetch_user_suggestions: 'UserFetchSuggestionsResponse'
    user_activity: 'UserFetchActivityResponse'
    user_fetch_incentives: 'UserFetchIncentivesResponse'
    user_fetch_notif_settings: 'UserFetchNotifSettingsResponse'
    user_fetch_notifications: 'UserFetchNotificationsResponse'
    user_fetch_sports: 'UserFetchSportsResponse'
    user_following: 'UserFetchAthletesResponse'
  }
  Sales: { // field return type name
    month: 'String'
    total_sales: 'Float'
    year: 'Int'
  }
  SalesTmpl: { // field return type name
    month: 'String'
    total_sales: 'Float'
    year: 'Int'
  }
  SettingsTmpl: { // field return type name
    description: 'String'
    notifications_preference: 'String'
  }
  SuggestionsData: { // field return type name
    id: 'Int'
    image_url: 'String'
    name: 'String'
    sport: 'String'
  }
  SuggestionsResData: { // field return type name
    id: 'Int'
    image_url: 'String'
    name: 'String'
    sport: 'String'
  }
  TokenData: { // field return type name
    token: 'String'
  }
  TokenResponse: { // field return type name
    data: 'TokenData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  TopFollowerStats: { // field return type name
    email: 'String'
    id: 'Int'
    name: 'String'
  }
  TopFollowers: { // field return type name
    email: 'String'
    id: 'Int'
    name: 'String'
  }
  UserContent: { // field return type name
    athlete_image_url: 'String'
    athlete_name: 'String'
    content_caption: 'String'
    content_media_url: 'String'
    distance: 'String'
  }
  UserFetchActivityResponse: { // field return type name
    data: 'UserFetchFollowingData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchAthletesResponse: { // field return type name
    data: 'UserFetchAthletesResponseData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchAthletesResponseData: { // field return type name
    athlete_data: 'AthleteResData'
    max_id: 'Int'
  }
  UserFetchFollowingData: { // field return type name
    activity: 'ActivityTmpl'
    max_id: 'Int'
    points: 'Int'
  }
  UserFetchIncentivesData: { // field return type name
    incentives: 'String'
  }
  UserFetchIncentivesResponse: { // field return type name
    data: 'UserFetchIncentivesData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchNotifSettingsData: { // field return type name
    notifications_preference: 'String'
  }
  UserFetchNotifSettingsResponse: { // field return type name
    data: 'UserFetchNotifSettingsData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchNotificationsData: { // field return type name
    notifications: 'NotifsTmpl'
  }
  UserFetchNotificationsResponse: { // field return type name
    data: 'UserFetchNotificationsData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchSportsData: { // field return type name
    sports: 'String'
  }
  UserFetchSportsResponse: { // field return type name
    data: 'UserFetchSportsData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchSuggestionsResponse: { // field return type name
    data: 'UserFetchSuggestionsResponseData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
  UserFetchSuggestionsResponseData: { // field return type name
    suggestions: 'SuggestionsResData'
  }
  UserSigninData: { // field return type name
    completion_status: 'String'
    token: 'String'
  }
  UserSigninResponse: { // field return type name
    data: 'UserSigninData'
    error: 'Boolean'
    message: 'String'
    status: 'Int'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    athlete_signin: { // args
      email: string; // String!
      password: string; // String!
    }
    athlete_signup: { // args
      country: string; // String!
      email: string; // String!
      name: string; // String!
      password: string; // String!
      phone: string; // String!
      sport: string; // String!
    }
    athlete_update_info: { // args
      description: string; // String!
      image_url: string; // String!
    }
    athlete_update_settings: { // args
      description?: string | null; // String
      notifications_preference?: Array<string | null> | null; // [String]
    }
    create_fixed_product: { // args
      category: string; // String!
      currency?: string | null; // String
      description: string; // String!
      media_url?: string | null; // String
      name: string; // String!
      price: number; // Float!
      quantity: number; // Int!
    }
    create_variable_product: { // args
      category?: string | null; // String
      currency?: string | null; // String
      description: string; // String!
      end_time: string; // String!
      media_url?: string | null; // String
      name: string; // String!
      price: number; // Float!
      quantity: number; // Int!
    }
    interests: { // args
      athletes: Array<number | null>; // [Int]!
      incentives: Array<string | null>; // [String]!
      notifications_preference: Array<string | null>; // [String]!
      sports: Array<string | null>; // [String]!
    }
    s3_upload: { // args
      file_name: string; // String!
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
    user_create_sale: { // args
      product_id: number; // Int!
      quantity?: number | null; // Int
      total_value: number; // Float!
    }
    user_follow_athlete: { // args
      athlete_id: number; // Int!
    }
    user_update_notif_settings: { // args
      notifications_preference: Array<string | null>; // [String]!
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
    user_activity: { // args
      limit: number; // Int!
      next_min_id?: number | null; // Int
    }
    user_following: { // args
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