import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Panel from './Panel';
import { withFirebase } from '../../firebase';
import { withDataProvider } from '../../services/DataProvider';
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

let formModal = null;

const Bookmarks = props => {
    const { dataProvider, authUser } = props;

    console.log(dataProvider);

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [formStatus, setFormStatus] = useState(false);
    const setItemsFromSnapshot = useCallback(snapshot => {
        setItems(dataProvider.getItemsFromSnapshot(snapshot));
    }, [dataProvider]);

    useEffect(() => {
        dataProvider.bookmarks.get().orderByChild("user").equalTo(authUser.uid).once('value', snapshot => {
            setItemsFromSnapshot(snapshot);
            setLoading(false);
        });
    }, [dataProvider, authUser, setItemsFromSnapshot]);

    const addBookmark = data => {
        const newItem = prepareData(data);
        newItem.id = dataProvider.bookmarks.getNewKey();

        setItems([
            ...items,
            newItem
        ]);

        dataProvider.bookmarks.push(newItem).then(() => {

        });
    }

    const prepareData = data => {
        const getPosition = () => {
            const maxPosition = items.length
                ? Object.keys(items).reduce((a, b) => items[a].position > items[b].position ? items[a].position : items[b].position)
                : 0;

            return parseInt(parseInt(maxPosition, 10) + 1, 10);
        }

        return {
            id: data.id,
            img: data.img,
            user: authUser.uid,
            link: data.link,
            short: data.short
                ? data.short.slice(0, SHORT_NAME_LENGTH).toUpperCase()
                : NameHelper.short(data.name, SHORT_NAME_LENGTH).toUpperCase(),
            name: data.name.slice(0, NAME_LENGTH),
            position: data.position
                ? data.position
                : getPosition()
        }
    }

    const updateBookmark = (id, data) => {
        const item = items.find(item => {
            return item.id === id;
        });

        const updatedItem = prepareData({
            ...item,
            ...data,
            id: item.id,
        });

        const updatedItems = items.map(item => {
            return item.id === id ? updatedItem : item;
        });

        setItems(updatedItems);
        dataProvider.bookmarks.update(id, updatedItem);
    }

    const moveBookmark = (toLeft, id) => {
        const selectedItem = items.find(item => item.id === id);

        if (selectedItem.position === 1 || selectedItem.position === items.length) {
            return true;
        }

        const relatedItem = items.find(item => {
            return toLeft ? item.position === selectedItem.position - 1 : item.position === selectedItem.position + 1;
        });

        selectedItem.position = toLeft ? selectedItem.position - 1 : selectedItem.position + 1;
        if (relatedItem) {
            relatedItem.position = toLeft ? relatedItem.position + 1 : relatedItem.position - 1;
        }

        const updatedItems = items.map(item => {
            if (item.id === selectedItem.id) {
                return selectedItem;
            } else if (relatedItem && item.id === relatedItem.id) {
                return relatedItem;
            }

            return item;
        });

        setItems(updatedItems);
        dataProvider.bookmarks.update(selectedItem.id, selectedItem);
        relatedItem && dataProvider.bookmarks.update(relatedItem.id, relatedItem);
    }

    const deleteBookmark = id => {
        const itemToDelete = items.find(item => item.id === id);

        if (!itemToDelete) {
            return false
        }

        const confirm = window.confirm(`Do you really want delete "${itemToDelete.name}" bookmark?`);
        if (!confirm) {
            return false;
        }

        const updatedItems = items
            .filter(item => item.id !== id)
            .map(item => {
                if (item.position > itemToDelete.position) {
                    return {
                        ...item,
                        position: item.position - 1,
                    }
                }
                return item;
            });

        setItems(updatedItems);
        dataProvider.bookmarks.remove(id).then(() => { });
    }

    const showAddForm = () => {
        const form = <Form submit={addBookmark} afterSubmit={hideUpdateForm} />;
        formModal = <Modal close={hideUpdateForm} content={form} />;
        setFormStatus(true);
    }

    const showUpdateForm = id => {
        const item = items.find(item => item.id === id);
        console.log(item);

        if (item) {
            const submit = () => data => {
                updateBookmark(data.id, data)
            }

            const form = <Form submit={submit()} afterSubmit={hideUpdateForm} fields={item} />;
            formModal = <Modal close={hideUpdateForm} content={form} />;
            setFormStatus(true);
        }
    }

    const hideUpdateForm = () => {
        setFormStatus(false);
    }

    const handleContextClick = (e, data, target) => {
        const { action } = data;
        const id = target.getAttribute('id');
        const item = items.find(item => item.id === id);

        switch (action) {
            case ACTION_UPDATE:
                showUpdateForm(id);
                break;
            case ACTION_DELETE:
                deleteBookmark(id);
                break;
            case ACTION_OPEN_IN_NEW_TAB:
                if (item) {
                    window.open(item.link, "_blank");
                }
                break;
            case ACTION_MOVE_TO_LEFT:
                moveBookmark(true, id);
                break;
            case ACTION_MOVE_TO_RIGHT:
                moveBookmark(false, id);
                break;
            default:
                return null;
        }
    };

    const bookmarks = useMemo(() => {
        return items
            .sort((item1, item2) => {
                return item1.position - item2.position;
            })
            .map(item => {
                return (
                    <ContextMenuTrigger key={item.id} id={BOOKMARKS_MENU} attributes={{ id: item.id }}>
                        <Bookmark item={item} />
                    </ContextMenuTrigger>
                );
            })
    }, [items]);

    const contextMenuItems = actions.map(action => {
        return (
            <MenuItem key={action.key} data={{ action: action.key }} onClick={handleContextClick} className="button mb-0 is-dark">
                <div title={action.title}>
                    {action.label}
                </div>
            </MenuItem>
        );
    });

    if (loading) {
        return <div className="w-100 has-text-centered">
            <span className="button is-text is-loading"></span>
        </div>
    }

    return (
        <>
            <ContextMenu id={BOOKMARKS_MENU} className="buttons has-addons is-centered">
                {contextMenuItems}
            </ContextMenu>
            <Panel bookmarks={bookmarks} />
            <AddBtn showAddForm={showAddForm} />
            {formStatus && formModal}
        </>
    );
}

export default withAuthUser(withDataProvider(Bookmarks));