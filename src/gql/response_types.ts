import { objectType, list } from 'nexus'

export const BaseResponse = objectType({
    name: 'BaseResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
    },
})

export const UserSignupResponse = objectType({
    name: 'UserSignupResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserSignupData',
                definition(t) {
                    t.string('token')
                },
            }),
        })
    },
})

export const TokenResponse = objectType({
    name: 'TokenResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'TokenData',
                definition(t) {
                    t.string('token')
                },
            }),
        })
    },
})

export const UserSigninResponse = objectType({
    name: 'UserSigninResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserSigninData',
                definition(t) {
                    t.string('token')
                    t.string('completion_status')
                },
            }),
        })
    },
})

export const UserFetchSportsResponse = objectType({
    name: 'UserFetchSportsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchSportsData',
                definition(t) {
                    t.list.string('sports')
                },
            }),
        })
    },
})

export const UserFetchIncentivesResponse = objectType({
    name: 'UserFetchIncentivesResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchIncentivesData',
                definition(t) {
                    t.list.string('incentives')
                },
            }),
        })
    },
})

const AthleteResData = list(
    objectType({
        name: 'AthleteResData',
        definition(t) {
            t.int('id')
            t.string('name')
            t.string('image_url')
            t.string('sport')
            t.string('description')
        },
    })
)

export const UserFetchAthletesResponse = objectType({
    name: 'UserFetchAthletesResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchAthletesResponseData',
                definition(t) {
                    t.field('athlete_data', {
                        type: AthleteResData,
                    })
                    t.int('max_id')
                },
            }),
        })
    },
})

const SuggestionsResData = list(
    objectType({
        name: 'SuggestionsResData',
        definition(t) {
            t.int('id')
            t.string('name')
            t.string('image_url')
            t.string('sport')
        },
    })
)

export const UserFetchSuggestionsResponse = objectType({
    name: 'UserFetchSuggestionsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchSuggestionsResponseData',
                definition(t) {
                    t.field('suggestions', {
                        type: SuggestionsResData,
                    })
                },
            }),
        })
    },
})

const AthleteBasicStats = objectType({
    name: 'AthleteBasicStats',
    definition(t) {
        t.string('name')
        t.string('image_url')
        t.int('follower_count')
        t.int('fixed_items_count')
        t.int('variable_items_count')
    },
})

export const AthleteFetchBasicsResponse = objectType({
    name: 'AthleteFetchBasicsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthleteFetchBasicsResponseData',
                definition(t) {
                    t.field('athlete_bio', {
                        type: AthleteBasicStats,
                    })
                },
            }),
        })
    },
})

const TopFollowerStats = objectType({
    name: 'TopFollowerStats',
    definition(t) {
        t.string('name')
        t.int('id')
        t.string('email')
    },
})

export const AthleteTopFollowersResponse = objectType({
    name: 'AthleteTopFollowersResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthleteTopFollowersData',
                definition(t) {
                    t.list.field('top_followers', {
                        type: TopFollowerStats,
                    })
                },
            }),
        })
    },
})

const SalesTmpl = objectType({
    name: 'SalesTmpl',
    definition(t) {
        t.int('year')
        t.string('month')
        t.float('total_sales')
    },
})

export const AthleteSalesResponse = objectType({
    name: 'AthleteSalesResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthleteSalesData',
                definition(t) {
                    t.list.field('sales', {
                        type: SalesTmpl,
                    })
                },
            }),
        })
    },
})

const ProductsTmpl = objectType({
    name: 'ProductsTmpl',
    definition(t) {
        t.string('name'),
            t.string('media_url'),
            t.float('price'),
            t.string('currency')
        t.int('quantity')
        t.int('id')
    },
})

export const AthleteProductsFetchResponse = objectType({
    name: 'AthleteProductsFetchResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthleteProductsFetchData',
                definition(t) {
                    t.list.field('products', {
                        type: ProductsTmpl,
                    })
                },
            }),
        })
    },
})

const SettingsTmpl = objectType({
    name: 'SettingsTmpl',
    definition(t) {
        t.string('description'), t.list.string('notifications_preference')
    },
})

export const AthleteSettingsFetchResponse = objectType({
    name: 'AthleteSettingsFetchResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthleteSettingsFetchData',
                definition(t) {
                    t.field('settings', {
                        type: SettingsTmpl,
                    })
                },
            }),
        })
    },
})
