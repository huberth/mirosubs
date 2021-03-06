// Universal Subtitles, universalsubtitles.org
//
// Copyright (C) 2010 Participatory Culture Foundation
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see
// http://www.gnu.org/licenses/agpl-3.0.html.

goog.provide('mirosubs.widget.DropDown');

/**
 *
 * @param {string} videoID
 * @param {Array.<Object<string, string>>=} Optional array of
 *     json translation languages, where each language
 *     has a code and name.
 */
mirosubs.widget.DropDown = function(widget, videoID, opt_translationLanguages) {
    goog.ui.Component.call(this);
    
    this.widget_ = widget;
    this.videoID_ = videoID;
    this.translationLanguages_ = opt_translationLanguages || [];
    
    this.currentLanguageCode_ = null;
    this.shown = false;
};

goog.inherits(mirosubs.widget.DropDown, goog.ui.Component);

mirosubs.widget.DropDown.prototype.createDom = function() {
    mirosubs.widget.DropDown.superClass_.createDom.call(this);
    var $d = goog.bind(this.getDomHelper().createDom, this.getDomHelper());
    this.getElement().className = 'mirosubs-dropdown';
    
    var languageListContainer = this.createLanguageList_($d);
    this.createActionList_($d);

    this.updateTranslationLanguages_();
    this.updateActions_();
    
    this.getElement().appendChild(languageListContainer);
    this.getElement().appendChild(this.actions_);
};

mirosubs.widget.DropDown.prototype.createLanguageList_ = function($d) {
    var container = $d('div', {'className': 'mirosubs-languageList'}); 
    container.appendChild(this.languageList_ = $d('ul', null));
    
    this.subtitlesOff_ = $d('li', null, $d('a', {'href': '#'}, 'Subtitles Off'));
    this.originalLanguage_ = $d('li', {'className': 'mirosubs-activeLanguage'},
                                $d('a', {'href': '#'}, 'Original Language'));
    return container;
};

mirosubs.widget.DropDown.prototype.updateTranslationLanguages_ = function() {
    var $d = goog.bind(this.getDomHelper().createDom, this.getDomHelper());
    this.getDomHelper().removeChildren(this.languageList_);
    
    this.languageList_.appendChild(
        $d('li', {'className': 'mirosubs-hintTranslate'},
           $d('span', {'className': 'mirosubs-asterisk'}, '*'),
           ' = Missing sections translated by Google Translate'));
    this.languageList_.appendChild(this.subtitlesOff_);
    this.languageList_.appendChild(this.originalLanguage_);
        
    for (var i = 0; i < this.translationLanguages_.length; i++) {
        if (!this.translationLanguages_[i].elt)
            this.translationLanguages_[i].elt = 
                $d('li', null, $d('a', {'href': '#'}, this.translationLanguages_[i].name));
        this.languageList_.appendChild(this.translationLanguages_[i].elt);
    }
};

mirosubs.widget.DropDown.prototype.createActionList_ = function($d) {
    this.actions_ = $d('div', {'className': 'mirosubs-actions'});
    this.createActionLinks_($d);
    this.actions_.appendChild(this.unisubsLink_);
    this.actions_.appendChild($d('h4', null, 'THIS VIDEO'));
    this.actions_.appendChild(this.videoActions_);
    this.actions_.appendChild($d('h4', null, 'MY SETTINGS'));
    this.actions_.appendChild(this.settingsActions_);
};


