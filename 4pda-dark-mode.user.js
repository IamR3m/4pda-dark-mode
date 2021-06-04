// ==UserScript==
// @name         4pda Dark Mode
// @namespace    https://4pda.to/forum/index.php
// @version      0.3.7
// @description  Dark Mode to 4pda
// @author       IamR3m
// @match        https://4pda.ru/*
// @match        https://4pda.to/*
// @icon         https://ds-assets.cdn.devapps.ru/cQMtfz1ctAlz1Rhz2XO6lH.png
// @downloadURL  https://github.com/IamR3m/4pda-dark-mode/raw/main/4pda-dark-mode.user.js
// @updateURL    https://github.com/IamR3m/4pda-dark-mode/raw/main/4pda-dark-mode.meta.js
// @grant        none
// ==/UserScript==

const BUTTON_SIZE = 32;

const userConfig = {
    key: '4pdafix',
    model: {
        night_mode: [false, true]
    },
    config: {},
    init() {
        let jsonString = localStorage.getItem(userConfig.key);
        const loadedConfig = jsonString ? JSON.parse(jsonString) : {};
        const loadedKeys = Object.keys(loadedConfig);
        const config = {};
        Object.keys(userConfig.model).forEach((key) => {
            const exist = loadedKeys.indexOf(key) >= 0;
            config[key] = exist ? loadedConfig[key] : userConfig.model[key][0];
        });
        jsonString = JSON.stringify(config);
        localStorage.setItem(userConfig.key, jsonString);
        userConfig.config = config;
    },
    getItem(key) {
        const jsonConfig = localStorage.getItem(userConfig.key);
        const config = JSON.parse(jsonConfig);
        return config[key];
    },
    setItem(key, value) {
        let jsonString = localStorage.getItem(userConfig.key);
        const config = JSON.parse(jsonString);
        config[key] = value;
        jsonString = JSON.stringify(config);
        localStorage.setItem(userConfig.key, jsonString);
        userConfig.config = config;
    },
    shiftItem(key) {
        const currentValue = userConfig.getItem(key);
        const availableValues = userConfig.model[key];
        const currentIdx = availableValues.indexOf(currentValue);
        const nextIdx = (currentIdx + 1) % availableValues.length;
        const nextValue = availableValues[nextIdx];
        userConfig.setItem(key, nextValue);
        return nextValue;
    }
};
userConfig.init();

const userStyleEl = document.createElement('style');
let userStyle = '';

