export default class DataProvider {
    constructor(firebase) {
        this.firebase = firebase
        this.bookmarks = this.firebase.bookmarks

        console.log(this.firebase)
    }
}