mirosubs.widget.DropDown.prototype.createActionLinks_ = function($d) {
    this.videoActions_ = $d('ul', null);    
    this.settingsActions_ = $d('ul', null);
    
    this.unisubsLink_ = $d('h5', {'className': 'mirosubs-uniLogo'}, 'Universal Subtitles');
    this.addTranslationLink_ = $d('li', {'className': 'mirosubs-addTranslation'},
                                  $d('a', {'href': '#'}, 'Add New Translation'));
    this.improveSubtitlesLink_ = $d('li', {'className': 'mirosubs-improveSubtitles'},
                                    $d('a', {'href': '#'}, 'Improve These Subtitles'));
    this.subtitleHomepageLink_ = $d('li', {'className': 'mirosubs-subtitleHomepage'},
                                    $d('a', {'href': '#'}, 'Subtitle Homepage'));
    this.downloadSubtitlesLink_ = $d('li', {'className': 'mirosubs-downloadSubtitles'},
                                     $d('a', {'href': '#'}, 'Download Subtitles'));
    
    this.createAccountLink_ = $d('li', {'className': 'mirosubs-createAccount'},
                                 $d('a', {'href': '#'}, 'Login or Create Account'));
    this.languagePreferencesLink_ = $d('li', {'className': 'mirosubs-languagePreferences'},
                                       $d('a', {'href': '#'}, 'Language Preferences'));
    this.usernameLink_ = $d('li', null,
                            $d('a', {'href': '#'}, 'USERNAME'));
    this.logoutLink_ = $d('li', null,
                          $d('a', {'href': '#'}, 'Logout'));
};

mirosubs.widget.DropDown.prototype.updateActions_ = function() {
    var $d = goog.bind(this.getDomHelper().createDom, this.getDomHelper());
    this.getDomHelper().removeChildren(this.videoActions_);
    this.getDomHelper().removeChildren(this.settingsActions_);

    this.videoActions_.appendChild(this.addTranslationLink_);
    this.videoActions_.appendChild(this.improveSubtitlesLink_);
    this.videoActions_.appendChild(this.subtitleHomepageLink_);
    this.videoActions_.appendChild(this.downloadSubtitlesLink_);
    
    if (mirosubs.currentUsername == null)
        this.settingsActions_.appendChild(this.createAccountLink_);
    else {
        goog.dom.setTextContent(
            goog.dom.getFirstElementChild(this.usernameLink_),
            mirosubs.currentUsername);
        this.settingsActions_.appendChild(this.usernameLink_);
        this.settingsActions_.appendChild(this.logoutLink_);
    }
    this.settingsActions_.appendChild(this.languagePreferencesLink_);
};

mirosubs.widget.DropDown.prototype.enterDocument = function() {
    mirosubs.widget.DropDown.superClass_.enterDocument.call(this);
    var s = mirosubs.widget.DropDown.Selection;
    this.getHandler().
        listen(this.unisubsLink_, 'click',
            function(e) { window.open('http://www.universalsubtitles.org'); }).
        listen(this.addTranslationLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.ADD_TRANSLATION)).
        listen(this.improveSubtitlesLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.IMPROVE_SUBTITLES)).
        listen(this.subtitleHomepageLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.SUBTITLE_HOMEPAGE)).
        listen(this.downloadSubtitlesLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.DOWNLOAD_SUBTITLES)).
        listen(this.createAccountLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.CREATE_ACCOUNT)).
        listen(this.languagePreferencesLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.LANGUAGE_PREFERENCES)).
        listen(this.subtitlesOff_, 'click',
               goog.bind(this.menuItemClicked_, this, s.SUBTITLES_OFF)).
        listen(this.originalLanguage_, 'click',
               goog.bind(this.languageSelected_, this, null)).
        listen(this.usernameLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.USERNAME)).
        listen(this.logoutLink_, 'click',
               goog.bind(this.menuItemClicked_, this, s.LOGOUT));
    
    var that = this;
    goog.array.forEach(this.translationLanguages_,
        function(e) {
            that.getHandler().listen(e.elt, 'click',
                goog.bind(that.languageSelected_, that, e.code));
        });
};

