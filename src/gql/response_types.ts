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
            t.int('new_product_count')
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

export const ProductsTmpl = objectType({
    name: 'ProductsTmpl',
    definition(t) {
        t.int('id')
        t.string('name'),
            t.list.string('media_urls'),
            t.string('media_url'),
            t.float('price'),
            t.string('currency')
        t.string('category')
        t.string('end_time')
        t.string('start_time')
        t.boolean('exclusive')
        t.int('quantity')
        t.string('description')
        t.int('number_of_views')
        t.int('total_views')
        t.int('unique_views')
        t.string('distance')
        t.string('start_distance')
        t.string('end_distance')
        t.boolean('notified_followers')
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
        t.int('upcoming_drops_count')
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

const WeeksVisits = objectType({
    name: 'WeeksVisits',
    definition(t) {
        t.string('date')
        t.string('day_of_week')
        t.int('count')
    },
})

export const StoreAnalyticsResponse = objectType({
    name: 'StoreAnalyticsresponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'StoreAnalyticsData',
                definition(t) {
                    t.list.field('sales', {
                        type: SalesTmpl,
                    })
                    t.list.field('week_visits', {
                        type: WeeksVisits,
                    })
                    t.int('todays_visits')
                },
            }),
        })
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
                    t.list.field('featured', {
                        type: ProductsTmpl,
                    })
                    t.list.field('future_products', {
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

const InstaRankingsTmpl = objectType({
    name: 'InstRankingsTmpl',
    definition(t) {
        t.string('username')
        t.boolean('is_follower')
        t.float('average_sentiment')
        t.float('interaction_score')
    },
})

const InstaPostsSentTmpl = objectType({
    name: 'InstPostsSentTmpl',
    definition(t) {
        t.string('caption')
        t.string('media_url')
        t.float('average_sentiment')
        t.string('post_id')
    },
})

const KizunaRankingsTmpl = objectType({
    name: 'KizunaRankingsTmpl',
    definition(t) {
        t.int('user_id')
        t.string('name')
        t.string('email')
        t.string('gender')
        t.string('age_range')
        t.int('sales_count')
        t.int('views_count')
        t.int('visits_count')
        t.float('interaction_score')
        t.boolean('is_follower')
    },
})

export const AthleteFetchRankingsResponse = objectType({
    name: 'AthleteFetchRankingsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AthletesRankingsFetchData',
                definition(t) {
                    t.field('instagram', {
                        type: objectType({
                            name: 'InstagramData',
                            definition(t) {
                                t.list.field('fans_ranking', {
                                    type: InstaRankingsTmpl,
                                })
                                t.list.field('posts_analysis', {
                                    type: InstaPostsSentTmpl,
                                })
                                t.field('profile_details', {
                                    type: ProfileTmpl,
                                })
                                t.string('is_private')
                            },
                        }),
                    })
                    t.list.field('kizuna', {
                        type: KizunaRankingsTmpl,
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

export const DeliveryDetailsResponse = objectType({
    name: 'DeliveryDetailsResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'DeliveryDetailsData',
                definition(t) {
                    t.nonNull.string('address')
                    t.nonNull.string('city')
                    t.nonNull.string('zipcode')
                    t.nonNull.string('card_email')
                    t.nonNull.string('card_name')
                    t.nonNull.string('card_number')
                    t.nonNull.string('card_expiry')
                    t.nonNull.string('name')
                    t.nonNull.string('email')
                    t.nonNull.string('phone')
                },
            }),
        })
    },
})

export const UserCreateSaleResponse = objectType({
    name: 'UserCreateSaleResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'CreateSalesData',
                definition(t) {
                    t.nonNull.string('sale_ref')
                },
            }),
        })
    },
})

//Scraping response types

const ProfileTmpl = objectType({
    name: 'ProfileTmpl',
    definition(t) {
        t.string('bio')
        t.string('full_name')
        t.string('username')
        t.int('no_of_posts')
        t.int('following')
        t.int('followers')
        t.string('profile_pic_url')
        t.boolean('is_private')
        t.boolean('can_crawl_all_followers')
    },
})

export const ProfileDetailsQuery = objectType({
    name: 'ProfileDetailsQuery',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'ProfileDetailsData',
                definition(t) {
                    t.field('profile_details', {
                        type: ProfileTmpl,
                    })
                },
            }),
        })
    },
})
