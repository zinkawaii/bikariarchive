import { library, config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as fab from "@fortawesome/free-brands-svg-icons";
import * as fas from "@fortawesome/free-solid-svg-icons";

config.autoAddCss = false;

library.add(
    fab.faBilibili,
    fab.faGithub,
    fab.faTwitter,
    fas.faArrowUp,
    fas.faArrowUpRightFromSquare,
    fas.faArrowRight,
    fas.faBullhorn,
    fas.faBookOpen,
    fas.faChevronLeft,
    fas.faChevronRight,
    fas.faChevronDown,
    fas.faClockRotateLeft,
    fas.faGear,
    fas.faHouse,
    fas.faLink,
    fas.faMoon,
    fas.faPaste,
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