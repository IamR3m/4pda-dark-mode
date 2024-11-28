// ==UserScript==
// @name         4pda Dark Mode
// @namespace    4PDA
// @homepage     https://4pda.to/forum/index.php?showtopic=1026245
// @version      0.12.11
// @description  Dark Mode to 4pda
// @author       IamR3m
// @match        https://4pda.ru/*
// @match        https://4pda.to/*
// @icon         https://4pda.to/s/PXtiacOY8Mz0UBgLQBVkl40yz0oYH.svg
// @downloadURL  https://github.com/IamR3m/4pda-dark-mode/raw/main/4pda-dark-mode.user.js
// @updateURL    https://github.com/IamR3m/4pda-dark-mode/raw/main/4pda-dark-mode.meta.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

/* global $*/

const FLAGS = {
  SMALL_BUTTONS: false,
  AUTO_NIGHT_MODE: false,
  AUTO_NIGHT_START: 20,
  AUTO_NIGHT_END: 8,
  FAV_UNREAD_DARK_COLOR: "#111d27",
  FAV_UNREAD_LIGHT_COLOR: "#ACD6F7",
  SHOW_NEW_VERSIONS: false,
  SHOW_USER_INFO: false,
  ADS_CLEANER: false,
  QMS_BB_PANEL: false,
  CATEND_HEIGHT: 5,
  TD_PADDING: 5,
  POPMENUBUTTON_PADDING: 4,
  POST_FOOTER_PADDING: 5,
},
      favURL = '/forum/index.php?act=fav',
      forumURL = '/forum/index.php?showforum=',
      topicURL = '/forum/index.php?showtopic=',
      qmsURL = '/forum/index.php?act=qms',
      configOptions = [
        ['SMALL_BUTTONS', 'маленькие кнопки настроек и ночного режима'],
        ['SHOW_NEW_VERSIONS', 'показывать новые версии в избранном'],
        ['SHOW_USER_INFO', 'показывать доп. информацию о пользователях в теме'],
        ['QMS_BB_PANEL', 'модифицированная панель BB-кодов в QMS'],
        ['ADS_CLEANER', 'удалять рекламу'],
        ['AUTO_NIGHT_MODE', 'aвтоматически включать ночной режим'],
        ['AUTO_NIGHT_START', 'начало ночного режима'],
        ['AUTO_NIGHT_END', 'окончание ночного режима'],
        ['CATEND_HEIGHT', 'высота разделителя постов'],
        ['TD_PADDING', 'отступы табличных ячеек'],
        ['POPMENUBUTTON_PADDING', 'отступ кнопки меню автора поста'],
        ['POST_FOOTER_PADDING','отступ подвала поста'],
      ]
if (!GM_getValue('4pdafixFlags')) {
  GM_setValue('4pdafixFlags', JSON.stringify(FLAGS))
} else {
  const jsonString = GM_getValue('4pdafixFlags'),
        loadedConfig = jsonString ? JSON.parse(jsonString) : {};
  Object.keys(FLAGS).forEach((key) => {
    if (
      Object.keys(loadedConfig).includes(key) &&
      configOptions.find(arr => arr[0] === key)
    ) FLAGS[key] = loadedConfig[key]
  })
}
const BUTTON_SIZE = FLAGS.SMALL_BUTTONS ? 16 : 32,
      BUTTON_SIZE2 = FLAGS.SMALL_BUTTONS ? 15 : 25,
      BUTTON_SIZE3 = FLAGS.SMALL_BUTTONS ? 6 : 10,
      BUTTON_SIZE4 = FLAGS.SMALL_BUTTONS ? 48 : 88,
      userConfig = {
        key: '4pdafix',
        model: {
          night_mode: [false, true],
          fav_unread_dark_color: [FLAGS.FAV_UNREAD_DARK_COLOR],
          fav_unread_light_color: [FLAGS.FAV_UNREAD_LIGHT_COLOR],
          catend_height: [FLAGS.CATEND_HEIGHT],
          td_padding: [FLAGS.TD_PADDING],
          popmenubutton_padding: [FLAGS.POPMENUBUTTON_PADDING],
          post_footer_padding: [FLAGS.POST_FOOTER_PADDING],
        },
        config: {},
        init() {
          let jsonString = GM_getValue(userConfig.key);
          const loadedConfig = jsonString ? JSON.parse(jsonString) : {},
                config = {};
          Object.keys(userConfig.model).forEach(key => {
            config[key] = Object.keys(loadedConfig).indexOf(key) >= 0 ? loadedConfig[key] : userConfig.model[key][0]
          });
          jsonString = JSON.stringify(config);
          GM_setValue(userConfig.key, jsonString);
          userConfig.config = config
        },
        getItem(key) {
          return JSON.parse(GM_getValue(userConfig.key))[key]
        },
        setItem(key, value) {
          let jsonString = GM_getValue(userConfig.key);
          const config = JSON.parse(jsonString);
          config[key] = value;
          jsonString = JSON.stringify(config);
          GM_setValue(userConfig.key, jsonString);
          userConfig.config = config
        },
        shiftItem(key) {
          const availableValues = userConfig.model[key],
                nextIdx = (availableValues.indexOf(userConfig.getItem(key)) + 1) % availableValues.length,
                nextValue = availableValues[nextIdx];
          userConfig.setItem(key, nextValue);
          return nextValue
        }
      };
