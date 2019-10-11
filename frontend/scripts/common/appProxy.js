
export default {
    set app(app) {
        this._app = app;
    },
    do_push(url) {
        this._app.push(url);
    }
}