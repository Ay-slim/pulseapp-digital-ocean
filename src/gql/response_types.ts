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

export const ProductsTmpl = objectType({
    name: 'ProductsTmpl',
    definition(t) {
        t.int('id')
        t.string('name'),
            t.list.string('media_urls'),
            t.string('media_url'),
            t.float('price'),
            t.string('currency')
        t.string('end_time')
        t.boolean('exclusive')
        t.int('quantity')
        t.string('description')
        t.int('total_views')
        t.int('unique_views')
    },
})

export const UsersFetchAthleteStore = objectType({
    name: 'UsersFetchAthleteStore',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UsersAthleteStoreData',
                definition(t) {
                    t.nonNull.string('athlete_name')
                    t.string('image_url')
                    t.list.field('products', {
                        type: ProductsTmpl,
                    })
                    t.list.field('expired_drops', {
                        type: ProductsTmpl,
                    })
                    t.field('featured', {
                        type: ProductsTmpl,
                    })
                },
            }),
        })
    },
})

export const UsersFetchProduct = objectType({
    name: 'UsersFetchProduct',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UsersProductData',
                definition(t) {
                    t.field('product', {
                        type: ProductsTmpl,
                    })
                },
            }),
        })
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
                name: 'AthletesProductData',
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

const ActivityTmpl = objectType({
    name: 'ActivityTmpl',
    definition(t) {
        t.int('id')
        t.string('name')
        t.string('athlete')
        t.string('distance')
        t.string('status')
        t.string('image_url')
    },
})

export const UserFetchActivityResponse = objectType({
    name: 'UserFetchActivityResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchFollowingData',
                definition(t) {
                    t.list.field('activity', {
                        type: ActivityTmpl,
                    })
                    t.int('max_id')
                    t.int('points')
                },
            }),
        })
    },
})

const NotifsTmpl = objectType({
    name: 'NotifsTmpl',
    definition(t) {
        t.int('id')
        t.string('message')
        t.string('status')
        t.string('event')
        t.string('headline')
        t.string('distance')
    },
})

export const UserFetchNotificationsResponse = objectType({
    name: 'UserFetchNotificationsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchNotificationsData',
                definition(t) {
                    t.list.field('notifications', {
                        type: NotifsTmpl,
                    })
                },
            }),
        })
    },
})

export const UserFetchNotifSettingsResponse = objectType({
    name: 'UserFetchNotifSettingsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UserFetchNotifSettingsData',
                definition(t) {
                    t.list.string('notifications_preference')
                },
            }),
        })
    },
})

export const UserUnreadNotificationsResponse = objectType({
    name: 'UserUnreadNotificationsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'UnreadNotifsData',
                definition(t) {
                    t.int('unread_count')
                },
            }),
        })
    },
})