userStyle += `
    .night_mode_switcher {
        box-sizing: border-box;
        position: fixed;
        width: 32px;
        height: 32px;
        right: 32px;
        bottom: 32px;
        width: ${BUTTON_SIZE}px;
        height: ${BUTTON_SIZE}px;
        right: ${BUTTON_SIZE}px;
        bottom: ${BUTTON_SIZE}px;
        z-index: 10000;
        bachground-color: transparent;
        border-radius: 50%;
        border: 4px solid #aaa;
        border-right-width: ${BUTTON_SIZE / 2}px;
        transition: border-color 0.1s ease-out;
    }

    .night_mode_switcher:hover {
        border-color: #333;
    }

    .night .night_mode_switcher {
        border-color: #515151;
    }

    .night .night_mode_switcher:hover {
        border-color: #9e9e9e;
    }

    .night ::-webkit-scrollbar,
    .night ::-webkit-scrollbar-corner,
    .night ::-webkit-scrollbar-track-piece {
        background-color: #000;
    }

    .night ::-webkit-scrollbar-thumb {
        background-color: #22272b;
        border: 1px solid #000;
    }

    .night ::-webkit-scrollbar-thumb:hover {
        background-color: #2C3237;
    }

    .night body.custom-scroll .scrollframe::-webkit-scrollbar-thumb {
        background: #22272b !important;
        border: 1px solid #000 !important;
    }

    .night {
        scrollbar-color: dark;
        scrollbar-face-color: #22272b;
        scrollbar-track-color: #000;
        scrollbar-color: #22272b #000;
    }

    /* Background */

    .night .activeusers {
        background: transparent;
    }

    .night .popupmenu,
    .night select,
    .night .borderwrap,
    .night .borderwrapm,
    .night .ed-p-textarea,
    .night .ed-textarea,
    .night .copyright,
    .night body,
    .night #logostrip,
    .night .pagelink,
    .night .pagelinklast,
    .night .minipagelink,
    .night .minipagelinklast,
    .night input,
    .night textarea,
    .night .post2,
    .night .post1,
    .night .bg1,
    .night .ed-wrap .ed-p-textarea,
    .night .qr-maintitle,
    .night .ed-wrap .ed-textarea,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field select,
    .night .container,
    .night .side-box,
    .night .z2Iuiq37TBOm,
    .night .navbar,
    .night .footer,
    .night .thread-list .date .text,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field:before,
    .night #ucpmenu,
    .night #ucpcontent,
    .night .check_list_div {
        background: #171c20;
    }

    .night #userlinks,
    .night #userlinksguest,
    .night .upopupmenu-new,
    .night .popupmenu-new,
    .night .twWqGD1Fem94z0ltz2wnz1,
    .night .borderwrap p,
    .night .row1,
    .night .row2,
    .night .post-edit-reason,
    .night .pformstrip,
    .night .borderwrap p.formbuttonrow,
    .night .borderwrap p.formbuttonrow1,
    .night .toplinks span,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g > li,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g .u-note:after,
    .night .profile-text,
    .night .ac_results,
    .night .footer-nav,
    .night #footer,
    .night rZWx6mPEjRxO .menu-main-item:hover,
    .night rZWx6mPEjRxO .menu-sub,
    .night rZWx6mPEjRxO .events-popup,
    .night rZWx6mPEjRxO .dropdown-menu,
    .night rZWx6mPEjRxO .menu-user > a:hover,
    .night rZWx6mPEjRxO .menu-user:hover > a,
    .night rZWx6mPEjRxO .menu-user.open > a,
    .night .plainborder,
    .night .tablefill,
    .night .tablepad,
    .night .advanced-area .z2Iuiq37TBOm,
    .night .poll-frame,
    .night .second-menu .menu-brands,
    .night .second-menu .menu-brands li a:hover,
    .night .second-menu .menu-brands li a:focus,
    .night .product-detail,
    .night #twocolumns,
    .night #q1a1WedtXihl9z2,
    .night .price-slider .ui-slider,
    .night .comment-box .comment-list li,
    .night .dipt,
    .night .form-bg,
    .night .bar,
    .night .barb,
    .night .barc{
        background: #22272B;
    }

    .night td.formbuttonrow,
    .night .borderwrap.read .row2,
    .night .borderwrap.read .post2,
    .night .borderwrap.read .post1,
    .night .borderwrap.read td.formbuttonrow,
    .night .post,
    .night .postcolor[style*="background-color: #F0F7FF"],
    .night .ed-emo-panel div:last-of-type {
        background: #22272B !important;
    }

    .night .list-group .our-message,
    .night .rz1gXXZ5pRH .list-group .list-group-item.active,
    .night .sidebar .list-group .list-group-item.active,
    .night .comment-box .comment-list.level-1 > li,
    .night .comment-box .comment-list.level-3 > li,
    .night .comment-box .comment-list.level-5 > li,
    .night .comment-box .comment-list.level-7 > li,
    .night .comment-box .comment-list.level-9 > li,
    .night .comment-box .comment-list.level-11 > li {
        background: #31383e;
    }

    .night .twWqGD1Fem94z0ltz2wnz1 h4,
    .night .borderwrap h3,
    .night .maintitle,
    .night .maintitlecollapse,
    .night .popupmenu-category,
    .night .catend,
    .night .formtable td.formtitle,
    .night .formsubtitle,
    .night #gfooter,
    .night .ac_over,
    .night .footer-panel,
    .night rZWx6mPEjRxO.menu,
    .night rZWx6mPEjRxO.oDwm2X,
    .night rZWx6mPEjRxO .userevents,
    .night rZWx6mPEjRxO #events-count,
    .night .poll-frame .poll-frame-option,
    .night .second-menu .menu-brands li a,
    .night .price-slider .ui-slider .ui-slider-range,
    .night .comment-box .comment-list .karma .num-wrap,
    .night .comment-box .comment-list .karma .num,
    .night .dropdown-menu > li > a:hover,
    .night .dropdown-menu > li > a:focus {
        background: #3A4F6C;
    }

    td.row1[style*="background:#FFE87F"] {
        background: #4e4623 !important;
    }

    .night .pagecurrent {
        background: #4c3c32;
    }

    .night .popmenubutton-new,
    .night .popmenubutton {
        background: #4c80a0;
    }

    .night .list-group .list-group-item .bage,
    .night .list-group .list-group-item .icon-close {
        background: #22272b;
        background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, #22272b 20%, #22272b 100%);
        background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0)), color-stop(20%, #22272b), color-stop(100%, #22272b));
        background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
        background: -o-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
        background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
    }

    .night .rz1gXXZ5pRH .list-group .list-group-item.active .bage,
    .night .sidebar .list-group .list-group-item.active .bage {
        background: #31383e;
        background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, #31383e 20%, #31383e 100%);
        background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0)), color-stop(20%, #31383e), color-stop(100%, #31383e));
        background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, #31383e 20%, #31383e 100%);
        background: -o-linear-gradient(left, rgba(255,255,255,0) 0%, #31383e 20%, #31383e 100%);
        background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%, #31383e 20%, #31383e 100%);
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, #31383e 20%, #31383e 100%);
    }

    .night .fosy-captcha {
        background: #4b80b5;
        background: -moz-linear-gradient(top, #4b80b5 0%, #335d88 44%, #14395f 100%);
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4b80b5), color-stop(44%,#335d88), color-stop(100%,#14395f));
        background: -webkit-linear-gradient(top, #4b80b5 0%, #335d88 44%, #14395f 100%);
    }

    /* Background Color */

    .night .usercp_menu {
        background-color: #171c20;
    }

    .night .ed-wrap .ed-vtoggle-normal,
    .night .ed-wrap .ed-vtoggle-hover,
    .night .ed-wrap .ed-vtoggle-down,
    .night .ed-wrap .ed-panel,
    .night .dropdown-menu .divider {
        background-color: #3A4F6C;
    }

    .night .deletedpostlight .row2,
    .night .deletedpostlight .post1shaded,
    .night .deletedpostlight .post2shaded,
    .night .deletedpostlight td.formbuttonrow {
        background: #3a4f6c !important;
    }

    .night .row4shaded2,
    .night .post1shaded2,
    .night .post2shaded2 {
        background-color: #fa052a5c;
    }

    .night p.copyright,
    .night .submit-wrapper,
    .night .fosy-captcha-load {
        background-color: transparent !important;
    }

    /* Background + Color */

    .night .g-btn.blue /*,
    .night .g-btn.red,
    .night .g-btn.green,
    .night .sel-btn */ {
        background: #3997d2;
        background: -moz-linear-gradient(top, #3f5364 0%, #7eb8e5 100%);
        background: -webkit-linear-gradient(top, #3f5364 0%, #7eb8e5 100%);
        background: linear-gradient(to bottom, #3f5364 0%, #7eb8e5 100%);
        color: #303040 !important;
    }

    .night .g-btn.red {
        background: #ff494c;
        background: -moz-linear-gradient(top, #924e4f 0%, #ff494c 100%);
        background: -webkit-linear-gradient(top, #924e4f 0%, #ff494c 100%);
        background: linear-gradient(to bottom, #924e4f 0%, #ff494c 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#924e4f', endColorstr='#ff494c',GradientType=0);
    }

    .night .g-btn.green {
        background: -moz-linear-gradient(top, #5b6b3b 0%, #84a544 100%);
        background: -webkit-linear-gradient(top, #5b6b3b 0%, #84a544 100%);
        background: linear-gradient(to bottom, #5b6b3b 0%, #84a544 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#5b6b3b', endColorstr='#84a544',GradientType=0);
    }

    .night .resized-linked-image {
        background-color: #000;
        color: #DDD;
    }

    .night .post-block > .block-body {
        background: #171c20;
        color: #9e9e9e;
    }

    .night .post-block > .block-title {
        background-color: #22272B;
        color: #9e9e9e;
    }

    .night .comment-box .heading .btn {
        background: #3a4f6c;
        color: #DDD !important;
    }

    .night .price-slider .ui-slider .ui-slider-handle {
        background: #4c80a0;
        color: #DDD !important;
    }

    .night .ed-wrap .ed-bbcode-hover,
    .night .ed-wrap .ed-color-hover {
        background-color: #4c678d;
        color: #6f85a3;
    }

    .night table th,
    .night .borderwrap table th,
    .night .subtitle,
    .night .subtitlediv,
    .night .postlinksbar{
        background-color: #4c678d;
        color: #8faed8;
    }

    .night .pp-title {
        background: #4c678d;
        color: #ddd;
    }

    .night .darkrow1 {
        background: #5f80af;
        color: #1d2735;
    }

    /* Background + Border Color */

    .night .list-group .list-group-item,
    .night .dropdown-menu {
        background: #22272B;
        border-color: #29394e;
    }

    .night .profile-textarea {
        background: #31383e;
        border-color: #395179;
    }

    .night .navbar .btn {
        background-color: #3A4F6C;
        border-color: #395179;
    }

    .night td.formbuttonrow,
    .night .pformstrip,
    .night .borderwrap p.formbuttonrow,
    .night .borderwrap p.formbuttonrow1 {
        background-color: #3A4F6C !important;
        border-color: #395179;
    }

    .night .rz1gXXZ5pRH,
    .night .sidebar {
        background: #171c20;
        border-right-color: #395179;
    }

    .night .post-block.spoil.open > .block-body:after {
        background: #22272B;
        outline-color: #22272B;
    }

    /* Border Color */

    .night .popupmenu,
    .night .popupmenu-new,
    .night .borderwrap,
    .night .borderwrapm,
    .night .upopupmenu,
    .night .upopupmenu-new,
    .night .borderwrap p,
    .night .bar,
    .night .barb,
    .night .barc,
    .night .toplinks span,
    .night .subtitlediv,
    .night .container {
        border-color: #29394e;
    }

    .night #userlinks,
    .night #userlinksguest,
    .night .usercp_menu,
    .night .usercp_menu_out,
    .night .twWqGD1Fem94z0ltz2wnz1,
    .night .twWqGD1Fem94z0ltz2wnz1 h4,
    .night .post-edit-reason,
    .night .pagelink,
    .night .pagelinklast,
    .night .pagecurrent,
    .night .minipagelink,
    .night .minipagelinklast,
    .night .hIiDg3yjTi9D > div,
    .night .maintitlecollapse,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g > li,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g .u-note,
    .night .profile-text,
    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field select,
    .night .fosy-div,
    .night .fosy-form input,
    .night .fosy-form textarea,
    .night .fosy-form select,
    .night .qr-maintitle .sel-btn,
    .night .navbar,
    .night .form-input,
    .night fieldset {
        border-color: #395179;
    }

    .night .ed-wrap td,
    .night .ed-wrap td table {
        border-color: #395179 !important;
    }

    .night rZWx6mPEjRxO .menu-main-item.w-sub > a:after {
        border-top-color: #9e9e9e;
    }

    .night .body-thread-form {
        border-top-color: #395179;
    }

    .night .price-slider .ui-slider .ui-slider-handle span {
        border-top-color: #4c80a0;
    }

    .night .content-box blockquote {
        border-left-color: #29394e;
    }

    .night .borderwrap h3,
    .night .maintitle,
    .night .maintitlecollapse,
    .night .upopupmenu-item,
    .night .popupmenu-item,
    .night .product-detail,
    .night .rz1gXXZ5pRH .clear-members-form,
    .night .sidebar .clear-members-form {
        border-bottom-color: #395179;
    }

    .night .post-block {
        border-color: #29394e;
        border-left-color: #395179;
    }

    /* Box Shadow */

    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field select {
        -webkit-box-shadow: 0 0 0 1px #395179;
        -moz-box-shadow: 0 0 0 1px #395179;
        box-shadow: 0 0 0 1px #395179;
    }

    .night .dipt:after,
    .night .dipt-hor-border {
        -webkit-box-shadow: 0 1px 0 0 #395179 inset;
        -moz-box-shadow: 0 1px 0 0 #395179 inset;
        box-shadow: 0 1px 0 0 #395179 inset;
    }

    .night .dipt .dfrml {
        -webkit-box-shadow: -1px 0 0 0 #395179 inset;
        -moz-box-shadow: -1px 0 0 0 #395179 inset;
        box-shadow: -1px 0 0 0 #395179 inset;
    }

    .night .dipt .dfrml + .dfrmr,
    .night .dipt .dfrmrbrd {
        -webkit-box-shadow: -1px 0 0 0 #395179;
        -moz-box-shadow: -1px 0 0 0 #395179;
        box-shadow: -1px 0 0 0 #395179;
    }

    .night .fosy-form input,
    .night .fosy-form textarea,
    .night .fosy-form select {
        -webkit-box-shadow: inset 0px 1px 3px 0px #395179;
        box-shadow: inset 0px 1px 3px 0px #395179;
    }

    /* Color */

    .night .borderwrap h3,
    .night #loading-layer-inner,
    .night .upopupmenu-item,
    .night .popupmenu-item-last,
    .night .popupmenu-item,
    .night .maintitle td,
    .night .maintitle-text,
    .night .qr-maintitle,
    .night #gfooter td,
    .night #gfooter a:link,
    .night #gfooter a:visited {
        color: #000;
    }

    .night a:hover {
		color: #13A4F4;
	}

    .night .sel-btn.orange {
        color: #303040 !important;
    }

    .night .globalmesscontent a:link,
    .night .globalmesscontent a:visited,
    .night .globalmesscontent a:active,
    .night .twWqGD1Fem94z0ltz2wnz1 h4,
    .night .usercp_menu,
    .night .usercp_menu_out,
    .night .formsubtitle,
    .night .ed-wrap .ed-vtoggle-normal,
    .night .ed-wrap .ed-vtoggle-hover,
    .night .ed-wrap .ed-vtoggle-down,
    .night .ed-wrap .ed-panel {
        color: #3294cf;
    }

    .night #submenu,
    .night .ipb-top-left-link a:link,
    .night .ipb-top-left-link a:visited,
    .night .ipb-top-right-link a:link,
    .night .ipb-top-right-link a:visited,
    .night .upopupmenu-item a:link,
    .night .upopupmenu-item a:visited,
    .night .upopupmenu-item-last a:link,
    .night .upopupmenu-item-last a:visited,
    .night .popmenubutton a:link,
    .night .popmenubutton a:visited,
    .night .popmenubutton-new a:link,
    .night .popmenubutton-new a:visited,
    .night .popmenubutton-new,
    .night .popmenubutton,
    .night .popmenubutton a:link,
    .night .popmenubutton a:visited,
    .night .popmenubutton-new a:link,
    .night .popmenubutton-new a:visited,
    .night .globalmesscontent {
         color: #515151;
    }

    .night .content-box a:link,
    .night .content-box a:visited {
        color: #5c94c8 !important;
    }

    .night .desc,
    .night .lastaction {
        color: #5f6772;
    }

    .night a:link,
    .night a:visited,
    .night a:active,
    .night table.ipbtable,
    .night tr.ipbtable,
    .night td.ipbtable,
    .night body,
    .night #events-wrapper,
    .night table.ipbtable,
    .night tr.ipbtable,
    .night td.ipbtable,
    .night .dipt,
    .night .maintitle,
    .night .maintitlecollapse,
    .night .maintitle a:link,
    .night .maintitle a:visited,
    .night .maintitlecollapse a:link,
    .night .maintitlecollapse a:visited,
    .night #navstrip a:link,
    .night #navstrip a:visited,
    .night .popupmenu-new,
    .night .popupmenu-category,
    .night .popupmenu-item a:link,
    .night .popupmenu-item a:visited,
    .night .popupmenu-item-last a:link,
    .night .popupmenu-item-last a:visited,
    .night .popmenubutton a:link,
    .night .popmenubutton a:visited,
    .night .post-edit-reason,
    .night .advanced-area .post p,
    .night .content-box,
    .night .content-box blockquote:before {
        color: #9e9e9e !important;
    }

    .night .input-warn,
    .night .input-green,
    .night .input-checkbox,
    .night input,
    .night textarea,
    .night select,
    .night .popupmenu-item-last,
    .night .textarea,
    .night .searchinput,
    .night .button,
    .night button.editor_button,
    .night .gobutton,
    .night .popupmenu-item,
    .night .normalname,
    .night .catend,
    .night .ed-wrap .ed-textarea,
    .night label.select-field select,
    .night .comment-box .comment-list {
        color: #DDD;
    }

    .night a.btn.noborder.iblock.rounded.green,
    .night .comment-box .wrap-menu a,
    .night .g-btn.red,
    .night .g-btn.green {
        color: #DDD !important;
    }

    .night .pwLRWWLQ2bWn3ByIrSeTn4g .heading .ico {
        color: rgba(255,255,255,0.2);
    }

    .night .body-tbl path,
    .night .body-tbl circle {
        fill: #3A4F6C;
    }

    /* Post block Image */

    .night .post-block.quote > .block-title {
        background-image: url(data:image/gif;base64,R0lGODlhNQAZAIQBAAAAAP///zZz1D551kqB2FSI21+Q3WmX34er5ZO06J276qbB7MfY83Oe4X2l47LK77zR8f///////////////////////////////////////////////////////////yH5BAEKAB8ALAAAAAA1ABkAAAWp4CeOZGmeqCms7Jq+MNkK5jCzca7as3y3OhSt9ht+irhgybVEjpDMk1EV9TmP0OlTu+WKst3izvsZDFLgsI2ntaGrxOuXCRy5hfAT+/aeJqV5gEN1gGdzZIdKiX1dfYiMeH6Bh4OTTYh/hFRiL3+bVpWXnJFvogI8d1hyn4Kbo2k1hqymM7J7fLGdkVdQs4qqr6Nbv6C4YSuyxC+3noepyp03ydDUPdTKIQA7);
    }

    .night .post-block.code > .block-title {
        background-image: url(data:image/gif;base64,R0lGODlhNQAZAOMPAP2Rkf/39/7Ly/2Zmf6urv7i4v2np/2goP7T0/69vf/p6f7a2v7Fxf/w8P62tv///yH5BAEKAA8ALAAAAAA1ABkAAASv8MlJq714gj2y/+A1bEBontmGrqzKvuFRyuQBk+WNk++eZ7YLTxM0jVxHzM7CobhSTkDxMZocj8to5Sn8PWRMTfbL5T7MlKQzLBlLZEW0N422gLXMn1xUz2/nbV6AgGeEeR14f2tbiGIhQ4mRcziOj4aEAI2FOTQuTY8pkz+delGaH4abO41Yp4FSMH+rKFiwsYWbMLVTK30suxkjvIG3FsB5mKmxWBiuGsXBykq3EQA7);
    }

    /* Image fixes */

    .night .postdetails img[alt="*"] {
        content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAKCAYAAABi8KSDAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WAQdtr/RtAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAH9JREFUGNNj/P//PwMDAwODhpYuAzbw8vkTOJvx////DBza6f8Z8ADOZ6sYGRgYGFhgAj7+QVgVbtm4jkFcUobh5fMnCMVG9rY4FcMAXPHNS1cZCAG4YjZOLlIUcxKv+NnN6wQVMwoICDB8lwojKugYBQQEGBgYGBjEJWUIRgoAGjEh5cbjPB4AAAAASUVORK5CYII=');
    }

    .night .postdetails img[alt="-----"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAKCAYAAAD2Fg1xAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WBTJfcPVKAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAHRJREFUOMtj/P//P8NwACwMDAwMZd1r8fqmqzSYcbCrY4Fx1NQ1sSq6dfM6Cn+wqoN7RFJBnigDB6s6uEfevnxFVFocrOrgHmFmYSXKwMGqDuERVhbiDByk6uCyn9+8IcrAwaoO7pHbt28SZeBgVcc4XCpEAO8SYIEmEM0iAAAAAElFTkSuQmCC);
    }

    .night .postdetails img[alt="-"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WDBvMANZvAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAIdJREFUGNONkDEKAjEURF8mWSurvcHCNoIXsRTEQ9pYeodFLESwTO8Vlv1rIYkiMTjl8HjM/+58uTJOhplRiiQaL8I4GffjYaaS1XbvQjKtu64I3WLEzAipWLZtWRcjwBt8DAOnL2YD4P1rayoXBdlnl40NsKsclMG57+sbJeXrfkUS7t+HPwFDzyxd8mmlQwAAAABJRU5ErkJggg==);
    }

    .night .postdetails a img[alt="-"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WCSVwFj+BAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAJFJREFUGNNjvP/svcuX77/2/P79lwEbYGVlZuDhZHNh+fL9157JWnL/GfCA3GuPGFlgJpWGh2NV1L1yJcPv338ZWGACcvr62I1buZKBgYEBofB4SQmDw39UFxxgZGRgYGNjYGBgYGCCCfJjMQxZDG4i////DPfQVSLZAFf4Ny4OvxtZWZnhvsMFWFmZGRiJDXAAEAQ1KpsQsDgAAAAASUVORK5CYII=);
    }

    .night .postdetails img[alt="+"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WDyUmTJgHAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAKtJREFUGNNjvHTtPMPvf78Y/v37x4ANMDExMbAysTGw/P73i2HVwXn/GfCAMPskRhaYSarqqlgV3b55m+Hfv38MTDABOVkJBjlZCYYTK24wnFhxA86HOwHGePXmLcOq7gNwiVXdBxhevXmLqZCVlRnDWmQxuEIWFmYGzyxjuIRnljEDCwtCIQuM8fbNZwYGBgYGszA1FD5cIRMTxNC7t+/iDB4mJiYGRmIDHADm9TsjsY71/AAAAABJRU5ErkJggg==);
    }

    .night .postdetails a img[alt="+"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WER3aDx9GAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAK9JREFUGNONkL0KglAYhh/TI5zqaqI1WtySiC7DrTmaonvwKhrEavESmgQJB2mqtcUQFKnpHIsserf3+57vh9e43M5OUeZRVVe0SZgCafcdqyjzaLIaPvih3fpoWGrTdO62QsE2pKorLFUYjwYAuL0lAOF9o0GAjgLjJNWQGoiTVHsNyq79cfa11oDSxs883fAzDykbUP+Ynq4ALMLZm9egMAUA++DwNR5hCox/A38Cvx098hNNN8QAAAAASUVORK5CYII=);
    }

    .night img[alt=">"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WFQ9N2qsKAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAADJJREFUGNOFz0EOACAIA8Gt///zekWD0msnkEbll8WQAyRxvHCj9kVFLVDzBLUEyDRzA6GMDwuVxSP3AAAAAElFTkSuQmCC);
    }

    .night #navstrip img {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WGAv/GRFeAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAHxJREFUGNOVkMEJwzAQBOeM25HQXw2oHYOlIlyAHq7EDagBfV3M5icCcYKysI87uFn2TBIzWgByzvLe/7wwSZznqfu+MTOu66L3bo9EgForrTVSSpRSPhIGcdu2sQwhEGMEGAkLk1rfhyfScRz/lUES+77LOSdJfLPNPvwF/UFdAlNuifMAAAAASUVORK5CYII=);
    }

    .night img[alt=">"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WFQ9N2qsKAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAADJJREFUGNOFz0EOACAIA8Gt///zekWD0msnkEbll8WQAyRxvHCj9kVFLVDzBLUEyDRzA6GMDwuVxSP3AAAAAElFTkSuQmCC);
    }

    /* Post Smiles */

    .night img[src="//ds-assets.cdn.devapps.ru/cQMts4DMoQGpJTI6wk2YHlqv91rqY5AYiJvqT244QbiMTL8pB2c1Zo1OFe4E1z14.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WJRgRTxg+AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAA2ZJREFUOMu1lG1oW1UYx//n3Jtzm7Sd3Upd0qzc1JjqZuNeTG9R56Zs+1D2QkGYQ1REJ4gofvJDUZyFjXxWPwiCOCZClaKjKu3YBnNlA9M4tYls5qVNOq+j7qVdEvJy7r3n+KEsoXR2X/SB58vhOT/+/+ec5wH+wyB3O0zN5LV8+ueHU9M/Pp5PxUuFxfnLa9rWV/WeiNPz6M6aHnrsZs8DemFVWP7aTfyVS7Lvvhg23GLqaHiTKxToUoW/U6nk87bI5Swkrlim1dT/wf4Xj/zWGegVuq+9tAKWM6/j9/gp9s2nrxkvHWqJ9kWaDKoSRgiBlBLClrC5QK1k86l4NTY6Xhs6+NaJ+MZtu6juay8vk3j29Bh781nPdvNi5ySf0Wv2XLcUfzbSnuuWPKvLUnKDvH5hfS0x0jb56kDT9osXzml3GBQALqezzd9+9o7x+iut0Q6vy1AZZYpKQGgjFZVA1SiYR4HWorIOr8vYv1ONnjz+bt+VzKxWh6UT5zcEvNeGgw9qhqJSRuiS+90Hbi1Tv2dwAYpK4dIoXG6FbXnEZTTzS8PpxHm9DktOjbP+iOanCmGE3uP5KUBVCkWlUFyUbQ4Rf3JqvKFsLnMJ3boKQgFCyD1oBIQsQQkl8HVQXM3+0uhZubiAlmYCKQApZf3embF1yzhnxtYBUkJKLNUKCTeTKJcWGzBP61rcXnQgHAkpVhcmBSBsAccWcCyBUknC09LWgHUFt/JMxjLtmsMdW6xofAMk4dgC+14owqo44BWHm38Lsyu4lddh4b4BM/4rP1YrOSavOBj/+j7sPnALUtyx1Pi0AwdvY+QjDdWiDV52zMSMPNbbN2ACgAoAofCO2sRX3tlM+sZsMKT5hS3Z91+uwZ7BhRXqRj7UUFm0UClYPJmyZ6ueSD4U3rF8nM6eHmOjHz9nvPG8Fu3wugyXW2GKSkEoqduzKg6qRRuVgsVvzNuxz09h6PD7E9NPPPl04a6zOfrJYWPwGTW6eZPLUBhllBIIIeFwAV5xwMsOT6bs2EScDB16+0Rs47ZdUve1W/+6NU4ef89wV+LDW3qI338/hUeTKBYlrs4LTGelyVuNI4MvH411Bnq57mtffZ/9kc2xdHLSn/jpB5ZPx1EuLsDTuhZ6KIJw/14e6n3KfCgY4Pg/4x/eQZ7fhjsV2wAAAABJRU5ErkJggg==);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtr3181aJLCjAwyXQUtGqv91LaA10pd1KvWdz0B2vwnXJdxz2GBCz17GpDjDvLy1.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WLRI5Q3soAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAz9JREFUOMu11F9oW1UcB/DvufcmabK2dEpd12tJY5voZuM2Td3TNiTbQ5GNwED2MhnqwAdFEHxxggiKPumjKAymIviwuTGV+u+CTjaQZlOXyLb8aZLO66ybTbqk98+5556fD2G9K7bzRX9wHs7hx4fz43d+B/gPg612WJptoFE+j9LF79Eo5XGzNY/+gQ2IpzJIPbQL8eQjSN0XvzPWuPYXfq8X8dlHryEqZ4z05pA+OqJBH1bRaAjU6x4Klz3T69me3XvwVQyPTiC+8e5/YnXzOn7Nf4VP3z9sPHmgNzGZ6dEVjYUZYyAiSEEQXMLtCD6Td8zj027tiec/zG56OLsCBAAY35zGc/tjhnlu2OGzcRJzCZK/BUvMJYhX49Qp3kvXz26gwicDztNTPca5s98tGwoAXCpXcfLoS3j2qb7E4FAoooUVqBoDU4KlagxaREE4piLSq2FwKBTZu0tLnDp2BJcrNQCABgDlwhmMDl0zxsYHdFVT8OKR9podIwLeejmKUFTF1gdD+i+XLhjlwpnsMlacmcaOTERXVBZmCvDOm/3YvW8B356+axm5tSdJ8BwJVVOghpTwliTTizPTQZlzlQtIxDUwBWCs25PboRV7xsAYurkKw8ZBBVerPwWY1W6idx0DSYCI7vwyiUCEbq4kRMMEq9MKsFjfeiy2fEifQPJfLAlIIeELCd+T6HQIsd6BABsZ24ZKxYNwffhCgiStARF8IeG5Ep7tg9s+zD8lRsa2BVh6cgr5n7npdnzObR97ck3s3rcAkrdKCh4tt3y4SwJOW4BbPi/MkjkxORVgyfRONG4MZStlx7QXPZw8ug6ff9yPPbkmhOvDcyS47cNpC9iLHuyWB/umh2JJmE4sk02mdwbYptQ49h9+Gx+ccGt/zLmu1eSwWhwn3ovBXuwCVovDanIsLXAsNTluzAv36/Osljv0Bh4YT6w+m8fffcbIPaYltmwO6WpYCSsKg5QEn3dvxy2fF0vC/DLPagdeWDmbq/4ap469gqidN7ammK7foyAWIbTbhKvzEherZPK+R7O5Q6+v/WvcHleqdZSLP6Dw4xdolPOw2k3E+tYjnswgvf1xJCd24P6xUfyv8Tf6Yq3pyN4aAAAAAABJRU5ErkJggg==);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtq077POrgCjgAaz0CvBMxXrdgaA1W3z2z0ocmlffNuvtERpPgnuIDvJr2L17MQU.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WMBLGLxc0AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAzlJREFUOMu1lO9rW2UUx7/Pc+/NbbJWu0pd1mtJs5qKs3GbphYcbkrci+qmBUGHqIhOEFF85StFEfwPfCEI4tA3CkVHRLq5XtFJB9I4ZYk4k7RNqtdRN9cfibk3z33uc3xRkmu12yv9wuE8HM7z4Tk85xzgPxTbKlhaqKFW/g6l81+jVspjfXUZ1/XuQGIkg5HbDyKRuhMjuxLXhtUu/oHfqkV89uGbiKo5O73bsIYGdVgDGmo1iWrVR+GC7/hd49kjT76BgaFRJHbe8G9Y1bmEH/On8Mm7z9lPHe1OjmW6LK6zCGMMRAQlCVIotBpSzOU9Z2q6tfjoSx9kb70juwkIALBP5/DiIzHbOTvgiYUEyaUkqV9Dk0tJEvMJahRvokuzO6jwUa/37ESXfXb2qw6DA8BP5Xl8+t4reP6ZnmR/3DD1CIemMzAemqYz6CZHJKbB7NbRHzfMIwf15Injr+JCZTGElQtnMBS/aA/fbFqazsE42/q3OIOmcxgmhxHVsPc2w9omztnlwpkQVpybxnjGtLjGIowD9z90pQNon9ueceDwE3VoOodm8MieFLOKc9MAAB0AlirnkHxAB+MAYwwzub7O5ZlcX8e3Y9MfXw933QfjDDv7Ob748vsQ1qyvoHubCVIAEXWA/9RMrg+kCL6nNnIVIRohNBurYZmxnu1YWw2gAgKpa3c5KUBJhUAqBL5Co0GIdfeGsMHhfahUfMhWgEAqkKKrgAiBVPBbCr4bQLgBnN8VBof3hbD02ATyPwin1QiEcANIoaAkgRSBaAPSblrRDND6U8KrS4hmIAoL5IyOTYSwVPoAapfj2UrZc9w1fyPRDXBocgWHHr4C31MQbgCvLuGu+XBXfbjrPool6XixTDaVPrB5nOzTOUy9/Zj9wuPm/v64YRpRDe2e65TXBq77uLwsW++fwuyx109m795/79azOfXOMXvyPj25Z7dhaREe4ZxBKUIgNl4nmoEolqRzMs8Wj768eTa33Bonjr+GqJu3944wy7qRI2YS6nXCL8sK5+fJET13ZSeffuvqW+Pv+nm+inLxGxS+/Ry1ch7N+gpiPduRSGWQHn8QqdF7cMvwEP5X/QUiIKexPt09+AAAAABJRU5ErkJggg==);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtpFVxz2drAS5EGTI4DPRcK4S0b97FhR7xnKL0EhU6NUpN3Jz1WExkNz2JUpQZhb.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WMgV3yvBxAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAA0xJREFUOMu1lE1sG0UUx/8zu14nbkzcotA0S+QsiQ0tMWmDQ09thWwOETSK1KrqAVAFrcQBxIkTSAgJbggJLggQUvmSDGpLFT7MR1aColZCcYOoXbX1R2ynXUpoGzu147Vnd2c4WGSxGsoFnvQOb/T0m3nvP+8B/6GR9Q6zC2WUc2eRPfcjytkUblaXcEdgM4LhKMIP7EEw9CDC9wRvDytfvYHfShl88dEr6OZzemSbRx0alKEOSCiXbZRKFtIXLcPq2hnb+8TLGBgaRXDLnbfCSsY1nE99ixPvHtGfPNijTUS7VCoThRACIQS4LWAzjlbdZnOppnEs2SoeeO7D2NbxWAcQAKB/P4Nn9/l048xAky0Ehb2oCX7FdXtRE6wQFPXM3eLa6c0inQg0n57s0s+c/mGNQQHgQq6Az99/Ac885df6+j1eWaGQZAJCXZdkAtlLofgkeHtk9PV7vHv3yNrJoy/iYr4IAJABIJc+haH+q/rwSECVZApCCeJTy2s3zs5s6oi//NgPT7eE7fd71F8vzOu59KnYGiwzl8SuqFelElEIBeJTy5id2dTRhr9iwQUema7g+Ds+SB6qjIWImplLumUu5uehBWUQChBCbgF16k+Q/LS3nUsJtvRRXC784sIatQp6NhAIDgghbv8zhYAQaOdygW5FoFGvujCffyNWqg64IyD4v7A4wG0Ox+ZwLI56XcDXE3Bhg8M7kM9bsFsOHJsjPrXc0XAXJODYHI89XoNlOmCmA+MPjsHhHa6akYlJpPSkMTaqaEQiSvKzXkgyXRcIAIm3vFi9wcAaDksvCGNi/ySARPtlochulK/3x/K5pmGuWGjWbDDTwdeJ3raS81XMzrf7knjTC7NqwbxpIZO1jaYvGgtFdrtlbg2PYN+RN/DB8Vbx98VWq1FhaFQZzBULJ97bgPh4APHxAD553YPVZYbVCsP1Jbv13VlSnD70Gu4b0dafzWNvH9anH5a1sW0eVVKoQikB5wIO42CmA9ZwWCZrG9+kSPHg852zue7WOHn0JXSbKX17mKjqXRQ+r0CtJnB5ieNcQRjM/1Bs+tCr/7w1/m6XCiXkMj8h/fNXKOdSaNQq8Pk3IhiKIrLzUYRGd+He4SH8r/YnnkmGnSFvut0AAAAASUVORK5CYII=);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtoCPqdRJrS5kW5EIgbTfCuwz2b97lR3xTk4TKiz1V5Hnx3X6VJG8GKvScz2aWDw.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WOgNWcN9MAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAWRJREFUOMvtkT0vQwEUhp/71YQ05WoqiHKTO1Afg0nCJNHFD5CYDLr4CTSShnQx+Rc2i1HF5COMmopGo70WiVIaJdx7e0y90YEfIN7kDCcn58n7ngP/+mMqhjKStpcEIGFaUgxlJGFaUlLTQaWsBTmKbQhA2l6SYigjADOxCblgXQBUAM1zST2PEw1F5k09jOa5mHoYALuZVexmVik0HIYemwCM0ofmuSRMSxa7Z7kfFgIYgGZ2sBNfOfjJ/clDXmk5GS11ADDbNcZ0KcaZXm6HbXqHzNx2MheZbIO0Yg52xsSJqqxGkvSoCvt2lQkjTi/C3tMpAHprqdBw2LfjLFdGADeA2c2sAsAb5PpvZPluBCfqk3fvWHOm8HWDq1pZaXMGsFXZTf72qMv3CprnkovccPxSAOC6/yOYqwC+blDzXnn8rOe2B86D/nvMlLUgx9V80tcNjuqXXNXKiq8bwb3+9df0BRrhjwMMoAduAAAAAElFTkSuQmCC);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtnBLgKbGJ3rsS31AM3YfCuwVrX3bA8fmZvujZc3JsDz0ifoDz1TLb5IUZsJqFz2.gif"] {
        content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4XAB2IFFZhAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAzhJREFUOMu11F9oW1UcwPHvubk3adNW06zdul5LmrWpbrZu09Q+uSHplCLb4ga6F6U4Bz4oPvmkMBR9E99EEIpTEYbMbVS0OntBJxtIszmWiFuT/knnddbVpV2z/Lm59x4fyhKH3fqiP/hxDj8OH34Hzu/AfxhiteLkdJZs+hyTF38gO5ngxuI89wQ2EOqJ0vPQTkKRR+jZFLo7lr36F7/Ppvjy0zepdyeMvi2a3tmhord7yGZtZmcrJC9VzErdQGz3c4dp7+wltHHdv7FZ8xq/JL7l+IeHjOcPNIb7o3W6ogqvEAIpJa4tsS2Xct62JhIl89hYeeaZVz6JbX44dhsIgPHdKC/v9xvm2faSNR2S9lxYur/V0p4LS2sqJPOp++S1Mxtk8migdHCozjh75vuqoQD8mp7ixMhrvPRCU7i1TfOpXoUn9+XYFc8hFIFQBB5VMPTsEnuH8/gaVVrbNN/unWr45JHXuZSZqWHp5Gk6264aXd0+3aMq7IrnGB8NMj4aZHDPdQAG91xnfDTIqePNPH3wJlq9h20PanqDdd5IJ0/XsNTEGANRn654hFcoMD4arLZ+a39rFQp8ffRePKqCR1O8WyNCT02M1bC5zHnCIRWhgBBijcckEGIFFYpgY6vClamfa1hhOUdjg0C6IKW8OyYlUrJy1pXUeyWF/GIN8zc1s7To4DoS6a5hueDaLo7t4lRc8nmJvzEAgArQ0bWdTMYg2KLi0QRP7Ftac3Q+e1fDKjqYf7p0dG0HLq901tc/ROKCZZbzjmUVHQAWFit3TIDSso1VcKzktDR7+4dq14z07SC70BbLpEtmcanCiZEGWgIaLQENgAvOeoBq7aO3FIo3KqQmbbPkj8YifTtq2OaebvYfeo+PvyjP/DFXLhdyFp+/X1cFBtflqvDIYcHNnMXCvF0+dU7MxIff4YHu8OqzeeyDF43442p46xZN93gVr6IIXFfiWC5W0cEqOFZq0ja/SYiZA6/ePpur/honj7xBfTFhbOsRur5ewe+TLC9Lrsy7XJySptX0aCw+/Padf41/xuWpWdKpH0n+9BXZdILCcg5/UzOhSJS+gaeI9D7G/V2d/K/xN8TNfMQQd53/AAAAAElFTkSuQmCC);
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtm8JbCPsi3rMiRTSnz2acK4SWrX35wGLMyfmv1p2GmYruBdiD3cR6KHRwjtfW.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhU3GUGVdNUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADYElEQVQ4y7VU32tcRRT+Zu69c7ObjU2U2G2uYXO7bsSaNa1uWrC0VaxCkNZUpRZBKSaCiOKTTyuWiPkLfBCk0qAvEYLGiCYlLmhLCpq1QnfFuj+yu6nXElubH7vZH3PvnfFhSbYhsU964MCZ4fDNd86c7wD/oZHtLlPzBVZI/2ykrvzACqk4VpcXcVfrTgS6I+h++AgPhB61uncH+B3BCtf/Zn/mk8bXnw2bHjEXDe/RjK5OFUaHgkLBQT5vI3HVtuymAyPHXj6T6+jqsQK77uFbwPLWDfZr/Pz+Lz5+bfiVUz6zL9JkUJUwQgiklBCOhMMFaiWHz8Wr1vhULXfyrU/PPPjIkz/dDggAiM1Mmm8+741ZlzqqfD4gnQVTij8a7iyYkmcDspS8T96Y3SkTY63Vwf6m2KXZ7811DAoAv6Wz7MtP3jFff7XFbPdrusooFJWA0IYrKoGqUzCvAt2not2v6ceOqObEaNS8msmxDbB04oLR5b8eDd6vG4pK8dTAEo4ev7X1tyhB/8kVnBhcg+ZRsPchzWjml6PpxAUDAFQASM5NsUMR3aAKYYQC303eDQA4evzWRrx+nplog10VqKzYUDTKekPESM5NNZgtZC7DDKggFCBk87SsM9xgSggIQT2XEuxqp7iW/aXRs3JxCb5mAikAKeWdJ1NKSIl6rpDwMIlyaRkbZXpb2rCyXITerEKK+qsANpW4HgtHQjgCriPg2gKlkoTX1wpgsc6sM7gPmYwNp+bCdQSk2J6dFBKuI2DXBOyKC15xYf0l0Bnc12AW7uvn8diU1dvDTKIQBgCKSvH0c0tbAL8a9aG25qBadMDLLk/MS6vvhX4OjNXBQuHD1vTn/pFM+ubZYEg3hSNxYnAN347tAKH1/ghXwq66ePZ0Cefep6is2kimHKvqjYyEwoetTXKKzUya4x++ePaNl/SD7X5N1zwKFJWCUNIor+KiWnRQWbVxc9GpnTuP2aH3poceO/h4blttjn80NDzwhGr27tEMhVFGKYEQEi4X4BUXvOzyZMqxpuMkd+rtzdrcdmtMjL5reirx6N5uYhj3Unh1iWJR4tqiwJWstHjL/pGB0x/8+9a43X7P5lk6edFI/PgNK6TjKBeX4G1pQyAUQfjAMzzUc8h6INjF8X/aP+0Pm3EGdwAzAAAAAElFTkSuQmCC");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtz2NZT0dLQKHi5SnIg5D18oB4F8avSFbEWz2tLluGz0TFOrsYbQdSInW3MdOc22.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYBCdd4S50AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADXklEQVQ4y7WUUWxTVRjH/+fe21PSZbCOsE5voC2y6WCULGE4RAE3eBFcIEaNiZIQ0ESnJkaXKEswkCyaTIgvEh+IBjVReEFnSEDAzJlF3BDCuiXadL1bt5sFN9uua2/b03vO8eFm3bDDJ/0//XNyzu98+b78P+A/FFnucHR8gt4Zv6n/8kcfHZ4Ywkz6Ltas9CHkb8b2h3ezLYGt5qaAn/0rbHz6L/q7OaJ/1Hs8OItfu/z1iu57UIG3huCuKTAd54hHham7t3e/037SeERvNAMPrGZlsDFzhvaNXt52/MLRE20HaLChSdOpRiiIBCQBsyUKBYFM2majt23zVr80el784v2dG/cOLgBLsAv93wU7zz939oXXVuyo8alul0bw8TO8rAWHPwNSySIm43ah71s58PmrV44+1fykUbpwZ2yMht6sa319oDJ2erZankmvlg+1VckF/dOfjK2SbwxWyN1naGzXsZbWcCxGAUABgBuRn3S3b7Jr3XpNpy6CUwc5oteSy04sei2Jcy8TeDwE/jqim/nfum5E+nUA0ADgx/Al2rBF01UVlCiLM9mwx1vmFz5xuRRQt0J9fq5fD19arCwcv4XatQREISAE6OzV7gEt1YY9XnR8Q6CqgKoAlV6JkfhtlCpLZROgKwikkJDSGUtnr7YsjAsgl+Pg3PGqCsxZTrUKAFRVVGN+ToJzQApZetjTbt8D6mm3IYUEt4FiUYAVBCxLYpXHuwhrXNuEqXEb+bwAK0oI7gA7e7USsKfdxtsXVbCiRCHvQHKWQDoBNK5rWoS1hvax6Igw59Oc5SyBPJOwbQkunIqufuqYPJOwsgLz8xzpORuZrGCzU8Rs27yPlWAtdbtMntC7jahtppI2MmmObFbg9AEbHecVPPaSxCtfEnzyvEAqWUQiYSOV4pg2hBmobO5uqd9pliXgra+ePfv4frKjplZzezwELpcCVQU4d3pkWRLpOQc0+6ddiAy5Bs51/FBKQFk2j3195ERDM4L+OqJTt0IXYKwgkLMEMlnBpg1hTkVcxqlD98nm0q3x4cX3gpPWUFdtQOqV1RKqBuQzEqkEMDNFzPUrH+1+9+AH998aSxU2DDoY+Vm/Ovw9HZ64iVQ2gaqKaoT8W7E39DTbVv+EuTkYZPg/9TfegLennKCGGgAAAABJRU5ErkJggg==");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtz1KbIORpbKHCr4j4DvBEGEjxF8aPiNPez2lz21DjHz1RWGXKt4fvliocCkhcbaT.gif"],
    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/unsure.gif"] {
        content: url("data:image/gif;base64,R0lGODlhEwATAMYIAEM0EP/mIv7kIeHn7f3iIf/9+nRjOPLRG/////ncH8bFwPrdH7i1qWpXKOvFF/bYHfjbHuCzEfreH8XFv/DNGue/FfTUHIh7WmZSIdnd4LWxpOK3EtSpEF9KFtre4eO4E9SfC2FHCO/MGevGF7Sworu5rol9XHlpQdnd4bm3q5OJbHhnPt+xEffZHmRMCZSJbWJJCNjc32NJCPfYHebHGq2MEMWnFdqpDu3JGH1dCH9hC66DCuC/GPDOGqh6B3VlOreRD8KkFdqqDsSPCIJnDbuYEbGIDNelDH9cB7mKCal7CNSgC7yOCu3IGOzHGHtYB7GJDJ50CKJ5CuO5E9elDcGhFMSSCndmPLKUEohsDejAFdWhC86sFdGyFuS6FIZoC926FseXC6t8B+K2ErqUD39eCfHPGv7lIv///////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFZAB/ACwAAAAAEwATAAAHwoB/goOEhYaHiIhEWF0iXDU6iX8uQQ8QCRAPBw5AMocuNAsEAAACpBYOHDCGNhKmBQUAsAAHFVCFWTOjBQgIsr0ATRFlhFUJr6SyyRQfO4Q8C2fKpLGkZl5hhBTHAcneCcxbhGAtBAHn6AEELTgRVoRFB67pAQISB1pCSoRfIxaiAgISWGBhRIQlSAqRcXDAEiZNDsZQEWNIBocKTkT0IFUhwpEhIQ7BMMJiw5QNLG6A8BEyUQ4pTEAkifJEks2bNgMBACH5BAXIAH8ALAYABQAHAAQAAAcQgAAICIKEg4aDAIKKi42CgQAh+QQFZAB/ACwGAAUABwAEAAAHEYB/BQWChIR/goiEAIkAi42BACH5BAUFAH8ALAQABAALAAYAAAclgH+CAgJ/BAuCiQGLiwISioyMBDOCkYwCCX8AmpWbgp6WAYV/gQAh+QQBAQB/ACwEAAQACwAGAAAHJoB/ggAAf4SCiAAFBYqMiQUICIqRhYaMhJeFZ38Fg52CZoOEo5WBADs=");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMttxcz1QGLxJ63b0fQZz2Dl4mTlFQ6EAA92aYLTiZfsU5z21PMkgI2xu0QfcYIwy7.gif"],
    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/cool.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYIOSBjwHgAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADYUlEQVQ4y7WU72ubVRTHv8+P3LRZ69pKt9jHkj5rE91sdNN2E8GN4YQVN60M5lCU4SqKP/CVryKWivEfEBGU4aZvZIw5K1J1LehkA002dYls5keTdD6OumnaJsuP+9znHl+EpA2tvtIDh8M53PPhnMM9B/gPRVkrmJjNsVzygpG49C3LJaJYWpjHLR0b4QsMIXD3Lu7z32cFNvn4v8Jy1/5kv2fjxucfT5itMhIKbnEZfb06jB4NuZxANmsjdsW27JYd4f1Pj2d6+gYt32238lWwrHWd/RL9avup95+beOZQmzk81GKousIURQERQQqC4BLVouCRaMU6OVXNHHzlo/HN9z70w0ogAGDmzKT58gHPjHW+p8JnfSTmTJK/LauYM4mnfVSM307Xz22k2CcdlSMjLTPnz31j1hkqAFxOptmnR18zX3i23ez2utw6U6HpChR1WTVdge5WwTwa3G06ur0u9/5dunn6WMi8ksowANABIBk7a/R5r4X6BzoMTVfx8Gi+qerpyS7sefSvptiJd1uw9S6X8fPli6Fk7OwYgIwOAPHIFNvQ5TL2PbXEmiCRPPYMdzZAdR8ADr5UAQC2737NiEemWKPNudRF7N3NMHViPaY/62rA6onTk11NPgCc+sCD42/reCAIXE3/uDyzUiGPtnUKSAJEtKrFlbYuJAGShFZGKBUX0JiZp70TiwsFuNfpILk6cSVYCgIvCZQWbTi2RLFI8LR1AJivVdbbvw2plA1RdeAICZK0JowkwRESdlXCLjvgZQfWHxK9/duW2wwOj/DoT9yqFh3Oyw4El5CCQJJAVIPUPy0vOXj8yE1UCgK85PDYLFmDwyO8AfMHd1q5G95wKlmxyot27WHZgV2RENWa5WUHlYLAY4eL+PBNFeUlG/GEsCqeobA/uNNqzGxzYIDPnJnMHH/nicyLT6Kn2yvdrlYNmq5CURWQJBx4vgQAODqu4Gae48a8qH59QcmMvRHO3Dlg8jV38+R7YxOju3Xzni0uQ2MqU1UFUhIcXquOlxweTwjry6iSOfRq826ueTVOH3vdbC1HQ1sDimFsUOFxEwoFwtV5iUtpsnj79vDo4bf++WqslF/TWZaMf2fEvv+C5ZJRlAp5eNo74fMPIbjjEe4ffNC6o7+P4/+UvwFcaL4Nhjo8+AAAAABJRU5ErkJggg==");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtsuWn2ip4J6ZLOrC43BWSCxGFQ6kwIraxoT9EserOgtLx3FPCn5x6LHgSHSZN.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYLFE6Rz84AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADgklEQVQ4y7WUX0xbVRzHv+fcP4VSDKA4xpWUOyhuE9ymZTy5xemD1aAkS5QXzdQtUeOfB7OnmhBUEp/00cSomTMxe0BdZgw6xShmJJNumrXGrS20ZV4nbq6Flntvzz33HB8aywzIk36T83LyzSe//8B/KLLRZ3qhoBcy54z0he/0QjqBldISbmrZgnBfFH137mfhyN1W37Yw2xRWuPKn/ls+ZXz24bjZKObiAzs1o7tLhdGpoFDgyOc9JC96ltcwNDH8+Fius7vfCm+9ma2D5a2r+s+JL/d+8s6R8SdGQ+ZgtMGgKtEJIZBSQnAJzgSqFc7mEq41OVXNPfrC8bEdd933w41AAMD0V6fM5w8Gp63ZTpcthCVfNKX4de3xRVOy+bCspG6TV89skckTLe7TsYbp2TPfmn8zKAD8kpnXP33vqPnMU81me4cWUHUKRSUglIBxIH9ZQFEJ1ACFHlQQCKlo79ACw/tV8+SxuHkxm9PrsExyxujuuBLv6Q0YikpB6FopOQdePLqCswkPhBIoKoUWoNAaFey+QzOa2Pl4Jjlj1GGpuSl9KBowqEJ0Qtd313El4q+WcWLSBaEAVSkUlULRqL4rQozU3JQOACoALGbPw3xQBaEAIbWo7n/4+jrou8dtpLMcLz/bUPNSgq3tFKe/+XGtZna5iFATgRSAlHLTwZyZZXj/o2rNKyQadQm7UlqDBZtbsVzyIXwJKTaf8uEHAnjyMR0+F/A9gUpFIhhqQT3Nrp49yGan0XaLCkUjIJTi61NtAIBVW+KR0SJUFXjucBCxAxrcMofn+GCOD+sPga6ePQAu1SIbGIyxxE/MqlZ8xhwfnAkILiGFhJRAWyvFG2PNiB3QwGwf1VUOt8zBbJ8lF6TVPxhj9TQjA/uswrWOiWzGtZxlr2Z0fHiugCIF3nqtCdu3EbhlDmfZg1Py4Kx4SKW55QajE5GBfVYdtqOvlx088mbug4+rud8Xq1W7yGCXGJxlD94qR0jzYZcY7CLD6nWG1SLDtSVePX2O5EYOTeS295psw92cfPvw+Mi9qrlrp2YoOtUpJRBCwmcCzPHBbJ+l0tz6IkFyoy/9czc3vBonj71iNjqJ+O4+Yhi3UgQDEuWyxOUlgQvz0mLNeydGDr3+71fjRl2az+uZ1PdG8uzneiGTgF0uItjcinAkioGhh1ik/x7r9p5uhv9TfwGrUrr30JznwQAAAABJRU5ErkJggg==");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtrz2ilnImYCsxfUwKubqWSCxmVo2ahPd9sFum1kqZz2MnwptTq1imgjNKZh5UcU.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYMODMINeoAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADEElEQVQ4y9WUXWxTZRjHfz09e7utIQvrFgZnc3bIgqN2oG7L4GCyhRhYlCxIvOQC0QuNURNDQsQsmviR4C0XGK6M8ZNIAoEYWMVRx7SwCWxjimErjiNQ9tX2lPa8PR9edM4QoyFe6f/qTd7n+SXv/3n/D/xX5fvjkJxOiRuXh7Xhrz4W14eHCIZqeWTbDrnuye3GuujDcvzSFXEldkKb+OakKGQWCLfptD79rFzR3GI0rgrJJVhyOiXGTx1rP/Pmnrd2r0F7aBnMFeC0gXF1Vcc7+u6XjW8Pvq+tz469odehlXlwMQVHb2I8c/CLvubNWxIPrKyWPoDv+8+Ej+zqOnygU9lEdSiA50HRBtuWQ0nTODSB3LsB0RKu0QBBvoA7bzI1g/XBNQZfOP7Dnkc3dkypAGNfHxW9jWiEagJUlpfebbvgOKIzEgzn3dusqQYqKxbN8aFYktqgDGyqQhs/fVwAKABX4/2sDwF+P/gUUFQoUyEgoLyc7iYY+G3RFL8f/Aoofvw+WF0Bv8T7WYJl79wiWKaC44Drgc8DRSk1qn6oa2JtCEjPlGpsB4o2tgPLlFL/EqxqZT2ptA1382DJRah7z9i1IKAGSve5PHa+SMGCWQuW1z/4JyyytVcO3MRgISsxTchb4NgloOuC4+BbXge+MsiYuOkcmRzkCsjhHEZka69cgkV7dhrn1Ia+IYOEM5uVpLNwtwBSlqCyCIUipLPY8znmM5AxkYPzJMzoE31ru7YZ93za8wPfic9e3dXeak6+t7OR9ooqIagsB1UF2wYzT8EskjZh1kQemyXhtm3Z99T+A4nWtg3yL3EY/XFMHHrtRf31OuLjnVhOD563XfGcHrxsF57RgXWqmcmXaoh98u7b+s8T18Q/5mvq19si9uUR/bkQsViEybnNWKmNeMnHsT5vIv78CtEdP3EyfN2YEfcV2OlbC+L82cHwK5GG7k9XE/8pQuZwA/G9HS36yLmE+Fdb4GJiROzrjOgf1vPR/q42fXRkVNzX1vg7Xb5wSczdSNZWN4TvRB+LSv6X+h29EFCnNpqllAAAAABJRU5ErkJggg==");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtqygWfkMTCsRP6c2VPol4mTFVo24R1RlfVmaZxrWvvvkHYy7VVEfhOilL6uvE.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYPCD78VoUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADXUlEQVQ4y7WUTUwUZxjHfzuz87JsQAXlYxkWQSjiJhZRGGJqaEJoTZOGNnqSnurFY9MeTBMOQEOzF2Nj0kuTtjZpmmqbhoRQSQwH1BQaxdII2V0ICC6OotT9YHeBnWF2eljDSrFpD+1zez7eX57nef954D80x98lQjNzIjQ+rE5e/16sLM1S4q2n6c0zRsPxt/SGg3XGv4ZNTkyIwUsfaRXpm32nWlGLCxX0xyYDd9AjRW09nR9cvN3U3Gz8Y6tT96bE+U7fibsfc8u+si9t/1Bm21f22fY3hbb9OenrZ7l1vtN3YurelPjrW+lFZ+7+khi53K+94Q34jx71aLjcgrx8cLnBXQCFu0R7I9oxd8A/crlfm7u/JF4KW3oSE8Gxa5o5c9Xf0VamoQiBw8ml4XU6+lf59lcbXPnIBfmi8xja6uRVf3Dsmrb0JCZ2wKLLYXXo4rm+D99BQ1EEsgQO+H1hE4DphxYoCrjcuApk8V4r2uCFc33R5bC6AzZ9Y0B0NKI6iz0C2bn1N75KJwD7S2SQnSAEuFx4SxEtVajTNwa2dxYIhMTIVz3q6dd4Dsqt8tVq5wtQKQtU8hAuifaDiJEve9RAcEZsweZ+G1Vf99HtKCxVkaRtgmncrwDwikfOxiUJFCfkCcqKUA+X0z1/d1TdggV/+Vm01qMiyQLHdumV75FoqVNQi+XnynSAJIMkI8sIXzlqaHw419mj2UnqPUAmA7a9Q3v+rsKcY9vZukyGjA2VBaDPTuZ2Zm2aWAZgpsE0YNMEywLL4rOhJB2fRPju5lo2bhrZOiONkc5OvmmmczDvoRZCD4BEAlIJWE/CRgo21tgjLGpLHXjcZjaeSkAiQSqeYS0FD6PgbWjOwZpOdhk/TaBHnlppI5KEaBTiUUjEeL8xwRfvJmmviEE0ihFJEv/DIhaF2Crp0UX0ppNdBoAT4MCRNn3lVG/PhR97+9rrqDlciaoolpAdVnYOGywbLBMMAzbWMaaX0cfCLDR29fYcONKmb7sa84uPRDhwW70z9HXN/Phgd00RqssJeU4odkMkBRsmrG/Cgzh67fHOT1vePrtQ5dP02uoK46UnKPw4IlafLatPF4MivqKzFn9Gej1JXn4B7t172V2iUlp9yNi1t1yv8hQb/F/2J9bIT/JL91joAAAAAElFTkSuQmCC");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtppoSFHMz0SUz23z29AhBz2on1cbUn4hpbXcz1xAD47JVPfHABRpV3fPjX9dT8p924.gif"] {
        content: url("data:image/png;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/happy.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYdJQPXeiMAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADZUlEQVQ4y62U228bRRTGv5ldj+MkrVpXUNR12qpRg5NQjINY11yCKO4FSmtExQOIt6riD6BQ8hTlyaIX3lEFD0iV4AWJgKuiWIiLhKV1LwlNsFuSQHC3pWpxfEl8md3Z4WEdu1VLI6GOdKTR2aPfzpz5zgc85EXul1wsL7Hrf+W0X41zbPp8CjfyVwAAjwX6MDi0C6Gdr3Bty4C5fm03XxV4zcyz77/5RDcmPh57LuLVBoMeBDapcITEwoKF7BULv1zg5s59743uOvCuEdB6+H8Cc7kp9umJI/p27WrizUPduq+TMkrdEseREJaEVRdYKtj8q7NVI18aGDn8/mkjGAzxe4Bzczl28sN9+lvx5YQe8ekqo4wqBCDNEinhCAmbO+BVgVrJ4plM3Uim/SNHPzpn9PYGOQBQt2cVdvbLU/re4XIiEunUPV6FKSoFoQSkySSUQFEpPF4F3k4VHWtUNhRiejR4K5H84oReKJVZC5ifn9ZmJ8+MvfxSl64wwqhCEIsXEDtYuKu/sXgBe95YhMIIPB0KPJ0Kiw559N8zZ8by85e1FvBS+ls2HO3QPN42LDXuR2rc34LGDrZzew8VQVUClVF4fZSF+6g2mU62T5id/BGDQQ8ode+XGve3TrWyvzM38bUflBJQhYAqFNsCBNmpn9AC/nNzAevX0f8t5rVdLqMFBABHSDiOBKRcnSDdWke4IUX7EwWADRu34PZtAcd2C/Agpmz+3HYlZHOBYtnBhkc3t4H9oWHM/MZh1QUEfwC0CRPcFbhVdWPedPB46IU28Knofp6+yM3los0bVRtWQyAWL0A6ErLZBelICNuB3XDQqNqoV9yoLQk+NQczHH2tLeyebTvM3vDboz/8XDNqJYvXKzbGP1+D3a8vYne8ALsuwGsCjWWBWsVCrWShWrRQK1s8MyOMvsg7o5t7nzTvGb3jH+zR488XE6EdTGc+haleCqqQ1qOtjF29YqNetnhu1ja+u/zIyLFTqdbo3W0O2Ul2+vhhPdCdTbz6ItN9XZQpqiuElevymkC1bPOJjGPctAZGjhz7zOgfCPNV7SudPDn2TD/Vtm4i2OgnkELixi0Hf5gOLs4S89kDR1e3rzsN1vxzRruUTrLpCyn8nb/qGmxPH554OoZwdD/Xtg7e12Af+voXfa6/7fI0GfoAAAAASUVORK5CYII=");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/tongue.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYgN5qGQ9UAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADi0lEQVQ4y62UX2xTVRzHv/f07pSOsXZddIbbbmOLs9vE2om31D8zgYogwsyMEo1vZPHJmCiKfVp4agT0wegDEn3RBHiAKNgBWTH+CTS5E7bBZjtk6qwXJMNubbfb9dw/x4drOgxzSwy/5Pdwzvnlk+/55ff7Anc5hKUuZwpz9PrvGemycoaO/ZjEjewEAOA+Xxs6uzYhuHEbk5o61LraGrYi8A81S785dUhWBj/Y93jYKXUGquBbK8IyOaamdKQndFy4yNSNW9/q37TjNcUn+dl/AjOZUfrpgT75fulq/MUXamRXNaGE2CWWxWHqHPqCibmcwU4MaEo23xHb/fZhJRAIsjuAk5MZevDdrfLLPfNxOeySRUoocQiA8E8J57BMDoNZYJqJUl5nQ0MLSiLlje1574zS2hpgACDaPSvSLz56U36muxAPh9fIopPQLb0zFeXJk15EexbPA0fc4BanXUEq52am44mjB2K5fEHxumttpZdHUuveeKn6XHHMXzammvnmDR7Or7csnWoL37zBw7W0n09faOA/n/CUX39+1bnR4fPrAIAAwHDqa9odWSVVOQVKHAKSJ73LzsXgl3UgogCREjhdhIbaiDSSStAKMD3yHToDVSDktp4tO2wCCBFAHAKIg6DFJyA9+j0qwL9uTqHOQ/73MNeuthkVIABYJodlcTzdk0N0Z255AufYtiuP3j4NlsnBzcUnEQDqG5pw69YE3PUcZ4974BDJitBTn6/B/AxDcbqM2YKF+nsbAWRtYHuwG+M/XUFjUxUcIoEgcCS/8gICEN2ZQzKyqwKKpo5h4IgbC3M6dM2Erpn4RbXwQPBJAOftLz8c2c5Sl5g6P2uwsmZAL5swDQvc4jbl40OLCaCsGVgo2lmaM9noJNRQ5DlW6aG/Zb3aGnql/9sfSkopr7OFooHyvAlWMnH6mBvRLo+trsuD459Uo5TXoc3qKBV0NjRuKm3hV/sbWx9S71i9/e9skXuemI0H11OZuhxUdBIQh13S26fh6IdOMM201RV0lrlmKGev3BPb+36ysnr/Nof0CD28f7fsq0nHn32Kyq7VhDpEexBMw4JRtsBKJrSCwQaHLOWm3hHr2/uZ0t4RYivaVypxcN+j7URqXiugwSuAmxw3pi38qlq4dE1QH9uxZ2X7ut1g1d/GpeFUgo5dTOLP7FXbYP1tePCRKEKR7Uxq7lzSYO96/A3mlrZCAqdcCgAAAABJRU5ErkJggg==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/laugh.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhYjAX4RhY8AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADT0lEQVQ4y62UXWxURRTH/zO7O9tdKvZDW8PdbUsb67YV10W9y6LWBIWildCk0YDxjRCeDA+i2JjQ8LSRDx98E9RneJAYdQmmhfgR2ORW6BZad4tULestkha63Zbd7tw7d3y4cKGhtMYwySQnZ8785pyTM3/gIS+ymHM6P8cmrmaUi9opNvxrP65lRwEATwSa0bZ2A8LrXudKfateubKcLwv8W8+yM999rmp9n+5/MepV2kIeBFa5YQmJ8XED6VED585zfd3m93s3bNmlBZQgfyAwkxliXx7cqT6pXI6/1V2u+vyUUWqHWJaEMCSMeYG5myY/cbKgZWdae3Z8cFQLhcL8PuDYWIYd+mizun3rrbga9aluRhl1EYDcDpESlpAwuQVeECjOGHxgYF5LJKt69nxySmtqCnEAoHbPZtnJ44fVjvZ8PBr1qx6vi3V057CxaxrkNpNQgo7uHDq35+H1u1H2iJutDTM1FpqMJ44dVG/O5JlT6sVUcvXut/2nZ4eDJXO8Qb76fIWUE41STjQ6tuPTbbuQDsrJc7Xy9xMVpfe6yk4PDZ5d7WQ4mPyetcfKFI+XMOoi6P+2ynnsju34CND3TSWom8DNKLw+yiLNVEklE8wBplM/oS3kAaX39GzJYSOglIC6CKiLojFAkB76GQ7wxvVxVFbQ/z3MK1fYDAcIAJaQsCwJSLk8QdqxlrC3FHeP3ABQXVuPqalRPFptB3R0Tf+nzI595oXJBXJ5C9U1dQCyNrAl3I6R3y6hrt4Dl9tOeipnLAl7rMIDoyBgFAT+0C08FX4ZwFm75GdjnTx5geu3ciYvFUznwlIwAJifNVGcE3xoDHok9ubdwQ42rtGbIu/0/vhLUSvOGPzrI/4FF1OiBilRs8D3xT6CYt7gAyNCa46+21vX9Ix+39c78OEmdetLuXh4DVOZz8W27S4tmuGRj4H5vMEzV0zth0uP9+w93O98vYXikE6xowd2qIHydPyNV5jqW0HZnZ4K04JZssCLAoW8yfsGLO260dqzc+9XWktrhC8rX8nEof0vtFClYRVBbRWBFBLXJi38qVu4cIXo67fsWV6+7hVY/a8RZTCZYMPn+/FP9rItsMFmPP3ca4jEOrnS0LaowD709S9eGISKwyTECQAAAABJRU5ErkJggg==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/rolleyes.gif"] {
        content: url("data:image/gif;base64,R0lGODlhFAAUAKUnAKaafLmNDMinFe7MGeW8FfjbHtuuENvXy6h9CW1TCf7lInZjNYxpCXtoPKqNEqaEDvHPGs6aCmVQHWJMF86dC/zhIKughJaIZfn49vbXHeHd0tnUx96xEOS6FGpNCNOxFuvGF9WhC+K3EtmnDZtxB0M0EP/mIv////rdH/7kIenCFuXi2e3r5fj39GlUH515DKicf3lnOvLRG31rQJpvB9/b0d3ZzvPUHb+RC+fEGNi3F+/RHJJyDLCTEunHGf///yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFCgA/ACwAAAAAFAAUAAAGvMCfcEgsGo/I5C/h+AwGgodH+XvtCihUIQMh8JKCQqmkUKTGMlXg2BOfTiVT6V3qvoqJ2/wN58NBBglEDm5jfYYlAyJ3QzooCmNjcpEoEB04RD6PkyadYwqVHRREOQUpnaioKQWKEUQfGRUKqZ0KFRkgHGtDDxBis6i2YgQjJEQJKr4lKWUpFWIqHBFTRA/JGZGR0SHGRgEEIAMQEAMgBAYhCEkMBiIEBCIcIxEMVB4vOCEhATTUVP8AkQQBACH5BAUFAD8ALAYABwAIAAEAAAYHwFNpeBKWggAh+QQFBQA/ACwGAAUACAAEAAAGEsBS6UcUFofH3+lEVC6ZxOUvCAAh+QQFyAA/ACwGAAYACAABAAAGB8BS6TQUnoIAIfkEBQoAPwAsBAAEAAsABgAABiXA36+SEg4LxorCZPqZFBWkkkl9VjKpajVVKP1KXiH4K2Qazb8gACH5BAEBAD8ALAQABAALAAYAAAYfwN+vVBIOi8LS6VRUMofLpVOqJDKZVYVxK0QlkUdhEAA7");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/sveta.gif"] {
        content: url("data:image/gif;base64,R0lGODlhFAAWAMZzAPnbH/jbHv/lIvHPGvzhIO3q5OnCFv7lIqWYenNgMt/b0QAAAPrdH/n49tvXy/3iIebj2vLRG/bXHfj39GJMF/7kIdWhC+W8FOvGF3xqPtnUx//ylGVQHe/MGfDOGvreH5eJZuK3EqmegdjTxtKyFs6bC6uNEc6ZCevKGu/NGvXWHZluB5pvB66REsaoFu/RHHFYC82qFKWCDax8B555C+S6FGhSHZmLaZRzDGlUHaebfqSYea2PEmhSHKaFD2tOB5aIZdGbCntpPd6vELiQDs6cC/j49XdkNqWZe2tRCe3MG92vELeQDuS9FmFLF6aafOXi2Zt/EKmHD9rVye3KGWtPCMCSC9ezFpx1Ctm5GPTVHW5UCnhlOJFuCtyvENmnDb2MCXpoO//yk29UCefAFt+yEd6wEGpVH4tlB2hMCOa8FOS6E9WiDL2QC9SfC6mdgP/zlEM0EP/mIv///wAA//8AAP///////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQJDAB/ACwAAAAAFAAWAAAH44B/goOEhYaHiIl/WyYkKVQxPkmKf1EvAQwMASoeTTiJLgFxowejcREGRIctAA8CcHBycBsPAAMXNIUwWgQCc6Nyo3MEEhheVYQ8ABVwv3HBcXNiAR0hWIRZHwfNc3Ny3XMbDANrVoRK2rKw6nAH4zVFhCjLcvX29RXUISWEVxK99+oJIIbBDBhCUga0EiCnjkMBtQao+cKC0BgyEQAQcMgxAKohQX4UkmHAA8cFHA2UsbDiEJMLDunIdLjEwoxEXerQqYNy5wk0lHZy1JmG0h86KB0uoGP0KFNBMps6lflUqtFAACH5BAEMAH8ALAAAAAAUABYAAAfcgH+Cg4SFhoeIiX9bJiQpVDE+SYp/US8BDAwBKh5NOIkuAXGjB6NxEQZEhy0ADwJwcHJwGw8AAxc0hTBaBAJzo3KjcwQSGF5VhDwAFXC/ccFxc2IBHSFYhFkfB81zc3LdcxsMA2tWhErasrDqcAfjNUWEKMty9XX39RXUISWEVxK95NwbKIAYBjNgCEkZ0GrggoG21HxhQWgMmQgA7tHZeA/VkCA/Cskw4KEOnToPTxooY2HFISYXTg40ucTCjERd6Dy8t4DOCTSUNrZh42ZjGkqCNipFyrSp06aBAAA7");
    }
    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/devil.gif"] {
        content: url("data:image/png;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/blink.gif"] {
        content: url("data:image/gif;base64,R0lGODlhFAAUAMYCAP/mIkM0EP////jbHvzhIPHPGvrdH/7kIf/lIv7lIvnbH6KYfGVQHf3iIeTl493d2O/y9O/MGenCFu7x8vDOGvLRG+vGF/bXHZKFY+K3EnhnPF9JFOW8FNjY0aOZfnVjNvXWHWJNGdHPxeW7FKGWeua8FOS6FNTSydWhC3dmOp52Cu/y82pQCdLQx5txB+S8FnppP6SDD6aCDdi3F96vENTTytinDWZQHOnHGcKkFXtqQPPUHd6wEJJyDKWbgZpvB5+VeGlUIG9UCaiGD9mnDdmsEL6QC7uKCdXUzJOGZduuENCbCtfWz3hmO2hLCGdTHqeehK19B9OwFW1QCHNhM62PEqJ8C7CTEs2aC86dC+fEGM2qFOa/Fm9WCrSNDraPDs6ZCYlkB6eKEd+yEWxOB8CSC96xEKGXe+vFF72MCWlNCJtwB49tCtDOxGlVIO/RHNKyFpp+EOK3E+7MGuzJGd2vEGxTCnJfMdWiDNSfC9jX0P///////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFyAB/ACwAAAAAFAAUAAAH0YB/goOEhYaHiIl/dmJwc3RbMSyKf3FvAwYGAyAULz2JOQMEBwkJBwQDFRJeh1cKDQGxAAAIDQoFJVaFXTsEAQLAAQCxARcWSlOEVQO/wMHOAREZKoQzBs3PzQEFJmWEONfOz8HcWYRaAwfYwsQDEXJYhFIXBAjEs7QExmZphEMFrxDgo2ULFxEXhIRwqSCKlCkCClTRWEKmkAwJFEBguhaAgoQxKNYc+sIBTYQCBSJY4FAHRZREbIpkGDEiAw8bYMJQUqPCCJ48R344oUS0qKJAACH5BAUKAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAVkAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BACH5BAUBAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAUBAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BACH5BAUBAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAFkAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BADs=");
    }
    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/dry.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhY1K7ky+Y4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADXElEQVQ4y62Uz28bRRTHvzu7HsdJGtFUUNR12qoRwUkoxkGsa34EUVwolNZIFYciDkhVxR9AoeQU5WTRH9xRBQekqnDhEHAVVAvxQ8LSmrYJTYhbkkBwl7ZqMbGdeO3ZnRkO69hEMc2lT3qXN28+M/PmvS9wn01pFfyntEz/+jOn/2JO0Omf07iZvwYAeDjYh8GhvQjveYXpOwaszV2dbEPgDStPv/3qY8O8+NHYM1G/PhjyIbhNg+ASi4sOZq85+OkSs/bsf3d078F3zKDew/4XmMtN0U9OHTMe0a8n3zjcaQTaCSXESxFCgjsSTpVjueCyLy9UzHxxYOToe2fNUCjM1gHn53P09Af7jSOJlaQRDRgaJZSoCqDUU6SE4BIuE2AVDrvosGy2aqYy3SPHP5wwe3tDDACIV7MyvfDFGePl4VIyGm03fH6VqhqBQhQodaZCFKgagc+vwt+uoW2TRofC1IiF7iRTn58yCsUSbQDzC9P63OS5sRdf6DBUqtRv1voLiapApQp8bSp87SqNDfmM37LnxvILV3UA0ADgSuZrOhxr031+DxZPFNZw0uPdiB9aG0ud74JGCfwBQiN9RJ/MpGgDODv5Pd5+3QdCmjVLj3evu+BqTErArXIQVQFRCXYFFUxM/YDGk/++vYjND5B1G1vBWllXh8doAAFAcAkhpHf8Ria9XME9l7y5RABgy9YduHuXQ7heAu7FlPXDXa+FXMaxVBLY8tD2JrA/PIyZXxmcKgdn94DWYZx5De5UPF+wBB4NP9cEPhE7wDKXmbWy5LJaxYVT44gnCogfKkDWqyCFBHcF3JpAreKiWvbcXuZsah5WJPZas7F7du22eiNvjn73o23aRYdVyy7GP9uE1Pku7EsUsC9RALM5aiscdtmBXXRQWXJglxyWneFmX/St0e29j1vrRu/k+y8ZiWeXkuHd1KABlWp+AqIqjU9bHbtq2UW15LDcnGt+c/XBkRNn0o3RWysOs5P07MmjRrBzNvnq89QIdBCqal4jrD6X2RyVkssuZoV52xkYOXbiU7N/IMI2lK9M6vTYU/1E37lNwdZuBZJL3Lwj8LslcHlOsZ4+eHxj+fqvwFp/zOhXMik6fSmNW/nrnsD29OGxJ+OIxA4wfedgS4G97/YvT6u17pjPirAAAAAASUVORK5CYII=");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/mellow.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhY7CmvYxF4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADTElEQVQ4y62U328UVRTHv/fO7N1uWwmUKITZAqGxbltx3RJmWX/UiFUQxJoYHzS+EeIfIIp9avq0kV/vhugbib74oC7B0Bh/JG4yK9BKyy7YVssyIgGX7m67s3tn7r0+zHYXUty+cJLzMDNnPvfMme/5Ao84yMNu3istsb9v5IzfrfNs+rcJ3MpfAwBsDvdiYHAvonte58a2fnvDuk6+JvCmnWc/fPuZaV04Pf58PGgMRAIIb9EhhcLCgovsNRe/XuT2nv0fju099IEVNrr5/wJzuSn2+Ykj5pPG9eQ7b3eaoXbKKPVLpFQQroJbFVgqePzrcxUrX+wfPfzRGSsSifJVwLm5HDv5yX7z3ZHlpBkPmTqjjGoEIPUSpSCFgscleEXAKbo8k6laqXTX6NFPz1s9PREOANSfWZmd++qUuW+olIzH281AUGOaTkEoAakzCSXQdIpAUEOwXUfbYzobjDIzEbmTTH15wiwUS6wBzM9PG7OTZ8dfebnD1BipdwYMv1l4YL7DIwVQjUBjBIE2DYF2jSUGA+YfmbPj+fkrRgN4Of0dG0q0GYFgE9ZKF1QjoDqBziiCIcpivdSYTKeaHWYnf8JAJABK75tZS7ERUEp8sEaxI0yQnfoZDeC/txewYT1d9d7EN10tr1diXYfPaAABQAoFKRWg1NodKr9WCj+VaD6iALBx0zbcvSsgPb8ArZiqfrjnS8jjAosliY1PbG0C+6JDmLnK4VYFBG8BrcME9wXuVvyctyWeir7YBD6bOMjTl7i9vOjxWsWDWxMQnoSSCqo+BSUVhCfh1SRqFQ/Vsp/OkuBTc7BjiTeawu7esdPuib039uMvjuUUXV4te6gtC3BH4NWRgp9v3UNtWcApu3CKLiqLLpySyzMzwuqNvz+2tecZe9XqHf/4NXPkhcVkdCczWUhjepCCaqTx01bWrlr2UC25PDfrWd9feXz02KmJxuo9aA7ZSXbm+GEz3JlNHniJmaEOyjTdF8LK53JHoFLy+IWMtG67/aNHjn1h9fXH+Jr2lU6dHN/dR43tWwg2dREooXDrjsSftsSlWWI/d+jo2vZ1v8Haf80Yl9MpNn1xAv/kr/sG292Lp3cNI5Y4yI3tAw812Ece/wGPdK9+lwfE+QAAAABJRU5ErkJggg==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/huh.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhcBAzZvyLQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADnElEQVQ4y61UXWwUVRT+5u52Sku7/QtUmd2y3cbaH7WuwkIVMUJDqCuJQdFqeCPEkGhMwMZsYtLw1EQFX/DBNPrEq31QakxYDLSBTWYt7ZLW3QKrrNuhNtDudv9m987ce32YskBa7QsnOck3k3O++e65Zz7gCYe03stUJiff/Tum3FB/lWd+D2IhOQcAeMrZju6X9qFndz9VtndpDY4auiHhvJaUf/v5O5968ezpV3dVKt0dFXBus4MzgUTCQHTOwLVJqu0+eGpo36GPVKfiov9JGItF5O+/Ou57Rrk5fOSdGl9VNZEJsUo4F2CGgFFkyC2bdPSXgppc6QocGxxROzp61ihFPB6TTxxx7xk/v2WieKulZCbcgs+3Cq55rJxvFft31Iv9O+pFJqKIxfGtpQtnHBMn3nXvicdj8mMKU5msfP7cSZ+r9sfh/oO1PnslkQ8cTpU/Fvyp0QIC4EzgwOEURkeqkV+iNHhZV9NVA4GjH3+jNtY5LKU3pkOtn75XfSk74yqZCbcQmkeIux4hsuesfBRrHmEm3KIQdYl715rFrdH60idvb7oUmbraCgB2AJgKXZD39m5SKiolmdgkS/fTcfTtbCgr7HvjCwuHUyCaB8QuwS4TVFYR2dtOlOnQmAwABACi01fQ3VEBQiRAkoDak/+/a45TIEQCsUkgNgKPU0I0Mo6ywqXFBBrqyZrGYHh1jgttD/E64dhscZQJAWvYnAtACCB7dm1X7tsyFJkz4FxYPUxAsIdldgBoat6O+/fnUNdkFdgkaS3pg+fVm+amgEk5TMqQznA0bW0BkLRm2NmzF7N/UBhFBkYtUoh1zrZKxqi14EbByj81jmd7XkP5Ul7s9dPQdarl0yYtFUwYJQZmcgguIFanILgAMznMEkepYKKYtVLPMRqJQ/P2vkXLhC7P81qb98OhyxO6qq8YtJg1UcozUJ3BLFpJdYZSnkHPGtBXDBTSBvSMQcOzTG3fdXSope0FrUzYWOeg/oFB9UqkITA5WVTzy5QWUhT6igE9Y6D//RX4P8igkKbIL1PkligKKUpjt001fGdLwD8wWP5LHjeH6LQ88uUxn7MmOvzm67KvajORbXZrnR4cl+oMhYxJL4a5umh0BY5//oPa2eWlG9pXaOzr0zs7ieLeJqG5UYJgAgv3OP7SOK7flrRXDn22sX09arDanVllKjQmz0wG8U/ypmWwrnY893IfvL1+qri71zXYJx7/Ajv0CYOXajUdAAAAAElFTkSuQmCC");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/ohmy.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhcCDxT011wAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADbklEQVQ4y62US2wbVRSG/3vHvmmayHVc2qKM88AVIQ8gOAS3hlBEkwU0FBZQqULsogh1DRGKhBRlAZV4LegKVbBAdEnFo0FALURjgaUJebhNsNvEoak7KRGtYzuJ7bkzcy+LIQ4kbcOiRzqLuXPmu/+cc/QD9zjI7Q6X86ts8VpSvah9z6Z/i+BG+jIA4H5/E9o6DqP94PNcbWjVazzVfFvgdT3Nfvr2k5B2/qPhpw5UqG3NbvhrXRC2xMKCicRlE7+Oc/3gc28MHT76uuZX6/gdgclknH36fn/oQfXKyWMvV4cqd1JGqVMihIRtSpglG6sZi5/9rqClc62DfQOntebm9i1KkUol2YljjV2jX+yJlmbrje5Or+zu9EqhB5y8/oBcP8vHVbk0utc496EneuKVxq5UKsk29WyFnXq3v+urU76oMdtgdHd6pdQDUi5uSj0g7WsOODdZKxcj9xmfv10V/fidvq5MLs8AgAJAen5anZs6M9z9bFVIYYRFvvYBBOh5MfOfi3teyoAqBD986YV7hwL3ToWFO9yh2bEzw+n5S2oZOBk7xw6Fd6juCsKoQu4w+42uU4WAughcjKKikrJgE1WnYiMbChNTF9DW7AalBCDkfywbAaXEASsUAT9BIj6KMvDW0gJqvHTLd5FvfHd9Xg9PlcMoAwFA2BJCSEDK7RVKp1bYTkp74xUFgN37GnDzpg1hOQW4G1P+c7klYXEBi9vI5gV2760HALgAoKX9EGZ+v4T6BjcUFwUhEuvD2TzpH8/WwObOgpsFJ+d1gYfanwbwi6PwsXAvj01wfS1rcaNgwTRs2JaAFFulWoaAUbBQWnGyuGrzeAp6MPwCL/9yXeARfX/w1aGfo0WtmDN5acWCsWaDF53mRCayiExkAQDFFRPFnIlC1kQxb/KxGVtrOvDaUP3+R/Uy0LfLw3uPD2gX4jWD4+MlbS3DeWGZo5gznYXu8KKnwwsAWMtwrN7iKCxznpyztLGrewZ7jw9ovl0evtUcElPs9Ht9IX914uSRZ1iosooyxeUsgm0JWIYAL9oo5C1+fkxoS2brYP9bn2ktrUG+rX3FRj4YfqKFqo21BPt8BNKWuPGXwB+6wMQc0Z88+ub29vVvg9WvzqiTsRE2PR7Bn+krjsHWNeHhx3sQDPdytbHttgZ7z+NvAWnFFylMs8AAAAAASUVORK5CYII=");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/sleep.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhcENh2r+NIAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADbElEQVQ4y62U32scVRTHv3Nn9m5+mZqtWuls2tLQuEnUdSPOdhUj1kCraxshCFF8EErxD7BB9ynkadHWvktR8KGgL4LVLYEEsQouzJo2qYnZ1iQ2rmMtbTfZTXZn987ce32YzcaQ2Lz0wJcLZ758Zs6dwxd4wKVs11wurtG//8zq18wxOvPLBG7lrgMAHg92oqf3CMKHX2X6/m6rrbWF7Qj8y8rR77/91DDHz42+EPXrPSEfgns1CC6xtORg7rqDnyeZdfjY+yNHjr9nBvV29r/AbHaafnbmlHFIv5F8c7DFaGwilBDPIoQEdyScCsda3mVfXyqbuUJ34uTweTMUCrMtwIWFLD374THjrYFS0og2GhollKgKoNQsUkJwCZcJsDKHXXBYJlMxU+lA4vRHY2ZHR4gBAPHubJVe+uoT42hfMRmNNhk+v0pVjUAhCpQaUyEKVI3A51fhb9LQ8JBGe8PUiIXuJFNfnjHyhSKtA3OLM/r81IXRV15uNlSq1L5s+19IVAUqVeBrUOFrUmms12f8nrkwmlv8Va8Dr6a/o32xBt3n92D9A/k6o/9EftMJBTg6uAKiKdAogb+R0Egn0afSKQoAGgDMTV3Gu2/4QIg338TFQB0wcTFQP9d7498E4FY4iKqAqAQHgwrGpn9EHXjv9hLaHiabplsHbdeTcnO/tdlj1EcGAMElhJBb3duV9LyCe5J84xEBgN179uPuXQ7hegbcjylrL3e9FXIZx0pRYPdj+zaAXeE+zP7G4FQ4OLsPtAbjzFtwp+xp0RJ4IvziBvCZWJylrzCrtOKyatmFU+XgroAUErJ2C1JIcFfArQpUyy4qq57sNc6mF2BFYq9vLHb7waesjsjbIz/8ZJt2wWGVVRfVEgezOdyKJ2ZzVEsc8cEl2AUH5RUHdtFhmVludkbfGdnX8bRVBwZ2tbL40LB5ebotMTlZMUt5xsrLDHbBgV2sqeBgYCiHL849grV7DOVlxrLzrpm5+WgiPjRsBna1sq3hMDdFz3980gi2zCVfe4kajc2Eqpq3COvjMpujXHTZeEaYt53uxKkPPje7uiNsx/hKp86OPtdF9AN7FewJKJBc4tYdgT8sgSvzivX88dM7x9d/A9a6OatfTafozOQE/snd8AK2vRNPPtuPSCzO9AM92wbsA69/AQ/J0JM0iOUnAAAAAElFTkSuQmCC");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/wub.gif"] {
        content: url("data:image/gif;base64,R0lGODlhFgAdAOeAAPd/g/mChfuHifBudv2Mjf2LjP8zM/iAg/6NjUMQIKJ6hd3U2u/w9eTf5e5qc+hcaWUdLfyJipJibu7v8+JNXXg7SV8UJdjO1GIZKetibaF4g3c5R50dMvd+gtHCyeRSYfFxeHU1RKN8h+RUYvV4ftTGzeVVY91DVuRSYvV5fsApQI8cMOhocd1CVdg4TqwXMLYxRNjN09MtRaQxQdddZ9UwSNNTX74pQJsTK5IjNM0nQaYsPsFQW+phbNtDVmkhMWkhMHs/TXo+TL0hOqIkOHg6SGkMH28TJO50eWoQItTHzu/w9NhBVONYZaczQ7shOdg3TaeCjJsVLOtoceJNXpoULM4uRXIxP/BtdWYcLOthbcwrQ+9tdaY7SG0NINUvR6V/imcfLtfM0mwKHu1sdOVaZ5NkcKw/TM1PW7BDT28XJ9AoQokQJt5EV9XJz9FaY593grMxQ6F5hHMzQWwVJd9GWOZlbtLEy9DByJk0QdQuR2gKHfJ3fEM0EP6Oju9KSv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFMgD/ACwAAAAAFgAdAAAI/gD/CRxIsKDBgwgTEvzzj6HCggz/SJSIMOLBiRUnOoSY0MBEAw8tDvQIUqDFjQ0pEiy5UOVAlAphcnxIkyadLm/ITEEzI0nNPEg6BAjQgQSXJjke8gAgoE8fAk4BgHgQJ2GaAxH6AAKkleuBASaIHFTDp2lXp1v7pMjgw4vBMwAKoOV6FoADChwM0ggAdStXv30CDPigwiALvn6cKnZKQPAHKwbtxPVDuTLlAnapbDFoI4UABJYpI2iaoc0Qg04GYAVdGUGEA31MuJBi8EgZEEwLECBQQADsByfWjDm44wEWEgCGAnD6oM4XHAlhjOjhYMAAB1pGtNDz4uEKJhRQF6CgcAKKDjY1jXC4UUPGkyp7asqfjzAgACH5BAVeAf8ALAcADQAJAAYAAAghAP/9S5BgYEGBBxMOBISQoUGHCSAm6NNnIMWBBglq/BcQACH5BAUyAP8ALAcADQAJAAYAAAgeAP/969NnYEGBBxMaRJiQIEOGgAANjDjQIMGL/wICACH5BAUFAP8ALAYADQALAAYAAAgsAP8JLEDgXwEBAhMi8MPQD4IIChs2RIDwn0SJBf710dinj5+OGzdavOhHYEAAIfkEAQEA/wAsBgANAAsABgAACCgA/wns0+cfQYEI+wACpJBhwoYEFxY0CBHiPwL/FjLU+C/AQIIgJwYEADs=");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/angry.gif"] {
        content: url("data:image/gif;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/sad.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhcNNsxpQ5sAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADQ0lEQVQ4y62UXUxURxTH//feZaDQEkCkyoXdEj+2qWBTXLYRF5OGVYwf0SC+aUzTpBHTl/pm2oTw0BjTxNCkwehDTWNM+lCoUcGPXDRxu6jLKvJhIhBYhF4sVF0Xlr17P2bGh0XsgogknGSSmfPwm//MOecPLHMIb0vq8RgZCT2SH9xpJT3BNoyN9AEA8u1OlLgqUbp5p2Ev2qCmpqUbiwKfT/xDrjU3uu8pDfUVm1Nl57oUFMo2MMoxPGyib8CEP2io5VXf1+2oPhpYkVdgLAgMDXSRX3/62v2pY+hETfWH7ppvomTuhU1n0xENW8bF1lgg9Hz98e9+OBcoWvf5PKUYG+0ntTWFnvY/8nzxAbte6crir2PufrJL5uO38/RrDZm+owccnrHR/uSL41qUnD75raf5lxyfPuBIgs0Fvj5HOvO5quTqvx3P8J35udYTj08TABAB4Mlgj9zfeaF+uzfDLRGBvE81U9IkkHSJbHWnuLv/Plc/MtgrzwKD/ivE82WqnEJEUrX/JZSO8DthSkcYew5NwUZEkDSRfLFelO+3t7xR2BNsQ/FnBIK0tJ4TJQGiJGBtoYDeB7cwC5x4GkLuimSatywb3rLsRXOAgMx0YOLp8Bsg5wBjHJwuTSGjHIwygP9PNQDkrXbg2bgFajFcb8pKUuEty4ZyKWde7vL5j2AZDJbOEI4wrFxlBwDYAKDEVYnu3kbkF9gg2UTcaM6GKAlJba9cygF4QpWlM8SjJswYhalRDI4yFJd+BcCfUOjassdov2+osYhl6DELls5ALQbOODhPfAlnHNRiMHUKPWYhPjWzotToCkHdVL7LmH3yJ2s3qk7Xwbqbt7WAFjENbcqEPk1haBTb9r5IrH1h6NMU8SkLWsRE7KUJbdI07vbQQPGWw3WONSVq0gerI33kSHWB52pDpk9VcvX//B/PTkSkM5+Hg6t5pSuLq0ouH/wriz/6PUP/88dU35HqwqTRe6s52DMfn9ixlbg/yBCJKIkzFU0UwNAoYpOW0RZkgX/NDfPMYUH78reeqi91inKRLGBVjgBOOcYmGIZUhodDglqx+9ji9jXPYNtbSHeHAnXGYGW7ExvLvCgt37WgwS57vAKqfczPPQ55KAAAAABJRU5ErkJggg==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/wacko.gif"] {
        content: url("data:image/gif;base64,R0lGODlhFAAUAMZ6APrdH/HPGv7kIf7lIvzhIO/y9GVQHe/MGd3d2P/lIqKYfPnbH+Tl4+nCFvXWHe7x8uK3EpKFY/bXHXhnPPDOGv3iIfLRG+vGF+W8FOa8FKOZftjY0dWhC3VjNmJNGXdmOuW7FF9JFNTSydHPxaGWep52CuS6FGZQHJtwB4lkB9+yEe7MGo9tCppvB86ZCaGXe76QC6J8C96xEOzJGbSNDnppP8KkFdjX0O/RHKeKEdXUzN6wEOfEGJJyDNmnDXhmO2lVIOvFF9msENuuENfWz2lNCNOwFZ+VeGxOB9i3F5OGZaSDD2dTHr2MCXNhM/PUHW9WCtCbCntqQGpQCc2qFKeehM2aC62PEtLQx9SfC9KyFmlUIKiGD9WiDGxTCqWbgc6dC92vEG9UCeK3E8CSC6aCDbaPDrCTEtinDea/Fu/y85txB7uKCZp+EN6vEK19B3JfMW1QCNDOxOS8FmhLCOnHGdTTyvjbHv/mIkM0EP///////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFAQB/ACwAAAAAFAAUAAAH1oB/goOEhYaHiIl/XjlaKzNUS1OKf204dwAAdw4Ucz2JNncEAgMDAgR3Fg00h2cLFXmxeLF5CwEZMYVQTwR5er++erESF0NxhFd3AsG/zXl3BxAlhEkAA7HAzgABJmSEddazsrQD2yZghDzKeOzt7ALQY1aERhIECe7sCQTEMk2EXAK8SiALT4IKtjL4WENITBoLd/KQkhhLlZsoSAqVaUDBASYAeTg1UMEBxSEzGIIcCBDgwAUMYTi8ScRCCAQQICDsQOMiBaUiJWB0ycKmBR1KSJMqCgQAIfkEBQEAfwAsBgAGAAcAAwAABw2Af4KCeXqDh3p5h3+BACH5BAUBAH8ALAcABgAFAAMAAAcLgH+CeXqChnp5hoEAIfkEBQEAfwAsCAAGAAMAAwAABweAenmChIOBACH5BAUBAH8ALAgABgADAAMAAAcIgHl5eoSEgoEAIfkEBQEAfwAsBwAGAAUAAwAABwuAeXp/hIWGf3p5gQAh+QQFAQB/ACwGAAYABwADAAAHDIB5en+EhYaHhHp5gQAh+QQBAQB/ACwGAAYABwADAAAHDYB6f4OEeYSDhod/eoEAOw==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/ph34r.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhcSNgEzTQUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADbElEQVQ4y62Ub2gbZRzHvznuHgl1TXuGRrw03RLomk2ttfW0OHyxVbFWq/XNfOELZYyyl6LDBoTSN4u6TcE3UoYiDKkKFteaUbsgvpHAda7+6TT+SdyWXeYKSa9dk9w99+fxRbxbQyN9sx8cPM/3jg/f3+9+fIE7XL5m4trGJiley0o/Kwtk5WIaNwq/AwDuDXdj/8MH0fvYMJW69qntrXfTHYHX1QL5dn5aVi68NzW3FJREUUQgEIDjONA0DeVyGZqmqR+efm3y4HPjSljqpP8LzGZ/Ih+dPCqfTV1LxuNxmRBCOI4DADiOA9u2YVkWarUazefzyiujexJHjp9Renp66TZgLpclpyaelr9b8ScjkYjM8zzx+Xzw+eqfMMbAGINlWTBNE7qu02KxqAwPIPHGOwtKLNZDAYCrz+wWOf/5aXnhoi8ZiURkQRAIx3HgOA4u1L0LggBBEEAIIaFQSP7qeyOZ+uykXF7fIB6wkF+REidmpqLR6DZnDfP5T+d53gWTUCgk/7n06VQh/4sEADwALGe+JsFgUOJ5nsxP/4onX1jzIOk50TsPjZa9c2qmFbV1E08dC5MvMgFpIJMi3suJ8QN7+/v7szTXxQ4NtLGtdWigjbFitKm+vnwfu74YZLFYLDsxfmCv13Lp5lX4/f6G9oYeaW+6uM10QghKN6/CA7pr4TjsdqtLa02BW3XHZvXHcfBXoQpvhveEulD5+xYci+GbL9saXLgzTM+JDfr82V2orFFY1IZhGNgVDgIo1R3Ge59AqVTCM8disCnD4mw70ufEhh8CAOlzIhZn23F+JgBTt2FWbTz/VicqlQrGXhy77fChwRGqaR+ouq7vGR6PEUEQwPM8dlhs1Go1mGaNHh7cUPsGn6XA23WHndEH1BOJw5OFQkHRdZ0ahgHDMGCaJizL8iCurus6dF2HYRi0VCop3Y++PBmJPah6DsVAK83lssrlSxcSi5duJDs6OmSe54nr0nVo27YHppRSTdOUscfvSoy8dFwRA610ezj89iM58+4R+ZO5K8lwOLwtHFy3lFK6urqqvDq6O3H0zY+V+L4+umN8ZVKnpmaVgNTS0gK/3w/GGKrVKiqVCjY3N9Xp91/fOb62Bqx65bK0nEmRlR/S+KfwRz1gO7txf/8Q+gZHqLR7f9OAveP1L1JX1deBqZS5AAAAAElFTkSuQmCC");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/banned.gif"] {
        content: url("data:image/png;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/antifeminism.gif"] {
        content: url("data:image/gif;base64,R0lGODlhRAA3AMYFAGYzAHk9AY9IAqNRAAAAAP///ygbAf8AAP+ZzP8Aivf3997e2qKNZYdtO2lICO3t7c2oI/PLF/LKF+/DFcefIdq2IfrXHPzdHv3fH/zeH/rbHfXTGu7FFv7iIP/lIf/mIv/lIv3iIcugG/XUHOm9FcibGfndH+3HGOGxEPzgIfDOGuO1Er6RHfziIfHQG+S4E9unDdumDfvgIPDOG+O2Eu3JGOGzEtulDf7lIt6uEL2QHfjZHf7kIvbYHuzIGc2iHPTUHOS6FN6tEOjAFeK2E8aXGdyoDsWWGUQtAQBLBty5Iu7FFwBxCf7kIQBhCACDC/jbH/zhIL7D3P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQJHgB/ACwAAAAARAA3AAAH/oB/goOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpuFAAECA5yih56go5MEqaqrrK2uraeDBAW0tba3uLm2BLGCs7q6BroHt7y9vwUHxMAFwrnKxb1/yMkHCAi2BsLbzrXQ0ce02gbKCQm347jlzdq0xrHUCAnrBQoLDA0ODg0MCwrV5hJgq/Xu1KxrAs8pO/AgH4QIESRMoLDvW4GE1woUHHXQHDttyipYuIABQwYNGzgoG9fOHLaNon55/OhAWQcPH3KCCKFMhIN0F89plEatloIGFS6sNPAB5IERJEo0+IcLJqeitBY4sNDhAzRhykCYOIHCwYJcVjdhLcAAwgUP/mAPkCNmIIWKFSwYoCWaq0EEDE2bLdzWwsULGA32hsPl4G9gWgubFT7sQDG8XA4kZMjpdC4IGTNoxKhclS+uBhM0gMipLKdXZTVs3EhcevEtBhQ2hHjt+gOOhTl06K19GZdWDjta6+RhoIcPZWYtG8x19IcyEywNAPERRIgyquCK43qgjMQJFeNqDCEipEjNZeGnPzvgoASKFS9e0LCRw8gRBw9UA587pt0CTUMOsABDDDHcoMM+AXozYFqaYGWRPfjow48/6sBHYSazIMHMiMB8aAkS0yDxyoosstILijCimEgpoUjjCBI4MkKjjY840MiOPCbiwEMRTeTjjJ/U/hikISKRZBJKHPyApCm9JGHlIUpccJNrO+3AgQiIABlLEkwkweQFTfTmWghQlUBKktKQaSYhW3U1TlPaiEXWkYSIeYqchbgF10ft1HUXC4bgKECOY5ZZiGPcpGPAZDAUgsQMM1yaaaNzDgJpLd1MalgMhGiKxKIyjpKEE0w80ekfmnGmDZ4GfBYaqYNcikQApo6CxKpMMCpIaqupmRMPUMR2Q6kzlCLsJro60asgue1mLA5RADFEcJZ6Mi20v7I6rQPIhbDaODxE4RwRRvA5iLOpQpspq0/oOsgPS4yAXQstyADFdt0d8SaVouAIrKsqxCuCeSq44MIM6rFXRJhwKfo6b6tJxCuIffjpx59/MwIgcizhYoxIggs2+OCSiVjpMsswxyxzJoEAACH5BAkKAH8ALAoABQA0ADAAAAf+gH+Cg4SFhoeFAAECA4iOj5CPioyRlYgEmJmam5ydnJaEBAWjpKWmp6ilBKCDoqmpBqkHpqusf64FB7OvBbGourS2t6W6CAilBrHKvqTAwbauyQa6CQmm0qfUvcmjtay4BQgJ2gUKCwwNDg4NDAsKuQfVCcek3qCixvPWugcP6RARIkiYQGGdswL6jBWwZwlftW3JdFWwcAEDhgwaNnDQJY1btWMMK7l6CNGBrg4ePqgEEUKXCAfYEFpbKAwcKQUNKlzgaOBDxAMjSJRo8O5UyEg2Ry1wYKHDB2CxdIEwcQKFgwWojkJKWoABhAseoh6YNstAChUrWDDIWhNVgwj+GHz24qeshYsXMBqwhYbKAVy5o/j1sovXwd5vfSVkUPmTLAgZM2jEMGy07akGEzSAUKlL5VNdNWzc0FuZ7ykGFDaE+Oz5Aw5+OXSsLY341FIOOzqv5GGghw9dVw/fQ4Xzhy4THQ0A8RFEiK6iz2qfeqCLxAkV0moMISKkiMld0Yf/OuCgBIoVL17QsJHDyBEHD+CB72bZFDB/DljAiBHjho518TUzn1aPJHWQOeiow4472YBHoCOiIMHLhK88aAgStyDhyYYcbmILhiBi6MgkjQhjCRIoRkKiiaA4UMmKtiQhoyMOACQQQS6OuEiJrCTBRBKITFTRRRlx8IOOlMT++OMhSlyAkmcs7cCBCIjA2OOShejURGuehRBUCYdYCYqPQBLClFPS+JTMVFXlSIiYlpBZyFdhQcSNWWixcCESAqQ4phNMPFGmIH8tg40BhMFQCBIzzMCooycmAaifhMbFzKWExUDIo3xSCgmjSDjB6SCKMZaMmgY8Fpmmg4AawKiRoCgpE7BmthmXKvEARWg3bDrDJJ4+AiqgT4AqSGqr4YpDFEAMEduiisD6KRKzCqqCiA7gFsJm0vAQhW9EGOHmIMCKGKujxCZh7h8/LDECci20IAMUyzV3RJg7skJtuoaIYJ0KLrgwg3bcFVFlvj3KOKMh5qGnHnvujQjAxCwNPpLffv39V/HGHIMSCAAh+QQFCgB/ACwKAAUANAAwAAAH/oB/goOEhYaHhQABAgOIjo+Qj4qMkZWIBJiZmpucnZyWhAQFo6SlpqeopQSgg6KpqQapB6arrH+uBQezrwWxqLq0treluggIpQaxyr6kwMG2rskGugkJptKn1L3Jo7WsuAUICdoFCgsMDQ4ODQwLCrkH1QnHpN6gosbz1roHD+kQESJImEBhnbMC+owVsGcJX7VtyXRVsHABA4YMGjZw0CWNW7VjDCu5egjRga4OHj6oBBFClwgH2BBaWygMHCkFDSpc4GjgQ8QDI0iUaPDuVMhINkctcGChwwdgsXSBMHEChYMFqI5CSlqAAYQLHqIemDbLQAoVK1gwyFoTVYMI/hh89uKnrIWLFzAasIWGygFcuaP49bKL18Heb30lZFD5kywIGTNoxDBstO2pBhM0gFCpS+VTXTVs3NBbme8pBhQ2hPjs+QMOfjl0rC2N+NRSDjs6r+RhoIcPXVcP30OF84cuEx0NAPERRIiuos9qn3qgi8QJFdJqDCEipIjJXdGH/zrgoASKFS9e0LCRw8gRBw/gge9m2RQwfw5YwIgR44aOdfE1M59WjyR1kDnoqMOOO9mAR6AjoiDBy4SvPGgIErcg4cmGHG5iC4YgYujIJI0IYwkSKEZCoomgOFDJiiw64gBAAhHk4oiLlBijIRNVdFFGHPyAIyW2JGHkIUpc/oCSZyztwIEIiMDIShJMJMHjBU205lkIQZVwiJSgUGklIUw5peVKVFllCJiWiFnIVymdqdJZaV2IhAApTlllIX915JM0hMFQCBIzzECooXqOOchfcqoUKCGH3plnm04w8YSifyjW6AePRRYDpIYGEOmJSVQ66R+ZbSYnD1CEdgOok5z6CKFIODGqIKmtdiYOUQAxRGyDKnIrJCiWysStDuAWwmbS8BCFb0QYcSMhsYoYCRIq1GoprYP8sMQIyLXQggxQLNfcEV/mCEqxlV6K6CAiWKeCCy7MoB13RUSp7omGtpuEtYOYh5567Lk3IgAIs4KEsZcikt9+/f23oyNGBlY88Y6BAAAh+QQJFAB/ACwKAAUANAAwAAAHYIB/goOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7yFBr9/vwasBgXCv8asBYLDf8urxQXG0snQwMK92drb3N3cgQAh+QQJFAB/ACwKAAUANAAwAAAH/oB/goOEhYaHhQABAgOIjo+Qj4qMkZWIBJiZmpucnZyWhAQFo6SlpqeopQSgg6KpqQapB6arrH+uBQezrwWxqLq0treluggIpQaxyr6kwMG2rskGugkJptKn1L3Jo7WsuAUICdoFCgsMDQ4ODQwLCrkH1QnHpN6gosbz1roHD+kQESJImEBhnbMC+owVsGcJX7VtyXRVsHABA4YMGjZw0CWNW7VjDCu5egjRga4OHj6oBBFClwgH2BBaWygMHCkFDSpc4GjgQ8QDI0iUaPDuVMhINkctcGChwwdgsXSBMHEChYMFqI5CSlqAAYQLHqIemDbLQAoVK1gwyFoTVYMI/hh89uKnrIWLFzAasIWGygFcuaP49bKL18Heb30lZFD5kywIGTNoxDBstO2pBhM0gFCpS+VTXTVs3NBbme8pBhQ2hPjs+QMOfjl0rC2N+NRSDjs6r+RhoIcPXVcP30OF84cuEx0NAPERRIiuos9qn3qgi8QJFdJqDCEipIjJXdGH/zrgoASKFS9e0LCRw8gRBw/gge9m2RQwfw5YwIgR44aOdfE1M59WjyR1kDnoqMOOO9mAR6AjriDBy4SpPHgJAUh4ouGGmrCCBBJ/gPihJIs0IowlH4IIySQmnliJA5Ww6OIjDgAkEEEwOiLjjIdMVNFFGXHwg44lCpPEkYco/nEBSp6xtAMHIiCyIytJMJGEITo10ZpnIQRVwiFTglLllYQw5dSWK1FllSFhWjJmIV+lJI1PyXxwVlqGfCjAiFRaWchfy2BjAGEwFILEDDMcmmifZA4CKETcDHpXDIQoisSeKrrpBBNPNPqHYoD1QooBkElWaaIBWIpiEpvyKUhmm80pDQ9QhHbDqZO4CsmhSDihqiCprYYmDlEAMURshiry665IsMrErw7gFsJmu0XhGxFG5EhIrpnumuimT/A6yA9LjGBCCtJAsVxzR4BZJIrNgpvEooOIYJ0BLrgwg3bcFSHlu5XwKm+3gpiHnnrsuacjAAx76GyniOS3X3//CfHoyJEYW8xjIAAh+QQJCgB/ACwKAAUANAAwAAAH/oB/goOEhYaHhQABAgOIjo+Qj4qMkZWIBJiZmpucnZyWhAQFo6SlpqeopQSgg6KpqQapB6arrH+uBQezrwWxqLq0treluggIpQaxyr6kwMG2rskGugkJptKn1L3Jo7WsuAUICdoFCgsMDQ4ODQwLCrkH1QnHpN6gosbz1roHD+kQESJImEBhnbMC+owVsGcJX7VtyXRVsHABA4YMGjZw0CWNW7VjDCu5egjRga4OHj6oBBFClwgH2BBaWygMHCkFDSpc4GjgQ8QDI0iUaPDuVMhINkctcGChwwdgsXSBMHEChYMFqI5CSlqAAYQLHqIemDbLQAoVK1gwyFoTVYMI/hh89uKnrIWLFzAasIWGygFcuaP49bKL18Heb30lZFD5kywIGTNoxDBstO2pBhM0gFCpS+VTXTVs3NBbme8pBhQ2hPjs+QMOfjl0rC2N+NRSDjs6r+RhoIcPXVcP30OF84cuEx0NAPERRIiuos9qn3qgi8QJFdJqDCEipIjJXdGH/zrgoASKFS9e0LCRw8gRBw/gge9m2RQwfw5YwIgR44aOdfE1M59WjyR1kDnoqMOOO9mAR6AjoiDBy4SvPGgIErcg4cmGHG5iC4YgYujIJI0IYwkSKEZCoomgOFDJiiw64gBAAhHk4oiLlBijIRNVdFFGHPyAIyW2JGHkIUpc/oCSZyztwIEIiMDIShJMJMHjBU205lkIQZVwiJSgUGklIUw5JY1PyUxV1Y2EgGmJmIV8FRZE3JiFFgsXIiFAilNWWchfy2BjAGEwFILEDDMcmmifYw4CKCnMDHpXDIQoqiefbzrBxBON/qEYY8mgacBjkVE6yKFIBGDpiUloiukfmW2mpUo8QBHaDZXOMMmrj6DqxKqCpLbarDhEAcQQsRmqCLCQoNgqE8A6gFsIm0nDQxS+EWEEm4PsKmIkvm6K6iA/LDECci20IAMUyzV3xJc5guKsppwuOogI1qngggszaMddEVHGe2Ki9Cbx7SDmoacee+6NCMDDrCDxLKeIDuS3X3//7eiIkRxrvGMgACH5BAkKAH8ALAoABQA0ADAAAAf+gH+Cg4SFhoeFAAECA4iOj5CPioyRlYgEmJmam5ydnJaEBAWjpKWmp6ilBKCDoqmpBqkHpqusf64FB7OvBbGourS2t6W6CAilBrHKvqTAwbauyQa6CQmm0qfUvcmjtay4BQgJ2gUKCwwNDg4NDAsKuQfVCcek3qCixvPWugcP6RARIkiYQGGdswL6jBWwZwlftW3JdFWwcAEDhgwaNnDQJY1btWMMK7l6CNGBrg4ePqgEEUKXCAfYEFpbKAwcKQUNKlzgaOBDxAMjSJRo8O5UyEg2Ry1wYKHDB2CxdIEwcQKFgwWojkJKWoABhAseoh6YNstAChUrWDDIWhNVgwj+GHz24qeshYsXMBqwhYbKAVy5o/j1sovXwd5vfSVkUPmTLAgZM2jEMGy07akGEzSAUKlL5VNdNWzc0FuZ7ykGFDaE+Oz5Aw5+OXSsLY341FIOOzqv5GGghw9dVw/fQ4Xzhy4THQ0A8RFEiK6iz2qfeqCLxAkV0moMISKkiMld0Yf/OuCgBIoVL17QsJHDyBEHD+CB72bZFDB/DljAiBHjho518TUzn1aPJHWQOeiow4472YBHoCOuIMHLhKk8eAkBSHii4YaasIIEEn+A+KEkizQijCUfggjJJCaeWIkDlbDo4iMOACQQQTA6IuOMh0xU0UUZcfCDjiUKk8SRhyj+cQFKnrG0AwciILIjK0kwkYQhOjXRmmchBFXCIVOCUuWVhDDl1JYrUWWVIWFaMmYhX6UkjU/JfHBWWoZ8KMCIVFpZyF/LYGMAYTAUgsQMMxyaaJ9kDgIoRNwMelcMhCiKxJ4quukEE080+odigPVCigGQSVZpogFYimISm/IpSGabzSkND1CEdsOpk7gKyaFIOKGqIKmthiYOUQAxRGyGKvLrrkiwysSvDuAWwma7ReEbEUbkSEiume6a6KZP8DrID0uMYEIK0kCxXHNHgFkkis2Cm8Sig4hgnQEuuDCDdtwVIeW7lfAqb7eCmIeeeuy5pyMADHvobKeI5Ldff/8J8ejIkRhbzGMgACH5BAkKAH8ALAoABQA0ADAAAAf+gH+Cg4SFhoeFAAECA4iOj5CPioyRlYgEmJmam5ydnJaEBAWjpKWmp6ilBKCDoqmpBqkHpqusf64FB7OvBbGourS2t6W6CAilBrHKvqTAwbauyQa6CQmm0qfUvcmjtay4BQgJ2gUKCwwNDg4NDAsKuQfVCcek3qCixvPWugcP6RARIkiYQGGdswL6jBWwZwlftW3JdFWwcAEDhgwaNnDQJY1btWMMK7l6CNGBrg4ePqgEEUKXCAfYEFpbKAwcKQUNKlzgaOBDxAMjSJRo8O5UyEg2Ry1wYKHDB2CxdIEwcQKFgwWojkJKWoABhAseoh6YNstAChUrWDDIWhNVgwj+GHz24qeshYsXMBqwhYbKAVy5o/j1sovXwd5vfSVkUPmTLAgZM2jEMGy07akGEzSAUKlL5VNdNWzc0FuZ7ykGFDaE+Oz5Aw5+OXSsLY341FIOOzqv5GGghw9dVw/fQ4Xzhy4THQ0A8RFEiK6iz2qfeqCLxAkV0moMISKkiMld0Yf/OuCgBIoVL17QsJHDyBEHD+CB72bZFDB/DljAiBHjho518TUzn1aPJHWQOeiow4472YBHoCOiIMHLhK88aAgStyDhyYYcbmILhiBi6MgkjQhjCRIoRkKiiaA4UMmKLDriAEACEeTiiIuUGKMhE1V0UUYc/IAjJbYkYeQhSlz+gJJnLO3AgQiIwMhKEkwkweMFTbTmWQhBlXCIlKBQaSUhTDkljU/JTFXVjYSAaYmYhXwVFkTcmIUWCxciIUCKU1ZZyF/LYGMAYTAUgsQMMxyaaJ9jDgIoKcwMelcMhCiqJ59vOsHEE43+oRhjyaBpwGORUTrIoUgEYOmJSWiK6R+ZbaalSjxAEdoNlc4wyauPoOrEqoKkttqsOEQBxBCxGaoIsJCg2CoTwDqAWwibScNDFL4RYQSbg+wqYiS+borqID8sMQJyLbQgAxTLNXfElzmC4qymnC46iAjWqeCCCzNox10RUcZ7YqL0JvHtIOahpx577o0IwMOsIPEsp4gO5Ldff//t6IiRHGu8YyAAIfkECQoAfwAsCQAFADUAMAAAB/6Af4KDhIWGh4YAAQIDiI6PkJCKjJGVjgSYmZqbnJ2cloUEBaOkpaanqKUEoISiqakGqQemq6yCrgUHs68Fsai6tLa3pboICKUGscq+pMDBwq7JBroJCabSp9S9yaO1trgFCAnaBQoLDA0ODg0MCwq5B9UJx6TerKLG89a6Bw/pEBEiSJhAYZ2zAvqMFbAHCl+1bcl0VbBwAQOGDBo2cNAljVu1YwwtuXoI0YGuDh4+qAQRQpcIB9gQWlso7A84UgoaVLjA0cCHiAdGkCjR4N2pkJVujlrgwEKHD8Bi6QJh4gQKBwtQIY2ktAADCBc8SD0wbZaBFCpWsGCgtWbXBv4RMPzsxU9ZCxcvYDRoCw2Vg7hzR/HrdTevA77f/ErIoBJoWRAyZtCIcfioW1QNJmgAoVKXSqi6ati4sddy31MMKGwIAfrzBxz8cuhgazrxKaYcdnheycNADx+6sCK+hyrnD10mOhoA4iOIEF1Gn9k+9UAXiRMqpNUYQkRIEZO7pBP/dcBBCRQrXrygYSOHkSMOHsAL3+1ytln+HLCAESPGDR3ryNcMfVtBotRB5qCjDjvu3FePfbxE+EqBjiCBiYWeZKhhJsIg8YeHSIToyCSN1HRIEoaE6KEki5RoIiFJMIFiIQ5UQuKLMMo4iAMACURQjSO2iKMgMc74x0QVXf6UEQc/BEmJiUlEqaMgSlyA0mcs7cCBCIjc2GESTjAx5ZEXNOHaZyEIVcIhXrKCxAxIiDllUx1I81MyH1BlFZCEtGnJm3EygcQTM4K1DDY+oaVWikgIIOKfcIoJ6CBxHcqNT4XBUMibcM4ApyVJBMrEE5P+USkpzGCKVwyEcNroo5GAKSehnq642J0+2elBZJO1CmcAroIqJq2fCqIZZ2eqxAMUot3g6ySwVpIEoSoSohpryeIQBRBDyLapIsGCYiSNuYWgHA9R/EaEEXwOAu2KQwrywxIjmJBCCy3IAAVzzh3BppDxEiLCdTO44MIM23VXRJcABzzIeemt1957IxACYLHDNO7X33/tYuzxkIEAACH5BAUKAH8ALAcAAwA5ADIAAAf+gH+Cg4SFhoeIggABAgOJj5CRkIuNkpaQBJmam5ydnp2XiAQFpKWmp6ippgShh6OqqgaqB6esrYWvBQe0sAWyqbu1t7imuwgIpgayy7+lwcLDg6/KBrsJCafUqNa+yqS20X+5BQgJ3AUKCwwNDg4NDAsKugfXCcil4NGjx/bYuwcP2EGIEEHCBArunhXod6xAvmH7rnVTtquChQsYMGTQsIHDLmreriF7eOuVxIkOdnXw8KEliBC7RDjQthCbw3CCxpVS0KDChY8GPlA8MIJEiQbyUJFspZPUAgcWOnwIJmsXCBMnUDhYkGppqKYFGEC44KHqgWq0DKRQsYIFg67+OMWlahABg1Bf/5a1cPECRgO4OME6qHuX1D9fe/s6ABxOsIQMLYeiBSFjBo0Yi5XGBdtgggYQLXe1nLqrho0bfzUHTsWAwoYQpEd/wPEvh463qhunesphh2iXPAz08LFrK2N9qXj+2GUCpAEgPoII2ZUUmu5UD3aROKGCWo0hRIQUScnLOnJgBxyUQLHixQsaNnIYOeLgwbzy3zajLxDQAQsYMcRwgw7u2OcMfl5d0pRC6azTzjvxbFNegpaA1cuFq2z2yYYcghKXJZQ48qEgSRyChCAnShLiiH8kwUSJhZwoIxIpJrLihy7CaAiNNU7CiIg45fiIA5fcOEwSSL7+eIgDAxV0EJE+VnILEkk4wYSShliEkUYccfBDlEBegsQMSFyJJSFKXLDSaC/twIEIjxhpyZhlMoHEEzoK4lMTso0WQlElJEKjADSKSeaVdBYCVQfUCKXMB1dlBWWMM5BZaY+PJFEnE08kOshYzGgT1Fpt7XgpoZgmUqWZeF5KSF2hehNUYjCYikQAY5JpiYucJqGCrq9i0MywHyQWg6mUFHpJEnjyaMhjjgbVqAeVXWbiIrmmmukjnoHWZ0s8QGHaDYgkq204rsH2LQ5RADGEbeX+yOIgDvQWgnM8RDEcEUZMWoicLP6wxAgmpNBCCzJAAZ10R9gIwMPzEiLCdjMduODCDN+FV0TEt6zX3nvxzcfxMP4BKCCBI6c8byAAIfkEBQ8AfwAsAgAOACYAIwAAB6+Af4JShIWGh4iJhoKMUgWPkJGSk5KMjY2RB5qUnJWWg3+OmQUHnaYFjAeMBYSjpKedgqqrrZClr4+at7mbpL2zf7OsornFuLi3pbvKssK1xsm2x8rSqtaCw7a6m8vT3pqy2M+7yL/SvsmpoMSw7Z+hmI+K8/SFn6JS7/r7/Pes/QADNsonsCA/ggYTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjxMNiAS5UaQBgIEAACH5BAkPAH8ALAIAAwA+ADIAAAdWgH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyL4fy8mwKS0tzdLTuoEAIfkECQ8AfwAsAgADAD4AMgAAB/6Af4KDhIWGh4iHAAECA4mPkJGSg4uNk5eTBJqbnJ2en56YkQQFpaanqKmqpwSikKSrqwarB6itromwBQe1sQWzqry2uLmnvAgIpwazzMCmwsPEh7DLBrwJCajVqde/y6W30oW6BQgJ3QUKCwwNDg4NDAsKuwfYCcmm4eKDpMj32bwOPGgHIUIECRMovINW4B+yAvr2/emHzdsyXhUsXMCAIYOGDRx4VfuGLVk4KShTqlzJsqXKag54dfDwoSaIELxEONjWMBtEQVJ8CRUqRUGDChdEGvhw8cAIEiUazEvVKugzhkOHSnFgocMHYbN4gTBxAoWDBaoIWH22K6uvXv6lpFzwEPaAtVoGUqhYwYJB2rVtA7vlhkoKBqa/AjJr4eIFjAZ/jZWCG9AYtMqC4RpGPBksY8cOIrMNTHmy6dK9GErJULPpXQ8yZtCIEZoq4NSmT7NF3VazBhA1edX8yquGjRuQbV8NWIu37tO4424IQXz4BxwBc+jwqzx3bsyl6UUPvJXDDuE2eRjo4YPXWdGD4xco2uAHLxMjDQDxEUQIr6nDrOXSgASmVMoDvJBwggrV1DAEEUIUERNcrAAVlzjkWOZACSis8MILNNiQgxFHOPCAeNH8EZQUGAZTy0AOsABDDDHcoMM7J15V4SAotYgKQ+qw4w488nADV0QsSv6ToXy+RLQPKFBG+YlEuFTiCJWTICGIlpJYiWWWf2iJxJiQePmlIUkYMiaXkZh55iBJMJFmIQ5c4uabcc75hwMFHZRQnWUyciWecg6S0UYdfcTBD4Fa8mUSkBYqiBIXzDTcTTtwIMIjd4qDRBJOMCHpH0g1Yd1wITxVQiJjCkDmPkjMgISoknLVQTVMLfPBWGUBWkisss4gq6eyiorEE3NCcEEz2yylF19qCouEq2ziEuusTFw7SAQYMPvNUp/BEC0SAQBbrShJYMvEE9r+wa0z8H4QbrSVvIoLqLQiK60gErCGK64gxDbbIUgsYq40ca6bhArDCjLBb6cOxwMUxmLdgEi957qSBLJrEkLBdK3pel0UQAyh3cWCUqknneaFkB8PUbBHhBG+FtLpm3/8wMEI+C0jAxT79XdEIgAUDQDOhoig4AwuuDCDgxAWgTQxHHoIoogkTi1NjDPWeKPWYGMZCAAh+QQJDwB/ACwCAAUAPAAwAAAH/oB/goOEhYaHiIUAAQIDiY+QkZJ/i42Tl5EEmpucnZ6fnpiPBAWlpqeoqaqnBKKJpKurBqsHqK2uh7AFB7WxBbOqvLa4uae8CAinBrPMwKbCw8SFsMsGvAkJqNWp17/LpbfSg7oFCAndBQoLDA0ODg0MCwq7B9gJyabhUvv8/f7/APvxetAOQoQIEiZQeAetwL17yW5J8UWRohReFSxcwIAhg4YNHHhV+4Yt4p+JzxpWrHjxQAcPH2KCCMFLhINtDrMVIIDy2a6VvnqVarnswzJeI0iUaDAvFU9jpYQCRSW1gJQPwmbxAmHiBAoHC1Q99fkzqkpevdBGJWtV6wFr/rUMpFCxggUDsT3LpiW7V2ittEKlMEPLrIWLFzAa4IWq16ffsj//QhacMq5hxA4Wm0Uree3jz3uHGoULF4SMGTRiZHbaUyrg0HqhPbYKIiavmFh51bBxQzHrqcBNSdkQIjfuDzjQ5tBx1+lJ4QGjS9/ngMOO2zJ5GOjhgxdYsYJQSiFGzpSCBj94mRhpAIiPIEJ4NY32fDyu8qYe8CJxQkW1GkMQIUQRDqiUDyH7kEfLAQ6UgMIKL7xAgw05GHGEAw/QU1U44SnITS0EOcACDDHEcIMO72SYEiviEIJfQ+qw4w488nx4YIuC4BdcLBxKg4QmP4Ii5JCb4PgHEkce/okEkohU4oiRiCRhyJJMPuIklIckwYSUhTggyZVYEqIll384YBBCCnmZCJhh/jHmIBlt1NFHHPywJiNPQpnEnlsOosQFL+E20w4ciNAknlAikYQTTPQpSAUXNHEcbiEkVcIhbIqDxAxINOqoAxZ0UM1oBnzAlVdqEpIpMZt2ygQST3AJwQXNbFPqXDSwMCUSAiypKaeNtjpIBBjU+k2pl8FQyKaczsCpNEm4ysQTwv5BrDPYfpAsIczy6isxi3oaq7NMSpABqeiahloM3HIaQLfQNjrus4JMoEFtk8bEAxS73dBuJd9CGyuVhFBAXL7IRQHEEMstuwi84pDZpXUhSrDHQxTcEWFEqoMAXGWbgvzAwQgmpNBCCzJA4R58R2CKKMiFiMCfCi64MAOAAhZxqCUwF+IghBJSaOGaABTdsyEikmgiikc3LU4gACH5BAkUAH8ALAkABQA1ADAAAAf+gH+Cg4SFhoeGAAECA4iOj5CQioyRlY4EmJmam5ydnJaFBAWjpKWmp6ilBKCEoqmpBqkHpqusgq4FB7OvBbGourS2t6W6CAilBrHKvqTAwcKuyQa6CQmm0qfUvcmjtba4BQgJ2gUKCwwNDg4NDAsKuQfVCcek3qyixvPWugcP6RARIkiYQGGdswL6jBWwBwpftW3JdFWwcAEDhgwaNnDQJY1btWMMLbl6CNGBrg4ePqgEEUKXCAfYEFpbKOwPOFIKGlS4wNHAh4gHRpAo0eDdqZCVbo5a4MBChw/AYukCYeIECgcLUCGNpLQAAwgXPEg9MG2WgRQqVrBgoLVm1wb+ETD87MVPWQsXL2A0aAsNlYO4c0fx63U3rwO+3/xKyKASaFkQMmbQiHH4qFtUDSZoAKFSl0qoumrYuLHXct9TDChsCAH68wcc/HLoYGs68SmmHHZ4XsnDQA8furAivocq5w9dJjoaAOIjiBBdRp/ZPvVAF4kTKqTVGEJESBGTu6QT/3XAQQkUK168oGEjh5EjDh7AC9/tcrZZ/hywgBEjxg0d68jXDH1bQaLUQeagow477txXj328RPhKgY4ggYmFnmSoYSbCIPGHh0iE6MgkjdR0SBKGhOihJIuUaCIhSTCBYiEOVELiizDKOIgDAAlEUI0jtoijIDHO+MdEFV3+lBEHPwRJiYlJRKmjIEpcgNJnLO3AgQiI3NhhEk4wMeWRFzTh2mchCFXCIV6ygsQMSIg5ZVMdSPNTMh9QZRWQhLRpyZtxMoHEEzOCtQw2PqGlVopICCDin3CKCeggcR3KjU+FwVDIm3DOAKclSQTKxBOT/lEpKcxgilcMhHDa6KORgCknoZ6uuNidPtnpQWSTtQpnAK6CKiatnwqiGWdnqsQDFKLd4OsksFaSBKEqEqIaa8niEAUQQ8i2qSLBgmIkjbmFoBwPUfxGhBF8DgLtikMK8sMSI5iQQgstyAAFc84dwaaQ8RIiwnUzuODCDNt1V0SXAAc8yHnprdfeeyMQAmCxwzTu199/7WLs8ZCBAAAh+QQJDwB/ACwCAAMAPQAyAAAH/oB/goOEhYaHiIUAAQIDiY+QkZKCi42Tl5IEmpucnZ6fnpiQBAWlpqeoqaqnBKKPpKurBqsHqK2uiLAFB7WxBbOqvLa4uae8CAinBrPMwKbCw8SGsMsGvAkJqNWp17/LpbfShLoFCAndBQoLDA0ODg0MCwq7B9gJyabh4oKkyPfZvA48aAchQgQJEyi8g1bgH7IC+vb1w+ZtGa8KFi5gwJBBwwYOvKp9w5ZMn5STKFOqXMmypcuXEAdJ8UWzps1YUm7NvMmzJ00pf3b6HOqzV6mTRJPeNHpUqNFeAZ9FfUovalVj0KxSbfqsK1Wmu0ox3Bq2bK2vYo0iTTvVK6qz/mXjBhT2dW5YuFzFutULNmtXvcb2SgVcYK1ctlLp/o1bFa/ZtoCBClVK+adOUy8za97MMqagnUBxkcPqoASKFS9e0LCRw8gRBw+usiI0M7Sr0WkLDHTAAkaMGDd0vIs9OF+hk8RwM1THzh08edyMRgyavHKs6dJAad/+aR+uSo68I0pyCIkg85DAiz+UhAn5QubjI0F/SP16Qu3fG5pPP5H9+3/k94gDkvznXRIIuneIAwUdlBCB/jES3j5IJOEEEwoagpFGHHnEwQ8RWkLhDEhgmCEhSlzQgQcftAhCCDtwIAIiBuKCBIkYIvGEfoJUcEETLQbZYggjkFBCeUgI8jCfNDeWyESThThgQQfVfFAlCCacgAKEg9xI4gwkEpOEk0w8AeUgEFzQzDYGfJCCCiuwQIiXSS6Ji4Um7ghmfxFgsOY3bbbgwgswzEliAHSKieGOKoRJSJ/ORPqBoIQaWomdYu7InyESZGDlMp+2CYIMM9AQA3yLJCoNj4ZMoAEIQgrJAxQ12HCDIZf2B6AgFGwQQotVfoBDFEAMkYMOuEq4qyEOcLBDCCIZwEMLPfhAhBFcDlLjsn/8sMQIJlQjAxRA+BCEEEfUB8C63BoiAgknqOCCCzPUMAQRQhTRriumoaYaa67tiwtvvgEnnMAIixMIACH5BAkKAH8ALAIAAwA9ADIAAAf+gH+Cg4SFhoeIhQABAgOJj5CRkoKLjZOXkgSam5ydnp+emJAEBaWmp6ipqqcEoo+kq6sGqweora6IsAUHtbEFs6q8tri5p7wICKcGs8zApsLDxIawywa8CQmo1anXv8ult9KEugUICd0FCgsMDQ4ODQwLCrsH2AnJpuHigqTI99m8DjxoByFCBAkTKLyDVuAfsgL69vXD5m0ZrwoWLmDAkEHDBg68qn3DlkyflJMoU6pcybKly5cQB0nxRbOmzVhSbs28ybMnTSl/dvoc6rNXqZNEk940elSo0V4Bn0V9Si9qVWPQrFJt+qwrVaa7SjHcGrZsra9ijSJNO9UrqrP+ZeMGFPZ1bli4XMW61Qs2a1e9xvZKBVxgrVy2Uun+jVsVr9m2gIEKVUr5p05TLzNr3swypqCdQHGRw+qgBIoVL17QsJHDyBEHD66yIjQztKvRaQsMdMACRowYN3S8iz04X6GTxHAzVMfOHTx53IxGDJq8cqzp0kBp3/5pH65KjrxjQiKIPCTw4sf/IY+kfSL06RElMdTe/CP48QslYTK/kANJ+OUnyH79/eFAQQcl9N97jIQn4B8EDoKRRhx5xMEPDFqSXxIc8jeIEhd04MEHJIIQwg4ciIBIgPsgkYQTTHgoSAUXNEHijSSGMAIJJRzSngDueYfEDEjEKKMDFnT1UM0HS4JgwgkoLDjIkETOQGSLRMaIxBP9QXBBM9sY8EEKKqzAAiFUIgGkfcQMWSQTbg4SAQZgfiNmCy68AAOaRAaQpjhJvMnEE3H+MacziH6Ap558VhIkMS8ayaWV5kmQAZPLYComCDLMQEMMhSCxyJ/S7DdoEipcKcgEGoCAI448QFGDDTcY4iibkHJZHyEUbBDCqyTiEAUQQ+Sgg60NplegfxzsEIJIBvAQRQ8+EGGElIOw+OAfPywxggkptNCCDFAA4UMQQhxxCADsArCtISKQcMIMLrgwQw1DECFEEe+6YhpqqrHmWr+48OYbcMIRrLA4gQAAIfkECQ8AfwAsAgADAD0AMgAAB/6Af4KDhIWGh4iFAAECA4mPkJGSgouNk5eSBJqbnJ2en56YkAQFpaanqKmqpwSij6SrqwarB6itroiwBQe1sQWzqry2uLmnvAgIpwazzMCmwsPEhrDLBrwJCajVqde/y6W30oS6BQgJ3QUKCwwNDg4NDAsKuwfYCcmm4eKCpMj32bwOPGgHIUIECRMovINW4B+yAvr29cPmbRmvChYuYMCQQcMGDryqfcOWTJ+UkyhTqlzJsqXLlxAHSfFFs6bNWFJuzbzJsydNKX92+hzqs1epk0ST3jR6VKjRXgGfRX1KL2pVY9CsUm36rCtVprtKMdwatmytr2KNIk071Suqs/5l4wYU9nVuWLhcxbrVCzZrV73G9koFXGCtXLZS6f6NWxWv2baAgQpVSvmnTlMvM2vezDKmoJ1AcZHD6qAEihUvXtCwkcPIEQcPrrIiNDO0q9FpCwx0wAJGjBg3dLyLPThfoZPEcDNUx84dPHncjEYMmrxyrOnSQGnf/mkfrkqOvCNKcgiJIPOQwIs/lIQJ+ULm4yNBf0j9ekLt3xuaTz+R/ft/5PeIA5L8510SCLp3iAMFHZQQgf4xEt4+SCThBBMKGoKRRhx5xMEPEVpC4QxIYJghIUpc0IEHH7QIQgg7cCACIgbiggSJGCLxhH6CVHBBEy0G2WIII5BQQnlICPIwnzQ3lshEk4U4YEEH1XxQJQgmnIAChIPcSOIMJBKThJNMPAHlIBBc0Mw2BnyQggorsECIl0kuiYuFJu4IZn8RYLDmN2224MILMMxJYgB0ionhjiqESUifzkT6gaCEGlqJnWLuyJ8hEmRg5TKftgmCDDPQEAN8iyQqDY+GTKABCEIKyQMUNdhwgyGX9gegIBRsEEKLVX6AQxRADJGDDrhKuKshDnCwQwgiGcBDCz34QIQRXA5S47J//LDECCZUIwMUQPgQhBBH1AfAutwaIgIJJ6jgggsz1DAEEUIU0a4rpqGmGmuu7YsLb74BJ5zACIsTCAAh+QQFCgB/ACwCAAMAPQAyAAAH/oB/goOEhYaHiIUAAQIDiY+QkZKCi42Tl5IEmpucnZ6fnpiQBAWlpqeoqaqnBKKPpKurBqsHqK2uiLAFB7WxBbOqvLa4uae8CAinBrPMwKbCw8SGsMsGvAkJqNWp17/LpbfShLoFCAndBQoLDA0ODg0MCwq7B9gJyabh4oKkyPfZvA48aAchQgQJEyi8g1bgH7IC+vb1w+ZtGa8KFi5gwJBBwwYOvKp9w5ZMn5STKFOqXMmypcuXEAdJ8UWzps1YUm7NvMmzJ00pf3b6HOqzV6mTRJPeNHpUqNFeAZ9FfUovalVj0KxSbfqsK1Wmu0ox3Bq2bK2vYo0iTTvVK6qz/mXjBhT2dW5YuFzFutULNmtXvcb2SgVcYK1ctlLp/o1bFa/ZtoCBClVK+adOUy8za97MMqagnUBxkcPqoASKFS9e0LCRw8gRBw+usiI0M7Sr0WkLDHTAAkaMGDd0vIs9OF+hk8RwM1THzh08edyMRgyavHKs6dJAad/+aR+uSo68Y0IiiDwk8OLH/yGPpH0i9OkRJTHU3vwj+PELJWEyv5ADSfjlJ8h+/f3hQEEHJfTfe4yEJ+AfBA6CkUYcecTBDwxakl8SHPI3iBIXdODBBySCEMIOHIiASID7IJGEE0x4KEgFFzRB4o0khjACCSUc0p4A7nmHxAxIxCijAxZ09VDNB0uCYMIJKCw4yJBEzkBki0TGiMQT/UFwQTPbGPBBCiqswAIhVCIBpH3EDFkkE24OEgEGYH4jZgsuvAADmkQGkKY4SbzJxBNx/jGnM4h+gKeefFYSJDEvGsmlleZJkAGTy2AqJggyzEBDDIUgscif0uw3aBIqXCnIBBqAgCOOPEBRgw03GOIom5ByWR8hFGwQwqsk4hAFEEPkoIOtDaZXoH8c7BCCSAbwEEUPPhBhhJSDsPjgHz8sMYIJKbTQggxQAOFDEEIccQgA7AKwrSEikHDCDC64MEMNQxAhRBHvumIaaqqx5lq/uPDmG3DCEaywOIEAACH5BAUPAH8ALBoALgADAAMAAAcGgAaCg4OBACH5BAkKAH8ALAIAAwA9ADIAAAdWgH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyJMfy8muKS0tzdLTtYEAIfkECQ8AfwAsAgADAD0AMgAAB/6Af4KDhIWGh4iFAAECA4mPkJGSgouNk5eSBJqbnJ2en56YkAQFpaanqKmqpwSij6SrqwarB6itroiwBQe1sQWzqry2uLmnvAgIpwazzMCmwsPEhrDLBrwJCajVqde/y6W30oS6BQgJ3QUKCwwNDg4NDAsKuwfYCcmm4eKCpMj32bwOPGgHIUIECRMovINW4B+yAvr29cPmbRmvChYuYMCQQcMGDryqfcOWTJ+UkyhTqlzJsqXLlxAHSfFFs6bNWFJuzbzJsydNKX92+hzqs1epk0ST3jR6VKjRXgGfRX1KL2pVY9CsUm36rCtVprtKMdwatmytr2KNIk071Suqs/5l4wYU9nVuWLhcxbrVCzZrV73G9koFXGCtXLZS6f6NWxWv2baAgQpVSvmnTlMvM2vezDKmoJ1AcZHD6qAEihUvXtCwkcPIEQcPrrIiNDO0q9FpCwx0wAJGjBg3dLyLPThfoZPEcDNUx84dPHncjEYMmrxyrOnSQGnf/mkfrkqOvCNKcgiJIPOQwIs/lIQJ+ULm4yNBf0j9ekLt3xuaTz+R/ft/5PeIA5L8510SCLp3iAMFHZQQgf4xEt4+SCThBBMKGoKRRhx5xMEPEVpC4QxIYJghIUpc0IEHH7QIQgg7cCACIgbiggSJGCLxhH6CVHBBEy0G2WIII5BQQnlICPIwnzQ3lshEk4U4YEEH1XxQJQgmnIAChIPcSOIMJBKThJNMPAHlIBBc0Mw2BnyQggorsECIl0kuiYuFJu4IZn8RYLDmN2224MILMMxJYgB0ionhjiqESUifzkT6gaCEGlqJnWLuyJ8hEmRg5TKftgmCDDPQEAN8iyQqDY+GTKABCEIKyQMUNdhwgyGX9gegIBRsEEKLVX6AQxRADJGDDrhKuKshDnCwQwgiGcBDCz34QIQRXA5S47J//LDECCZUIwMUQPgQhBBH1AfAutwaIgIJJ6jgggsz1DAEEUIU0a4rpqGmGmuu7YsLb74BJ5zACIsTCAAh+QQJDwB/ACwCAAUAPQAwAAAH/oB/goOEhYaHiIUAAQIDiY+QkZKCi42Tl5IEmpucnZ6fnpiQBAWlpqeoqaqnBKKPpKurBqsHqK2uiLAFB7WxBbOqvLa4uae8CAinBrPMwKbCw8SGsMsGvAkJqNWp17/LpbfShLoFCAndBQoLDA0ODg0MCwq7B9gJyabhf1L8/f7/AAMKHEiwQDgpvhIqXBhLyi2EDCNKTChl38SLGHuV4oexI0ONGyHuelaKl0aTtU7SM1kSWsteLEeWNMVx5kyVIGW6VGkTpsyRMDXWXCkMJ6qUP0+iTEoUKdKQJG+SzAmN50+bQI/6hIo1qNKiUa8u5Tk2akWRHtNSfEiToNu3/nABGhwEsSIucqYUNPjBy0S1ZUB8BBHCa14qfQjtusJr6gEvEidUVKsxhIiQIg5csirEjxjjlg5KoFjx4gUNGzmMHHHwYGU0QopFfRb2oB0LGDFi3NDxrvUzkPrE/WHsUh07d/DkcdMYXNxnteCED0KiiTqo69g3SReE5E93JOATVXK0PVESQ+C7QxpfHlESJucLOZDEvn2h9/H/OIAQIYKECRTMJx4j5NknCH6DVGDBBRhgkIEGG3Dww4CW2JfEhfANosQFHXjwwYcghLADByIgUt92SCThBBMZClLBBU18KOOHIYxAQgmHnCgcEjMgwWKLDljQQTUfEAmCCSeg7CAgITpKw6OPTCDxRHwQXNDMNgZ8kIIKK7CAHhIChCfOkyw+OUgEGFz5TZYtuPACDIXw2KMKPYqTBJRMPGHmH2g64+cHbb5JiJxgikmMij9OOUOdf0iQQZHLQJolCDLMQEMMg/YYAKF2sjglner9MYEGIMw4Iw9Q1GDDDZlWYqg0SUyZHiEUbBCCqR/iEAUQQ+SgQ5yLcCpcfvJxsEMIfxnAQxQ9+ECEEUsO4mqoBg7ywxJAmJBCCy3IAEVggx2RI4HVHiICZCq44MIMlFlWhInklmuIaKSZhppq4gGgr7yHOHBbbrtFy+/AxAQCACH5BAUKAH8ALAkABQA1ADAAAAf+gH+Cg4SFhoeGAAECA4iOj5CQioyRlY4EmJmam5ydnJaFBAWjpKWmp6ilBKCEoqmpBqkHpqusgq4FB7OvBbGourS2t6W6CAilBrHKvqTAwcKuyQa6CQmm0qfUvcmjtba4BQgJ2gUKCwwNDg4NDAsKuQfVCcek3qyixvPWugcP6RARIkiYQGGdswL6jBWwBwpftW3JdFWwcAEDhgwaNnDQJY1btWMMLbl6CNGBrg4ePqgEEUKXCAfYEFpbKOwPOFIKGlS4wNHAh4gHRpAo0eDdqZCVbo5a4MBChw/AYukCYeIECgcLUCGNpLQAAwgXPEg9MG2WgRQqVrBgoLVm1wb+ETD87MVPWQsXL2A0aAsNlYO4c0fx63U3rwO+3/xKyKASaFkQMmbQiHH4qFtUDSZoAKFSl0qoumrYuLHXct9TDChsCAH68wcc/HLoYGs68SmmHHZ4XsnDQA8furAivocq5w9dJjoaAOIjiBBdRp/ZPvVAF4kTKqTVGEJESBGTu6QT/3XAQQkUK168oGEjh5EjDh7AC9/tcrZZ/hywgBEjxg0d68jXDH1bQaLUQeagow477txXj328RPhKgY4ggYmFnmSoYSbCIPGHh0iE6MgkjdR0SBKGhOihJIuUaCIhSTCBYiEOVELiizDKOIgDAAlEUI0jtoijIDHO+MdEFV3+lBEHPwRJiYlJRKmjIEpcgNJnLO3AgQiI3NhhEk4wMeWRFzTh2mchCFXCIV6ygsQMSIg5ZVNPnblSVVclIqSbcIqJxBMzgpWSnSqhpVaKSAggoiVvxslEo4PE1dFP0nxQGAyFvAnnDHBakoSjTDwB6R+AEarSpYRomuiikYApJ6AqdPrHYqZ+AJlkMaQKZwCqeiomrLL+oRlnhPIAhWg36DoJq5UkAaiKhKjGmp04RAHEELJlqkivoBhJY24hKMdDFL8RYQSQhCy74pCC/LDECCak0EILMkDBnHNHsLknu4OIcN0MLrgww3bdFdHlvvwKcl56L6zQ3nsjAiBxwjQL7tfff+hSrDG7gQAAIfkECQoAfwAsCQAFADUAMAAAB2GAf4KDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8qAa/f78GrQYFwr/GrQWCw3/LrMUFxtLJ0MDCvdna29zd3oeBACH5BAUPAH8ALAIAAgA9ADMAAAf+gH+Cg4SFhoeIhgABAgOJj5CRkoKLjZOXkgSam5ydnp+emJAEBaWmp6ipqqcEoo+kq6sGqweora6IsAUHtbEFs6q8tri5p7wICKcGs8zApsLDxIawywa8CQmo1anXv8ult9KEugUICd0FCgsMDQ4ODQwLCrsH2AnJpuHigqTI99m8DjxoByFCBAkTKLyDVuAfsgL69vXD5m0ZrwoWLmDAkEHDBg68qn3DliyiOFgUKzrg1cHDh5cgQvAS4WBbw2wQB0nZybOnz59Ag0o5sOyDxQMjSJRoMC/VLSm+oko9NfQXPRAmTqBwsEBVK6hTw0Ydaq2WgRQqVrBg4BWs2Lf+q4YS/dXCxQsYDdrC3ZtKrtm6dx3ofRaQHrReuwwfXsywAFleIGTMoBFDsFO3iLklLoW487PNoKW8/BCwho0beS8TZhiwVmvPnD+3pjoaR8AcOtiqjh3bM2zQvj+XEg2Ch4EePnhxHazY9ezfmQsrNiVFJBAfQYTwamrLLV+4UmZUqzGEiJAiKzPn++NWqPv3PlGsePGCho0cRo44eGA4Glgp0pBDWAEDOcACDDHEcIMO7/A34HqCQAUgMQLSY4o67LgDjzzcIKbPTgF+J1VEE+ICyokofrIPLpU4suKLh7QIoyFJHIKEIDdGIuOMgyTBRI2F3CgkEjkisiOPPgL+aQiRRT5yJIxJPuLAJE+Kk8SVPx7iQEEHJTSlk4y4KA4SSTjBRJaGYKQRRx5x8AOYlow5AxJnokmIEhe0NFpMO3AgQiJECkCkNEjMeSYSTygpSAUXNDHaoyEkVYKNM8xZaZOXFEonE5oW4oAFHVRjVFFYafXlIIXOKSimlySxKRNPdDoIBBc0s40BH6ClVpBzBpAqq5GUWWeilxISAQa2foMrYDDwWsmguPgIaxIqzFnIsc5k+wGzSy7yKzFJJMqkIRJkMCquokY2WQwxMgItuI9MoAEIjz7KAxSm3dBunDwSQsEGIbwk6gc4RAHEELjtK2a/gjjAwQ4hiGQAD1E/IEeEEacSAsDGADBcyA9LjGBCNTJAcV12R3gsiggknKCCCy7MQJ55RajsSgny0Wcffinb7IqBCCrIoM9EixMIACH5BAkPAH8ALAIAAgA9ADMAAAdXgH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMmHH8zKrSktLc7T1LKBACH5BAUPAH8ALAIAAgA9ADMAAAf+gH+Cg4SFhoeIhgABAgOJj5CRkoKLjZOXkgSam5ydnp+emJAEBaWmp6ipqqcEoo+kq6sGqweora6IsAUHtbEFs6q8tri5p7wICKcGs8zApsLDxIawywa8CQmo1anXv8ult9KEugUICd0FCgsMDQ4ODQwLCrsH2AnJpuHigqTI99m8DjxoByFCBAkTKLyDVuAfsgL69vXD5m0ZrwoWLmDAkEHDBg68qn3DliyiOFgUKzrg1cHDh5cgQvAS4WBbw2wQB0nZybOnz59Ag0o5sOyDxQMjSJRoMC/VLSm+oko9NfQXPRAmTqBwsEBVK6hTw0Ydaq2WgRQqVrBg4BWs2Lf+q4YS/dXCxQsYDdrC3ZtKrtm6dx3ofRaQHrReuwwfXsywAFleIGTMoBFDsFO3iLklLoW487PNoKW8/BCwho0beS8TZhiwVmvPnD+3pjoaR8AcOtiqjh3bM2zQvj+XEg2Ch4EePnhxHazY9ezfmQsrNiVFJBAfQYTwamrLLV+4UmZUqzGEiJAiKzPn++NWqPv3PlGsePGCho0cRo44eGA4Glgp0pBDWAEDOcACDDHEcIMO7/A34HqCQAUgMQLSY4o67LgDjzzcIKbPTgF+J1VEE+ICyokofrIPLpU4suKLh7QI4yRICFJjJDLOGEmNPCJxIyI56khIEob4+OMjQQr++UcSTBBZiAOTJKkjk07+4UBBByUEJZKMuCgklYNgpBFHHnHwA5eWzJjEmk0OosQFLY0W0w4ciJCIjwL4+CISSTjBRJuCVHBBE6MVGkJSJRyCxAwzLNroPosi8SegDljQQTVGFYWVVlsO4igSeR6JS6R/IvGEkxBc0Mw2BnyAllqFRBrAp9KQykSkg0SAwarftAoYDLHOUIme0iQh6Z9P4PqHrs40+8GvRS5CKy59TnoqozdKkEGmrWIa2WQxxMgIscQwycSpKjwqyAQagFBooTxAYdoN4qYpThKnGkkIBRuE8BKmH+DQAhBD4Favl/ci4gAHO4QgkgE8RIEcEUY7dEoIABgDoGQhPywxggnVyADFddkdsbEoIpBwggouuDADeeYVcbIrJchHn334mTyzKwYiqCCDOwctTiAAIfkECQ8AfwAsAgACAD0AMwAAB1eAf4KDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIyYcfzMqtKS0tztPUsoEAIfkEBQoAfwAsCgACADUAMwAAB/6Af4KDhIWGh4iJiouMiQABAgONk4cElpeYmZqbmpSEBAWhoqOkpaajBJ6DoKenBqcHpKmqf6wFB7GtBa+muLK0taO4CAijBq/IvKK+v7Ssxwa4CQmk0KXSu8ehs6q2BQgJ2AUKCwwNDg4NDAsKtwfTCcWi3J6gxPHUuAcP5xARERImUEjHrAA+YgXoUbI3LdsxXBUsXMCAIYOGDRxwQdM2rZjCSawaOnSAq4OHDyhBhMAlwoE1g9QSAvMmSkGDChc0Gvjw8MAIEiUatCv1sRHNUAscWOjwwdcrXCBMnEDhYIGpooyOFmAA4YKHpweixTKQQsUKFgyuzjTVIAIGnv679CFr4eIFjAZqnZly4BZuKH276Np1kLfbXgkZUPYUC0LGDBoxCBNdW6rBBA0gUOJC2RRXDRs38E7WW4oBhQ0hOnP+gENfDh1pRxsulZTDjs0peRjo4QNX1cL1TNn8gcvERgNAfAQRgmtos9mlHuAicUIFtBpDiAgpQjLX8+C9DjgogWLFixc0bOQwcsTBA3fet1Em5YufAxYwYsS4oSPd+2XxYbXIUQWRYw466rBzjXcCKqKVLhCiMhMnFFbYCTCTPBIJhhwioqEkHSaChCAjMvJhiCL+MSISLCpyIoqIsFjiIi/CeIgDGUICoo2COOAPQALh6KKOPAoS0UQVXf7EwQ9DbqhKElAeosQFJnGm0g4ciCAiEgK06EkSTCRhCE5NrMZZCD+VcAgSM8zApptfhlmIUh1Aw9MxH0Q1lZCDvMmll5SAKSYhXSVjzU5lnVUIm0gE4Gecgw7ilqHa7CQYDIvOoCGgkwhayKSiKGNpXTEYgsQjj3bqBBNPRPoHYnfuZGdjj5VqyKYzMoJEEqtyellmZqLEAxSf3XBIjbq66USqf5yWWrA4RAHEEK8dS+QkLPLKRKoO2BbCcTxEwRsRRvBJCADoAkAJo6s+weggPywxggkptNCCDFAkt9wRPGbbbhIq5CoCdSq44MIM2GlXRJHssppEroKQZx566haxVySJ2raKyH357dffxYNAKTLIngQCACH5BAEKAH8ALBcAKAAJAAUAAAcTgB0fg4SDHoWFBooGH4uMiJCQgQA7");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/censored.gif"] {
        content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhciIsSvr4sAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAClUlEQVRIx81WTUhUURT+7n3v3XF0DLSw5JaEpU0qiEGvLKhIMaud0KJtEUFBm9y4ilnNIosoWkjUzmWK0NRARn9UMEFWTI46hdg0GYVOjubPm5l7WzyV1zT6GsfAA493PvjOOd875/A4BFlabGqSfQ0P8vcP/Sz4uBej4UEAwKbtlag+eBi1TUcNvmNntMhVaGSTl2RDjkYj7NGdDj3QcdWzv9TBq9dr2OxSIYTEyM8EQmMJvPxuRPeeu3ip4dTZAOdbjFUXMhB8x26fP6NXTAx5T1S5dCejjBIzXEiJVEIiYaQwFU8aXcPTgUhpVdvpm7cC7ppaY9WEfBoaYO0tzfrJkl9evcypqxpllBJgXgikhBASyYSAMZPCzFTCeP1lNuBLFre1dvsD2yrdtmKo7U5Mxtn961f0I4Vx756yfF1jClMUCkIJyLwWQgkUhUJjChxOFXkFKttVwvT65A+v79plfTw+wXIWEgl94B97Oj0N5QW6ohHW1BNDY/d4xt429cRw7MEENIcCzamw+g2aHr7b6Yn0B7ldHdWO0Oe/xw7wPK5phFFK0NtSDABo7Bpf9K1YCgljLgVVo3AwyuoKKH/r9+XekdDzp6gu1kCJZScsxa1vszMElBBQhYCqFOX5BKEXz5CzkLHPIyhyUKzU1ilmjpxHAwBCSAgpASkXu2Idi9WHNLkiZT4y9e//EYk1YKr5EdIyYrIkXvCX46wUUysgacuYjq3BmTh28cvxl9xCu6QLOJO4pYRnEvaXECnlH4HpOD1RJgF2hTPVWHPLuqIz4NWNds9uF+Vb8wg2MgIpJEZnBYanBd7Mkei+C63/7wywHkbRgX7e5/ex4JNefAsPmYdRRSVqDjWirvm4wd1VWR9GvwGqCC3zRUzlAwAAAABJRU5ErkJggg==");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/clap.gif"] {
        content: url("data:image/gif;base64,R0lGODlhHAAeAIQdAEI2EtWqApZiBvvXDrCJBM3MxPK/AndlO9TUzs2JAuqlAmxREf7kH6RzBp+Ueunt7pKFY2JKFuGWAv7+/vC0ArR6AnJeMvbKAt62AsKMAqNrBJ5+Bt7e3v///////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQJDwAfACwAAAAAHAAeAAAF0+AnjmRpnmIUoeynltF1rS0s0+ld2zMZz7iaSjf6EVvGXlF2ZCWDriZSGlXuftBqFoU9dYXUnHJBCMgChIV4W71YNpeBXH6hNCxMdnQRGDD+gAMXBhkLVigQBH4AAICMgnYQeiKGDI2WmJYDBgpqNYqAoYF1DTsYfqKhkAk7cYypf4wUEq0DABOMubm4s6a2E8DBwgAKrJ8Xt8LKxBo7CwbIysHEEp41FdDJwxQKzTsiGRQGuowKChXfJAIKFO3cChIC6SULDQnwCRrW8/z9/v8nQgAAIfkECQwAHwAsAAACABoAGwAABcjgF0VfaZ4oOorXRabwGbUjHd+sO9MvXta8lrB32w1zLp/J+NoRlc6lTZkjRqnX3xS61SY/C0KgFSAsvE+kZXMZuN0XSsNyTM0WgQFjzx9cDBkLX3YQBHoAAHyIfnIiN4IMiZGTkQMGCj6GfJt9cT4YepybjAk4bYiie4gUEqYDABOIsrKxrDigsBO6u7sACqU3BBe5vLy+GjgLBsPFvQoSZzgVy8S9FArIShkUBrOICgoVVCUCChTn188C4yYLDQnPCRrR7PUlIQAh+QQJDwAfACwBAAEAGAAbAAAFw+AXRV9pnqg5itdFpnAZtSMdx7Obr/dZ6y1bjxX8CXs5226oEi6ZxNeTOZ3erM8FIdAKEBayI/Fi2VwGaPSF0rAUUbNFYMCo2wcXQ2bhSkUgBHQAAHaDeGwQLyh8DISNj40DBgpgMIF2mHdrDTEYdJmYhwkxZ4OgdYMUEqQDABODsLCvqp2tE7e4uQAKo5YXrrnBuxoxCwa/wbi7EpUwFcfAuhQKxD0ZFAaxgwoKFVACChTi0woSAlAlCw0J5QkazejxIQAh+QQBCgAfACwAAAAAHAAeAAAF1OAnjmRpnmiqrmwrRhEJu2V0XfFn4/R75z6ea4fLwW5CFlG4BKp2MGf0t4I+qSmbE6W9xhwLQuAWICwcuuRJa9lcBnD4hdKwdLm/wIDB7w8uBhkLWCY2EAR7AAB9in90EGoyF4MMi5WXlQMGCoNbIzGIfaJ+cw06Khh7o6KOCSxviqt8ihQSrwMAE4q7u7q1LKm5E8PExAAKrisEF8LFxccaLAsGzM7GChILLRXUzcYUCtEuGRQGvIoKChU9HwIKFPDg2ALsIgsNCdgJGtr1/v8Ae4QAADs=");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/bubble.gif"] {
        content: url("data:image/gif;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/congratulate.gif"] {
        content: url("data:image/gif;base64,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");
    }

    .night img[src="//s.4pda.to/cQMtpAqfqkggRwm/daisy.gif"] {
        content: url("data:image/gif;base64,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");
    }

    .night img[src="//ds-assets.cdn.devapps.ru/cQMtXA64ZR8O6Ahb6Qhv0N5dC2m0wfES3M4K21VhHxALRdx.gif"] {
        content: url("data:image/gif;base64,R0lGODlhCAAJAKECAHJ1efL1+f///////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAIALAAAAAAIAAkAAAIRhC8CwWHa3InMUHkt1fF4UwAAOw==");
    }

    /* QMS Plus fix */
    .night .qms-search-form .btn.blue {
        color: #9e9e9e;
    }

    /* EXPERIMENTAL! hide ads. If not needed comment next selectors */
    .night body > div:first-of-type > :nth-child(2) > :first-child > :nth-child(2),
    .night article > :first-child:not(div) {
        display: none !important;
        cursor: default;
    }

    .night body #rkgrKCNWoK>.sWq>.rdu>#rkgmEjiy+#fcsFYH#fcsFYH#fcsFYH#fcsFYH {
        background: black !important;
    }
`

