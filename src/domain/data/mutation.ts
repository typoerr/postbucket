import omit = require('lodash/omit');

type S = IAppState;
type DS = IDataState;
type PJ = Model.IProject;
type T = Model.ITopic;


/**
 * projectを追加 or 更新
 */
export const setProject = (s: S, p: PJ) => ({
    projects: { ...s.projects, [p.id]: p }
});


/**
 * projectを削除
 */
export const deleteProject = (s: S, p: PJ): Partial<S> => ({
    projects: omit<DS['projects'], DS['projects']>(s.projects, p.id),
    topics: omit<DS['topics'], DS['topics']>(s.topics, [...p.topicIds]),
    posts: omit<DS['posts'], DS['posts']>(s.posts, [...p.postIds])
});


/**
 * topicを追加
 *
 * project.topicIdsからtopic.idを削除
 */
export const addTopic = (s: S, t: T) => {
    const pj = s.projects[t.projectId];
    return {
        projects: {
            ...s.projects,
            [pj.id]: { ...pj, topicIds: [...pj.topicIds, t.id] }
        },
        topics: {
            ...s.topics,
            [t.id]: t
        }
    };
};


/**
 * topicを更新
 */
export const updateTopic = (s: S, t: T) => ({
    topics: { ...s.topics, [t.id]: t }
});


/**
 * topicを削除
 *
 * project.topicIdsからtopic.idを削除
 * topicに依存したpostを削除
 */
export const deleteTopic = (s: S, t: T) => {
    const pj = s.projects[t.projectId];
    return {
        projects: {
            ...s.projects,
            [pj.id]: { ...pj, topicIds: pj.topicIds.filter(id => id !== t.id) }
        },
        topics: omit<DS['topics'], DS['topics']>(s.topics, t.id),
        posts: omit<DS['posts'], DS['posts']>(s.posts, [...t.postIds])
    };
};

