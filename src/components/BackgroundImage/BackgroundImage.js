import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GetImage } from '../../utils';
import { Image as ImageIcon } from '../Icons';
import styles from './BackgroundImage.module.css';

const STORAGE_IMG_SRC_KEY = '__new_tab_background_img_src__';
const STORAGE_IMG_TIME_KEY = '__new_tab_background_time_src__';
const IMG_PERIOD = 1000 * 60 * 10; // 10 min

const BackgroundImage = (props) => {
    const getImage = useRef(new GetImage());
    const [bgImage, setBgImage] = useState();
    const [loadingStatus, setLoadingStatus] = useState();
    const [btnStatus, setBtnStatus] = useState(true);

    const disableBtn = useCallback(
        () => {
            setBtnStatus(false);
            setTimeout(() => {
                setBtnStatus(true);
            }, 3000);
        },
        []
    )

    const setImageTimeToStorage = useCallback(
        () => {
            localStorage.setItem(STORAGE_IMG_TIME_KEY, Date.now());
        },
        []
    )

    const setImageSrcToStorage = useCallback(
        src => {
            localStorage.setItem(STORAGE_IMG_SRC_KEY, src);
            setImageTimeToStorage();
        },
        [setImageTimeToStorage]
    )

    const getImageSrcFromStorage = useCallback(
        () => {
            return localStorage.getItem(STORAGE_IMG_SRC_KEY);
        },
        []
    )

    const getImageTimeFromStorage = () => {
        return localStorage.getItem(STORAGE_IMG_TIME_KEY);
    }

    const updateImage = useCallback(force => {
        const srcFromStorage = getImageSrcFromStorage();
        const expirationTime = parseInt(getImageTimeFromStorage(), 10) + parseInt(IMG_PERIOD, 10);
        const isExpired = expirationTime - Date.now() < 0;
        const { width, height } = window.screen;
        const image = new Image();

        if (!srcFromStorage || isExpired || force) {
            setLoadingStatus(true);
            getImage.current.getRandom({ width, height }).then(imgUrl => {
                image.src = imgUrl;

                image.onload = () => {
                    disableBtn();
                    setBgImage(imgUrl);
                    setLoadingStatus(false);
                    setImageSrcToStorage(imgUrl);
                }
            });
        } else {
            image.src = srcFromStorage;

            image.onload = () => {
                setBgImage(srcFromStorage);
            }
        }
    }, 
    [
        getImage, 
        getImageSrcFromStorage, 
        setLoadingStatus, 
        setBgImage, 
        setImageSrcToStorage, 
        disableBtn]
    );

    const style = {
        backgroundImage: `url(${bgImage})`,
    };

    useEffect(() => {
        updateImage();
    }, [updateImage]);

    const forceUpdate = () => updateImage(true);

    return (
        <div className={styles.bg} style={style}>
            {props.children}
            <button type="button" onClick={forceUpdate} disabled={!btnStatus}
                    className={`button is-dark-transparent bbar bbar-2 ${loadingStatus && 'is-loading'}`}>
                <ImageIcon />
            </button>
        </div>
    );
};

export default BackgroundImage;