userStyleEl.innerHTML = userStyle;

const navigatorEdge = /Edge/.test(navigator.userAgent);

function readyHead(fn) {
	if (document.body) {
			fn();
	} else if (document.documentElement && !navigatorEdge) {
		const observer = new MutationObserver(() => {
			if (document.body) {
				observer.disconnect();
				fn();
			}
		});
		observer.observe(document.documentElement, { childList: true });
	} else {
		setTimeout(() => readyHead(fn), 16);
	}
}

readyHead(() => {
	if (document.getElementById('4pdafixmarker')) return;
	document.head.appendChild(userStyleEl);
	if (userConfig.getItem('night_mode')) {
		document.documentElement.classList.add('night');
	}
});

function ready(fn) {
	const { readyState } = document;
	if (readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			fn();
		});
	} else {
		fn();
	}
}

ready(() => {
	if (document.getElementById('4pdafixmarker')) return;

	const switcherEl = document.createElement('div');
	switcherEl.classList.add('night_mode_switcher');
	switcherEl.onclick = () => {
		const isNightMode = userConfig.shiftItem('night_mode');
		document.documentElement.classList.toggle('night', isNightMode);
	};
	document.body.appendChild(switcherEl);
	setInterval(() => {
		const boolClass = document.documentElement.classList.contains('night');
		const isNightMode = userConfig.getItem('night_mode');
		if (boolClass !== isNightMode) {
			document.documentElement.classList.toggle('night', isNightMode);
		}
	}, 1000);

	setTimeout(() => {
		const marker = document.createElement('meta');
		marker.id = '4pdafixmarker';
		document.head.appendChild(marker);
	}, 300);
});
