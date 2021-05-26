// ==UserScript==
// @name         4pda Dark Mode
// @namespace    https://4pda.to/forum/index.php
// @version      0.2.2
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

    .night {
        scrollbar-color: dark;
        scrollbar-face-color: #22272b;
        scrollbar-track-color: #000;
        scrollbar-color: #22272b #000;
    }

    /* bg */
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
    .night .z2Iuiq37TBOm {
        background: #171c20;
    }

    .night .pagecurrent {
        background: #4c3c32;
    }

    .night .usercp_menu {
        background-color: #171c20;
    }

    /* text */
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

    /* non important text */
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

    /* non important bg */
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
    .night .comment-box .comment-list li {
        background: #22272B;
    }

    .night td.formbuttonrow,
    .night .borderwrap.read .row2,
    .night .borderwrap.read .post2,
    .night .borderwrap.read .post1,
    .night .borderwrap.read td.formbuttonrow,
    .night .post {
        background: #22272B !important;
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
    .night .comment-box .comment-list .karma .num {
        background: #3A4F6C;
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

    /* White to black */
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
    .night #gfooter a:visited
     {
        color: #000;
    }

    /* Black to white */
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
    .night .comment-box .wrap-menu a {
        color: #DDD !important;
    }

    .night a:hover {
		color: #13A4F4;
	}

    .night #navstrip img {
        opacity: 0.5;
    }

    .night .g-btn.blue {
        background: #3997d2;
        background: -moz-linear-gradient(top, #3f5364 0%, #7eb8e5 100%);
        background: -webkit-linear-gradient(top, #3f5364 0%, #7eb8e5 100%);
        background: linear-gradient(to bottom, #3f5364 0%, #7eb8e5 100%);
        color: #303040 !important;
    }

    .night .g-btn.red,
    .night .g-btn.green,
    .night .sel-btn,
    .night .sel-btn.orange {
        color: #303040 !important;
    }

    .night .popmenubutton-new,
    .night .popmenubutton {
        background: #4c80a0;
    }

    .night .price-slider .ui-slider .ui-slider-handle {
        background: #4c80a0;
        color: #DDD !important;
    }

    .night .comment-box .heading .btn {
        background: #3a4f6c;
        color: #DDD !important;
    }

    .night .price-slider .ui-slider .ui-slider-handle span {
        border-top-color: #4c80a0;
    }

    .night .post-block > .block-title {
        background-color: #22272B;
        color: #9e9e9e;
    }

    .night .post-block > .block-body {
        background: #171c20;
        color: #9e9e9e;
    }

    .night .post-block.spoil.open > .block-body:after {
        background: #22272B;
        outline-color: #22272B;
    }

    .night .resized-linked-image {
        background-color: #000;
        color: #DDD;
    }

    .night .bar,
    .night .barb,
    .night .barc {
        background: #22272B;
    }

    .night .ed-wrap .ed-vtoggle-normal,
    .night .ed-wrap .ed-vtoggle-hover,
    .night .ed-wrap .ed-vtoggle-down,
    .night .ed-wrap .ed-panel {
        background-color: #3A4F6C;
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
    .night .postlinksbar {
        background-color: #4c678d;
        color: #8faed8;
    }

    .night .darkrow1 {
        background: #5f80af;
        color: #1d2735;
    }

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

    .night .borderwrap h3,
    .night .maintitle,
    .night .maintitlecollapse,
    .night .upopupmenu-item,
    .night .popupmenu-item,
    .night .product-detail {
        border-bottom-color: #395179;
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
    .night .fosy-form select {
        border-color: #395179;
    }

    .night .post-block {
        border-color: #29394e;
        border-left-color: #395179;
    }

    .night .content-box blockquote {
        border-left-color: #29394e;
    }

    .night .pwLRWWLQ2bWn3ByIrSeTn4g .heading .ico {
        color: rgba(255,255,255,0.2);
    }

    .night .profile-textarea {
        background: #31383e;
        border-color: #395179;
    }

    .night .comment-box .comment-list.level-1 > li,
    .night .comment-box .comment-list.level-3 > li,
    .night .comment-box .comment-list.level-5 > li,
    .night .comment-box .comment-list.level-7 > li,
    .night .comment-box .comment-list.level-9 > li,
    .night .comment-box .comment-list.level-11 > li {
        background: #31383e;
    }

    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field:before {
        background: #171c20;
    }

    .night .pwLRWWLQ2bWn3ByIrSeTn4g .select-field select {
        -webkit-box-shadow: 0 0 0 1px #395179;
        -moz-box-shadow: 0 0 0 1px #395179;
        box-shadow: 0 0 0 1px #395179;
    }

    .night .fosy-form input,
    .night .fosy-form textarea,
    .night .fosy-form select {
        -webkit-box-shadow: inset 0px 1px 3px 0px #395179;
        box-shadow: inset 0px 1px 3px 0px #395179;
    }

    .night .fosy-captcha {
        background: #4b80b5;
        background: -moz-linear-gradient(top, #4b80b5 0%, #335d88 44%, #14395f 100%);
        background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4b80b5), color-stop(44%,#335d88), color-stop(100%,#14395f));
        background: -webkit-linear-gradient(top, #4b80b5 0%, #335d88 44%, #14395f 100%);
    }

    .night p.copyright,
    .night .submit-wrapper,
    .night .fosy-captcha-load {
        background-color: transparent !important;
    }

    /* hide ads */
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
