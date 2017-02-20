import * as React from 'react';
import unified = require('unified');
import parse = require('remark-parse');
import stringify = require('remark-stringify');
import remark2rehype = require('remark-rehype');
import rehype2react = require('rehype-react');
import highlight from './highlight';
import { checkboxIdentityOnHAST, checkboxIndexOnMDAST, toggleCheckboxOnMDAST } from './checkbox';

const processor = unified()
    .use(parse)
    .use(checkboxIndexOnMDAST)
    .use(remark2rehype)
    .use(checkboxIdentityOnHAST)
    .use(highlight);


/* Component
----------------------------- */
interface Props {
    src: string;
    onSrcUpdated?: (src: string) => void;
}

export default class MarkdownView extends React.Component<Props, void> {
    handleCheckboxItemClick = (id: string) => {
        const src = unified()
            .use(parse)
            .use(checkboxIndexOnMDAST)
            .use(toggleCheckboxOnMDAST, id)
            .use(stringify)
            .process(this.props.src);

        this.props.onSrcUpdated && this.props.onSrcUpdated(src.contents as string);
    }

    $checkbox = (props: {
        type: string;
        checked: string;
        identity: string;
    }) => {
        return <input {...props}
            checked={props.hasOwnProperty('checked')}
            onClick={() => this.handleCheckboxItemClick(props.identity)}
        />;
    }

    render() {
        return (
            <div>
                {
                    processor
                        .use(rehype2react, {
                            createElement: React.createElement,
                            components: {
                                input: this.$checkbox
                            }
                        })
                        .process(this.props.src, {
                            breaks: true
                        }).contents
                }
            </div>
        );
    }
}