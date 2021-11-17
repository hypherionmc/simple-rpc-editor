import Vue from 'vue';
import VueToast from 'vue-toast-notification';

import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import vueNiceScrollbar from 'vue-nice-scrollbar';
import vSelect from 'vue-select';
import VueSweetalert2 from 'vue-sweetalert2';
import {
	faDownload,
	faQuestionCircle,
	faUserSecret,
	faCoffee,
	faMoon,
	faLightbulb,
	faFile,
	faFileAlt,
	faSave,
	faCode,
	faEye,
	faArchive,
	faSpinner,
	faList,
	faServer,
	faGamepad,
	faUser,
	faUsers,
	faTachometerAlt,
	faGlobe, faEdit
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';

library.add(
	faUserSecret,
	faDownload,
	faCoffee,
	faDiscord,
	faGithub,
	faQuestionCircle,
	faLightbulb,
	faMoon,
	faFile,
	faFileAlt,
	faSave,
	faCode,
	faEye,
	faArchive,
	faSpinner,
	faList,
	faServer,
	faGamepad,
	faUser,
	faUsers,
	faTachometerAlt,
	faGlobe,
	faEdit
);

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-select/dist/vue-select.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(BootstrapVue);
Vue.use(vueNiceScrollbar);
Vue.use(VueSweetalert2);
Vue.use(VueToast);
Vue.config.productionTip = false;
Vue.component('v-select', vSelect);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
	render: (h) => h(App)
}).$mount('#app');
