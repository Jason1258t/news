export interface ArticleLikes {
    count: number;
    /** Лайкнул ли статью текущий читатель. */
    liked: boolean;
}

export interface ArticleLikeCount {
    slug: string;
    likes: number;
}
