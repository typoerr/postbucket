import * as React from 'react';
import { connect } from 'react-redux';
import { Project, Session, UI } from './../../mutation/index';
import abortIf from './../utils/abortTransaction';

import RenderCase from './../utils/RenderCase';
import TopicForm from './TopicForm';
import TopicView from './TopicView';

/* Container
--------------------------------- */
const mapStateToProps = (store: IAppStoreFromProvider) => {
    const { currentProjectId } = store.session;
    const currentProject = store.projects[currentProjectId || ''] as IEntity.IProject | undefined;
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
                (_, t) => abortIf(() => !!t.title),
                Project.addTopic,
            ]),

            updateTopic: usecase('TOPIC::UPDATE').use<IEntity.ITopic>([
                (_, t) => abortIf(() => !!t.title),
                UI.removeEditingId('editingTopicCardIds'),
                Project.updateTopic,
            ]),

            deleteTopic: usecase('TOPIC::DELETE').use<IEntity.ITopic>([
                UI.removeEditingId('editingTopicCardIds'),
                Project.deleteTopic
            ]),

            toggleTopicCard: usecase('TOPIC::TOGGLE_CARD').use<IEntity.ITopic>([
                UI.toggleEditingIds('editingTopicCardIds')
            ]),

            onTopicSelect: usecase('TOPIC::SELECT').use<IEntity.ITopic>([
                UI.clearEditingIds('editingTopicCardIds'),
                Session.setCurrentTopicId
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
        // sortとかやる
        return this.props.topics;
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
