import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.authObject = app.auth();
        this.provider = new app.auth.GoogleAuthProvider();
        this.db = app.database();
        this.getItemsFromSnapshot = this.getItemsFromSnapshot.bind(this);
        this.updateUser = this.updateUser.bind(this);
        //this.auth.signInWithGoogle = this.auth.signInWithGoogle.bind(this);
    }

    auth = {
        signInWithGoogle: () => {
            const anonUid = this.authObject.currentUser.uid;
            this.authObject.signInWithPopup(this.provider).then(result => {
                this.bookmarks.updateUser(anonUid, result.user.uid);
            });
        },
        signInAnonymously: () => {
            this.authObject.signInAnonymously().catch(function (error) {
                // // Handle Errors here.
                // var errorCode = error.code;
                // var errorMessage = error.message;
                // // ...
            });
        },
        signOut: () => this.authObject.signOut(),
    }

    getItemsFromSnapshot(snapshot) {
        const itemsObject = snapshot.val();
        if (itemsObject) {
            return Object.keys(itemsObject).map(key => ({
                ...itemsObject[key],
                id: key,
            }));
        }
        return [];
    }

    updateUser(query, update, from, to) {
        query().orderByChild("user").equalTo(from).once('value', snapshot => {
            const items = this.getItemsFromSnapshot(snapshot);
            items.forEach(item => {
                const updatedItem = {
                    ...item,
                    user: to,
                }

                update(item.id, updatedItem);
            });
        })
    }

    // *** Bookmarks API ***
    bookmarks = {
        get: () => this.db.ref('bookmarks'),
        push: (data) => this.db.ref('bookmarks').push(data),
        getNewKey: () => this.db.ref().child('bookmarks').push().key,
        update: (id, data) => this.db.ref(`bookmarks/${id}`).set(data),
        remove: (id) => this.db.ref(`bookmarks/${id}`).remove(),
        updateUser: (from, to) => {
            this.updateUser(this.bookmarks.get, this.bookmarks.update, from, to);
        }
    };
}

export default Firebase;