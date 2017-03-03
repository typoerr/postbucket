import omit = require('lodash/omit');
import { whenExists } from './../utils/utils';
import { set, update } from './../utils/object';

type S = IAppState;
type PJ = IEntity.IProject;
type T = IEntity.ITopic;
type P = IEntity.IPost;
type R = IEntity.IRoute;

/* ProjectMutation
------------------------------------------------- */
/**
 * projectsにprojectを追加または更新
 *
 * @export
 * @param {S} s
 * @param {PJ} pj
 * @returns {S}
 */
export function putProject(s: S, pj: PJ): S {
    return set(s, ['projects', pj.id], pj);
}

/**
 * projectsからprojectを削除
 *
 * @export
 * @param {S} s
 * @param {PJ} pj
 * @returns {S}
 */
export function removeProject(s: S, pj: PJ): S {
    return update(s, ['projects'], (v) => omit(v, pj.id));
}

/* TopicMutation
------------------------------------------------- */
/**
 * topicIdをprojectに追加する
 *
 * @export
 * @param {S} s
 * @param {T} t
 * @returns {S}
 */
export function setTopicIdToProject(s: S, t: T): S {
    if (!t.projectId) throw new Error('topc.projectId is required');

    return whenExists(s.projects[t.projectId], pj => {
        return update(s, ['projects', pj.id, 'topicIds'], ids => {
            return ids.includes(t.id) ? ids : [...ids, t.id];
        });
    }, () => s);
}

/**
 * projectからtopicIdを削除する
 *
 * @export
 * @param {S} s
 * @param {T} t
 * @returns {S}
 */
export function removeTopicIdFromProject(s: S, t: T): S {
    if (!t.projectId) throw new Error('topc.projectId is required');

    return whenExists(s.projects[t.projectId], pj => {
        return update(s, ['projects', pj.id, 'topicIds'], ids => ids.filter(id => id !== t.id));
    }, () => s);
}

/**
 * topicsにtopicを追加または更新する
 *
 * @export
 * @param {S} s
 * @param {T} t
 * @returns {S}
 */
export function putTopic(s: S, t: T): S {
    return set(s, ['topics', t.id], t);
}


/**
 * topicsからtopicを削除する
 *
 * @export
 * @param {S} s
 * @param {T} t
 * @returns {S}
 */
export function removeTopic(s: S, t: T): S {
    return update(s, ['topics'], v => omit(v, t.id));
}

/* PostMutation
------------------------------------------------- */
/**
 * topic.postsにpostを追加
 *
 * @export
 * @param {S} s
 * @param {P} p
 * @returns {S}
 */
export function putPost(s: S, p: P): S {
    return whenExists(s.topics[p.topicId], t => {
        return set(s, ['topics', t.id, 'posts', p.id], p);
    }, () => s);
}

/**
 * topic.postsからpostを削除
 *
 * @export
 * @param {S} s
 * @param {P} p
 * @returns {S}
 */
export function removePost(s: S, p: P): S {
    return whenExists(s.topics[p.topicId], t => {
        return update(s, ['topics', t.id, 'posts'], v => omit(v, p.id));
    }, () => s);
}

/* SessionMutation
------------------------------------------------- */
/**
 * locationの変更によるsessionを更新
 *
 * @export
 * @param {S} s
 * @param {R} r
 * @returns {S}
 */
export function updateCurrentIds(s: S, r: R): S {
    return set(s, ['session'], {
        currentProjectId: r.params['projectId'] || r.query['project'] || undefined,
        currentTopicId: r.params['topicId'] || r.query['topic'] || undefined,
        currentPostId: r.params['postId'] || r.query['post'] || undefined
    } as S['session']);
};
