import ApiRequests from "./ApiRequests";

const api = new ApiRequests();

class Auth {
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    static async refreshUser() {
        const user = await api.fetchUser();

        localStorage.setItem('user', JSON.stringify(user));
    }

    async isLoggedIn() {
        try {
            const user = await api.fetchUser();

            this.saveUser(user)
        } catch (e) {
            localStorage.removeItem('user');
            localStorage.removeItem('user_token');
            return false;
        }

        return true;
    }
}

export default Auth;