userConfig.init();
const userStyleEl = document.createElement('style');
let userStyle = `
/* Night mode Swhitcher */

.night_mode_switcher {
    box-sizing: border-box;
    position: fixed;
    width: ${BUTTON_SIZE}px;
    height: ${BUTTON_SIZE}px;
    right: ${BUTTON_SIZE}px;
    bottom: ${BUTTON_SIZE}px;
    z-index: 10000;
    background-color: transparent;
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

/* Scrollbar */

.night ::-webkit-scrollbar, .night ::-webkit-scrollbar-corner, .night ::-webkit-scrollbar-track-piece {
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

/* PageLinks */

.night .pagelinklast > a, .night .pagelink > a, .night .pagelink-menu, .night .minipagelink > a,
.night .minipagelinklast > a {
    background: #171c20;
}

.night .pagelinklast > a, .night .pagelink > a, .night .pagelink-menu, .night .pagecurrent-wa,
.night .minipagelink > a, .night .minipagelinklast > a {
    border-color: #395179;
}

/* Background */

.night .activeusers {
    background: transparent;
}
.unread_row > td {
    background: ${userConfig.getItem('fav_unread_light_color')};
}
.night .unread_row > td {
    background: ${userConfig.getItem('fav_unread_dark_color')};
}
.night .popupmenu, .night select, .night .borderwrap, .night .borderwrapm, .night .ed-p-textarea, .night .pagelinklast,
.night .ed-textarea, .night .copyright, .night body, .night #logostrip, .night .pagelink, .night .ed-wrap .ed-textarea,
.night .minipagelink, .night .minipagelinklast, .night input, .night textarea, .night .post2, .night .check_list_div,
.night .post1, .night .bg1, .night .ed-wrap .ed-p-textarea, .night .qr-maintitle, .night .thread-list .date .text,
.night form[action*="//4pda.to/forum/index.php"] ul .select-field select, .night .container, .night #ucpcontent,
.night form[action*="//4pda.to/forum/index.php"] ul .select-field:before, .night .side-box, .night #ucpmenu,
.night .navbar, .night .footer, .night .lb-outerContainer, .night #lbOuterContainer, .night #lbDetailsContainer {
    background: #171c20;
}
.night .catend {
    background: #1b4466;
}
.night #userlinks, .night #userlinksguest, .night .upopupmenu-new, .night .popupmenu-new, .night #gc_1, .night #footer,
.night #go_1, .night .borderwrap p, .night .row1, .night .row2, .night .post-edit-reason, .night .menu-main-item:hover,
.night .pformstrip, .night .borderwrap p.formbuttonrow, .night .comment-box .comment-list li, .night #events-wrapper,
.night .borderwrap p.formbuttonrow1, .night form[action*="//4pda.to/forum/index.php"] ul > li, .night .product-detail,
.night .toplinks span, .night form[action*="//4pda.to/forum/index.php"] ul .u-note:after, .night .menu-user > a:hover,
.night .profile-text, .night .ac_results, .night .footer-nav, .night .menu-sub, .night ul.status, .night .load_frame,
.night .events-popup, .night .menu-user:hover > a, .night .menu-user.open > a, .night .plainborder, .night .poll-frame,
.night .tablefill, .night .tablepad, .night .second-menu .menu-brands, .night .second-menu .menu-brands li a:hover,
.night .second-menu .menu-brands li a:focus, .night #twocolumns, .night .price-slider .ui-slider, .night .form-bg,
.night .dipt, .night .bar, .night .barb, .night .list-group .list-group-item[data-message-id]:not(.our-message),
.night .list-group .list-group-item[data-message-id]:not(.our-message), .night .barc {
    background: #22272B;
}
.night .list-group .list-group-item[data-message-id]:not(.our-message)::before {
    border-left-color: #22272B;
}
.night td.formbuttonrow, .night .borderwrap.read .row2, .night .borderwrap.read .post2, .night .borderwrap.read .post1,
.night .borderwrap.read td.formbuttonrow, .night .post, .night .postcolor[style*="background-color: #F0F7FF"],
.night body > div:first-of-type > :nth-child(2) > :first-child > :nth-child(7) > :nth-child(2) > :nth-child(4),
.night .ed-emo-panel div:last-of-type {
    background: #22272B !important;
}
.night .deletedpost .post1shaded, .night .deletedpost .post2shaded, .night .deletedpost td.formbuttonrow,
.night .deletedpost .row2 {
    background: #2c0707 !important;
}
.night .list-group .list-group-item.active, .night .list-group .list-group-item.active, .night #events-list > a:hover,
.night .forum-attach-form .forum-attach-file-border, .night .comment-box .comment-list.level-1 > li, .night #print h3,
.night .comment-box .comment-list.level-3 > li, .night .comment-box .comment-list.level-5 > li, .night .td-description,
.night .comment-box .comment-list.level-7 > li, .night .comment-box .comment-list.level-9 > li, .night .td-comment,
.night .comment-box .comment-list.level-11 > li, .night .forum-attach-form .view-preview, .night .paginator .active a,
.night .paginator a:hover {
    background: #31383e;
}
.night .list-group .our-message, .night .row2[style*="background-color: rgb(220, 220, 220)"] {
    background: #31383e !important;
}
.night .list-group .our-message::before {
    border-right-color: #31383e !important;
}
.night .logo-in-qms .show-checkboxes .thread-list .list-group-item:hover::before,
.night .logo-in-qms .show-checkboxes .thread-list .list-group-item:focus::before {
    border-right-color: #3a4f6c !important;
    border-left-color: #3a4f6c !important;
}
.night h4, .night .borderwrap h3, .night .maintitle, .night .maintitlecollapse, .night .poll-frame .poll-frame-option,
.night .popupmenu-category, .night .formtable td.formtitle, .night .formsubtitle, .night .footer-panel,
.night body > div:first-of-type > :nth-child(2) > :first-child > :nth-child(4), .night .second-menu .menu-brands li a,
.night #gfooter, .night .ac_over, .night .menu-sub-item:hover, .night .comment-box .comment-list .karma .num-wrap,
.night .price-slider .ui-slider .ui-slider-range, .night .comment-box .comment-list .karma .num, .night .userevents,
.night .dropdown-menu > li > a:hover, .night .dropdown-menu > li > a:focus, .night .forum-attach-form .attach-btn,
.night .menu-sub-item:active, .night .menu-right #events-count {
    background: #3A4F6C;
}
.night h4 {
    background: #3A4F6C !important;
}
.night td.row1[style*="background:#FFE87F"] {
    background: #4e4623 !important;
}
.night .forum-attach-form .attach-btn:hover {
    background: #469ef9 !important;
}
.night .pagecurrent, .night .pagecurrent-wa {
    background: #4c3c32;
}
.night .popmenubutton-new, .night .popmenubutton {
    background-color: #4c80a0;
}
.night .forum-attach-list-before {
    background: #22272b;
    background: -moz-linear-gradient(top, #22272b 0%, rgba(214,232,255,0) 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, #22272b), color-stop(100%, rgba(214,232,255,0)));
    background: -webkit-linear-gradient(top, #22272b 0%, rgba(214,232,255,0) 100%);
    background: -o-linear-gradient(top, #22272b 0%, rgba(214,232,255,0) 100%);
    background: -ms-linear-gradient(top, #22272b 0%, rgba(214,232,255,0) 100%);
    background: linear-gradient(to bottom, #22272b 0%, rgba(214,232,255,0) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#22272b', endColorstr='#22272b', GradientType=0 );
}
.night .forum-attach-list-after {
    background: #22272b;
    background: -moz-linear-gradient(top, rgba(214,232,255,0) 0%, #22272b 100%);
    background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(214,232,255,0)), color-stop(100%, #22272b));
    background: -webkit-linear-gradient(top, rgba(214,232,255,0) 0%, #22272b 100%);
    background: -o-linear-gradient(top, rgba(214,232,255,0) 0%, #22272b 100%);
    background: -ms-linear-gradient(top, rgba(214,232,255,0) 0%, #22272b 100%);
    background: linear-gradient(to bottom, rgba(214,232,255,0) 0%, #22272b 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#22272b', endColorstr='#22272b', GradientType=0 );
}
.night .list-group .list-group-item .bage, .night .list-group .list-group-item .icon-close {
    background: #22272b;
    background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, #22272b 20%, #22272b 100%);
    background: -webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0)), color-stop(20%, #22272b), color-stop(100%, #22272b));
    background: -webkit-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
    background: -o-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
    background: -ms-linear-gradient(left, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, #22272b 20%, #22272b 100%);
}
.night .list-group .list-group-item.active .bage, .night .sidebar .list-group .list-group-item.active .bage {
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

.night .status-1 {
    background-color: #0f480f;
}
.night .usercp_menu {
    background-color: #171c20;
}
.night .ed-wrap .ed-vtoggle-normal, .night .ed-wrap .ed-vtoggle-hover, .night .zbtn-default:active:hover,
.night .ed-wrap .ed-vtoggle-down, .night .ed-wrap .ed-panel, .night .dropdown-menu .divider,
.night .pp-contentbox-back, .night .zbtn-default.active:hover, .night .post-block.quote > .block-title {
    background-color: #3A4F6C;
}
.night .deletedpostlight .row2, .night .deletedpostlight .post1shaded, .night .deletedpostlight td.formbuttonrow,
.night .deletedpostlight .post2shaded {
    background: #3a4f6c !important;
}
.night .t-row.row-open.row-1, .night .t-row.row-open.row-2 {
    background-color: #5a5a0a;
}
.night .status-0 {
    background-color: #992a2a;
}
.night .row4shaded2, .night .post1shaded2, .night .post2shaded2 {
    background-color: #fa052a5c;
}
.night .post-block.code > .block-title {
    background-color: #fd919170;
}
.night p.copyright, .night .submit-wrapper, .night .fosy-captcha-load {
    background-color: transparent !important;
}

/* Background + Color */

.night .wr.va-m .content {
    background: #22272B;
    color: #9e9e9e;
}
.night .zbtn-default {
    background: #31383e;
    color: #9e9e9e;
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
.night .post-block:not(.cur):not(.mod):not(.ex):not(.code) > .block-title {
    background-color: #29394e;
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
.night table th, .night .borderwrap table th, .night .subtitle, .night .subtitlediv, .night .postlinksbar {
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
.night textarea.t-comment-text {
    background: #31383e;
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, #31383e 50%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(255,255,255,0)), color-stop(50%, #31383e));
    background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, #31383e 50%);
    background: -o-linear-gradient(top, rgba(255,255,255,0) 0%, #31383e 50%);
    background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, #31383e 50%);
    background: linear-gradient(top, rgba(255,255,255,0) 0%, #31383e 50%);
    border-color: #395179;
    color: #9e9e9e;
}
.night .dropdown-menu > li > a[data-count]:after {
    background: #9e9e9e;
    color: #171c20;
}

/* Background + Border Color */

.night .list-group .list-group-item, .night .dropdown-menu {
    background: #22272B;
    border-color: #29394e;
}
.night .pp-contentbox-entry-noheight-mod, .night .pp-contentbox-entry-noheight-sel, .night .pp-contentbox-entry,
.night .pp-contentbox-entry-noheight {
    background-color: #22272b;
    border-color: #29394e;
}
.night .events-popup {
    background: #22272B;
    border: 1px #395179 solid;
}
.night div[style*="background:#dff0d8"] {
    background: #26351f !important;
    border-color: #597540 !important;
    position: relative;
}
.night .profile-textarea {
    background: #31383e;
    border-color: #395179;
}
.night .t-row.row-1.row-status-2, .night .t-row.row-2.row-status-2 {
    background: #31383e;
    border-top-color: #395179;
}
.night .navbar .btn, .night .bb-codes, .night .ed-panel .dropdown .btn {
    background-color: #3A4F6C;
    border-color: #5d7397;
}
.night td.formbuttonrow, .night .pformstrip, .night .borderwrap p.formbuttonrow, .night .borderwrap p.formbuttonrow1 {
    background-color: #3A4F6C !important;
    border-color: #395179;
}
.night .t-row.row-1 {
    background-color: #446a80;
    border-top-color: #395179;
}
.night .t-row.row-2 {
    background-color: #305367;
    border-top-color: #395179;
}
.night .rz1gXXZ5pRH, .night .sidebar {
    background: #171c20;
    border-right-color: #395179;
}
.night .post-block.spoil.open > .block-body:after {
    background: #29394e;
    outline-color: #29394e;
}

/* Border */

.night input, .night .pagelink, .night .pagelinklast, .night .pagecurrent, .night .g-btn, .night .usercp_menu_out,
.night .usercp_menu, .night #gc_1, .night #go_1, .night .post-block.spoil, .night .post-block.code,
.night .post-block.quote, .night .resized-linked-image, .night #userlinks, .night .post-edit-reason, .addInfo,
.myDiv, .night .popmenubutton, .night .popupmenu-new, .night .upopupmenu-new, .night .popupmenu, .night .borderwrap,
.night a.button, .night select, .night #gfooter, .night .ed-color-normal, .night #ed-0_sp > div:last-child,
.night button, .config_frame, .night form[action*="//4pda.to/forum/index.php"] ul li, .night .profile-text,
.night .profile-textarea, .night .btn, .night .activeusers {
    border-radius: 4px !important;
    -webkit-border-radius: 4px !important;
}
.night label.select-field:before {
    right: 2px
}

/* Buttons */

.night .g-btn.blue {
    -moz-box-shadow:inset 0px 1px 0px 0px #6aa8d4;
    -webkit-box-shadow:inset 0px 1px 0px 0px #6aa8d4;
    box-shadow:inset 0px 1px 0px 0px #6aa8d4;
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #63b8ee), color-stop(1, #468ccf));
    background:-moz-linear-gradient(top, #63b8ee 5%, #468ccf 100%);
    background:-webkit-linear-gradient(top, #63b8ee 5%, #468ccf 100%);
    background:-o-linear-gradient(top, #63b8ee 5%, #468ccf 100%);
    background:-ms-linear-gradient(top, #63b8ee 5%, #468ccf 100%);
    background:linear-gradient(to bottom, #63b8ee 5%, #468ccf 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#63b8ee', endColorstr='#468ccf',GradientType=0);
    background-color:#63b8ee;
    border:1px solid #3866a3;
    color:#14396a !important;
    text-shadow:0px 1px 0px #7cacde;
}
.night .g-btn.blue:hover {
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #468ccf), color-stop(1, #63b8ee));
    background:-moz-linear-gradient(top, #468ccf 5%, #63b8ee 100%);
    background:-webkit-linear-gradient(top, #468ccf 5%, #63b8ee 100%);
    background:-o-linear-gradient(top, #468ccf 5%, #63b8ee 100%);
    background:-ms-linear-gradient(top, #468ccf 5%, #63b8ee 100%);
    background:linear-gradient(to bottom, #468ccf 5%, #63b8ee 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#468ccf', endColorstr='#63b8ee',GradientType=0);
    background-color:#468ccf;
}
.night .g-btn.blue:active {
    position:relative;
    top:1px;
}
.night .g-btn.red {
    -moz-box-shadow:inset 0px 1px 0px 0px #8c433c;
    -webkit-box-shadow:inset 0px 1px 0px 0px #8c433c;
    box-shadow:inset 0px 1px 0px 0px #8c433c;
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #af3228), color-stop(1, #b32114));
    background:-moz-linear-gradient(top, #af3228 5%, #b32114 100%);
    background:-webkit-linear-gradient(top, #af3228 5%, #b32114 100%);
    background:-o-linear-gradient(top, #af3228 5%, #b32114 100%);
    background:-ms-linear-gradient(top, #af3228 5%, #b32114 100%);
    background:linear-gradient(to bottom, #af3228 5%, #b32114 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#af3228', endColorstr='#b32114',GradientType=0);
    background-color:#af3228;
    border:1px solid #6f170f;
    color:#ffffff !important;
    text-shadow:0px 1px 0px #810e05;
}
.night .g-btn.red:hover {
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #b32114), color-stop(1, #af3228));
    background:-moz-linear-gradient(top, #b32114 5%, #af3228 100%);
    background:-webkit-linear-gradient(top, #b32114 5%, #af3228 100%);
    background:-o-linear-gradient(top, #b32114 5%, #af3228 100%);
    background:-ms-linear-gradient(top, #b32114 5%, #af3228 100%);
    background:linear-gradient(to bottom, #b32114 5%, #af3228 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#b32114', endColorstr='#af3228',GradientType=0);
    background-color:#b32114;
}
.night .g-btn.red:active {
    position:relative;
    top:1px;
}
.night .g-btn.green {
    -moz-box-shadow:inset 0px 1px 0px 0px #699c3c;
    -webkit-box-shadow:inset 0px 1px 0px 0px #699c3c;
    box-shadow:inset 0px 1px 0px 0px #699c3c;
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #477d1b), color-stop(1, #207113));
    background:-moz-linear-gradient(top, #477d1b 5%, #207113 100%);
    background:-webkit-linear-gradient(top, #477d1b 5%, #207113 100%);
    background:-o-linear-gradient(top, #477d1b 5%, #207113 100%);
    background:-ms-linear-gradient(top, #477d1b 5%, #207113 100%);
    background:linear-gradient(to bottom, #477d1b 5%, #207113 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#477d1b', endColorstr='#207113',GradientType=0);
    background-color:#477d1b;
    border:1px solid #1e6d12;
    color:#ffffff !important;
    text-shadow:0px 1px 0px #aade7c;
}
.night .g-btn.green:hover {
    background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #207113), color-stop(1, #477d1b));
    background:-moz-linear-gradient(top, #207113 5%, #477d1b 100%);
    background:-webkit-linear-gradient(top, #207113 5%, #477d1b 100%);
    background:-o-linear-gradient(top, #207113 5%, #477d1b 100%);
    background:-ms-linear-gradient(top, #207113 5%, #477d1b 100%);
    background:linear-gradient(to bottom, #207113 5%, #477d1b 100%);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#207113', endColorstr='#477d1b',GradientType=0);
    background-color:#207113;
}
.night .g-btn.green:active {
    position:relative;
    top:1px;
}

/* Catend height */
.catend {
    height: ${userConfig.getItem('catend_height')}px;
}

/* padding */
.ipbtable td, .divpad {
    padding: ${userConfig.getItem('td_padding')}px;
}
.popmenubutton-new-out {
    padding: ${userConfig.getItem('popmenubutton_padding')}px;
}
.popmenubutton-new {
    padding: ${Math.max(0, userConfig.getItem('popmenubutton_padding')-1)}px;
}
td.formbuttonrow, .pformstrip, .borderwrap p.formbuttonrow, .borderwrap p.formbuttonrow1 {
    padding: ${userConfig.getItem('post_footer_padding')}px !important;
}

/* Closable notification */

.closable {
    cursor: pointer;
    position: absolute;
    top: 50%;
    right: 0%;
    padding: 10px 14px;
    transform: translate(0%, -50%);
}
.closable:hover {
    background: #b7d7aa;
}
.night .closable:hover {
    background: #39502f;
}

/* Filters */

.night .ed-wrap .ed-panel-title {
    filter: brightness(1.6);
}
.night .ed-wrap .ed-bbcode-normal {
    filter: brightness(1.3);
}
.night .ed-wrap .ed-bbcode-hover, .night .ed-wrap .ed-bbcode-normal:hover {
    filter: brightness(0.7) contrast(1.3);
}
.night input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px #31383e inset !important;
    -webkit-text-fill-color: #9e9e9e !important;
}

/* Border Color */

.night .p-i-goto {
    border-color: revert;
}
.night .popupmenu, .night .popupmenu-new, .night .borderwrap, .night .borderwrapm, .night .upopupmenu-new, .night .bar,
.night .upopupmenu, .night .borderwrap p, .night .post-block:not(.cur):not(.mod):not(.ex), .night .toplinks span, .night .barb,
.night .barc, .night .subtitlediv, .night .container {
    border-color: #29394e;
}
.night #userlinks, .night #userlinksguest, .night .usercp_menu, .night .usercp_menu_out, .night .qr-maintitle .sel-btn,
.night .post-edit-reason, .night .pagelink, .night .pagelinklast, .night .pagecurrent, .night #t-content .paginator a,
.night .minipagelink, .night .minipagelinklast, .night .hIiDg3yjTi9D > div, .night .maintitlecollapse, .night .navbar,
.night form[action*="//4pda.to/forum/index.php"] ul li, .night form[action*="//4pda.to/forum/index.php"] ul .u-note,
.night .profile-text, .night form[action*="//4pda.to/forum/index.php"] ul .select-field select, .night .form-input,
.night .fosy-div, .night .fosy-form input, .night .fosy-form textarea, .night .fosy-form select, .night fieldset,
.night .paginator span.static {
    border-color: #395179;
}
.night h4, .night #gc_1, .night #go_1, .night .ed-wrap td, .night .ed-wrap td table {
    border-color: #395179 !important;
}
.night .menu-main-item.w-sub > a:after {
    border-top-color: #9e9e9e;
}
.night .body-thread-form, .night .header.logo-in-qms .footer {
    border-top-color: #395179;
}
.night .price-slider .ui-slider .ui-slider-handle span {
    border-top-color: #4c80a0;
}
.night .content-box blockquote {
    border-left-color: #29394e;
}
.night #print h2, .night #print h3, .night #print p {
    border-bottom-color: #29394e;
}
.night .borderwrap h3, .night .maintitle, .night .maintitlecollapse, .night .upopupmenu-item, .night .popupmenu-item,
.night .product-detail, .night .rz1gXXZ5pRH .clear-members-form, .night .sidebar .clear-members-form, .night .t-row,
.night .t-row-content, .night .t-form-post {
    border-bottom-color: #395179;
}
.night .post-block.code {
    border-left-color: #ff43436e !important;
}
.night .comment-box .comment-list li [name="comment"] {
    outline-color: #395179;
}

/* Box Shadow */

.night form[action*="//4pda.to/forum/index.php"] ul .select-field select {
    -webkit-box-shadow: 0 0 0 1px #395179;
    -moz-box-shadow: 0 0 0 1px #395179;
    box-shadow: 0 0 0 1px #395179;
}
.night .dipt:after, .night .dipt-hor-border {
    -webkit-box-shadow: 0 1px 0 0 #395179 inset;
    -moz-box-shadow: 0 1px 0 0 #395179 inset;
    box-shadow: 0 1px 0 0 #395179 inset;
}
.night .dipt .dfrml {
    -webkit-box-shadow: -1px 0 0 0 #395179 inset;
    -moz-box-shadow: -1px 0 0 0 #395179 inset;
    box-shadow: -1px 0 0 0 #395179 inset;
}
.night .dipt .dfrml + .dfrmr, .night .dipt .dfrmrbrd {
    -webkit-box-shadow: -1px 0 0 0 #395179;
    -moz-box-shadow: -1px 0 0 0 #395179;
    box-shadow: -1px 0 0 0 #395179;
}
.night .fosy-form input, .night .fosy-form textarea, .night .fosy-form select {
    -webkit-box-shadow: inset 0px 1px 3px 0px #395179;
    box-shadow: inset 0px 1px 3px 0px #395179;
}

/* Color */

.night .borderwrap h3, .night #loading-layer-inner, .night .popupmenu-item-last, .night #gfooter a:visited,
.night .upopupmenu-item, .night .popupmenu-item, .night .maintitle td, .night .maintitle-text, .night #gfooter a:link,
.night .qr-maintitle, .night #gfooter td, .night #gfooter a:visited
{
    color: #000;
}
.night a:hover {
    color: #13A4F4;
}
.night .sel-btn.orange {
    color: #303040 !important;
}
.night .post-block.cur > .block-title, .night .post-block.mod > .block-title, .night .post-block.ex > .block-title {
    color: #222;
}
.night .globalmesscontent a:visited, .night .globalmesscontent a:link, .night .usercp_menu_out, .night .formsubtitle,
.night .globalmesscontent a:active, .night .twWqGD1Fem94z0ltz2wnz1 h4, .night .ed-wrap .ed-vtoggle-normal,
.night .ed-wrap .ed-vtoggle-hover, .night .ed-wrap .ed-vtoggle-down, .night .usercp_menu, .night .ed-wrap .ed-panel {
    color: #3294cf;
}
.night .upopupmenu-item-last a:visited, .night .ipb-top-right-link a:visited, .night .ipb-top-left-link a:visited,
.night .upopupmenu-item-last a:link, .night .popmenubutton-new a:visited,.night .upopupmenu-item a:visited,
.night .ipb-top-left-link a:link, .night .popmenubutton-new a:link, .night #submenu, .night .upopupmenu-item a:link,
.night .popmenubutton a:visited, .night .popmenubutton, .night .popmenubutton-new, .night .globalmesscontent {
    color: #515151;
}
.night .dropdown-menu > .disabled > a, .night .dropdown-menu > .disabled > a:hover,
.night .dropdown-menu > .disabled > a:focus {
    color: #555;
}
.night .content-box a:link,
.night .content-box a:visited {
    color: #5c94c8 !important;
}
.night .desc, .night .lastaction {
    color: #5f6772;
}
.night #t-content, .night #t-content a, .night .wr-t + .footer, .night .article-footer-item,
.night .comment-box .comment-form [name="comment"] {
    color: #9e9e9e;
}
.night #t-content a:hover {
    color: #DDD;
}

.night .advanced-area .post .list-post-title a, .night .advanced-area .post .list-post-title a:visited, .night a:link,
.night a:visited, .night a:active, .night .advanced-area .post .list-post-title a:active {
    color: #b2b2b2;
}
.night table.ipbtable, .night tr.ipbtable, .night td.ipbtable, .night body, .night #events-wrapper, .night tr.ipbtable,
.night table.ipbtable, .night td.ipbtable, .night .dipt, .night .maintitle, .night .maintitlecollapse a:visited,
.night .maintitlecollapse, .night .maintitle a:link, .night .maintitle a:visited, .night .popupmenu-item-last a:link,
.night .maintitlecollapse a:link, .night #navstrip a:link, .night #navstrip a:visited, .night .popmenubutton a:visited,
.night .popupmenu-new, .night .popupmenu-category, .night .popupmenu-item a:link, .night .advanced-area .post p,
.night .popupmenu-item-last a:visited, .night .popupmenu-item a:visited, .night .ipb-top-right-link a,
.night .post-edit-reason, .night .content-box, .night .content-box blockquote:before,
.night div[id^="ka_"] span[style*="color:#222222"] {
    color: #9e9e9e !important;
}
.night .popmenubutton a:link {
    color: #484848 !important;
}
.night span[style*="color:red"], .night span[style*="color:#FF0000"], .night span[style*="color:#ff0000"] {
    color: #c70000 !important;
}
.night span[style*="color:blue"], .night span[style*="color:#0000FF"], .night span[style*="color:#0000ff"] {
    color: #3050f5 !important;
}
.night span[style*="color:purple"] {
    color: #cc00cc !important;
}
.night .input-warn, .night .input-green, .night .input-checkbox, .night input, .night textarea, .night .popupmenu-item,
.night select, .night .popupmenu-item-last, .night .textarea, .night .searchinput,.night .button, .night .normalname,
.night label.select-field select, .night button.editor_button, .night .gobutton, .night .comment-box .comment-list,
.night .catend, .night .ed-wrap .ed-textarea, .night .comment-box .comment-list .nickname {
    color: #DDD;
}
.night a.btn.noborder.iblock.rounded.green, .night .comment-box .wrap-menu a {
    color: #DDD !important;
}
.night form[action*="//4pda.to/forum/index.php"] ul .heading .ico {
    color: rgba(255,255,255,0.2);
}
.night .body-tbl path, .night .body-tbl circle {
    fill: #3A4F6C;
}

/* Fix download screen */

.night .download-container {
    background-color: #22272B !important;
    border-color: #393d41 !important;
    color: #9e9e9e;
}
.night .dw-fname, .night .dw-fsize, .night .dw-fdwlink, .night .dw-descr, .night .download-container div:last-of-type {
    text-shadow: 0 0 4px black !important;
}
.night .download-container div:last-of-type a {
    color: #468cf7 !important;
}

/* Post block Image */

.night .post-block.quote > .block-title {
    background-image: url(data:image/gif;base64,R0lGODlhNQAZAIQBAAAAAP///zZz1D551kqB2FSI21+Q3WmX34er5ZO06J276qbB7MfY83Oe4X2l47LK77zR8f///////////////////////////////////////////////////////////yH5BAEKAB8ALAAAAAA1ABkAAAWe4CeOZGmeaKqubEsOQiwLbv3OdInPdg3vul2sZ8oFhSThkChaFpVJpbGYcj6RUaxukBpwq9LjoPEzwVTT00+Lsn7OYNZaYJCt3Gkq060f8aNMH39JOnd5LoeAfomLe4xNQYYCBTwsg01pl5hsbWh5Mz9fi1BxbYdho5wvon1XQFmvZqw2UlOohYGCt7qxuaacO7O+JXN2w77Bx8rLgSEAOw==);
}
.night .post-block.code > .block-title {
    background-image: url(data:image/gif;base64,R0lGODlhNQAZAOMPAP2Rkf/39/7Ly/2Zmf6urv7i4v2np/2goP7T0/69vf/p6f7a2v7Fxf/w8P62tv///yH5BAEKAA8ALAAAAAA1ABkAAASv8MlJq714gj2y/+A1bEBontmGrqzKvuFRyuQBk+WNk++eZ7YLTxM0jVxHzM7CobhSTkDxMZocj8to5Sn8PWRMTfbL5T7MlKQzLBlLZEW0N422gLXMn1xUz2/nbV6AgGeEeR14f2tbiGIhQ4mRcziOj4aEAI2FOTQuTY8pkz+delGaH4abO41Yp4FSMH+rKFiwsYWbMLVTK30suxkjvIG3FsB5mKmxWBiuGsXBykq3EQA7);
}

/* Image fixes */

.night .postdetails img[alt="*"], .night .pp-contentbox-entry-noheight img[alt="*"] {
    content: url('data:image/gif;base64,R0lGODlhCwAKAMIHAAcqZlB1tFN5uF6KymST1Gqc3YW49f///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAALAAoAAAMgeLqs8PAtIKoF0+iN3fhgdwBEaYpAoa5o4L5oBDW0kgAAOw==');
}
.night .postdetails img[alt="-----"] {
    content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAKCAYAAAD2Fg1xAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WBTJfcPVKAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAHRJREFUOMtj/P//P8NwACwMDAwMZd1r8fqmqzSYcbCrY4Fx1NQ1sSq6dfM6Cn+wqoN7RFJBnigDB6s6uEfevnxFVFocrOrgHmFmYSXKwMGqDuERVhbiDByk6uCyn9+8IcrAwaoO7pHbt28SZeBgVcc4XCpEAO8SYIEmEM0iAAAAAElFTkSuQmCC);
}
.night .postdetails img[alt="-"] {
    content: url(data:image/gif;base64,R0lGODlhCgAKAMIHAHd3d556esB3d8Z3d8t3d8qbm9atrf///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAKAAoAAAMfeLp88fCpUKoN0+iNnQAgIHTBEAIDSawsaV1TBDV0AgA7);
}
.night .postdetails a img[alt="-"] {
    content: url(data:image/gif;base64,R0lGODlhCgAKAMIHAAAAAGYHB8ABAc8BAd4AANteXvmNjf///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAKAAoAAAMfeLp88fCpUKoN0+iNnQAgIHTBEAIDSawsaV1TBDV0AgA7);
}
.night .postdetails img[alt="+"] {
    content: url(data:image/gif;base64,R0lGODlhCgAKAOMIAGRkZHeVZ5q6ipy8jKTFkanKlK3Ol7rZpP///////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAgALAAAAAAKAAoAAAQjEMlJUbj4yjC6D9txAIAIWgRJEmdQqEDRGgZJt0KutxlW/REAOw==);
}
.night .postdetails a img[alt="+"] {
    content: url(data:image/gif;base64,R0lGODlhCgAKAOMIAAAAACdmB3G0UHW4U4bKXo/UZJjdarT1hf///////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAgALAAAAAAKAAoAAAQjEMlJUbj4yjC6D9txAIAIWgRJEmdQqEDRGgZJt0KutxlW/REAOw==);
}
.night img[alt=">"] {
    content: url(data:image/gif;base64,R0lGODlhCAAIAIABAAAAAP///yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAEALAAAAAAIAAgAAAIMjI+JoAGcHjxPzWYKADs=);
}
.night #navstrip img, .night .popupmenu-item img[alt="V"], .night .popupmenu-item-last img[alt="V"] {
    content: url(data:image/gif;base64,R0lGODlhCgAKAMIGAAoKCi0tLTo6OnR0dHV1dZmZmf///////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAKAAoAAAMceLp8E22VQWArQJDKMMib5YHcgWmlMqXLE71MAgA7);
}
.night .popmenubutton-new {
    background-image: url(data:image/gif;base64,R0lGODlhDQAFAOMLAD8/P0FBQUJCQkZGRkdHR0hISElJSUxMS01NTVFQUFBRUf///////////////////yH5BAEKAA8ALAAAAAANAAUAAAQW8ElSqpX4AUuGyVgSjAqYIQJigocZAQA7);
}
.night .popmenubutton img[alt="V"], .night .pagelink img[alt="V"] {
    content: url(data:image/gif;base64,R0lGODlhDQAFAOMLAD8/P0FBQUJCQkZGRkdHR0hISElJSUxMS01NTVFQUFBRUf///////////////////yH5BAEKAA8ALAAAAAANAAUAAAQW8ElSqpX4AUuGyVgSjAqYIQJigocZAQA7);
}

/* Post Smiles */

.night .dfrmr input[value="1"] + img {
    content: url(data:image/gif;base64,R0lGODlhEwATAMZFAEM0EH1aB4BeCYFfCX9iC4NoDYxwDqh6B6t9CLCECrCIDKyKELGJDLCSEraRD8OOCMaTCsiUCr2aEsmZDMuaDMihEMGjFdKfC8OkFdSgC9WhC9elDNOoEMyqFdqqDtCvFtS1F+CzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGeXGGuvFF+vGF+zGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/TUHPTVHPbXHffYHffZHvjbHvncH/rdH/reH/ziIf3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAezgH+Cg4SFhoeIiAUNHy4dCwSJghY4Ozw7ODQrDokqPj9BoT89NischyA+QUSsrEE+NCgKhQY6QKwArQBAOS8hA4QYPKtEubhBPDAjCYQpPkO4ukI9MiUThDHDrdvIyheEJ7bbrby+EIQSNT7Gra8AKB4IhS0360FCQUDrLCEZhhUsaOgAQJDgChEbDhzigOIFjBkwXqAIseFBIgYhSJggEcJDBoWSBCSgoCECggCSUqpMGQgAOw==);
}
.night .dfrmr input[value="2"] + img {
    content: url(data:image/gif;base64,R0lGODlhEwATAMZRAEM0EGBGCGJHCGFICGJICGNJCGNLCWlOCWxTCn1aB29eFH5bB3BfFIBeCYFfCX9iC4NoDYlqDIxwDqh6B6t9CLCECrCIDKyKELGJDLCSEraRD8OOCMaTCsiUCr2aEsmZDMuaDMihEMGjFdKfC8OkFdSgC9WhC9elDNOoEMyqFdqqDtCvFtS1F+CzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGeXGGuvFF+vGF+zGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/TUHPTVHPbXHffYHffZHvjbHvncH/rdH/reH/ziIf3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAfBgH+Cg4SFhoeIiBAZKzopFw+JfwYiREdIR0RANxoEhwg2SktNpEtJQjcoBYYsSk1QsLBNSkA0FoUSRkwMvL0MCkU7LQ6EJEivALHJTUg8LxWENUpPsdVOST4xH4Q9x9WxzM4jhDO637BMwS0chB5Brt+ztSoUhBE5QwAATU5NTEpCcLQosaBQCBxAjABQgsTIJhcnJhg6gILGDh4/eOyg0eLEBgGHBmBoAUMGjBYqSkwIIKlBBRAmOlBIIKmmzZqBAAA7);
}
.night .dfrmr input[value="3"] + img {
    content: url(data:image/gif;base64,R0lGODlhEwATAMZPAEM0EGBGCGJHCGFICGJICGNJCGNLCWlOCWxTCn1aB35bB4BeCYFfCX9iC4NoDYlqDIxwDqh6B6t9CLCECrCIDKyKELGJDLCSEraRD8OOCMaTCsiUCr2aEsmZDMuaDMihEMGjFdKfC8OkFdSgC9WhC9elDNOoEMyqFdqqDtCvFtS1F+CzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGeXGGuvFF+vGF+zGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/TUHPTVHPbXHffYHffZHvjbHvncH/rdH/reH/ziIf3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAe/gH+Cg4SFhoeIiA4XKTgnFQ2JfwYgQkVGRUI+NRgEhwg0SElLpElHQDUmBYYqSEtOsLBLSD4yFIUQREqxvEpDOSsMhCJGSwCwx8fGOi0ThDNITU4Ax8gARzwvHYQ7xbyxS0bMIYQxut+wvsAahBw/rt+ztSgShA83QUhKS0xLSkhAbKwYoaDQBxs+iFAzQmQTixIRDB0wISOHjh46cshYUSKDgEMDLKxwAcPFChQjIgSQtGCCBxIbJCSQRLMmzUAAOw==);
}
.night .dfrmr input[value="4"] + img {
    content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4WMgV3yvBxAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAA0xJREFUOMu1lE1sG0UUx/8zu14nbkzcotA0S+QsiQ0tMWmDQ09thWwOETSK1KrqAVAFrcQBxIkTSAgJbggJLggQUvmSDGpLFT7MR1aColZCcYOoXbX1R2ynXUpoGzu147Vnd2c4WGSxGsoFnvQOb/T0m3nvP+8B/6GR9Q6zC2WUc2eRPfcjytkUblaXcEdgM4LhKMIP7EEw9CDC9wRvDytfvYHfShl88dEr6OZzemSbRx0alKEOSCiXbZRKFtIXLcPq2hnb+8TLGBgaRXDLnbfCSsY1nE99ixPvHtGfPNijTUS7VCoThRACIQS4LWAzjlbdZnOppnEs2SoeeO7D2NbxWAcQAKB/P4Nn9/l048xAky0Ehb2oCX7FdXtRE6wQFPXM3eLa6c0inQg0n57s0s+c/mGNQQHgQq6Az99/Ac885df6+j1eWaGQZAJCXZdkAtlLofgkeHtk9PV7vHv3yNrJoy/iYr4IAJABIJc+haH+q/rwSECVZApCCeJTy2s3zs5s6oi//NgPT7eE7fd71F8vzOu59KnYGiwzl8SuqFelElEIBeJTy5id2dTRhr9iwQUema7g+Ds+SB6qjIWImplLumUu5uehBWUQChBCbgF16k+Q/LS3nUsJtvRRXC784sIatQp6NhAIDgghbv8zhYAQaOdygW5FoFGvujCffyNWqg64IyD4v7A4wG0Ox+ZwLI56XcDXE3Bhg8M7kM9bsFsOHJsjPrXc0XAXJODYHI89XoNlOmCmA+MPjsHhHa6akYlJpPSkMTaqaEQiSvKzXkgyXRcIAIm3vFi9wcAaDksvCGNi/ySARPtlochulK/3x/K5pmGuWGjWbDDTwdeJ3raS81XMzrf7knjTC7NqwbxpIZO1jaYvGgtFdrtlbg2PYN+RN/DB8Vbx98VWq1FhaFQZzBULJ97bgPh4APHxAD553YPVZYbVCsP1Jbv13VlSnD70Gu4b0dafzWNvH9anH5a1sW0eVVKoQikB5wIO42CmA9ZwWCZrG9+kSPHg852zue7WOHn0JXSbKX17mKjqXRQ+r0CtJnB5ieNcQRjM/1Bs+tCr/7w1/m6XCiXkMj8h/fNXKOdSaNQq8Pk3IhiKIrLzUYRGd+He4SH8r/YnnkmGnSFvut0AAAAASUVORK5CYII=);
}
.night .dfrmr input[value="5"] + img {
    content: url(data:image/gif;base64,R0lGODlhEwATAIQQABwKFSkRIDoVLE4aOmQgSssAescCfHsjWd0Ce9oGgJAlZ78VfaMjcbMfed8ThOIkjf///////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKABAALAAAAAATABMAAAVdICSOZGmeaKqubOuqyQEFSYDcxAIdCSQUIoTDhxAgREYIAxFQNIIPhjEZ/CEIBhnkijgUbwjAYqlQMKuKxHfEWxAQvSpETYUMuranqAYh1MAEcwJzWi+Gh4iJiikhADs=);
}
.night .dfrmr input[value="6"] + img {
    content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9biyIVByuIiGSo4mBBqoijVqEIFUKt0KqDyaVf0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QNzcnRRcp8X9JoUWMB8f9eHfvcfcO8NfLTDU7JgBVs4xUIi5ksqtC5yuCGEY/YhiTmKnPiWISnuPrHj6+3kV5lve5P0ePkjMZ4BOIZ5luWMQbxNObls55nzjMipJCfE48btAFiR+5Lrv8xrngsJ9nho10ap44TCwU2lhuY1Y0VOIp4oiiapTvz7iscN7irJarrHlP/sJQTltZ5jrNISSwiCWIECCjihLKsBClVSPFRIr24x7+QccvkksmVwmMHAuoQIXk+MH/4He3Zn4y5iaF4kDwxbY/RoDOXaBRs+3vY9tunACBZ+BKa/krdWDmk/RaS4scAb3bwMV1S5P3gMsdYOBJlwzJkQI0/fk88H5G35QF+m6B7jW3t+Y+Th+ANHWVvAEODoHRAmWve7y7q723f880+/sB2YRy0PmOGPQAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQflBR4XAB2IFFZhAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAzhJREFUOMu11F9oW1UcwPHvubk3adNW06zdul5LmrWpbrZu09Q+uSHplCLb4ga6F6U4Bz4oPvmkMBR9E99EEIpTEYbMbVS0OntBJxtIszmWiFuT/knnddbVpV2z/Lm59x4fyhKH3fqiP/hxDj8OH34Hzu/AfxhiteLkdJZs+hyTF38gO5ngxuI89wQ2EOqJ0vPQTkKRR+jZFLo7lr36F7/Ppvjy0zepdyeMvi2a3tmhord7yGZtZmcrJC9VzErdQGz3c4dp7+wltHHdv7FZ8xq/JL7l+IeHjOcPNIb7o3W6ogqvEAIpJa4tsS2Xct62JhIl89hYeeaZVz6JbX44dhsIgPHdKC/v9xvm2faSNR2S9lxYur/V0p4LS2sqJPOp++S1Mxtk8migdHCozjh75vuqoQD8mp7ixMhrvPRCU7i1TfOpXoUn9+XYFc8hFIFQBB5VMPTsEnuH8/gaVVrbNN/unWr45JHXuZSZqWHp5Gk6264aXd0+3aMq7IrnGB8NMj4aZHDPdQAG91xnfDTIqePNPH3wJlq9h20PanqDdd5IJ0/XsNTEGANRn654hFcoMD4arLZ+a39rFQp8ffRePKqCR1O8WyNCT02M1bC5zHnCIRWhgBBijcckEGIFFYpgY6vClamfa1hhOUdjg0C6IKW8OyYlUrJy1pXUeyWF/GIN8zc1s7To4DoS6a5hueDaLo7t4lRc8nmJvzEAgArQ0bWdTMYg2KLi0QRP7Ftac3Q+e1fDKjqYf7p0dG0HLq901tc/ROKCZZbzjmUVHQAWFit3TIDSso1VcKzktDR7+4dq14z07SC70BbLpEtmcanCiZEGWgIaLQENgAvOeoBq7aO3FIo3KqQmbbPkj8YifTtq2OaebvYfeo+PvyjP/DFXLhdyFp+/X1cFBtflqvDIYcHNnMXCvF0+dU7MxIff4YHu8OqzeeyDF43442p46xZN93gVr6IIXFfiWC5W0cEqOFZq0ja/SYiZA6/ePpur/honj7xBfTFhbOsRur5ewe+TLC9Lrsy7XJySptX0aCw+/Padf41/xuWpWdKpH0n+9BXZdILCcg5/UzOhSJS+gaeI9D7G/V2d/K/xN8TNfMQQd53/AAAAAElFTkSuQmCC);
}
.night .dfrmr input[value="7"] + img {
    content: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TtSIVByuICGaoThZEpThqFYpQIdQKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ/ABxc3NSdJES/5cUWsR6cNyPd/ced+8AoVZimtUxAWi6bSbjMTGdWRUDr+iCgAFEMSIzy5iTpATajq97+Ph6F+FZ7c/9OXrVrMUAn0g8ywzTJt4gjm7aBud94hAryCrxOfG4SRckfuS64vEb57zLAs8MmankPHGIWMy3sNLCrGBqxNPEYVXTKV9Ie6xy3uKslSqscU/+wmBWX1nmOs1hxLGIJUgQoaCCIkqwEaFVJ8VCkvZjbfxDrl8il0KuIhg5FlCGBtn1g//B726t3NSklxSMAZ0vjvMxCgR2gXrVcb6PHad+AvifgSu96S/XgJlP0qtNLXwE9G0DF9dNTdkDLneAwSdDNmVX8tMUcjng/Yy+KQP03wI9a15vjX2cPgAp6ipxAxwcAmN5yl5v8+7u1t7+PdPo7weJTHKwHDpFZQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UGAhU3GUGVdNUAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAADYElEQVQ4y7VU32tcRRT+Zu69c7ObjU2U2G2uYXO7bsSaNa1uWrC0VaxCkNZUpRZBKSaCiOKTTyuWiPkLfBCk0qAvEYLGiCYlLmhLCpq1QnfFuj+yu6nXElubH7vZH3PvnfFhSbYhsU964MCZ4fDNd86c7wD/oZHtLlPzBVZI/2ykrvzACqk4VpcXcVfrTgS6I+h++AgPhB61uncH+B3BCtf/Zn/mk8bXnw2bHjEXDe/RjK5OFUaHgkLBQT5vI3HVtuymAyPHXj6T6+jqsQK77uFbwPLWDfZr/Pz+Lz5+bfiVUz6zL9JkUJUwQgiklBCOhMMFaiWHz8Wr1vhULXfyrU/PPPjIkz/dDggAiM1Mmm8+741ZlzqqfD4gnQVTij8a7iyYkmcDspS8T96Y3SkTY63Vwf6m2KXZ7811DAoAv6Wz7MtP3jFff7XFbPdrusooFJWA0IYrKoGqUzCvAt2not2v6ceOqObEaNS8msmxDbB04oLR5b8eDd6vG4pK8dTAEo4ev7X1tyhB/8kVnBhcg+ZRsPchzWjml6PpxAUDAFQASM5NsUMR3aAKYYQC303eDQA4evzWRrx+nplog10VqKzYUDTKekPESM5NNZgtZC7DDKggFCBk87SsM9xgSggIQT2XEuxqp7iW/aXRs3JxCb5mAikAKeWdJ1NKSIl6rpDwMIlyaRkbZXpb2rCyXITerEKK+qsANpW4HgtHQjgCriPg2gKlkoTX1wpgsc6sM7gPmYwNp+bCdQSk2J6dFBKuI2DXBOyKC15xYf0l0Bnc12AW7uvn8diU1dvDTKIQBgCKSvH0c0tbAL8a9aG25qBadMDLLk/MS6vvhX4OjNXBQuHD1vTn/pFM+ubZYEg3hSNxYnAN347tAKH1/ghXwq66ePZ0Cefep6is2kimHKvqjYyEwoetTXKKzUya4x++ePaNl/SD7X5N1zwKFJWCUNIor+KiWnRQWbVxc9GpnTuP2aH3poceO/h4blttjn80NDzwhGr27tEMhVFGKYEQEi4X4BUXvOzyZMqxpuMkd+rtzdrcdmtMjL5reirx6N5uYhj3Unh1iWJR4tqiwJWstHjL/pGB0x/8+9a43X7P5lk6edFI/PgNK6TjKBeX4G1pQyAUQfjAMzzUc8h6INjF8X/aP+0Pm3EGdwAzAAAAAElFTkSuQmCC");
}
.night .dfrmr input[value="8"] + img {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZMACNDEBVfBhVgBRdhBhdiBhtkBxtmBh9rBx5tAx9tAyNxBSRyBSl3Bi9+BzB+CDGFATWFCDOJAjuRBDuVAFONEkCWBkGbAkObAkebCEmfB0iiA0ijA0ulA0qmA0+kCkunA0+rBFOqCVStCFaxBVeyB160DF60DWC5C1+7B2O/CGa+DGXCCWjECWjFCWzFDW3KC2/KDXTQC3XRDHbRDXfUDHfUDXjVD3zZDn/cDoDeD4LeD4LfD4ThEIXiEIflEYnmEYrnEY3pEozqEY3qEY7rEY7sEpPwE5TxE5byE5XzFJb0FJj1FP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAfCgH+Cg4SFhoeIiA4eKjUnGAyJfwUmPkFDQT45MRkDhwc2RUYApKQ8MSQEhi5FSABMTK+xOi8VhRBAR7KxsLE0KAuEJUNJr6WksTcrEoQzRUpLx6VEOCwahDfES9vcS0lCyhyEMLnbANwARz+/FoQhO63m0UhFtCMRhA0yPUVHxRQAivCQgaJDgkIiZOj4EXAIwxgpQDwwZIDECxo3cNyg8QIFiAkCDg2ogGJFixUoRnR4EECSAgkbPlyIgECSzZs2AwEAOw==");
}
.night .dfrmr input[value="9"] + img,
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/unsure.gif"] {
    content: url("data:image/gif;base64,R0lGODlhEwATAMYIAEM0EP/mIv7kIeHn7f3iIf/9+nRjOPLRG/////ncH8bFwPrdH7i1qWpXKOvFF/bYHfjbHuCzEfreH8XFv/DNGue/FfTUHIh7WmZSIdnd4LWxpOK3EtSpEF9KFtre4eO4E9SfC2FHCO/MGevGF7Sworu5rol9XHlpQdnd4bm3q5OJbHhnPt+xEffZHmRMCZSJbWJJCNjc32NJCPfYHebHGq2MEMWnFdqpDu3JGH1dCH9hC66DCuC/GPDOGqh6B3VlOreRD8KkFdqqDsSPCIJnDbuYEbGIDNelDH9cB7mKCal7CNSgC7yOCu3IGOzHGHtYB7GJDJ50CKJ5CuO5E9elDcGhFMSSCndmPLKUEohsDejAFdWhC86sFdGyFuS6FIZoC926FseXC6t8B+K2ErqUD39eCfHPGv7lIv///////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFZAB/ACwAAAAAEwATAAAHwoB/goOEhYaHiIhEWF0iXDU6iX8uQQ8QCRAPBw5AMocuNAsEAAACpBYOHDCGNhKmBQUAsAAHFVCFWTOjBQgIsr0ATRFlhFUJr6SyyRQfO4Q8C2fKpLGkZl5hhBTHAcneCcxbhGAtBAHn6AEELTgRVoRFB67pAQISB1pCSoRfIxaiAgISWGBhRIQlSAqRcXDAEiZNDsZQEWNIBocKTkT0IFUhwpEhIQ7BMMJiw5QNLG6A8BEyUQ4pTEAkifJEks2bNgMBACH5BAXIAH8ALAYABQAHAAQAAAcQgAAICIKEg4aDAIKKi42CgQAh+QQFZAB/ACwGAAUABwAEAAAHEYB/BQWChIR/goiEAIkAi42BACH5BAUFAH8ALAQABAALAAYAAAclgH+CAgJ/BAuCiQGLiwISioyMBDOCkYwCCX8AmpWbgp6WAYV/gQAh+QQBAQB/ACwEAAQACwAGAAAHJoB/ggAAf4SCiAAFBYqMiQUICIqRhYaMhJeFZ38Fg52CZoOEo5WBADs=");
}
.night .dfrmr input[value="10"] + img,
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/cool.gif"] {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZQAEM0EGBGCGJHCGFICGJICGNJCGNLCWlOCWxTCn1aB35bB4BeCYFfCX9iC4NoDYlqDI9sDIxwDqh6B6t9CJyCE7CECrCIDKyKELGJDLCSEraRD8OOCMaTCsiUCr2aEsmZDMuaDMihEMGjFdKfC9SgC9WhC9elDNOoEMyqFdqqDtCvFtS1F+CzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGeXGGuvFF+vGF+zGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/TUHPTVHPbXHffYHffZHvjbHvncH/rdH/reH/ziIf3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAe+gH+Cg4SFhoeIiA4ZKjkoFw2JfwYiQ0ZHRkM/NhoEhwg1SUpMpEpIQTYnBYYrSUxPsLBMST8zFoURRUsAvABPvQA6LAyEFMBQvci9EIQ0SU7Av709MB+EPEdMvbG9Oy4jhDK6seRLRMIchB5AruRPs7UpE4QPOEJJS0xNTEtJQQAsSCgoFOLGjyJHkhwp8gNACxMSDB04MUPHDh87eLEwsUHAoQEYWLyI8YJFChISAkhaUAFEiQ4TEkiaSXNmIAA7");
}

.night .dfrmr input[value="11"] + img {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZgAEM0EEc4EEw8EVVFEmBGCGJHCGFICGJICGNJCGNLCWlOCWxTCn1aB35bB4BeCYFfCX9iC4NoDYlqDIFuFoxwDpB8F5J9F6h6B6t9CLCECrCIDKyKELGJDKeSGrCSEraRD8OOCMaTCsiUCrGcGr2aEsmZDMuaDMihEMGjFdKfC8OkFdSgC9WhC9elDNOoEMyqFdqqDtCvFsiyHdS1F8+3HeCzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGd7HH+XGGuvFF+vGF+TIHezGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/PUHfTUHPTVHPTXHvbXHffYHffZHvbaH/PbIfjbHvTcIfncH/rdH/reH/jgIfziIf3iIf7kIf/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAfOgH+Cg4SFhoeIiBEeMUQvGxCJfwkoUFVXVVBKQB8Hhws/WVtdpFtYTUAuCIYzWV1fX1o+X11ZSjwahRRSXLBfVgIyX1xRRTUPhCpXr7BWAAAdXVdGNxmEPVleX8/cABNPSDklhEfL293PFtQphDu8590VTMYhhCRLrs0AASO2PDAYCEkY4iQLly5UBtDI0iRIjRUNCp0IokTKlSlCpGyy0eKCIQUueBQxksRIER41WoAocMgAhxo4dOCoAWPFBQKSHGQwwUIEBgaSggoNGggAOw==");
}
.night .dfrmr input[value="12"] + img {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZpAF8SAGMTAGgTAGsUAGkVAHQYAHQaAIcaAI0bAJocAJwdAKIfAKMiAKkiAKcjAKIlAKMpAKopALomAKktAMAmAL0sALouAMYrAMYxANMtANgsANUtAL05AN0wALs7AMQ5AN8xAMY7AOA0ANw2ANU5AOU3AOg4AOg5ANY/AOo6ANVDAOw8AO09AO49APA/AOlCAPFBAOhEAOVFAPNBAOpEAPRCAPZEAPdFAONOAPtIAPxJAPRMAP1KAPpMAP9MAP9OAv9RBP9RBf9TAvpVAP9TBv9UBv9WCP9WCf5ZAP9YCv9ZC/9bAP9bDP9cDf9dDv9fEP9gCf9hEv9iE/9kEP9kFP9lFf9mFv9nF/9oF/9oGf9pGf9qGP9qGv9rGv9sHP9uHP9uHf9vHf9vH/9wHv9wH/9xIP9yIv9zIf9zIv///////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAexgH+Cg4SFhoeIiYqFBig9MRCDEzI0FgSMQlVUT0whACpUVEw8IwKEH1ZjY15aVxxDYGBVRTAMhDtaZWZlZGJLHmFlWEc1F4RAVmJnaMxoOFBgVEEuGYQvTVljZc1IU1dKOSYUhBE+TVdfZbxbVUo8LB0IhRg6SVRdX1xSRjkrIAuHHtgg4iSKkyA3Tmw4kKgACR4/eMwoIWHAogAVWqQQ0WARIQcaFHgslGCkyZMoEQUCADs=");
}
.night .dfrmr input[value="13"] + img {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZwAEM0EGUwAGcxAGcyAHY3AHo5AHk8AGBHE4A/AIFAAIZAAGZKEYhCAI9EAI9GAJBGAIpKAJdJAJdKAJNMAHZWFZpOAHhYFZtWAKlUAKFZALBVAKlYAIpjF7pZAI5mFqthAJBoF7leALtgAJVrGLpiAJ5sE7trAKJyGKR0GNRoANVqANZqANxtANNzAM14ANx1AL1+E9x3AOR2ALiDG9h/AOh8AOp8AL+HHOSBAO2BAO6BAPCCAPCDAPOGAPSHAPSIAPaJAO2NAPeLAPmNAPmOAPyRAPuSAP+UAP+VAv+WAv+XA/6YAPuZAP+YA+SgH/+aBf+bBv6cAP+cCP+cCeeiIP+dCf+eC/+fC/+gDP+gDf+hDv+kEP+kEv+lEf+lE/+nFP+nFf+oFP+pFv+pF/+qF/+qGf+rGf+uHP+uHf+vH/+wHv+wH/+xIP+xIv+yIf+yIv///////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAfUgH+Cg4SFhoeIiRdBTzgTiYQuYWRhWUckkH8mZWpsamVaRRuJEGNpbSAAJ2NVQgmHA0xnbm8HABRnXkoxAYYfZmxvbxwAI2xmV0MVhlFobcIzADdtaFxIL4UZYmvCb1QATm9rYlI9DoQ0wN1vFsLHVkAhhEtj3OvCa2NTPyqERltm0KRJ4wEACjRmtiTRsYJQCyVYunwBU2IBjC5YlPiQ0YEQghxEjjR5AuVJkyNEeMhIUaCQARE1cuzgsSOHDRksNBBAJIDBAwkYIjRQICCT0aOHAgEAOw==");
}
.night .dfrmr input[value="14"] + img {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZuAABDVQFFVwJIWwBPZgBRaABSagdUaQBWbghUaQBXcABbdQBbdgBeeAtdcwxedQBhfgBifQ1gdw5jew5kfABohw9lfQ9ogBJshQBxkQBxkgB0lhB0kAB6nQB/owCApACApRp9mQCGrQCHrgCIsByCnwaMswCPugCQuQWPtwCSvR2MqwCUwA2TugOXwyORsQ2XwAuawwicyCSVtSSXtyWXtwyeyCCavB2dwRagyCecvRyhxxajzBGl0SegwhOn0xun0RWp1Raq1her1yeozBis2Cyoyyipzh+s1S6rzxyw3B6y3SK24iC34iS34SG44zK13CO65Si55CS75im96SnA6yrB7C3B7SvC7TfA5y3E7y7F8DLG8jjG7zHI8zLJ9DfI8TvI8TTL9jXM9zzL9TjM+DbN+D3N9z7P+TrR/DvS/T7S/jzT/j7U/0DU/////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAfcgH+Cg4SFhoeIiBgsP1I7JRSJfwc4W2FiYVtVTCgFhwxRZWg9EgYTQ1lMNZ6FR2RrLgAIDQABRldJIYUcXmlnAg5nbTIAFl1QPA+EOGJqWBc5bW1FABViU0AdhE1lbNLSYxEAM2VUQieEU83fYA4AJGrXQCmESr3fxDRtacc8IoQvrLyShgSEmTVlcMXQQAiDEy1l0qjh8uRLmSxLeKRYUAjGkitexKgAYOMKEx8tMhhKUCMJlCk3NuhIwqPFhwGHCIjgEYRIEB4xUmTAmQiCBxMrRmhQIKmp06aBAAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/happy.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZUAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfQgH+Cg4SFhoeIiX8GFi5CQSgUBIp/EEZLTU1LSUQ4DIkkS05QUVFQTktHPBiHHExPUlOyU1JPTEU6EYUISE5SAACzwE5KPywFhBlLUMFTwc0AS0M0D4QzTVGz2lNRTUU2HoRA2Nuz3d8ihD3L5bJQ0jUghCtKvuVSxD8xGoQVRa+xZtW6pSOFA0IHdhxZAoCUKSdMVL0IMaDQBB5EkgDTxImHjBINDm3I4WNIkSJDfuRoUUJCIgUqaNy4QQPGiQ8JKAl40MHEiAsLAlAaSlRRIAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/tongue.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZWAEM0EP8CAGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCf9tZ7SNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfPgH+Cg4SFhoeIiX8HFzBEQyoVBYp/EUhNT09NS0Y6DYkmTVBSU1NSUE1JPhqHHk5RALFVsQBORzwShQlKUABVv8BUAExBLgaEG01SwMxVUk1FNhCENU9TzcBTT0c4IIRC1ti/2twkhD9NsthSsTcihC1MUMK09cQzHIQWR69UsxkAa91a8YAQgh5JRLELwBCAqhgjCBSi4MPIEkwAAgAw4oPGCQeHOuwAUuTIEQBBdrw4MSHRAhY2cuSwISNFCAWUBkD4gKIEBgYCKAkdqigQADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/laugh.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZWAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv/ylP/zlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfZgH+Cg4SFhoeIiX8GFi5CQSgUBIp/EEZLTU1LSUQ4DIkkS05QUVFQAABHPBiHHExPqABTU1KwRToRhQhITlJTVVW/VVJOSj8sBYQZS1BTVqhTqFZQS0M0D4QzTVFVz7LSVE1FNh6EQNvdVlbO6uHjIoQ9zMLBwFXUQzUghCtKvbMAaRX7EUMDoQpFXvkCWIvJrRQOCB3YcUQUKVNOmKh6EWJAoQk8iCTBpIkTDxklGhzakMPHkCKofuRoUUJCIgUqaNy4QQPGiQ8JKAl40MHEiAsLAlBaylRRIAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/rolleyes.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAKUnAKaafLmNDMinFe7MGeW8FfjbHtuuENvXy6h9CW1TCf7lInZjNYxpCXtoPKqNEqaEDvHPGs6aCmVQHWJMF86dC/zhIKughJaIZfn49vbXHeHd0tnUx96xEOS6FGpNCNOxFuvGF9WhC+K3EtmnDZtxB0M0EP/mIv////rdH/7kIenCFuXi2e3r5fj39GlUH515DKicf3lnOvLRG31rQJpvB9/b0d3ZzvPUHb+RC+fEGNi3F+/RHJJyDLCTEunHGf///yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFCgA/ACwAAAAAFAAUAAAGvMCfcEgsGo/I5C/h+AwGgodH+XvtCihUIQMh8JKCQqmkUKTGMlXg2BOfTiVT6V3qvoqJ2/wN58NBBglEDm5jfYYlAyJ3QzooCmNjcpEoEB04RD6PkyadYwqVHRREOQUpnaioKQWKEUQfGRUKqZ0KFRkgHGtDDxBis6i2YgQjJEQJKr4lKWUpFWIqHBFTRA/JGZGR0SHGRgEEIAMQEAMgBAYhCEkMBiIEBCIcIxEMVB4vOCEhATTUVP8AkQQBACH5BAUFAD8ALAYABwAIAAEAAAYHwFNpeBKWggAh+QQFBQA/ACwGAAUACAAEAAAGEsBS6UcUFofH3+lEVC6ZxOUvCAAh+QQFyAA/ACwGAAYACAABAAAGB8BS6TQUnoIAIfkEBQoAPwAsBAAEAAsABgAABiXA36+SEg4LxorCZPqZFBWkkkl9VjKpajVVKP1KXiH4K2Qazb8gACH5BAEBAD8ALAQABAALAAYAAAYfwN+vVBIOi8LS6VRUMofLpVOqJDKZVYVxK0QlkUdhEAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/sveta.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAWAMZzAPnbH/jbHv/lIvHPGvzhIO3q5OnCFv7lIqWYenNgMt/b0QAAAPrdH/n49tvXy/3iIebj2vLRG/bXHfj39GJMF/7kIdWhC+W8FOvGF3xqPtnUx//ylGVQHe/MGfDOGvreH5eJZuK3EqmegdjTxtKyFs6bC6uNEc6ZCevKGu/NGvXWHZluB5pvB66REsaoFu/RHHFYC82qFKWCDax8B555C+S6FGhSHZmLaZRzDGlUHaebfqSYea2PEmhSHKaFD2tOB5aIZdGbCntpPd6vELiQDs6cC/j49XdkNqWZe2tRCe3MG92vELeQDuS9FmFLF6aafOXi2Zt/EKmHD9rVye3KGWtPCMCSC9ezFpx1Ctm5GPTVHW5UCnhlOJFuCtyvENmnDb2MCXpoO//yk29UCefAFt+yEd6wEGpVH4tlB2hMCOa8FOS6E9WiDL2QC9SfC6mdgP/zlEM0EP/mIv///wAA//8AAP///////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQJDAB/ACwAAAAAFAAWAAAH44B/goOEhYaHiIl/WyYkKVQxPkmKf1EvAQwMASoeTTiJLgFxowejcREGRIctAA8CcHBycBsPAAMXNIUwWgQCc6Nyo3MEEhheVYQ8ABVwv3HBcXNiAR0hWIRZHwfNc3Ny3XMbDANrVoRK2rKw6nAH4zVFhCjLcvX29RXUISWEVxK99+oJIIbBDBhCUga0EiCnjkMBtQao+cKC0BgyEQAQcMgxAKohQX4UkmHAA8cFHA2UsbDiEJMLDunIdLjEwoxEXerQqYNy5wk0lHZy1JmG0h86KB0uoGP0KFNBMps6lflUqtFAACH5BAEMAH8ALAAAAAAUABYAAAfcgH+Cg4SFhoeIiX9bJiQpVDE+SYp/US8BDAwBKh5NOIkuAXGjB6NxEQZEhy0ADwJwcHJwGw8AAxc0hTBaBAJzo3KjcwQSGF5VhDwAFXC/ccFxc2IBHSFYhFkfB81zc3LdcxsMA2tWhErasrDqcAfjNUWEKMty9XX39RXUISWEVxK95NwbKIAYBjNgCEkZ0GrggoG21HxhQWgMmQgA7tHZeA/VkCA/Cskw4KEOnToPTxooY2HFISYXTg40ucTCjERd6Dy8t4DOCTSUNrZh42ZjGkqCNipFyrSp06aBAAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/devil.gif"] {
    content: url("data:image/gif;base64,R0lGODlhGQAXAMZeAB0AAEEBAUsAAFMAAF0AAGYAAEcMEFgIB0kNDHcBAGsHCYUBAEAXE4sDA0gYGIwGA5IGBV4WF4gND20VFH0REVIgIZoMCnMXGGkbGWobHqsJB5MQFaYMDmUfH2oeHqcOCaUPEJ8REJEWGK0PEJsWF6wTFVosLqQaGnQqK1w0NbYcHrocGVs3OZEoJZomJ68hH5EsMKQoKJQuLLQlJ8QhIr4jIa8pKsYjJns7O5kzM8onKscpKm9DQsorMMctK7sxL5s8OL0yN5ZAP8wzM8A4OrY8O6ZCQMU9PblCPtM7Os09PM8+O8hCQ6ZMS6pLSZZRVJ9QTNNCRdBEQ9VDRo5YVqpSUdVJStBMSpNgXdROT6xaXNVRTcdWWNdTUf///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAZABcAAAf+gH+Cg4SFhoeIiYqLjH80iBqNfzUDiAKRjDeVhwIchRmHOzsHCgQCAgOmIx+FMKCFPrGyPjUqJSUjhTEbGLBDv789OjUruA6DMTYQEIQyShXQS0u/0BUgBX8mSEUoQYQXR1Pi0FHPFcMlFgGCWhGFOVJWWVnQ4xU7NCvXg08XhEVXtmzp0iWLlSlJhvS4oW8BC0FNJgzywOQKNIJdDkrzAW1EAwaCuDjx98fDEYteqqmskBLEA5CChLz6A5BlSi84b6YMsSDFoCa9BMlgYtMmzqIWsA0yEvTPBCJEdR7d+WDdTxyEWgQ5Ai1nygonkgIgBIUKoQ4ufvxYCdZCgkIoXMwesjGj7osTJyAQEBTDiRYgVRIdoCDiBAkJBawS4oGFEQIDkv4EAgA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/blink.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMYCAP/mIkM0EP////jbHvzhIPHPGvrdH/7kIf/lIv7lIvnbH6KYfGVQHf3iIeTl493d2O/y9O/MGenCFu7x8vDOGvLRG+vGF/bXHZKFY+K3EnhnPF9JFOW8FNjY0aOZfnVjNvXWHWJNGdHPxeW7FKGWeua8FOS6FNTSydWhC3dmOp52Cu/y82pQCdLQx5txB+S8FnppP6SDD6aCDdi3F96vENTTytinDWZQHOnHGcKkFXtqQPPUHd6wEJJyDKWbgZpvB5+VeGlUIG9UCaiGD9mnDdmsEL6QC7uKCdXUzJOGZduuENCbCtfWz3hmO2hLCGdTHqeehK19B9OwFW1QCHNhM62PEqJ8C7CTEs2aC86dC+fEGM2qFOa/Fm9WCrSNDraPDs6ZCYlkB6eKEd+yEWxOB8CSC96xEKGXe+vFF72MCWlNCJtwB49tCtDOxGlVIO/RHNKyFpp+EOK3E+7MGuzJGd2vEGxTCnJfMdWiDNSfC9jX0P///////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFyAB/ACwAAAAAFAAUAAAH0YB/goOEhYaHiIl/dmJwc3RbMSyKf3FvAwYGAyAULz2JOQMEBwkJBwQDFRJeh1cKDQGxAAAIDQoFJVaFXTsEAQLAAQCxARcWSlOEVQO/wMHOAREZKoQzBs3PzQEFJmWEONfOz8HcWYRaAwfYwsQDEXJYhFIXBAjEs7QExmZphEMFrxDgo2ULFxEXhIRwqSCKlCkCClTRWEKmkAwJFEBguhaAgoQxKNYc+sIBTYQCBSJY4FAHRZREbIpkGDEiAw8bYMJQUqPCCJ48R344oUS0qKJAACH5BAUKAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAVkAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BACH5BAUBAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAUBAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BACH5BAUBAH8ALAQABQALAAcAAActgH9/CAAAgoeChIWGAAgEfweLkgAHAwkBmAEAAX+YBgmTiwkGf5OllIeLiIKBACH5BAFkAH8ALAQABQALAAcAAAckgH9/AYSChoIBAooBg4WJiouQhJACiX+Lj5KSg5uEjIiFh3+BADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/dry.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZUAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfNgH+Cg4SFhoeIiX8GFi5CQSgUBIp/EEZLTU1LSUQ4DIkkS05QUVFQTktHPBiHHExPUlOyU1JPTEU6EYUISE6xs7JSTko/LAWEGUtQAMwAU80AS0M0D4QzTVHOs9pRTUU2HoRA2MDA3d8ihD3K5bNQ0jUghCtKvu3CxDEahBVFr7/BbOFK4YDQgR1HljArdYqJqhchBhSawINIEoXROPGQUaLBoQ05fAwpUmTIjxwtSkhIpEAFjRs3aMA48SEBJQEPOpgYcWFBAEpAgyoKBAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/mellow.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZUAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfPgH+Cg4SFhoeIiX8GFi5CQSgUBIp/EEZLTU1LSUQ4DIkkS05QUVFQTktHPBiHHExPUlOyU1JPTEU6EYUISE6xALMAUk5KPywFhBlLULLAzVNQS0M0D4QzTVHPz1FNRTYehEDYs+RT3N4ihD3L5bPRQzUghCtKvu3DxTEahBVFr7Gzat3SkcIBoQM7jogiZcoJE1UvQgwoNIEHkSRLAGjkxENGiQaHNuTwMaRIkSE/crQoISGRAhU0btygAePEhwSUBDzoYGLEhQUBKAkdqigQADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/huh.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZWAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv/ylP/zlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfZgH+Cg4SFhoeIiX8GFi5CQSgUBIp/EEZLTU1LSUQ4DIkkS05QUVFQAABHPBiHHExPqABTU1KwRToRhQhITlJTVVW/VVJOSj8sBYQZS1BTVqhTqFZQS0M0D4QzTVFVz7LSVE1FNh6EQNvdVlbO6uHjIoQ9zMLBwFXUQzUghCtKvbMAaRX7EUMDoQpFXvkCWIvJrRQOCB3YcUQUKVNOmKh6EWJAoQk8iCTBpIkTDxklGhzakMPHkCKofuRoUUJCIgUqaNy4QQPGiQ8JKAl40MHEiAsLAlBaylRRIAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/ohmy.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZVAEM0EP8CAGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfPgH+Cg4SFhoeIiX8HFy9DQikVBYp/EUdMTk5MSkU5DYklTAAAUlJRo0g9GYcdTQBTVLFUU1AARjsShQlJT7AAsq9PS0AtBoQaTFGxv8tUUUxENRCENE5Szc1STkY3H4RB1rLiVNrcI4Q+yeOyz0Q2IYQsS73rU8JAMhuEFkZNUL6jAEBpckvFA0IIeCBh8uRUwCapYIggUIhCjyJKRAUIAKBIjxkmHBzioOMHkYAAdLgwMSHRghU1cOCoEQMFCAWUBkDwcIIEBgYCKAkdqigQADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/sleep.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZVAEQuAEM0EGhLCGlNCGxOB2pQCW1QCGxTCm9UCW9WColkB49tCppvB5JyDJtwB5txB552Cpp+EKJ8C619B6aCDaSDD6iGD6eKEbuKCbSNDq2PEr2MCbaPDrCTEr6QC8CSC86ZCc2aC9CbCs6dC9SfC8KkFdWhC9WiDNinDc2qFNmnDdmsENOwFduuEN2vENKyFt6vEN6wEN6xEN+yEdi3F+K3EuK3E+S6FOW7FOS8FuW8FOa8FOa/FunCFufEGOvFF+vGF+nHGezJGe7MGu/MGfDOGvHPGu/RHPLRG/PUHfXWHfbXHfjbHvnbH/rdH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfOgH+Cg4SFhoeIiX8HFy9DQikVBYp/EUdMTk5MSkU5DYklTE9RUlJRT0xIPRmHHU1QU1SyVFNQTUY7EoUJSU+xs7JTT0tALQaEGkxRAbLMzFQBTEQ1EIQ0TlLQz9pSTkY3H4RB2MDA3d8jhD7K5bNR0jYhhCxLvu3CxDIbhBZGr7/BbOFS8YAQAh5IRJEy9aSJKhgiCBSi0KOIEkyalADoMcOEg0McdPwgYsQIEQA6XJiYkGjBiho4cNSIgQKEAkoDIHg4QQIDAwGUggpVFAgAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/wub.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFgAdAOeAAPd/g/mChfuHifBudv2Mjf2LjP8zM/iAg/6NjUMQIKJ6hd3U2u/w9eTf5e5qc+hcaWUdLfyJipJibu7v8+JNXXg7SV8UJdjO1GIZKetibaF4g3c5R50dMvd+gtHCyeRSYfFxeHU1RKN8h+RUYvV4ftTGzeVVY91DVuRSYvV5fsApQI8cMOhocd1CVdg4TqwXMLYxRNjN09MtRaQxQdddZ9UwSNNTX74pQJsTK5IjNM0nQaYsPsFQW+phbNtDVmkhMWkhMHs/TXo+TL0hOqIkOHg6SGkMH28TJO50eWoQItTHzu/w9NhBVONYZaczQ7shOdg3TaeCjJsVLOtoceJNXpoULM4uRXIxP/BtdWYcLOthbcwrQ+9tdaY7SG0NINUvR6V/imcfLtfM0mwKHu1sdOVaZ5NkcKw/TM1PW7BDT28XJ9AoQokQJt5EV9XJz9FaY593grMxQ6F5hHMzQWwVJd9GWOZlbtLEy9DByJk0QdQuR2gKHfJ3fEM0EP6Oju9KSv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFMgD/ACwAAAAAFgAdAAAI/gD/CRxIsKDBgwgTEvzzj6HCggz/SJSIMOLBiRUnOoSY0MBEAw8tDvQIUqDFjQ0pEiy5UOVAlAphcnxIkyadLm/ITEEzI0nNPEg6BAjQgQSXJjke8gAgoE8fAk4BgHgQJ2GaAxH6AAKkleuBASaIHFTDp2lXp1v7pMjgw4vBMwAKoOV6FoADChwM0ggAdStXv30CDPigwiALvn6cKnZKQPAHKwbtxPVDuTLlAnapbDFoI4UABJYpI2iaoc0Qg04GYAVdGUGEA31MuJBi8EgZEEwLECBQQADsByfWjDm44wEWEgCGAnD6oM4XHAlhjOjhYMAAB1pGtNDz4uEKJhRQF6CgcAKKDjY1jXC4UUPGkyp7asqfjzAgACH5BAVeAf8ALAcADQAJAAYAAAghAP/9S5BgYEGBBxMOBISQoUGHCSAm6NNnIMWBBglq/BcQACH5BAUyAP8ALAcADQAJAAYAAAgeAP/969NnYEGBBxMaRJiQIEOGgAANjDjQIMGL/wICACH5BAUFAP8ALAYADQALAAYAAAgsAP8JLEDgXwEBAhMi8MPQD4IIChs2RIDwn0SJBf710dinj5+OGzdavOhHYEAAIfkEAQEA/wAsBgANAAsABgAACCgA/wns0+cfQYEI+wACpJBhwoYEFxY0CBHiPwL/FjLU+C/AQIIgJwYEADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/angry.gif"] {
    content: url("data:image/gif;base64,R0lGODlhEwATAMZPAEM0EGBGCGJHCGFICGJICGNJCGNLCWlOCWxTCn1aB35bB4BeCYFfCX9iC4NoDYlqDIxwDqh6B6t9CLCECrCIDKyKELGJDLCSEraRD8OOCMaTCsiUCr2aEsmZDMuaDMihEMGjFdKfC8OkFdSgC9WhC9elDNOoEMyqFdqqDtCvFtS1F+CzEeK2EuO4E+O5E+S6FOW7FOG+F+jAFeTDGeXGGuvFF+vGF+zGGOvJGe3JGPDNGvDOGvHPGvHPG/LRG/PSG/TUHPTVHPbXHffYHffZHvjbHvncH/rdH/reH/ziIf3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAATABMAAAe+gH+Cg4SFhoeIiA4XKTgnFQ2JfwYgQkVGRUI+NRgEhwg0SElLpElHQDUmBYYqSEtOsLBLSD4yFIUQREoAALGwvDkrDIQiRq9Ovb9LRjotE4QzSE2/vbxMRzwvHYQ7xtTIAMvNIYQxur6xSkPBGoQcP67os7UoEoQPN0FIu7y8QDYrRigo9MGGDwBGkBghcpBFiQiGDpiQkUNHDx05ZKwokUHAoQEWVriA4WIFihERAkhaMMEDiQ0SEkiaSXNmIAA7");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/sad.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZSAEM0EGhMCGpOCGtOB2tPCGtRCW5UCm9UCXFYC4tlB5FuCphuB5luB5pvB5RzDJx1Cp55C5t/EKx8B6WCDaaFD6mHD7qJCauNEa2PEr2MCa6REreQDriQDr2QC8CSC86ZCc6bC9GbCs6cC9SfC9WhC9WiDMaoFtinDc2qFNmnDdmsENyvEN2vENKyFt6vEN6wENezFt+yEdm5GOK3EuS6E+S6FOW8FOa8FOS9FufAFunCFuvFF+vGF+vKGu3KGe3MG+/MGe/NGvDOGvHPGu/RHPLRG/TVHfXWHfbXHfjbHvnbH/reH/zhIP3iIf7kIf7lIv/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfIgH+Cg4SFhoeIiX8GFy1BPigUBYp/EUQAmJhCOA6JJkkAUlKho0U6HIcaSqSjoqNDNhCFCEZMrLdIPCsEhBirrq2uAEAzD4QyS6zBogBDNB6EP8mjodXVQzUihD2/mK3ewzMghDBItplRmQC5LxmEFUNKTVBR9VFQTUpDNykNhAc5iihh4uTJEydMkphyEWJAoQk6hBwBhemIEB0xSDA4tMHGjmZDgACwwYKEhEQKVMyoUWPGixMfElAS8KBDiREWFgSgxLOnokAAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/wacko.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZ6APrdH/HPGv7kIf7lIvzhIO/y9GVQHe/MGd3d2P/lIqKYfPnbH+Tl4+nCFvXWHe7x8uK3EpKFY/bXHXhnPPDOGv3iIfLRG+vGF+W8FOa8FKOZftjY0dWhC3VjNmJNGXdmOuW7FF9JFNTSydHPxaGWep52CuS6FGZQHJtwB4lkB9+yEe7MGo9tCppvB86ZCaGXe76QC6J8C96xEOzJGbSNDnppP8KkFdjX0O/RHKeKEdXUzN6wEOfEGJJyDNmnDXhmO2lVIOvFF9msENuuENfWz2lNCNOwFZ+VeGxOB9i3F5OGZaSDD2dTHr2MCXNhM/PUHW9WCtCbCntqQGpQCc2qFKeehM2aC62PEtLQx9SfC9KyFmlUIKiGD9WiDGxTCqWbgc6dC92vEG9UCeK3E8CSC6aCDbaPDrCTEtinDea/Fu/y85txB7uKCZp+EN6vEK19B3JfMW1QCNDOxOS8FmhLCOnHGdTTyvjbHv/mIkM0EP///////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQFAQB/ACwAAAAAFAAUAAAH1oB/goOEhYaHiIl/XjlaKzNUS1OKf204dwAAdw4Ucz2JNncEAgMDAgR3Fg00h2cLFXmxeLF5CwEZMYVQTwR5er++erESF0NxhFd3AsG/zXl3BxAlhEkAA7HAzgABJmSEddazsrQD2yZghDzKeOzt7ALQY1aERhIECe7sCQTEMk2EXAK8SiALT4IKtjL4WENITBoLd/KQkhhLlZsoSAqVaUDBASYAeTg1UMEBxSEzGIIcCBDgwAUMYTi8ScRCCAQQICDsQOMiBaUiJWB0ycKmBR1KSJMqCgQAIfkEBQEAfwAsBgAGAAcAAwAABw2Af4KCeXqDh3p5h3+BACH5BAUBAH8ALAcABgAFAAMAAAcLgH+CeXqChnp5hoEAIfkEBQEAfwAsCAAGAAMAAwAABweAenmChIOBACH5BAUBAH8ALAgABgADAAMAAAcIgHl5eoSEgoEAIfkEBQEAfwAsBwAGAAUAAwAABwuAeXp/hIWGf3p5gQAh+QQFAQB/ACwGAAYABwADAAAHDIB5en+EhYaHhHp5gQAh+QQBAQB/ACwGAAYABwADAAAHDYB6f4OEeYSDhod/eoEAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/ph34r.gif"] {
    content: url("data:image/gif;base64,R0lGODlhFAAUAMZFAAkJCQsLCwwMDBERERMTExUVFRcXFxgYGBkZGRoaGhsbGxwcHB4eHiAgICEhISIiIiMjIycnJygoKCkpKSoqKisrKy0tLS8vLzAwMDExMTIyMjMzMzU1NUM0EDc3Nzg4ODo6Ojs7Ozw8PD09PT8/P0BAQEFBQUJCQkNDQ0REREVFRUdHR0lJSUtLS0xMTE1NTU5OTmlNCGxOB21QCGxTCt6xEOK3E+S6FOa8FOvGF+/MGfHPGvbXHfjbHvnbH/rdH/zhIP3iIf7kIf/lIv/mIv///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAAUABQAAAfXgH+Cg4SFhoeIiX80DBgkIxYKAYp/ByYrLCwrKSUeBYkTKy0uLy8uLSsnIA2HDiukMLEwpiudCIUCKC0vsrIvLSoiGDOEDStCHclEy8kdPTocBoQbPx1F1x1E1tg7NxCEItVF1tnk490ThCA92+Pa1+M6NhGEFzxAzcvayTw5NayDFpTwEWSIPiJDgvjYgcPCp0ECPpwQRcoUKlUZJMgopABEiRSYNHECoYHCw0IOPIQgUaIECREeMFBIkIjABQ4ePHDIYCHCAEoxDDyoQKFBAQCUkipVFAgAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/banned.gif"] {
    content: url("data:image/gif;base64,R0lGODlhOgA0AMZbAAAAAAEBAQICAg4ODgIaMhsbGykpKQIyYkIyEkM0EDc3N0VFRWpKCFJSUgJiympSCpdLM3JaCmBgYIJiCopiAqdXO25ubppqApduCIpyEppyCrdnQ3t7e6p6AqKCCqqCCjKa/omJibqKCrKSCtODU7qSCsKSCpaWlsqaCs6bCtKaCtKiCqSkpNqiCtmnDdqqEtuuENKyEt6wEP6iQtqyErKysuKyEuC3E9q6GuK6Etm9EeS6FOW8FeLCEsDAwOrCEunCFprK/uPHG+vGF+rKGvLKGu/MGvHPGs3NzfLRG/LSGvXWHfjbHsjY8v7aGvfbL/reH9vb2/zhIP7iIv7kIf/lIv/mIv/lOf/vQ/7+Av//AP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAA6ADQAAAf+gH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaEAZmZl5yGARAVGwGdpIIBG6ijpZ0BFSSiq4MAs7Szmre4ubq7tbWJAFHBwsPExcbHyMEAv8nNzs9Ry4jA0NXW0czX2s3Sh9RRPhbiJz7bziwWUejl3YbfFgAKCgMALObJCwZREgA12NPCGlBjASAdEhYIg9XwgbDcQYb2FCYMBtHAgigKqLUr9M2AgihIBPqoMaCAAQAcohQAUGDAgCghZp1MuSAeAAkwARigl86jsmzRal20sABJNAtIAAwFxs9fQXj++CEZcDHmiaM/AUapgXJrzRosFmRESdCehJfyQKI8WetEPXX+ANhF3EiImtuI/AguYMGhXl+jaQfgLKsUoYUQ8ILxA/cxq7dg8CRY4KeAoIUT9JCcDSY4acq/O0/A4+D28ICPooXRlaVYnjwOSJAsON2ggA8JODGGqKHAX4iPNWYrSLnP5IJ0Ei46dnev+bDVgr45vwf9j/Tp26pfx35NO3fqv3rZ2kW+/C3xtGKZgrCBhCr1lU6lMiSgvv378D2hgjWovoP/ADpwwID15TdIAK9U8J4AAfrnQH0DEmjgHwhuoKAgDP5HYBb1zSBAhAQQIICBFcLyIYH2ZZEFCh7aF6KI+VV44YkCgBDEjfeBoOODIY4IX4mj2AfCfUTa92CBP5L+UMGFf9g3YIARHtAjkj+yB8GCEB6AQIQIvGgfiZm88l4ESiTQRAII2JemAAkM8QIDJGpxRSua/JEBE2YmkIAVe+p5phE3TEDiFUJkIucoOECRp5965nnEDiaQqIMOmQhB6R9EOGFmE5x2ymkCj6JAYQDVUaIJBFeqkukUjbaqJxNG2CBqdOrJx+QfMSghRRVTTGHFr1ZUIcUSQ9AggimkxlLhlYN8UAQTu/YqrRRMHJFDCxdQiAUWpU5yCqrvPdBDEtBSUUUVVFCbBBAvqABnAFg8oUO3keBCiAc/HLEEno0eAQQNK2RLoaWXTjjICDwMAeoRRigswwodYLKJwYQgYADDDTnkYAMNLqRAAcWNMKBBCSuoIMIFcIKs8sqOBAIAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/antifeminism.gif"] {
    content: url("data:image/gif;base64,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");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/censored.gif"] {
    content: url("data:image/gif;base64,R0lGODlhIgASAKU6AAAAAEMXEGgVCGkWCG0XCGoZCWwcCm8dCpocB54iCpImDKInC7smCZowEKQvD74qC7QvDsAsC6c1Ec0sC604Es4vC9QuC7A5EtUwDMJCFds7EM1CFOJBEuJCE9JIFuRFFOZFFNhKF+RHFulLFudPGOtOF+lRGexSGe9TGe5UGvBVGvFWGvJXG+9aHPNbHfVbHfZdHfhgHvlgH/phH/xlIP1mIf5nIf5oIv9oIv9pIv///////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAD8ALAAAAAAiABIAAAazwJ9wSCwaj8ik0CDxpE4bR0FJJTZasdks9lKJFFVqJkaz3W42Wow1goSRF1kNl6vncDXZCrR4Fw8uNAEBdnWDMCUaBH5DFDE2hnaENjEoHAmMQiEzN4aEgzk3MysfEZk/JpyeOaCipBWnJI+FhZQoHRNJALu8vb6/wMA6wwDDOsXHycTGyMrOu8fQ0cbK0MXX1djW29jTyd3f1t7P083m38zMwevswGEDCQ8YFgwIAqf4SkEAOw==");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/clap.gif"] {
    content: url("data:image/gif;base64,R0lGODlhHAAeAIQdAEI2EtWqApZiBvvXDrCJBM3MxPK/AndlO9TUzs2JAuqlAmxREf7kH6RzBp+Ueunt7pKFY2JKFuGWAv7+/vC0ArR6AnJeMvbKAt62AsKMAqNrBJ5+Bt7e3v///////////yH/C05FVFNDQVBFMi4wAwEAAAAh/hFDcmVhdGVkIHdpdGggR0lNUAAh+QQJDwAfACwAAAAAHAAeAAAF0+AnjmRpnmIUoeynltF1rS0s0+ld2zMZz7iaSjf6EVvGXlF2ZCWDriZSGlXuftBqFoU9dYXUnHJBCMgChIV4W71YNpeBXH6hNCxMdnQRGDD+gAMXBhkLVigQBH4AAICMgnYQeiKGDI2WmJYDBgpqNYqAoYF1DTsYfqKhkAk7cYypf4wUEq0DABOMubm4s6a2E8DBwgAKrJ8Xt8LKxBo7CwbIysHEEp41FdDJwxQKzTsiGRQGuowKChXfJAIKFO3cChIC6SULDQnwCRrW8/z9/v8nQgAAIfkECQwAHwAsAAACABoAGwAABcjgF0VfaZ4oOorXRabwGbUjHd+sO9MvXta8lrB32w1zLp/J+NoRlc6lTZkjRqnX3xS61SY/C0KgFSAsvE+kZXMZuN0XSsNyTM0WgQFjzx9cDBkLX3YQBHoAAHyIfnIiN4IMiZGTkQMGCj6GfJt9cT4YepybjAk4bYiie4gUEqYDABOIsrKxrDigsBO6u7sACqU3BBe5vLy+GjgLBsPFvQoSZzgVy8S9FArIShkUBrOICgoVVCUCChTn188C4yYLDQnPCRrR7PUlIQAh+QQJDwAfACwBAAEAGAAbAAAFw+AXRV9pnqg5itdFpnAZtSMdx7Obr/dZ6y1bjxX8CXs5226oEi6ZxNeTOZ3erM8FIdAKEBayI/Fi2VwGaPSF0rAUUbNFYMCo2wcXQ2bhSkUgBHQAAHaDeGwQLyh8DISNj40DBgpgMIF2mHdrDTEYdJmYhwkxZ4OgdYMUEqQDABODsLCvqp2tE7e4uQAKo5YXrrnBuxoxCwa/wbi7EpUwFcfAuhQKxD0ZFAaxgwoKFVACChTi0woSAlAlCw0J5QkazejxIQAh+QQBCgAfACwAAAAAHAAeAAAF1OAnjmRpnmiqrmwrRhEJu2V0XfFn4/R75z6ea4fLwW5CFlG4BKp2MGf0t4I+qSmbE6W9xhwLQuAWICwcuuRJa9lcBnD4hdKwdLm/wIDB7w8uBhkLWCY2EAR7AAB9in90EGoyF4MMi5WXlQMGCoNbIzGIfaJ+cw06Khh7o6KOCSxviqt8ihQSrwMAE4q7u7q1LKm5E8PExAAKrisEF8LFxccaLAsGzM7GChILLRXUzcYUCtEuGRQGvIoKChU9HwIKFPDg2ALsIgsNCdgJGtr1/v8Ae4QAADs=");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/bubble.gif"] {
    content: url("data:image/gif;base64,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");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/congratulate.gif"] {
    content: url("data:image/gif;base64,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");
}
.night img[src="//4pda.to/s/PXtiWRYz1TshP8hc/daisy.gif"] {
    content: url("data:image/gif;base64,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");
}
.night img[src="//4pda.to/s/PXtioRGJA39hLRz0olYQoVuGMwgfFF7uRYwNgCbud2gSYYNz1.gif"] {
    content: url("data:image/gif;base64,R0lGODlhCAAJAKECAHJ1efL1+f///////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAIALAAAAAAIAAkAAAIRhC8CwWHa3InMUHkt1fF4UwAAOw==");
}

/* QMS Plus fix */

.night .logo-in-qms #contacts {
    background: #171c20;
}

.night .qms-search-form .btn.blue {
    color: #9e9e9e;
}
.ed-wrap .ed-bbcode-normal, .ed-wrap .ed-bbcode-hover, .ed-wrap .ed-bbcode-down {
    border: solid;
    border-width: 1px;
    cursor: pointer;
    margin: 0px 3px 0px 0px;
    width: 20px;
    height: 20px;
    text-align: center;
    color: #000;
    box-sizing: content-box;
    -moz-box-sizing: content-box;
    -webkit-box-sizing: content-box;
}
.ed-wrap div.ed-bbcode-normal, .ed-wrap div.ed-bbcode-hover, .ed-wrap div.ed-bbcode-down {
    font-family: Verdana;
    line-height: 11px;
    width: 11px;
    height: 11px;
    color: #4373c3;
}
.ed-wrap .ed-bbcode-normal {
    border-color: transparent;
}
.ed-wrap .ed-color-hover, .ed-wrap .ed-bbcode-hover, .ed-wrap .ed-bbcode-normal:hover {
    border-color: transparent;
    background-color: #D6E8FF;
}
.ed-wrap .dropdown-menu [class^="icon-"] {
    margin-left: 0px;
}
.ed-wrap .dropdown.open .dropdown-menu i.icon-cog:before,
.ed-wrap .dropdown.open .dropdown-menu i.icon-cog i.icon-down-dir-1:before {
    display: none;
}
.night div#threads-bottom-form::after, .night div#thread-bottom-form::after, .night div#create-thread-div-form::after {
    background-color: #171c20;
    border-bottom: #395179 solid 1px;
}
.night .logo-in-qms .dropdown-menu > li > a:hover, .night .logo-in-qms .dropdown .chk-wrap:hover {
    background-color: #3A4F6C;
}
.night .logo-in-qms .starred {
    background-color: #1B4466;
    border-color: #1B4466;
}
.night .ac_odd, .night .ac_even {
    background: #22272b;
    color: #9e9e9e;
}
.night .ac_over {
    background: #3A4F6C;
}
.night .logo-in-qms #message-preview {
    background-color: #171c20;
    border-color: #395179;
}
.night .logo-in-qms .show-checkboxes .thread-list .list-group-item:hover,
.night .logo-in-qms .show-checkboxes .thread-list .list-group-item:focus,
.night .logo-in-qms .show-checkboxes .thread-list .list-group-item:active {
    background: #3a4f6c !important;
}

/* Ticket paginator fix */

.paginator form {
    margin: -1px !important;
}
#ad {
    background: white !important;
}
.night #ad {
    background: black !important;
}

/* mobile version
 * Author: anauthentic https://4pda.to/forum/index.php?showuser=200816
*/

.night .post_header, .night .quick_editor, .night .makepost_link, .night .board_forum_row {
    background: #22272B;
}
.night .post_header_editor, .night .forum_search, .night .topic_title_post, .night .cat_name {
    background: #3A4F6C;
}
.night .anonce_body {
    background: #4e4623 !important;
    border-bottom-color: #171c20;
}
.night .cat_name + [data-post] > div[style*="background-color:#CFFFE3"] {
    background: #2C0707 !important;
}
.night [data-spoil-poll-pinned-container] {
    border-color: #395179 !important;
}
.night .post_header, .night .cat_name {
    border-bottom-color: #395179;
}
.night .topic_title_post, .night #gfooter {
    color: #000;
}
.night .post_header_editor, .night .forum_search, .night .cat_name, .night .board_forum_row {
    color: #9e9e9e !important;
}
.night .board_forum_date {
    color: #5f6772;
}
/* end mobile version */

/* Global Message fix */
.night .globalmesswarnwrap h4 {
    background: #b76f6f !important;
    color: #7b1717;
}

.night .globalmesswarnwrap {
    background: #331212;
}

/* *** Curator+ options style fix *** */

.night .borderwrap .bar a.button {
    display: inline-block;
}

.night .borderwrap .bar form input {
    height: 21px;
}

/* *** Curator+ options style fix end *** */

`
/* Кнопка и фрейм настроек */
userStyle += `
.config_button {
    box-sizing: border-box;
    position: fixed;
    width: ${BUTTON_SIZE}px;
    height: ${BUTTON_SIZE2}px;
    right: ${BUTTON_SIZE}px;
    bottom: ${BUTTON_SIZE4}px;
    z-index: 10000;
    background: -webkit-linear-gradient(top, #aaa 50%, transparent 50%);
    background: -moz-linear-gradient(top, #aaa 50%, transparent 50%);
    background: -moz-linear-gradient(top, #aaa 50%, transparent 50%);
    background-size: 10px ${BUTTON_SIZE3}px;
    transition: background 0.1s ease-out;
}
.config_button:hover {
    background: -webkit-linear-gradient(top, #333 50%, transparent 50%);
    background: -moz-linear-gradient(top, #333 50%, transparent 50%);
    background: -moz-linear-gradient(top, #333 50%, transparent 50%);
    background-size: 10px ${BUTTON_SIZE3}px;
}
.night .config_button {
    background: -webkit-linear-gradient(top, #515151 50%, transparent 50%);
    background: -moz-linear-gradient(top, #515151 50%, transparent 50%);
    background: -moz-linear-gradient(top, #515151 50%, transparent 50%);
    background-size: 10px ${BUTTON_SIZE3}px;
}
.night .config_button:hover {
    background: -webkit-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background: -moz-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background: -moz-linear-gradient(top, #9e9e9e 50%, transparent 50%);
    background-size: 10px ${BUTTON_SIZE3}px;
}
.config_frame {
    box-sizing: border-box;
    position: fixed;
    right: 80px;
    bottom: 32px;
    z-index: 10000;
    border: 1px solid #aaa;
    padding: 8px;
    background: #f7f7f7;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-y: auto;
    max-height: calc(100vh - 64px);
    min-width: 390px;
    text-align: left;
}
.mobile_config_frame {
    min-width: 200px;
    font-size: 0.8em;
    bottom: ${BUTTON_SIZE4 * 1.6}px;
    right: 10px;
}
.config_frame label:hover {
    cursor: pointer;
    background: rgba(128, 128, 128, 0.3);
}
.config_frame input {
    cursor: pointer;
    position: absolute;
    opacity: 0;
}
.config_frame input[type="number"] {
    opacity: 1;
    margin: 0 3px 0 3px;
    position: initial;
    width: 40px;
}
.config_frame input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.config_frame input[type="color"] {
    opacity: 1;
    position: initial;
    width: 30px;
    height: 19px;
    margin: 0 3px 3px 0;
    padding: 0;
}
.config_frame input + span:before {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    margin: 0 0.4em 0.1em 0.3em;
    outline: 1px solid currentcolor;
    outline-offset: 1px;
}
.config_frame input:checked + span:before {
    background: currentcolor;
}
.config_frame .reset {
    margin: -1px 3px 0 0;
    padding: 0 2px;
    font-weight: bold;
    border-radius: 8px;
    opacity: 1;
    position: initial;
}
.night .config_frame {
    background: #22272B;
    border-color: #393d41;
}`
userStyleEl.innerHTML = userStyle;
const frameStyleEl = document.createElement('style'),
      frameStyle = `
.night .download-container {
    background-color: #22272B !important;
    border-color: #393d41 !important;
    color: #9e9e9e;
}
.night .dw-fname, .night .dw-fsize, .night .dw-fdwlink, .night .dw-descr, .night .download-container div:last-of-type {
    text-shadow: 0 0 4px black !important;
}
.night .download-container div:last-of-type a {
    color: #468cf7 !important;
}`;
frameStyleEl.innerHTML = frameStyle;
const navigatorEdge = /Edge/.test(navigator.userAgent);

