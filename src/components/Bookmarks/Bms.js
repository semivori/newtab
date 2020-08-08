import React, { useState, useEffect } from 'react';
import Panel from './Panel';
import { withFirebase } from '../../firebase';
import { NameHelper } from '../../utils';
import { withAuthUser } from '../Auth';
import Modal from '../Modal';
import Form from './BookmarkForm';
import Bookmark from './Bookmark';
import AddBtn from './AddBtn';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { ArrowLeftShort, ArrowRightShort, BoxArrowInUpRight, Pen, Trash } from '../Icons';

const BOOKMARKS_MENU = 'BOOKMARKS_MENU';

const ACTION_DELETE = 'delete';
const ACTION_MOVE_TO_LEFT = 'move_to_left';
const ACTION_MOVE_TO_RIGHT = 'move_to_right';
const ACTION_OPEN_IN_NEW_TAB = 'open_in_new_tab';
const ACTION_UPDATE = 'update';

const actions = [
    { key: ACTION_MOVE_TO_LEFT, label: <ArrowLeftShort />, title: 'Move to left' },
    { key: ACTION_MOVE_TO_RIGHT, label: <ArrowRightShort />, title: 'Move to right' },
    { key: ACTION_OPEN_IN_NEW_TAB, label: <BoxArrowInUpRight />, title: 'Open in new tab' },
    { key: ACTION_UPDATE, label: <Pen />, title: 'Update' },
    { key: ACTION_DELETE, label: <Trash />, title: 'Delete' },
];

export const NAME_LENGTH = 18;
export const SHORT_NAME_LENGTH = 2;


class Bookmarks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: [],
            formStatus: false,
        };
        this.addBookmark = this.addBookmark.bind(this);
        this.updateBookmark = this.updateBookmark.bind(this);
        this.deleteBookmark = this.deleteBookmark.bind(this);
        this.reloadBookmarks = this.reloadBookmarks.bind(this);
        this.setItemsFromSnapshot = this.setItemsFromSnapshot.bind(this);
        this.formModal = null;
    }

    componentDidMount() {
        this.props.firebase.bookmarks.get().orderByChild("user").equalTo(this.props.authUser.uid).on('value', this.setItemsFromSnapshot);
    }

    componentWillUnmount() {
        this.props.firebase.bookmarks.get().off();
    }

    setItemsFromSnapshot(snapshot) {
        this.setState({
            items: this.props.firebase.getItemsFromSnapshot(snapshot),
            loading: false,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.authUser.uid !== this.props.authUser.uid) {
            this.reloadBookmarks()
        }
    }

    addBookmark() {
        return data => {
            const newItem = {
                name: data.name.slice(0, NAME_LENGTH),
                link: data.link,
                short: data.short ? data.short.slice(0, SHORT_NAME_LENGTH).toUpperCase() : NameHelper.short(data.name, SHORT_NAME_LENGTH).toUpperCase(),
                img: data.img,
                user: this.props.authUser.uid
            };

            this.props.firebase.bookmarks.push(newItem);
        }
    }

    updateBookmark(id, data) {
        const updatedItem = {
            name: data.name.slice(0, NAME_LENGTH),
            link: data.link,
            short: data.short ? data.short.slice(0, SHORT_NAME_LENGTH).toUpperCase() : NameHelper.short(data.name, SHORT_NAME_LENGTH).toUpperCase(),
            img: data.img,
            user: this.props.authUser.uid
        };

        return this.props.firebase.bookmarks.update(id, updatedItem);
    }

    deleteBookmark() {
        return id => {
            const item = this.state.items.find(item => item.id === id);

            if (item) {
                const confirm = window.confirm(`Do you really delete "${item.name}" bookmark?`);
                if (confirm) {
                    return this.props.firebase.bookmarks.remove(id);
                }
            }
            return false;
        }
    }

    moveBookmark() {
        return (toRight, id) => {
            const index = this.state.items.findIndex(item => item.id === id);

            if (index >= 0) {
                return false;
            }

            // const notRelatedItems = this.state.items.slice(toRight ? 0 : index, toRight ? index : null);
            // const relatedItems = this.state.items.slice(toRight ? index : 0, toRight ? null : index);

            // const updatedItems = relatedItems.map(item => {
            //     return {
            //         ...item,
            //         position: toRight ? item.position + 1 : item.position - 1
            //     }
            // })

        }
    }

    reloadBookmarks() {
        this.props.firebase.bookmarks.get().orderByChild("user").equalTo(this.props.authUser.uid).once('value', this.setItemsFromSnapshot);
    }

    showAddForm() {
        return () => {
            const form = <Form submit={this.addBookmark()} afterSubmit={this.hideUpdateForm()} />;
            this.formModal = <Modal close={this.hideUpdateForm()} content={form} />;
            this.setState({
                formStatus: true
            });
        }
    }

    showUpdateForm() {
        return id => {
            const item = this.state.items.find(item => item.id === id);

            if (item) {
                const submit = () => data => {
                    this.updateBookmark(data.id, data)
                }

                const form = <Form submit={submit()} afterSubmit={this.hideUpdateForm()} fields={item} />;
                this.formModal = <Modal close={this.hideUpdateForm()} content={form} />;
                this.setState({
                    formStatus: true
                });
            }
        }
    }

    hideUpdateForm() {
        return () => {
            this.setState({
                formStatus: false
            })
        }
    }

    handleContextClick = () => (e, data, target) => {
        const { action } = data;
        const id = target.getAttribute('id');
        const item = this.state.items.find(item => item.id === id);

        switch (action) {
            case ACTION_UPDATE:
                this.showUpdateForm()(id);
                break;
            case ACTION_DELETE:
                this.deleteBookmark()(id);
                break;
            case ACTION_OPEN_IN_NEW_TAB:
                if (item) {
                    window.open(item.link, "_blank");
                }
                break;
            case ACTION_MOVE_TO_LEFT:
                this.moveBookmark()(false, id);
                break;
            case ACTION_MOVE_TO_RIGHT:
                this.moveBookmark()(true, id);
                break;
            default:
                return null;
        }
    }

    render() {
        if (this.state.loading) {
            return <div className="w-100 has-text-centered">
                <span className="button is-text is-loading"></span>
            </div>
        }

        const bookmarks = this.state.items.map(item => {
            return (
                <ContextMenuTrigger key={item.id} id={BOOKMARKS_MENU} attributes={{ id: item.id }}>
                    <Bookmark item={item} />
                </ContextMenuTrigger>
            );
        });

        const contextMenuItems = actions.map(action => {
            return (
                <MenuItem key={action.key} data={{ action: action.key }} onClick={this.handleContextClick()} className="button mb-0 is-dark">
                    <div title={action.title}>
                        {action.label}
                    </div>
                </MenuItem>
            );
        });

        return (
            <>
                <ContextMenu id={BOOKMARKS_MENU} className="buttons has-addons is-centered">
                    {contextMenuItems}
                </ContextMenu>
                <Panel bookmarks={bookmarks} />
                <AddBtn showAddForm={this.showAddForm()} />
                {this.state.formStatus && this.formModal}
            </>
        );
    }
}

export default withAuthUser(withFirebase(Bookmarks));