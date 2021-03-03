import { observable, action } from 'mobx';

class SnackbarStore {
    @observable SnackBarProps = {};
    @observable open = false;

    @action.bound Snackbar(props) {
        this.SnackBarProps = props;
        this.open = true;
    }

    @action.bound onClose() {
        this.open = false;
    }
}

export default () => {
    const store = new SnackbarStore();
    return store;
};
