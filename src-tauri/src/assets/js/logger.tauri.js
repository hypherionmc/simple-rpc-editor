window.LoggerTauri = {

    _tauri: window.__TAURI__,
    _keepOld: false,
    _logName: "",
    _oldLog: "",

    init: async function(logname, keepOld) {

        await this._tauri.fs.createDir("logs", {
            recursive: true
        });

        this._keepOld = keepOld;
        this._logName = keepOld ? "logs/" + logname + "-" + this.dateLogName() + ".log" : "logs/" + logname + ".log";

        setInterval(() => { this.saveLog(); }, 10);

    },

    dateLogName: function () {

        var date = new Date();
        return date.getDate() + "" + date.getMonth() + "" + date.getFullYear() + "" + date.getTime();

    },

    saveLog: async function () {

        await this._tauri.fs.writeFile({
            contents: this._oldLog,
            path: this._logName
        }, null);

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

    }

};