mirosubs.widget.DropDown.prototype.menuItemClicked_ = function(type, e) {
    e.preventDefault();

    var s = mirosubs.widget.DropDown.Selection;
    if (type == s.CREATE_ACCOUNT)
        mirosubs.login();
    else if (type == s.LOGOUT)
        mirosubs.logout();
    else if (type == s.USERNAME)
        window.open('/profiles/mine');
    else if (type == s.LANGUAGE_PREFERENCES)
        window.open('/profiles/mine');
    else
        this.widget_.selectMenuItem(type, this.currentLanguageCode_);
};

mirosubs.widget.DropDown.prototype.languageSelected_ = function(languageCode, e) {
    e.preventDefault();
    this.widget_.selectMenuItem(mirosubs.widget.DropDown.Selection.LANGUAGE_SELECTED,
                                languageCode);
};

mirosubs.widget.DropDown.Selection = {
    ADD_TRANSLATION: "add_translation",
    IMPROVE_SUBTITLES: "improve_subtitles",
    SUBTITLE_HOMEPAGE: "subtitle_homepage",
    DOWNLOAD_SUBTITLES: "download_subtitles",
    CREATE_ACCOUNT: "create_account",
    LANGUAGE_PREFERENCES: "language_preferences",
    SUBTITLES_OFF: "subtitles_off",
    LANGUAGE_SELECTED: "language_selected",
    USERNAME: "username",
    LOGOUT: "logout"
};

mirosubs.widget.DropDown.prototype.setCurrentLanguageCode = function(languageCode) {
    var that = this;
    if (this.currentLanguageCode_ == null)
        this.originalLanguage_.className = '';
    else
        goog.array.find(this.translationLanguages_, function(elt, idx, arr) {
            return elt.code == that.currentLanguageCode_;
        }).elt.className = '';

    this.currentLanguageCode_ = languageCode;

    if (this.currentLanguageCode_ == null)
        this.originalLanguage_.className = 'mirosubs-activeLanguage';
    else
        goog.array.find(this.translationLanguages_, function(elt, idx, arr) {
            return elt.code == languageCode;
        }).elt.className = 'mirosubs-activeLanguage';
};

mirosubs.widget.DropDown.prototype.setShowingSubs = function(showSubs) {
    // TODO: finish this
};

mirosubs.widget.DropDown.prototype.getTranslationLanguages = function() {
    return this.translationLanguages_;
};

mirosubs.widget.DropDown.prototype.toggleShow = function() {
    if (this.shown) {
        goog.style.showElement(this.getElement(), false);
        this.shown = false;
    }
    else {
        goog.style.showElement(this.getElement(), true);
        this.shown = true;
    }
};

mirosubs.widget.DropDown.prototype.loginStatusChanged = function() {
    this.updateActions_();
};

mirosubs.widget.DropDown.prototype.onActionTaken_ = function(event) {
    var selectedValue = event.target.getModel();
    var mv = mirosubs.MainMenu.MenuValues_;
    var et = mirosubs.MainMenu.Selection;
    if (selectedValue == mv.ADD_SUBTITLES)
        this.dispatchEvent(et.ADD_SUBTITLES);
    else if (selectedValue == mv.EDIT_SUBTITLES)
        this.dispatchEvent(et.EDIT_SUBTITLES);
    else if (selectedValue == mv.ORIGINAL_LANG)
        this.dispatchEvent(
            new mirosubs.MainMenu
                .LanguageSelectedEvent());
    else if (selectedValue == mv.NEW_LANG)
        this.dispatchEvent(et.ADD_NEW_LANGUAGE);
    else if (selectedValue == mv.LOGIN)
        mirosubs.login();
    else if (selectedValue == mv.CREATE_ACCOUNT)
        mirosubs.createAccount();
    else if (selectedValue == mv.LOGOUT)
        mirosubs.logout();
    else if (selectedValue == mv.TURNOFFSUBS)
        this.dispatchEvent(et.TURN_OFF_SUBS);
    else
        this.dispatchEvent(
            new mirosubs.MainMenu
                .LanguageSelectedEvent(selectedValue));
};

