import React, { useState } from 'react';
import { NameHelper } from '../../utils';
import { NAME_LENGTH, SHORT_NAME_LENGTH } from './Bookmarks';
import { BookmarkPlus } from '../Icons';

const BookmarkForm = (props) => {
    const { fields = {}, submit, afterSubmit } = props;
    const [name, setName] = useState(fields.name ? fields.name : '');
    const [link, setLink] = useState(fields.link ? fields.link : '');
    const [short, setShort] = useState(fields.short ? fields.short : '');
    const [img, setImg] = useState(fields.img ? fields.img : '');

    const onSubmit = (e) => {
        e.preventDefault();
        submit({
            name, link, short, img, id: fields.id
        });

        if (afterSubmit) {
            afterSubmit();
        }
    }

    const onNameChange = value => {
        setName(value);
        setShort(NameHelper.short(name ? name : '', SHORT_NAME_LENGTH).toUpperCase());
    };

    return (
        <form onSubmit={onSubmit}>
            <div className='content is-medium is-inline'>
                <h4>
                    <span className="icon is-medium mr-1">
                        <BookmarkPlus />
                    </span>
                    Add Bookmark
                </h4>
            </div>
            <hr />

            <div className="field">
                <label className="label has-text-light">
                    Name
                    <input className="input has-background-grey-dark has-text-light" value={name} onChange={e => onNameChange(e.target.value)} max={NAME_LENGTH} required />
                </label>
            </div>
            <div className="field">
                <label className="label has-text-light">
                    Link
                    <input className="input has-background-grey-dark has-text-light" value={link} onChange={e => setLink(e.target.value)} required />
                </label>
            </div>
            <div className="field">
                <label className="label has-text-light">
                    Label
                    <input className="input has-background-grey-dark has-text-light" value={short} onChange={e => setShort(e.target.value)} min={SHORT_NAME_LENGTH} max={SHORT_NAME_LENGTH} />
                </label>
            </div>
            <div className="field">
                <label className="label has-text-light">
                    Image URL
                    <input className="input has-background-grey-dark has-text-light" value={img} onChange={e => setImg(e.target.value)} />
                </label>
            </div>
            <input type="submit" className="button has-background-black-ter is-fullwidth" value="Save" />
        </form>
    );
};

export default BookmarkForm;