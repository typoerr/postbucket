import * as React from 'react';
import { connect } from 'react-redux';
import $ from './../../action/index';

import RenderCase from './../utils/RenderCase';
import TopicForm from './TopicForm';
import TopicView from './TopicView';

/* Container
--------------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentProjectId = '' } = store.session;
    const currentProject = store.projects[currentProjectId] as IEntity.IProject | undefined;
    const topics: IEntity.ITopic[] = currentProject ? Object.values(currentProject.topics) : [];

    return {
        topics,
        currentProject,
        editingCardIds: store.ui.editingTopicCardIds
    };
};

const mapDispatchToProps = (usecase: UseCase) => {
    return {
        actions: {
            addTopic: usecase('TOPIC::ADD').use<IEntity.ITopic>([
                (_, t) => $.abortIf(t.title.trim().length <= 0),
                $.project.setTopic,
            ]),

            updateTopic: usecase('TOPIC::UPDATE').use<IEntity.ITopic>([
                (_, t) => $.abortIf(t.title.trim().length <= 0),
                $.ui.removeEditingId('editingTopicCardIds'),
                $.project.setTopic,
            ]),

            deleteTopic: usecase('TOPIC::DELETE').use<IEntity.ITopic>([
                $.ui.removeEditingId('editingTopicCardIds'),
                $.project.deleteTopic
            ]),

            toggleTopicCard: usecase('TOPIC::TOGGLE_CARD').use<IEntity.ITopic>([
                $.ui.toggleEditingIds('editingTopicCardIds')
            ]),

            onTopicSelect: usecase('TOPIC::SELECT').use<IEntity.ITopic>([
                $.ui.clearEditingIds('editingTopicCardIds'),
            ])
        }
    };
};


/* ProjectPane
-------------------------------------- */
type TopicAction = (topic: IEntity.ITopic) => any;

interface Props {
    topics: IEntity.ITopic[];
    currentProject: IEntity.IProject | undefined;
    editingCardIds: string[];
    actions: {
        addTopic: TopicAction;
        updateTopic: TopicAction;
        deleteTopic: TopicAction;
        toggleTopicCard: TopicAction;
        onTopicSelect: TopicAction;
    };
}

export class ProjectPane extends React.Component<Props, void> {
    get topics() {
        return this.props.topics.sort((a, b) => b.updateAt.getTime() - a.updateAt.getTime());
    }
    render() {
        const {currentProject, actions} = this.props;

        if (!currentProject) return <div>...NotFound</div>;

        return (
            <div className='ProjectPane'>
                <header>
                    <h1>{currentProject.name}</h1>
                </header>

                <TopicForm
                    topic={{ projectId: currentProject.id } as IEntity.ITopic}
                    isNew
                    onSubmit={actions.addTopic}
                />

                <div className='TopicList'>
                    {
                        this.topics.map(t =>
                            <div key={t.id} className='TopicCard'>
                                <RenderCase cond={!this.props.editingCardIds.includes(t.id)}>
                                    <TopicView
                                        topic={t}
                                        deleteTopic={actions.deleteTopic}
                                        onSelect={actions.onTopicSelect}
                                        toggleToicView={actions.toggleTopicCard}
                                    />

                                    <TopicForm
                                        topic={t}
                                        onCancel={actions.toggleTopicCard}
                                        onSubmit={actions.updateTopic}
                                    />
                                </RenderCase>
                            </div>)
                    }
                </div>

            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProjectPane);
