import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as fab from "@fortawesome/free-brands-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

library.add(
    fab.faBilibili,
    fab.faGithub,
    fab.faTwitter,
    far.faClock,
    fas.faAnglesDown,
    fas.faAnglesUp,
    fas.faArrowUp,
    fas.faArrowUpRightFromSquare,
    fas.faArrowRight,
    fas.faBullhorn,
    fas.faBookOpen,
    fas.faBoxArchive,
    fas.faChevronLeft,
    fas.faChevronRight,
    fas.faChevronDown,
    fas.faClockRotateLeft,
    fas.faCommentDots,
    fas.faEye,
    fas.faGear,
    fas.faHouse,
    fas.faLink,
    fas.faMoon,
    fas.faMugSaucer,
    fas.faPaperPlane,
    fas.faPaste,
    fas.faPen,
    fas.faPenToSquare,
    fas.faPencil,
    fas.faPersonPraying,
    fas.faQuoteLeft,
    fas.faQuoteRight,
    fas.faRotateRight,
    fas.faRss,
    fas.faSearch,
    fas.faSitemap,
    fas.faSubway,
    fas.faSun,
    fas.faTrashCan,
    fas.faToriiGate,
    fas.faUser,
    fas.faXmark
);

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component("fa-icon", FontAwesomeIcon);
});