const getDateBefore = (days) => (d => new Date(d.setDate(d.getDate() - days)))(new Date);
const getMinutesBefore = (minutes) => (d => new Date(d.setMinutes(d.getMinutes() - minutes)))(new Date);

function readyHead(fn) {
  if (document.body) {
    fn()
  } else if (document.documentElement && !navigatorEdge) {
    const observer = new MutationObserver(() => {
      if (document.body) {
        observer.disconnect();
        fn()
      }
    });
    observer.observe(document.documentElement, { childList: true })
  } else {
    setTimeout(() => readyHead(fn), 16)
  }
}
readyHead(() => {
  if (document.getElementById('4pdafixmarker')) return;
  if (window.top === window.self) {
    document.head.appendChild(userStyleEl)
  } else {
    document.head.appendChild(frameStyleEl)
  }
  if (userConfig.getItem('night_mode')) {
    document.documentElement.classList.add('night')
  }
});

function ready(fn) {
  const { readyState } = document;
  if (readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fn()
    })
  } else {
    fn()
  }
}
ready(async () => {
  if (document.getElementById('4pdafixmarker')) return;
  // Автоматичский ночной режим
  if (FLAGS.AUTO_NIGHT_MODE) {
    setInterval(() => {
      const currentHours = new Date().getHours();
      userConfig.setItem('night_mode', currentHours < FLAGS.AUTO_NIGHT_END || currentHours >= FLAGS.AUTO_NIGHT_START);
    }, 500)
  }
  // Переключатель дневного/ночного режима
  const switcherEl = document.createElement('div');
  switcherEl.classList.add('night_mode_switcher');
  switcherEl.onclick = () => {
    const isNightMode = userConfig.shiftItem('night_mode');
    document.documentElement.classList.toggle('night', isNightMode);
  };
  document.body.appendChild(switcherEl);
  setInterval(() => {
    const isNightMode = userConfig.getItem('night_mode');
    if (document.documentElement.classList.contains('night') !== isNightMode) {
      document.documentElement.classList.toggle('night', isNightMode)
    }
  }, 500)
  // чиним страницу/фрейм с загрузкой файла
  const dw_fname = document.querySelector('div.dw-fname');
  if (dw_fname && dw_fname.parentNode) dw_fname.parentNode.className = 'download-container';
  // проверяем, скрипт запустился во фрейме или основном окне
  if (window.top === window.self) {
    // Фрейм настроек
    const configFrame = document.createElement('div');
    configOptions.forEach(([key, text]) => {
      // булевые флаги
      if (typeof FLAGS[key] !== 'boolean') return;
      const inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.value = key;
      inputEl.checked = FLAGS[key];
      const labelEl = document.createElement('label');
      labelEl.setAttribute('unselectable', 'on');
      labelEl.setAttribute('onselectstart', 'return false');
      const spanEl = document.createElement('span');
      spanEl.innerHTML = text;
      configFrame.appendChild(labelEl);
      labelEl.appendChild(inputEl);
      labelEl.appendChild(spanEl);
      inputEl.onchange = () => {
        FLAGS[key] = inputEl.checked;
        GM_setValue('4pdafixFlags', JSON.stringify(FLAGS))
      };
      configFrame.appendChild(document.createElement('br'))
    });
    // Время автоматического переключения ночного режима
    const inputNightStart = document.createElement('input');
    inputNightStart.type = 'number';
    inputNightStart.value = FLAGS.AUTO_NIGHT_START;
    inputNightStart.min = 0;
    inputNightStart.max = 23;
    const labelNightStart = document.createElement('label');
    labelNightStart.setAttribute('unselectable', 'on');
    labelNightStart.setAttribute('onselectstart', 'return false');
    const spanNightStart = document.createElement('span');
    spanNightStart.innerHTML = "от (ч)";
    configFrame.appendChild(labelNightStart);
    labelNightStart.appendChild(spanNightStart);
    configFrame.appendChild(inputNightStart);
    inputNightStart.oninput = () => {
      FLAGS.AUTO_NIGHT_START = inputNightStart.value;
      GM_setValue('4pdafixFlags', JSON.stringify(FLAGS))
    };
    const inputNightEnd = document.createElement('input');
    inputNightEnd.type = 'number';
    inputNightEnd.value = FLAGS.AUTO_NIGHT_END;
    inputNightEnd.min = 0;
    inputNightEnd.max = 23;
    const labelNightEnd = document.createElement('label');
    labelNightEnd.setAttribute('unselectable', 'on');
    labelNightEnd.setAttribute('onselectstart', 'return false');
    const spanNightEnd = document.createElement('span');
    spanNightEnd.innerHTML = " до (ч)";
    configFrame.appendChild(labelNightEnd);
    labelNightEnd.appendChild(spanNightEnd);
    configFrame.appendChild(inputNightEnd);
    inputNightEnd.oninput = () => {
      FLAGS.AUTO_NIGHT_END = inputNightEnd.value;
      GM_setValue('4pdafixFlags', JSON.stringify(FLAGS))
    };
    configFrame.appendChild(document.createElement('br'));
    // Настройка цвета непрочитанных тем
    const inputFavColorDark = document.createElement('input');
    inputFavColorDark.type = 'color';
    inputFavColorDark.value = userConfig.getItem('fav_unread_dark_color');
    const labelFavColorDark = document.createElement('label');
    labelFavColorDark.setAttribute('unselectable', 'on');
    labelFavColorDark.setAttribute('onselectstart', 'return false');
    configFrame.appendChild(inputFavColorDark);
    const inputResetDark = document.createElement('input');
    inputResetDark.type = 'button';
    inputResetDark.value = "X";
    inputResetDark.className = 'reset';
    inputResetDark.title = 'сбросить';
    configFrame.appendChild(inputResetDark);
    const spanFavColorDark = document.createElement('span');
    spanFavColorDark.innerHTML = "цвет фона непрочитанных тем (темный режим)";
    configFrame.appendChild(labelFavColorDark);
    labelFavColorDark.appendChild(spanFavColorDark);
    inputResetDark.onclick = () => {
      userConfig.setItem('fav_unread_dark_color', FLAGS.FAV_UNREAD_DARK_COLOR);
      inputFavColorDark.value = FLAGS.FAV_UNREAD_DARK_COLOR
    };
    inputFavColorDark.oninput = () => {
      userConfig.setItem('fav_unread_dark_color', inputFavColorDark.value)
    };
    configFrame.appendChild(document.createElement('br'))
    const inputFavColorLight = document.createElement('input');
    inputFavColorLight.type = 'color';
    inputFavColorLight.value = userConfig.getItem('fav_unread_light_color');
    const labelFavColorLight = document.createElement('label');
    labelFavColorLight.setAttribute('unselectable', 'on');
    labelFavColorLight.setAttribute('onselectstart', 'return false');
    configFrame.appendChild(inputFavColorLight);
    const inputResetLight = document.createElement('input');
    inputResetLight.type = 'button';
    inputResetLight.value = "X";
    inputResetLight.className = 'reset';
    inputResetLight.title = 'сбросить';
    configFrame.appendChild(inputResetLight);
    const spanFavColorLight = document.createElement('span');
    spanFavColorLight.innerHTML = "цвет фона непрочитанных тем (светлый режим)";
    configFrame.appendChild(labelFavColorLight);
    labelFavColorLight.appendChild(spanFavColorLight);
    inputResetLight.onclick = () => {
      userConfig.setItem('fav_unread_light_color', FLAGS.FAV_UNREAD_LIGHT_COLOR);
      inputFavColorLight.value = FLAGS.FAV_UNREAD_LIGHT_COLOR
    };
    inputFavColorLight.oninput = () => {
      userConfig.setItem('fav_unread_light_color', inputFavColorLight.value)
    };
    configFrame.appendChild(document.createElement('br'));
    // Настройка высоты разделителя постов
    const inputCatendHeight = document.createElement('input');
    inputCatendHeight.type = 'number';
    inputCatendHeight.value = userConfig.getItem('catend_height');
    inputCatendHeight.min = 0;
    inputCatendHeight.max = 20;
    const labelCatendHeight = document.createElement('label');
    labelCatendHeight.setAttribute('unselectable', 'on');
    labelCatendHeight.setAttribute('onselectstart', 'return false');
    const spanCatendHeight = document.createElement('span');
    spanCatendHeight.innerHTML = "Высота разделителя постов (px):";
    configFrame.appendChild(labelCatendHeight);
    labelCatendHeight.appendChild(spanCatendHeight);
    configFrame.appendChild(inputCatendHeight);
    inputCatendHeight.oninput = () => {
      userConfig.setItem('catend_height', inputCatendHeight.value);
    };
    configFrame.appendChild(document.createElement('br'));
    // Настройка отступа табличных ячеек
    const inputTdPadding = document.createElement('input');
    inputTdPadding.type = 'number';
    inputTdPadding.value = userConfig.getItem('td_padding');
    inputTdPadding.min = 0;
    inputTdPadding.max = 5;
    const labelTdPadding = document.createElement('label');
    labelTdPadding.setAttribute('unselectable', 'on');
    labelTdPadding.setAttribute('onselectstart', 'return false');
    const spanTdPadding = document.createElement('span');
    spanTdPadding.innerHTML = "Отступ табличных ячеек (px):";
    configFrame.appendChild(labelTdPadding);
    labelTdPadding.appendChild(spanTdPadding);
    configFrame.appendChild(inputTdPadding);
    inputTdPadding.oninput = () => {
      userConfig.setItem('td_padding', inputTdPadding.value);
    };
    configFrame.appendChild(document.createElement('br'));
    // Настройка отступа кнопки меню автора поста
    const inputPostFooterPadding = document.createElement('input');
    inputPostFooterPadding.type = 'number';
    inputPostFooterPadding.value = userConfig.getItem('post_footer_padding');
    inputPostFooterPadding.min = 0;
    inputPostFooterPadding.max = 6;
    const labelPostFooterPadding = document.createElement('label');
    labelPostFooterPadding.setAttribute('unselectable', 'on');
    labelPostFooterPadding.setAttribute('onselectstart', 'return false');
    const spanPostFooterPadding = document.createElement('span');
    spanPostFooterPadding.innerHTML = "Отступ подвала поста (px):";
    configFrame.appendChild(labelPostFooterPadding);
    labelPostFooterPadding.appendChild(spanPostFooterPadding);
    configFrame.appendChild(inputPostFooterPadding);
    inputPostFooterPadding.oninput = () => {
      userConfig.setItem('post_footer_padding', inputPostFooterPadding.value);
    };
    configFrame.appendChild(document.createElement('br'));
    // Настройка отступа кнопки меню автора поста
    const inputPopmenubuttonPadding = document.createElement('input');
    inputPopmenubuttonPadding.type = 'number';
    inputPopmenubuttonPadding.value = userConfig.getItem('popmenubutton_padding');
    inputPopmenubuttonPadding.min = 0;
    inputPopmenubuttonPadding.max = 6;
    const labelPopmenubuttonPadding = document.createElement('label');
    labelPopmenubuttonPadding.setAttribute('unselectable', 'on');
    labelPopmenubuttonPadding.setAttribute('onselectstart', 'return false');
    const spanPopmenubuttonPadding = document.createElement('span');
    spanPopmenubuttonPadding.innerHTML = "Отступ кнопки меню автора поста (px):";
    configFrame.appendChild(labelPopmenubuttonPadding);
    labelPopmenubuttonPadding.appendChild(spanPopmenubuttonPadding);
    configFrame.appendChild(inputPopmenubuttonPadding);
    inputPopmenubuttonPadding.oninput = () => {
      userConfig.setItem('popmenubutton_padding', inputPopmenubuttonPadding.value);
    };
    configFrame.appendChild(document.createElement('br'));
    // Информация о перезагрузке страницы
    const reloadText = document.createElement('div');
    reloadText.style.textAlign = 'right';
    reloadText.innerHTML = `
        * чтобы увидеть изменения
        <a href="#" onclick="location.reload(); return false">
        обновите страницу
        </a>`;
    configFrame.appendChild(reloadText);
    configFrame.classList.add('config_frame');
    /* Mobile version */
    if (document.querySelector("meta[name='MobileOptimized']")) {
      configFrame.classList.add('mobile_config_frame')
    }
    /* End mobile version */
    configFrame.style.display = 'none';
    document.body.appendChild(configFrame);
    // Конец фрейма настроек
    // Кнопка настроек
    const configButton = document.createElement('div');
    configButton.classList.add('config_button');
    document.body.appendChild(configButton);
    configButton.onclick = () => {
      if (configFrame.style.display) {
        configFrame.style.display = ''
      } else {
        configFrame.style.display = 'none'
      }
    };
    // Подсветка непрочитанных тем в избранном и форумах
    const URL = window.document.URL;
    if (~URL.indexOf(favURL) || ~URL.indexOf(forumURL)) {
      const tbl = document.getElementsByClassName('ipbtable');
      for (let i = 0; i < tbl.length; i++) {
        const tr = tbl[i].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        for (let j = 0; j < tr.length; j++) {
          if (tr[j].hasAttribute('data-item-fid') || (
            tr[j].getElementsByTagName('td') &&
            tr[j].getElementsByTagName('td')[0] &&
            tr[j].getElementsByTagName('td')[0].className === 'row2'
          )) {
            const td = tr[j].getElementsByTagName('td'),
                  tdIndex = ~URL.indexOf(favURL) ? 1 : 2;
            if (
              td[tdIndex].getElementsByTagName('a') &&
              td[tdIndex].getElementsByTagName('a')[0] &&
              td[tdIndex].getElementsByTagName('a')[0].getElementsByTagName('img') &&
              td[tdIndex].getElementsByTagName('a')[0].getElementsByTagName('img')[0] &&
              td[tdIndex].getElementsByTagName('a')[0].getElementsByTagName('img')[0].alt === ">N"
            ) {
              tr[j].setAttribute("class", "unread_row")
            }
          }
        }
      }
    }
    /* Автор Azat-777 https://4pda.to/forum/index.php?showuser=917143
           Мной только адаптировано и слегка оптимизировано
        */
    if (FLAGS.SHOW_NEW_VERSIONS) {
      let counter = 0; // счетчик
      // Избранное
      if (~URL.indexOf(favURL)) {
        // находим таблицу
        const _tr = document.getElementsByClassName('ipbtable')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr'),
              // запихиваем в tr нужные нам строки таблицы
              tr = [];
        for (let i = 0; i < _tr.length; i++) {
          if (_tr[i].hasAttribute('data-item-fid')) { // отсортировываем из таблицы только темы
            tr.push(_tr[i]) // запихиваем в массив tr
          }
        }
        const trLength = tr.length,
              name = []; // названия тем
        for (let i = 0; i < trLength; i++) {
          const tmp = tr[i].getElementsByTagName('td')[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0];
          getVersion(tmp.getAttribute('href'), i);
          name.push(tmp)
        }
        //=====================================================
        // добавление счетчика с количеством новых версий приложений
        let count = 0;
        const _span = document.createElement('span');
        _span.id = 'count';
        const navstrip = document.getElementById('navstrip');
        //=====================================================
        let app_name,
            saveToHideName = [],
            saveToHideVer = [];

        function getVersion(link, i) {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', link, true);
          xhr.send();
          xhr.onload = function() {
            if (this.readyState === 4 && this.status === 200) {
              const parser = new DOMParser(),
                    doc = parser.parseFromString(xhr.responseText, 'text/html'),
                    tbl = doc.getElementsByClassName('ipbtable');
              for (let j = 0; j < tbl.length; j++) {
                if (tbl[j].hasAttribute('data-post')) {
                  const span = tbl[j].getElementsByTagName('tbody')[0]
                  .getElementsByTagName('tr')[1]
                  .getElementsByTagName('td')[1]
                  .getElementsByClassName('postcolor')[0]
                  .getElementsByTagName('span');
                  for (let k = 0; k < span.length; k++) {
                    // версии приложений
                    if (span[k].getAttribute('style') == 'font-size:12pt;line-height:100%') {
                      if (~span[k].innerHTML.toLowerCase().indexOf('верси')) {
                        // замена
                        let replace_ver = span[k].innerHTML,
                            alt_ver;
                        // если тема не была открыта
                        if (~name[i].innerHTML.indexOf('<strong>')) {
                          replace_ver = replace_ver.toLowerCase().replace(/[А-Яа-я\s]*верси[ия]:[\s]*/, 'v.').replace(/<[\/]*b[r]*>/g, '').trim();
                          alt_ver = replace_ver;
                          const alt_name = name[i].innerHTML.replace(/<[\/]*strong>/g, '');
                          // сравнение версий: текущей полученной и сохраненной в локальном хранилище
                          if (alt_ver.localeCompare(GM_getValue(alt_name)) !== 0) {
                            showNotif(alt_name, alt_ver, link)
                          }
                          // если тема была открыта и просмотрена
                        } else {
                          replace_ver = replace_ver.toLowerCase().replace(/<b>[А-Яа-я\s]*верси[ия]:[\s]*/, 'v.').replace(/<[\/]*b>/g, '').trim();
                          alt_ver = replace_ver;
                          if (replace_ver.localeCompare(GM_getValue(name[i].innerHTML)) !== 0) {
                            showNotif(name[i].innerHTML, alt_ver, link)
                          }
                        }
                        // добавление цвета для наглядности
                        replace_ver = '<font color="#bb72ff"> ' + replace_ver + '</font>';
                        name[i].innerHTML += replace_ver
                      }
                      break
                    }
                  }
                  break
                }
              }
            }
          };
          xhr.onerror = () => {
            console.log('onerror')
          };
          xhr.onloadend = (event) => {
            if (++counter === trLength) {
              // вешаем обработчик событий строки (появление/скрытие кноки "Скрыть")
              addEvent();
              // скрытие строки с обновленным приложением
              hideApp()
            }
          }
        }
        // переопределяем стиль для кнопок
        const btnStyle = document.createElement('style');
        const _s = `
.myBtn {
    display: inline-block;
    font-family: arial,sans-serif;
    font-size: 10px;
    font-weight: bold;
    color: rgb(68,68,68);
    text-decoration: none;
    user-select: none;
    padding: .1em 1.2em;
    outline: none;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 2px;
    background: rgb(245,245,245) linear-gradient(#f4f4f4, #f1f1f1);
    transition: all .218s ease 0s;
}
.myBtn:hover {
    color: rgb(24,24,24);
    border: 1px solid rgb(198,198,198);
    background: #f7f7f7 linear-gradient(#f7f7f7, #f1f1f1);
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
}
.myBtn:active {
    color: rgb(51,51,51);
    border: 1px solid rgb(204,204,204);
    background: rgb(238,238,238) linear-gradient(rgb(238,238,238), rgb(224,224,224));
    box-shadow: 0 1px 2px rgba(0,0,0,.1) inset;
}
.night .myBtn {
    border: 1px solid rgba(0,0,0,.1) !important;
    background: #777 linear-gradient(#777, #616161) !important;
}
.night .myBtn:hover {
    border: 1px solid #7d7d7d !important;
    background: #6d6d6d linear-gradient(#6d6d6d, #525252) !important;
}`;
        const _st = document.createTextNode(_s);
        btnStyle.appendChild(_st);
        document.head.appendChild(btnStyle);
        navstrip.appendChild(_span);
        _span.innerHTML = '<br/><br/>Обновлений: <font id="_cnt" color="red">' + count + '</font> <input id="hideBtn" class="myBtn" type="button" value="Скрыть обновления" style="display: none;" /><br/>' +
          `<table id="_tbl" style="border-collapse: collapse; border: 0px"><thead><tr><th class="one">#</th><th class="two">Название</th><th>Версия</th></tr></thead><tbody></tbody></table>`;
        const _tbl = document.querySelector('#_tbl'),
              _tbody = _tbl.querySelector('tbody'),
              _cnt = document.querySelector('#_cnt');
        let n = 0;
        _tbl.style.display = 'none';
        const tblStyle = document.createElement('style');
        const s = `
#_tbl th {
    color: brown;
    background-color: white;
    text-align: center;
    padding: 2px;
    letter-spacing: 0px;
}
.night #_tbl th {
    color: sandybrown;
    background-color: darkslategrey;
}
#_tbl td {
    font-size: 10px;
    padding: 0 5px;
}
#_tbl .one, .two {
    border-right: 1px solid
}`;
        const st = document.createTextNode(s);
        tblStyle.appendChild(st);
        document.head.appendChild(tblStyle);
        // кнопка скрытия обновлений вручную
        const hideBtn = document.querySelector('#hideBtn');
        hideBtn.onclick = () => {
          hideBtn.style.display = 'none';
          // сразу сохраняем обновленные версии в память, чтобы при следующем обновлении не всплыли в таблице обновлений
          for (let i = 0; i < saveToHideName.length; i++) {
            GM_setValue(saveToHideName[i], saveToHideVer[i])
          }
          // скрываем таблицу с обновлениями и обнуляем счетчик
          _tbl.style.display = 'none';
          count = 0;
          _cnt.innerHTML = count;
          for (; _tbody.querySelectorAll('tr').length > 0;) {
            _tbl.deleteRow(1)
          }
        }
        // вывод обновленных приложений вверху
        function showNotif(alt_name, alt_ver, link) {
          // показываем скрытую кнопку, если есть обновления
          hideBtn.style.display = 'inline';
          count++;
          const goto = '<a href="' + link + '&amp;view=getnewpost"><img src="//4pda.to/s/PXtiv0SJz25I1LFK93vEIDz09EWP3igNulg0lq5cZxWOKJ.gif" alt=">N" title="Перейти к первому непрочитанному" border="0"></a> ';
          app_name = goto + '<a href="' + link + '" title="Перейти к первому сообщению">' + alt_name + '</a>';
          saveToHideName.push(alt_name);
          saveToHideVer.push(alt_ver);
          showUpdates(app_name, alt_ver)
        }
        // показ количества обновлений и вывод их в таблице
        function showUpdates(app_name, ver) {
          _tbl.style.display = 'block';
          n++;
          const row = _tbody.insertRow(-1),
                cell1 = row.insertCell(-1),
                cell2 = row.insertCell(-1),
                cell3 = row.insertCell(-1),
                cell4 = row.insertCell(-1);
          row.className = 'myTr';
          cell1.className = 'one';
          cell2.className = 'two';
          cell1.innerHTML = n;
          _cnt.innerHTML = count;
          cell2.innerHTML = app_name;
          cell3.innerHTML = ver;
          cell4.innerHTML = '<input class="myBtn hidden" type="button" value="Скрыть" style="display: none;">'
        }

        function addEvent() {
          const myTr = document.querySelectorAll('.myTr');
          for (let i = 0; i < myTr.length; i++) {
            myTr[i].addEventListener('mouseover', function showButton() {
              this.querySelector('.hidden').style.display = 'block'
            });
            myTr[i].addEventListener('mouseout', function hideButton() {
              this.querySelector('.hidden').style.display = 'none'
            })
          }
        }

        function hideApp() {
          let hBut = document.querySelectorAll('.myBtn.hidden');
          for (let i = 0; i < hBut.length; i++) {
            hBut[i].onclick = function() {
              const n = this.parentNode.parentNode.firstChild.innerHTML,
                    name = this.parentNode.parentNode.children[1].children[1].innerHTML,
                    ver = this.parentNode.parentNode.children[2].innerHTML;
              GM_setValue(name, ver);
              // сброс # таблицы и удаление строк(и)
              _tbl.deleteRow(n);
              let num = _tbl.querySelectorAll('td.one');
              // если было скрыто последнее обновление, скрываем шапку таблицы и кнопку "Скрыть обновления"
              if (num.length === 0) {
                _tbl.style.display = 'none';
                hideBtn.style.display = 'none'
              }
              for (var j = 0; j < num.length; j++) {
                num[j].innerHTML = j + 1
              }
              _cnt.innerHTML = j
            }
          }
        }
      }
    }
    if (FLAGS.SHOW_USER_INFO) {
      if (~URL.indexOf(topicURL)) {
        const post = document.querySelectorAll('.postdetails > center'),
              userLink = document.getElementsByClassName('normalname'),
              link = [], // собираем все ссылки на профили
              ulLength = userLink.length;
        // создание области для новых данных
        const addInfoDiv = document.createElement('div');
        addInfoDiv.className = 'addInfo';
        addInfoDiv.innerText = "Дополнительная информация";
        const div = document.createElement('div');
        div.className = 'myDiv';
        addInfoDiv.appendChild(div);
        // Стиль для новой области
        const style = document.createElement('style');
        const styleData = `
.myDiv {
    display: none;
    position: absolute;
    width: 148px;
    z-index: 10;
    padding: 5px;
    border: 1px solid lightblue;
    background: PaleTurquoise;
    color: blue;
    font-size: 9pt;
    margin-left: -1px;
}
.night .myDiv {
    border-color: #395179;
    background: #3A4F6C;
    color: #9e9e9e;
}
.myDiv p {
    border: initial !important;
    background: initial !important;
    text-align: center;
    margin: 0px 0 -10px 0;
    padding: 0;
}
.addInfo {
    margin: 5px 0 -10px 0;
    border: 1px solid lightblue;
}
.night .addInfo {
    border-color: #395179;
}
.addInfo:hover .myDiv {
    display: block;
}`;
        const styleNode = document.createTextNode(styleData);
        style.appendChild(styleNode);
        document.head.appendChild(style);

        for (let i = 0; i < ulLength; i++) {
          const link = userLink[i].querySelector('a').getAttribute('href');
          insertUserDataContainer(link, i);
        }

        function insertUserDataContainer(link, index) {
          post[index].appendChild(addInfoDiv.cloneNode(true));
          post[index].getElementsByClassName('addInfo')[0].addEventListener("mouseenter", async () => await getUserData(link, index));
        }

        function getUserData(link, index) {
          return new Promise(resolve => {
            //debugger;
            const usersInfo = GM_getValue('usersInfo') || new Map();
            const userInfo = usersInfo[link];
            if (!userInfo || isNaN(new Date(userInfo.updated)) || new Date(userInfo.updated) < getMinutesBefore(10)) {
              const xhr = new XMLHttpRequest();
              xhr.open('GET', link, true);
              xhr.send();
              xhr.onload = function() {
                if (this.readyState === 4 && this.status === 200) {
                  const response = xhr.responseText;
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(response, 'text/html');
                  const personalData = doc.getElementsByClassName('info-list width1 black-link')[0];
                  personalData.style.marginLeft = 0;
                  personalData.style.paddingLeft = 0;
                  personalData.style.display = 'block';
                  personalData.style.listStyle = 'none';
                  const personalDataList = personalData.querySelectorAll('li');
                  const mainData = doc.getElementsByClassName('info-list black-link')[0];
                  mainData.style.marginLeft = 0;
                  mainData.style.paddingLeft = 0;
                  mainData.style.display = 'block';
                  mainData.style.listStyle = 'none';
                  const mainDataList = mainData.querySelectorAll('li');
                  const personalDataFilter = [
                    'Мужчина',
                    'Женщина',
                    'Город:',
                    'Дата рождения:',
                    'Время у юзера:',
                  ];
                  const list = Array.prototype.slice.call(personalDataList)
                  .filter(li => personalDataFilter.filter(el => li.innerText.includes(el)).length > 0)
                  .concat(
                    Array.prototype.slice.call(mainDataList)
                    .filter(li => li.innerText.includes('посещение')));
                  let userData = '';
                  for (let i = 0; i < list.length; i++) {
                    const reg = new RegExp(/Город:\n(.*)/);
                    // console.log(list[i].innerText);
                    userData += '<p>' + list[i].innerText
                      .replace(/(Город:)/, '$1 ')
                      .replace(/(рождения:)/, '$1<br/>')
                      .replace(/(юзера:)/, '$1<br/>')
                      .replace(/(посещение:)/, '$1<br/>') +
                      '</p><br/>'
                  }
                  //debugger;
                  usersInfo[link] = {userData, updated: Date.now()};
                  GM_setValue("usersInfo", usersInfo);
                  insertData(userData, index);
                  resolve();
                }
              };
              xhr.onerror = () => {
                console.log('error');
              }
            } else {
              insertData(userInfo.userData, index);
              resolve();
            }
          });
        }

        function insertData(userData, index) {
          post[index].getElementsByClassName('myDiv')[0].innerHTML = userData;
        }
      }
    }
    if (FLAGS.ADS_CLEANER) {
      let div = document.querySelector('body > div:first-of-type > :nth-child(2):not(div) > :first-child:not(div) > :nth-child(2):not(div)');
      div && div.remove();
      div = document.querySelector('body > div:first-of-type > :nth-child(2):not(div) > :first-child:not(div) > div:nth-child(2)');
      div && div.remove();
      div = document.querySelector('article > :first-child:not(div)');
      div && div.remove();
      div = document.querySelector('div[itemprop="description"]');
      div && div.remove();
      div = document.querySelector('body > div:first-of-type > :nth-child(2):not(div) > :first-child:not(div) > :nth-child(6):not(div)');
      if (div) div.id = 'ad';
    }
    if (FLAGS.QMS_BB_PANEL) {
      if (~URL.indexOf(qmsURL)) {
        const smiles = {
          ":happy:": "happy",
          ";)": "wink",
          ":P": "tongue",
          ":-D": "biggrin",
          ":lol:": "laugh",
          ":rolleyes:": "rolleyes",
          ":)": "smile_good",
          ":beee:": "beee",
          ":rofl:": "rofl",
          ":sveta:": "sveta",
          ":thank_you:": "thank_you",
          "}-)": "devil",
          ":girl_cray:": "girl_cray",
          ":D": "biggrin",
          "o.O": "blink",
          ":blush:": "blush",
          ":yes2:": "yes",
          ":mellow:": "mellow",
          ":huh:": "huh",
          ":o": "ohmy",
          "B)": "cool",
          "-_-": "sleep",
          "<_<": "dry",
          ":wub:": "wub",
          ":angry:": "angry",
          ":(": "sad",
          ":unsure:": "unsure",
          ":wacko:": "wacko",
          ":blink:": "blink",
          ":ph34r:": "ph34r",
          ":banned:": "banned",
          ":antifeminism:": "antifeminism",
          ":beta:": "beta",
          ":boy_girl:": "boy_girl",
          ":butcher:": "butcher",
          ":bubble:": "bubble",
          ":censored:": "censored",
          ":clap:": "clap",
          ":close_tema:": "close_tema",
          ":clapping:": "clapping",
          ":coldly:": "coldly",
          ":comando:": "comando",
          ":congratulate:": "congratulate",
          ":dance:": "dance",
          ":daisy:": "daisy",
          ":dancer:": "dancer",
          ":derisive:": "derisive",
          ":dinamo:": "dinamo",
          ":dirol:": "dirol",
          ":diver:": "diver",
          ":drag:": "drag",
          ":download:": "download",
          ":drinks:": "drinks",
          ":first_move:": "first_move",
          ":feminist:": "feminist",
          ":flood:": "flood",
          ":fool:": "fool",
          ":friends:": "friends",
          ":foto:": "foto",
          ":girl_blum:": "girl_blum",
          ":girl_crazy:": "girl_crazy",
          ":girl_curtsey:": "girl_curtsey",
          ":girl_dance:": "girl_dance",
          ":girl_flirt:": "girl_flirt",
          ":girl_hospital:": "girl_hospital",
          ":girl_hysterics:": "girl_hysterics",
          ":girl_in_love:": "girl_in_love",
          ":girl_kiss:": "girl_kiss",
          ":girl_pinkglassesf:": "girl_pinkglassesf",
          ":girl_parting:": "girl_parting",
          ":girl_prepare_fish:": "girl_prepare_fish",
          ":good:": "good",
          ":girl_spruce_up:": "girl_spruce_up",
          ":girl_tear:": "girl_tear",
          ":girl_tender:": "girl_tender",
          ":girl_teddy:": "girl_teddy",
          ":girl_to_babruysk:": "girl_to_babruysk",
          ":girl_to_take_umbrage:": "girl_to_take_umbrage",
          ":girl_triniti:": "girl_triniti",
          ":girl_tongue:": "girl_tongue",
          ":girl_wacko:": "girl_wacko",
          ":girl_werewolf:": "girl_werewolf",
          ":girl_witch:": "girl_witch",
          ":grabli:": "grabli",
          ":good_luck:": "good_luck",
          ":guess:": "guess",
          ":hang:": "hang",
          ":heart:": "heart",
          ":help:": "help",
          ":helpsmilie:": "helpsmilie",
          ":hemp:": "hemp",
          ":heppy_dancing:": "heppy_dancing",
          ":hysterics:": "hysterics",
          ":indeec:": "indeec",
          ":i-m_so_happy:": "i-m_so_happy",
          ":kindness:": "kindness",
          ":king:": "king",
          ":laugh_wild:": "laugh_wild",
          ":4PDA:": "love_4PDA",
          ":nea:": "nea",
          ":moil:": "moil",
          ":no:": "no",
          ":nono:": "nono",
          ":offtopic:": "offtopic",
          ":ok:": "ok",
          ":papuas:": "papuas",
          ":party:": "party",
          ":pioneer_smoke:": "pioneer_smoke",
          ":pipiska:": "pipiska",
          ":protest:": "protest",
          ":popcorm:": "popcorm",
          ":rabbi:": "rabbi",
          ":resent:": "resent",
          ":roll:": "roll",
          ":rtfm:": "rtfm",
          ":russian_garmoshka:": "russian_garmoshka",
          ":russian:": "russian",
          ":russian_ru:": "russian_ru",
          ":scratch_one-s_head:": "scratch_one-s_head",
          ":scare:": "scare",
          ":search:": "search",
          ":secret:": "secret",
          ":skull:": "skull",
          ":shok:": "shok",
          ":sorry:": "sorry",
          ":smoke:": "smoke",
          ":spiteful:": "spiteful",
          ":stop_flood:": "stop_flood",
          ":suicide:": "suicide",
          ":stop_holywar:": "stop_holywar",
          ":superman:": "superman",
          ":superstition:": "superstition",
          ":tablet_za:": "tablet_protiv",
          ":tablet_protiv:": "tablet_za",
          ":this:": "this",
          ":tomato:": "tomato",
          ":to_clue:": "to_clue",
          ":tommy:": "tommy",
          ":tongue3:": "tongue3",
          ":umnik:": "umnik",
          ":victory:": "victory",
          ":vinsent:": "vinsent",
          ":wallbash:": "wallbash",
          ":whistle:": "whistle",
          ":wink_kind:": "wink_kind",
          ":yahoo:": "yahoo",
          ":yes:": "yes",
          ":blush:": "confusion",
          "-:{": "girl_devil",
          ":*": "kiss",
          "@}-'-,-": "give_rose",
          ":'(": "cry",
          ":-{": "mad",
          "=^.^=": "kitten",
          "(-=": "girl_hide",
          "(-;": "girl_wink",
          ")-:{": "girl_angry",
          "*-:": "girl_chmok",
          ")-:": "girl_sad",
          ":girl_mad:": "girl_mad",
          "(-:": "girl_smile",
          ":acute:": "acute",
          ":aggressive:": "aggressive",
          ":air_kiss:": "air_kiss",
          "o_O": "blink",
          ":-": "confusion",
          ":'-(": "cry",
          ":lol_girl:": "girl_haha",
          ")-':": "girl_cray",
          "(;": "girl_wink",
          ":-*": "kiss",
          ":laugh:": "laugh",
          ":ohmy:": "ohmy",
          ":-(": "sad",
          "8-)": "rolleyes",
          ":-)": "smile",
          ":smile:": "smile",
          ":-P": "tongue",
          ";-)": "wink"
        }
        const bbButtons = [{
          src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/b.png",
          title: "Жирный",
          name: "B"
        },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/i.png",
                             title: "Курсив",
                             name: "I"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/u.png",
                             title: "Подчёркивание",
                             name: "U"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/s.png",
                             title: "Зачёркивание",
                             name: "S"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/sub.png",
                             title: "Подстрочный текст",
                             name: "SUB"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/sup.png",
                             title: "Надстрочный текст",
                             name: "SUP"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/left.png",
                             title: "Влево",
                             name: "LEFT"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/center.png",
                             title: "По центру",
                             name: "CENTER"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/right.png",
                             title: "Вправо",
                             name: "RIGHT"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/url.png",
                             title: "Вставить гиперссылку",
                             name: "URL"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/quote.png",
                             title: "Вставить цитату",
                             name: "QUOTE"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/offtop.png",
                             title: "Оффтоп",
                             name: "OFFTOP"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/code.png",
                             title: "Вставить код",
                             name: "CODE"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/spoiler.png",
                             title: "Сделать текст сворачиваемым",
                             name: "SPOILER"
                           },
                           {
                             src: "//4pda.to/s/Zy0hOXnvtW2qrwxoyQORE95VPgds/1/folder_editor_buttons/list.png",
                             title: "Вставить список",
                             name: "LIST"
                           },
                          ];

        function getSelectionText() {
          let text = "";
          if (window.getSelection) {
            text = window.getSelection().toString()
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text
          }
          return text
        }

        function quoteClick() {
          const appendText = getSelectionText();
          const textArea = $('#thread-msg');
          textArea.val(textArea.val() + '[QUOTE]' + appendText + '[/QUOTE]')
        }

        $('#body').on('click', (e) => {
          if (e.target.id == 'btn-bb-codes') {
            if (!($('div').is('#btn-bb'))) {
              $('#btn-bb-codes').attr('data-options', '{"class":"show"}');
              let btn = '<table cellspacing="0" cellpadding="0" border="0" width="100%" class="ed-wrap"><tbody><tr>' +
                  '<td id="ed--1_bbc" style="text-align: left; width: 100%; padding-left: 4px;" class="ed-panel">';
              for (const bbButton of bbButtons) {
                if (bbButton.name == "QUOTE") {
                  btn += '<img src="' + bbButton.src + '" border="0" align="top" class="ed-bbcode-normal" alt="' + bbButton.title +
                    '" title="' + bbButton.title + '" id="bb-quote">'
                } else {
                  btn += '<img data-toggle="bb" data-options={"target":"#thread-msg","before":"[' + bbButton.name +
                    (bbButton.name == "URL" ? '=' : '') + ']","after":"[/' + bbButton.name + ']"} src="' + bbButton.src +
                    '" border="0" align="top" class="ed-bbcode-normal" alt=" ' + bbButton.title + '" title="' + bbButton.title +
                    '">'
                }
              }
              btn += '<div class="dropdown"><a href="#" class="btn" data-toggle="dropdown"><i class="icon-cog"/>' +
                '<span class="on-show-sidebar">Смайлы</span><i class="icon-down-dir-1"/></a>' +
                '<ul class="dropdown-menu" style="position: absolute; width: 262px; margin-left: auto; height: 150px;' +
                ' border: 1px solid; overflow-y: auto; overflow-x: auto; cursor: pointer;">';
              const paths_to_smile = GM_getValue('4pda_script_path_to_smile');
              for (const i in smiles) {
                btn += '<img src="' + paths_to_smile + smiles[i] + '.gif" border="0" class="ed-emo-normal" alt"' + i +
                  '" title="' + i + '" data-toggle="bb" data-options={"target":"#thread-msg","before":"","after":"&#32;' + i + '&#32;"}>'
              }
              btn += '</ul></td></tr></tbody></table>';
              let sep1;
              if ($('div').is('.form-thread[data-form="create-thread"]')) {
                sep1 = 'div.form-thread[data-form="create-thread"]'
              } else if ($('div').is('.form-thread[data-form="send-message"]')) {
                sep1 = 'div.form-thread[data-form="send-message"]'
              } else if ($('form').is('#create-thread-form')) {
                sep1 = '#create-thread-form'
              }
              $(sep1).prepend('<div id="btn-bb" style="display: block;">' + btn + '</div>');
              $('#bb-quote').on('click', () => quoteClick())
            } else {
              if ($('#btn-bb').attr('style').indexOf('display: block;') != -1) {
                $('#btn-bb').attr('style', 'display: none;')
              } else {
                $('#btn-bb').attr('style', 'display: block;')
              }
            }
          }
        })
      } else {
        if (GM_getValue('4pda_script_path_to_smile') == null) {
          const smilesPath = BBSmiles.toString().match(/b\.src\=\"(\/\/\S+\/)/)[1];
          GM_setValue('4pda_script_path_to_smile', smilesPath)
        }
      }
    }
    // Исправление кнопок
    const fixedButton = "data:image/gif;base64,R0lGODlhHgAVAOeCAAcpWgcpZRI0bBg5cSRIhSRLiC9OgS9VkztXh0NVhzRalzRbmThfnDpfnThgnj5hmzpjoD1jojtkoTxkojxnpUFmoD1npD9npj1opj9op0Fopj5ppj9pqEBqqE5okkNrpEFsqkFtrEJtq1FrlUVtrEZuqEdvrEhxsElyrE5xp1BzqE12tUt3tkx3tlN5rll4qVN5uVV6sE98uVV9vVF/vlWAv1aAv1OBwVeBwFWDwlWEw1mDw1uGxlaIyGOGuGiFslyHx12KyluLyl+NzF+NzWyLuWCOzmGOzmGR0WOR0WGT0naQuWKV1maW13iTvGuX1mWZ2WeZ2mmZ2XqWwGea22ib3Gmb3Wic3Gmd3mqd3mue322g4G2h4m2i42+j42+m53Gm53Gn6YmjyHKo6XKp63Op6pGmx3Ws7nWt75Opynev8ZSrzJatzpeu0J+xzoW59aK107HD27rH27zK377N4cnT5MnU5MrW5svW58vX59ff7Nfg7OPo8eTp8fH0+PL0+PL0+fL1+f///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH5BAEKAP8ALAAAAAAeABUAAAj+AP8JHEiwoMGDAxMEWMiwocOHDgcGeEOxosWLGC8GEBjgicePIEOKDLnxXwAYKFOqXMlyZckAM2LKnEmzJs2XOHLq1EliwQISFw5MWLGz6MsdSJMitfGAD58HLwTJiaC06ksgWLNi5aFhiSAzDdwI+nFCq9aXRNKqTTukhoI6glJU8NPHQZC1al8m2cuX7xETKv7YYeBEUJoWffm+bMK4CZPGjI1AmCPowwdAejBAbvwyiucoUj57vlFEEJwMawRNYSH680stsGPHrhJiT6ASLgTdkYBEduySAqx4GU58uA42gsRswCMohowtxYmXNNADjPXrYLigoBPHgo88bUROZMGOveQ/AmHKqF8/RgiIDjlocBChZMz6+2XMe6CApr//M19QccUXXUCBBRn+Jdifef+MUEAPXKgh4YQUVmghAAYhMABEHD6E0IcgFhQQADs=";
    const goButtons = document.getElementsByClassName('gobutton');
    for (let i = 0; i < goButtons.length; i++) {
      goButtons[i].src = fixedButton;
      goButtons[i].style.backgroundColor = 'transparent'
    }
    const searchButtons = document.getElementsByClassName('button');
    for (let i = 0; i < searchButtons.length; i++) {
      if (searchButtons[i].getAttribute('type') == 'image') {
        searchButtons[i].src = fixedButton;
        searchButtons[i].style.backgroundColor = 'transparent'
      }
    }
    // Закрываемый контейнер уведомления
    const notifyObserver = new MutationObserver((mutations, obs) => {
      const notifyDiv = document.querySelector('div[style*="background:#dff0d8"]');
      if (notifyDiv) {
        const closeSpan = document.createElement('span');
        closeSpan.className = 'closable';
        closeSpan.innerHTML = 'X';
        notifyDiv.appendChild(closeSpan);
        closeSpan.addEventListener("click", () => {
          notifyDiv.remove();
        });
        obs.disconnect();
        return;
      }
    });
    notifyObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  setTimeout(() => {
    const marker = document.createElement('meta');
    marker.id = '4pdafixmarker';
    document.head.appendChild(marker)
  }, 300)
});
