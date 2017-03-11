import { Entity, IState } from '@shared';

/* Category
-------------------------------------- */
export const category = (props: Entity.ICategory): Entity.ICategory => props;

/* Topic
-------------------------------------- */
export const topic = (props: Partial<Entity.ITopic> = {}): Entity.ITopic => ({
    category: props.category || undefined,
    title: props.title || '',
    postIds: props.postIds || [],
    createdAt: props.createdAt || Date.now(),
    updatedAt: props.updatedAt || Date.now(),
    ...props
});

/* Post
-------------------------------------- */
export const post = (props: Partial<Entity.IPost> & { topicId: number }): Entity.IPost => ({
    content: props.content || '',
    replyIds: props.replyIds ? [...props.replyIds] : [],
    tagIds: props.tagIds ? [...props.tagIds] : [],
    createdAt: props.createdAt || Date.now(),
    updatedAt: props.updatedAt || Date.now(),
    ...props
});

/* Route
---------------------------------------*/
export const route = (props: Partial<Entity.IRoute> & {
    component: Entity.IRoute['component'], path: string
}): Entity.IRoute => ({
    query: props.query || {},
    params: props.params || {},
    ...props,
});

/* State
-------------------------------------- */
export const state = (props: Partial<IState> = {}): IState => ({
    categories: {},
    topics: {},
    posts: {},
    session: {
        currentCategory: undefined,
        currentTopicId: undefined,
        currentPostId: undefined,
    },
    ...props
});

