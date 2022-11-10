//import { fs } from '@tauri-apps/api';

const TauriLogger = {

	_keepOld: false,
	_logName: "",
	_oldLog: "",

	init: async function(logname, keepOld) {
		this._keepOld = keepOld;
		this._logName = keepOld ? "logs/" + logname + "-" + this.dateLogName() + ".log" : "logs/" + logname + ".log";

		setInterval(() => { this.saveLog(); }, 10);

	},

	dateLogName: function () {

		let date = new Date();
		return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear() + "-" + this.msToTime(date.getTime());

	},

	saveLog: async function () {

	},

	log: async function(logType, message) {

		switch (logType) {
		case 'INFO':
			this._oldLog = this._oldLog + "\r\n[INFO]: " + message;
			break;

		case 'WARN':
			this._oldLog = this._oldLog + "\r\n[WARN]: " + message;
			break;

		case 'ERROR':
			this._oldLog = this._oldLog + "\r\n[ERROR]: " + message;
			break;

		case '':
			this._oldLog = this._oldLog + "\r\n" + message;
		}

	},
	msToTime: function (s) {
		const ms = s % 1000;
		s = (s - ms) / 1000;
		const secs = s % 60;
		s = (s - secs) / 60;
		const mins = s % 60;
		const hrs = (s - mins) / 60;

		let retTime;

		if (hrs > 0) {
			retTime = this.pad(hrs, 2) + '-' + this.pad(mins, 2) + '-' + this.pad(secs, 2);
		} else {
			retTime = this.pad(mins, 2) + '-' + this.pad(secs, 2);
		}
		return retTime;
	},
	pad: function (str, max) {
		str = str.toString();
		return str.length < max ? this.pad("0" + str, max) : str;
	}

};

export default TauriLogger;
