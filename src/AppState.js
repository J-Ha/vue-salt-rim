class AppState {
    constructor() {
        this.theme = 'light'
        this.defaultUnit = 'ml'
        this.language = 'en-US'
        this.token = null
        this.bar = {}
        this.user = {}

        this._key = '_salt_rim'
        this._readStateFromStorage()
    }

    setToken(token) {
        this.token = token
        this._updateState()
    }

    setUser(user) {
        this.user = user
        this._updateState()
    }

    setBar(bar) {
        let searchHost = window.srConfig.MEILISEARCH_URL
        if (!searchHost) {
            searchHost = bar.search_driver_host
        }

        if (!(searchHost.startsWith('http://') || searchHost.startsWith('https://'))) {
            if (!searchHost.startsWith('/')) {
                searchHost = '/' + searchHost
            }

            searchHost = window.location.origin + searchHost
        }

        bar.search_driver_host = searchHost

        this.bar = bar
        this._updateState()
    }

    forgetUser() {
        this.user = {}
        this.token = null
        this._updateState()
    }

    forgetBar() {
        this.bar = {}
        this._updateState()
    }

    setDefaultUnit(unit) {
        this.defaultUnit = unit
        this._updateState()
    }

    setTheme(theme) {
        this.theme = theme
        this._updateState()
    }

    setLanguage(language) {
        this.language = language
        this._updateState()
    }

    hasUserInfo() {
        return this.user.id != null || this.user.id != undefined
    }

    clear() {
        localStorage.removeItem(this._key)
    }

    isAdmin() {
        return this.bar.access.role_id == 1
    }

    isModerator() {
        return this.bar.access.role_id == 2
    }

    isGeneral() {
        return this.bar.access.role_id == 3
    }

    isGuest() {
        return this.bar.access.role_id == 4
    }

    _updateState() {
        localStorage.setItem(this._key, JSON.stringify(this))
    }

    _readStateFromStorage() {
        if (localStorage.getItem(this._key)) {
            const newState = JSON.parse(localStorage.getItem(this._key))

            this.theme = newState.theme
            this.defaultUnit = newState.defaultUnit
            this.language = newState.language
            this.token = newState.token
            this.bar = newState.bar
            this.user = newState.user
        }
    }
}

export default AppState
