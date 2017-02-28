import { StatelessComponent, ComponentClass } from 'react';
import * as E from './../../app/entity';
import * as S from './../../app/state';
import * as Quex from 'quex';
import * as brace from 'brace';

declare global {
    // cdnから読み込んでいるためglobalにしている
    /* tslint:disable:class-name */
    let ace: typeof brace;
    namespace ace {
        interface Editor extends brace.Editor { }
    }
    // interface ace extends brace.Editor { }
    /* tslint:eable:class-name */

    interface UseCase extends Quex.UseCase<S.IState> { }

    interface IAppState extends S.IState { }

    interface IAppStoreFromProvider extends S.IState {
        usecase: UseCase;
    }

    namespace IEntity {
        interface IProject extends E.IProject { }
        interface ITopic extends E.ITopic { }
        interface IPost extends E.IPost { }
        interface IRoute {
            component: StatelessComponent<any> | ComponentClass<any>;
            query: { [key: string]: string };
            params: { [key: string]: string };
            path: string;
        }
    }
}
