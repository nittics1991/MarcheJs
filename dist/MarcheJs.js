////////////////////////////////////

const _MESSGAGE_DELAY_INFO = 2;     //メッセージウィンドウ通知 表示時間
const _MESSGAGE_DELAY_ERROR = 3;    //メッセージウィンドウエラー 表示時間

////////////////////////////////////

/**
*   EventDispatcher
*/
class EventDispatcher {
    /**
    *   @var array
    */
    _listeners = []; 
    
    /**
    *   addEventListener
    *
    *   @param string name
    *   @param callable callback
    *   @return this
    */
    addEventListener(name, callback) {
        if(!this._listeners[name]) {
            this._listeners[name] = [];
        }
        
        this._listeners[name].push(callback);
        return this;
    }
    
    /**
    *   removeEventListener
    *
    *   @param string name
    *   @param callable callback
    *   @return this
    */
    removeEventListener(name, callback) {
        if(!this.listeners[name]) {
            return this;
        }
        
        let that = this;
        this._listeners[name].forEach((current, index) => {
            if (current == callback) {
                that.listeners[name].splice(index, 1);
            }
        });
        return this;
    }
    
    /**
    *   dispatchEvent
    *
    *   @param string name
    *   @param mixed event
    *   @return mixed[] 実行結果
    */
    dispatchEvent(name, event) {
        if(this._listeners[name] == undefined
        || this._listeners[name].length == 0
        ) {
            return [];
        }
        
        event.type = name;
        
        return this._listeners[name].map((callback) => {
            return callback(event);
        });
    }
}

///////////////////////////////

/**
*   UnixDate
*
*/
class UnixDate
{
    /**
    *   now
    *
    *   @return int unixtime
    */
    static now() {
        return (new Date()).getTime();
    }
    
    /**
    *   today
    *
    *   @return int unixtime
    */
    static today() {
        const now = new Date();
        
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0,
            0,
            0
        ).getTime();
    }
    
    /**
    *   byStrDate
    *
    *   @param string date_string yyyy-mm-dd
    *   @return int unixtime
    */
    static byStrDate(date_string) {
        return new Date(date_string + ' 00:00:00.000').getTime();
    }
    
    /**
    *   modifyDate
    *
    *   @param int unixtime
    *   @param int date_number
    *   @return unixtime
    */
    static modifyDate(unixtime, date_number) {
        return unixtime + (date_number * 60 * 60 * 24 * 1000);
    }
    
    /**
    *   unixtime => Date
    *
    *   @param str_unixtime
    *   @return Date
    */
    static toDate(str_unixtime) {
        return new Date(str_unixtime);
    }
    
    /**
    *   setTimeString
    *
    *   @param int unixtime
    *   @param int time_string
    *   @return unixtime
    */
    static setTimeString(unixtime, time_string) {
        const dt = UnixDate.toDate(unixtime);
        
        return new Date(
            dt.getFullYear() + '-' +
            (dt.getMonth() + 1) + '-' +
            dt.getDate() + ' ' +
            time_string
        ).getTime();
    }
    
    /**
    *   isToday
    *
    *   @param int unixtime
    *   @return bool
    */
    static isToday(unixtime) {
        const min_unixtime = UnixDate.today();
        const max_unixtime = UnixDate.modifyDate(
            min_unixtime,
            1
        );
        
        return unixtime >= min_unixtime
            && unixtime < max_unixtime;
    }
}

/**
*   DateFormatter
*
*/
class DateFormatter
{
    /**
    *   日付文字列取得
    *
    *   @param str_unixtime
    *   @return string
    */
    static toDate(str_unixtime) {
        let dt;
        
        try {
            dt = new Date(parseInt(str_unixtime));
        } catch (e) {
            return '';
        }
        return (new Date(
            str_unixtime - dt.getTimezoneOffset() * 60 * 1000)
        ).toISOString()
        .substr(0,10);
    }
    
    /**
    *   時刻文字列取得
    *
    *   @param str_unixtime
    *   @return string
    */
    static toTime(str_unixtime) {
        let dt;
        
        try {
            dt = new Date(parseInt(str_unixtime));
        } catch (e) {
            return '';
        }
        return (new Date(
            str_unixtime - dt.getTimezoneOffset() * 60 * 1000)
        ).toISOString()
        .substr(11,5);
    }
}


//////////////////////////////////

/**
*   MarcheDataCollection
*
*/
class MarcheDataCollection
{
    /**
    *   _storage_data
    *
    *   @var object
    */
    _storage_data;
    
    /**
    *   constructor
    *
    *   @param object
    */
    constructor(storage_data) {
        this._storage_data = storage_data;
    }
    
    /**
    *   set
    *
    *   @param string id
    *   @param string jobname
    *   @return this
    */
    set(id, jobname) {
        this._storage_data[id] = jobname;
        return this;
    }
    
    /**
    *   get
    *
    *   @param string id
    *   @return ?string
    */
    get(id) {
        return this._storage_data[id] || null;
    }
    
    /**
    *   remove
    *
    *   @param string id
    *   @return this
    */
    remove(id) {
        delete this._storage_data[id];
        return this;
    }
    
    /**
    *   has
    *
    *   @param string id
    *   @return bool
    */
    has(id) {
        return this.get(id) != null;
    }
    
    /**
    *   all
    *
    *   @return object
    */
    all() {
        return this._storage_data;
    }
    
    /**
    *   first
    *
    *   @return ?object
    */
    first() {
        const storage_data = this._storage_data;
        
        return storage_data[
            Object.keys(storage_data).sort()[0]
        ] || null;
    }
    
    /**
    *   last
    *
    *   @return ?object
    */
    last() {
        let storage_data = this._storage_data;
        
        return storage_data[
            Object.keys(storage_data).reverse()[0]
        ] || null;
    }
    
    /**
    *   firstId
    *
    *   @return ?int
    */
    firstId() {
        let storage_data = this._storage_data;
        
        return parseInt(Object.keys(storage_data).sort()[0])
            || null;
    }
    
    /**
    *   lastId
    *
    *   @return ?int
    */
    lastId() {
        const storage_data = this._storage_data;
        
        return parseInt(Object.keys(storage_data).sort().slice(-1)[0])
            || null;
    }
    
    /**
    *   findByJobName
    *
    *   @param string jobname
    *   @return array
    */
    findByJobName(jobname) {
        const storage_data = this._storage_data;
        
        return Object.values(storage_data).filter((inner_jobname) => {
            return inner_jobname === jobname;
        });
    }
    
    /**
    *   groupByJobName
    *
    *   @return array
    */
    groupByJobName() {
        const storage_data = this._storage_data;
        
        let uniques = [];
        
        Object.values(storage_data).forEach((jobname) => {
            if (uniques.indexOf(jobname) === -1) {
                uniques.push(jobname);
            }
        });
        
        return uniques;
    }
    
    /**
    *   findByDateString
    *
    *   @param string date_string yyyy-mm-dd
    *   @return array [[id,name,start_time,diff_time],...]
    */
    findByDateString(date_string) {
        const storage_data = this._storage_data;
        
        const min_unixtime = UnixDate.byStrDate(date_string);
        const max_unixtime = UnixDate.modifyDate(min_unixtime, 1);
        
        let dataset = [];
        let prev_data = 0;
        
        Object.keys(storage_data).sort().forEach((jobtime) => {
            if (parseInt(jobtime) >= min_unixtime
                && parseInt(jobtime) < max_unixtime
            ) {
                const diff_time = (
                    (parseInt(jobtime) - prev_data) / 1000 / 60 / 60
                ).toFixed(2);
                
                dataset.push({
                    id:jobtime,
                    name:storage_data[jobtime],
                    start_time:DateFormatter.toTime(jobtime),
                });
                
                if (prev_data) {
                    dataset[dataset.length - 2]['diff_time'] = diff_time;
                }
                
                prev_data = parseInt(jobtime);
            }
        });
        
        return dataset;
    }
    
    /**
    *   groupByDateString
    *
    *   @param string date_string yyyy-mm-dd
    *   @return array [[name,diff_time],...]
    */
    groupByDateString(date_string) {
        const storage_data = this._storage_data;
        
        const min_unixtime = UnixDate.byStrDate(date_string);
        const max_unixtime = UnixDate.modifyDate(min_unixtime, 1);
        
        let prev_pos = -1;
        let prev_data = 0;
        let total_key = [];
        let total_data = [];
        
        Object.keys(storage_data).sort().forEach((jobtime) => {
            if (parseInt(jobtime) >= min_unixtime
                && parseInt(jobtime) < max_unixtime
            ) {
                const diff_time =
                    parseInt(jobtime) - prev_data;
                let pos;
                
                if ((pos = total_key.indexOf(storage_data[jobtime])) === -1) {
                    pos = total_key.push(storage_data[jobtime]) - 1;
                    total_data[pos] = 0;
                }
                
                total_data[prev_pos] += prev_pos > -1? diff_time:0;
                
                prev_pos = pos;
                prev_data = parseInt(jobtime);
            }
        });
        
        return total_key.map((jobname, i) => {
            const diff_time = total_data[i]?
                (total_data[i] / 1000 / 60 / 60).toFixed(2):0;
            
            return{
                name:jobname,
                diff_time:diff_time * 1,
            };
        });
    }
    
    /**
    *   groupByJobNameOrderDesc
    *
    *   @return array
    */
    groupByJobNameOrderDesc() {
        const storage_data = this._storage_data;
        
        let uniques = [];
        
        Object.values(storage_data).reverse().forEach((jobname) => {
            if (uniques.indexOf(jobname) === -1) {
                uniques.push(jobname);
            }
        });
        
        return uniques;
    }
}


/**
*   MarcheConfig
*
*/
class MarcheConfig
{
    /**
    *   _storage_data
    *
    *   @var object
    */
    _storage_data;
    
    /**
    *   constructor
    *
    *   @param object
    */
    constructor(storage_data) {
        this._storage_data = storage_data;
    }
    
    /**
    *   set
    *
    *   @param string id
    *   @param string dataset
    *   @return this
    */
    set(id, dataset) {
        this._storage_data[id] = dataset;
        return this;
    }
    
    /**
    *   get
    *
    *   @param string id
    *   @return ?string
    */
    get(id) {
        return this._storage_data[id] || null;
    }
    
    /**
    *   remove
    *
    *   @param string id
    *   @return this
    */
    remove(id) {
        delete this._storage_data[id];
        return this;
    }    
    /**
    *   autoDates
    *
    *   @return array [id,auto_date_job,auto_date_start,auto_date_end]
    */
    autoDates() {
        return this._storage_data['auto_date'] || {};
    }
}


//////////////////////////////////////////

/**
*   MarcheRepository
*
*/
class MarcheRepository
{
    /**
    *   _DATA_NAMESPACE
    *
    *   @var string
    */
    _DATA_NAMESPACE = 'MarcheJs';
    
    /**
    *   _CONFIG_NAMESPACE
    *
    *   @var string
    */
    _CONFIG_NAMESPACE = 'MarcheJs_config';
    
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _storage
    *
    *   @var localStorage
    */
    _storage;
    
    /**
    *   constructor
    *
    */
    constructor(eventDispatcher) {
        this._eventDispatcher = eventDispatcher;
        this._storage = window.localStorage;
        this._removeExpirationData();
        
    }
    
    /**
    *   _dispatchStorageEvent
    *
    */
    _dispatchStorageEvent(event) {
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_update_storage',
            event
        );
    }
    
    /**
    *   generateId
    *
    *   @return string
    */
    generateId() {
        return (new Date()).getTime();
    }
    
    /**
    *   dataCollection
    *
    *   @return MarcheDataCollection
    */
    dataCollection() {
        const item = this._storage.getItem(this._DATA_NAMESPACE);
        const data_collection = item? JSON.parse(item):{};
        const storage_data = data_collection['_storage_data'] || {};
        return new MarcheDataCollection(storage_data);
    }
    
    /**
    *   setJobItem
    *
    *   @param string id
    *   @param object job_data
    *   @return this
    */
    setJobItem(id, job_data) {
        const event = {target:this, id:id, job_data:job_data};
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setJobItem_before',
            event
        );
        
        const dataCollection = this.dataCollection();
        
        dataCollection.set(id, job_data);
            
        this._storage.setItem(
            this._DATA_NAMESPACE,
            JSON.stringify(dataCollection)
        );
        
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setJobItem_after',
            event
        );
        
        this._dispatchStorageEvent(event);
        
        return this;
    }
    
    /**
    *   removeJobItem
    *
    *   @param string id
    *   @return this
    */
    removeJobItem(id) {
        const event = {target:this, id:id};
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_removeJobItem_before',
            event
        );
        
        const dataCollection = this.dataCollection();
        
        dataCollection.remove(id);
            
        this._storage.setItem(
            this._DATA_NAMESPACE,
            JSON.stringify(dataCollection)
        );
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_removeJobItem_after',
            event
        );
        
        this._dispatchStorageEvent(event);
        
        return this;
    }
    
    /**
    *   autoJob
    *
    *   @param ?string|int id
    *   @return this
    */
    autoJob(id) {
        id = id || UnixDate.now();
        const now = parseInt(id) 
        const _this = this;
        
        const auto_dates = this.getConfigs().autoDates();
        
        Object.keys(auto_dates).sort()
            .map((key) => {return auto_dates[key]})
            .forEach((obj) => {
        
            const today_date_start = UnixDate.setTimeString(
                UnixDate.today(),
                obj.auto_date_start
            );
            
            const data_collection = this.dataCollection();
            let latest_unixtime = data_collection.lastId();
        
            if (today_date_start < now
                && today_date_start > latest_unixtime
                && !data_collection.has(today_date_start)
            ) {
                _this.setJobItem(
                    today_date_start,
                    obj.auto_date_job
                );
                latest_unixtime = data_collection.lastId();
            }
            
            if (latest_unixtime != null
                && obj.auto_date_end != ''
                && UnixDate.isToday(latest_unixtime)
            ) {
                const today_date_end = UnixDate.setTimeString(
                    UnixDate.today(),
                    obj.auto_date_end
                );
                
                if (today_date_end < now
                    && today_date_start > latest_unixtime
                    && !data_collection.has(today_date_end)
                ) {
                    _this.setJobItem(
                        today_date_end,
                        data_collection.get(latest_unixtime)
                    );
                }
            }
        });
        return this;
    }
    
    /**
    *   _removeExpirationData
    *
    *   @return this
    */
    _removeExpirationData() {
        const expiration = this.getExpiration() || 0;
        
        if (expiration <= 0 || expiration >= 1000) {
            return this;
        }
        
        const today_unixtime = UnixDate.today();
        
        const expiaration_unixtime =
            today_unixtime - expiration * 60 * 60 * 24 * 1000;
        
        const dataCollection = this.dataCollection();
        
        Object.keys(dataCollection.all()).forEach((id) => {
            if (parseInt(id) < expiaration_unixtime) {
                this.removeJobItem(id);
            }
        });
    }
    
    ////////////////////////
    
    /**
    *   getConfigs
    *
    *   @return MarcheConfig
    */
    getConfigs() {
        const item = this._storage.getItem(this._CONFIG_NAMESPACE);
        const data_collection = item? JSON.parse(item):{};
        const storage_data = data_collection['_storage_data'] || {};
        return new MarcheConfig(storage_data);
    }
    
    /**
    *   setExpiration
    *
    *   @param ?int day
    *   @return this
    */
    setExpiration(day = 60) {
        const event = {target:this, day:day};
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setExpiration_before',
            event
        );
        
        const config = this.getConfigs();
        
        config.set('expiration', day);
            
        this._storage.setItem(
            this._CONFIG_NAMESPACE,
            JSON.stringify(config)
        );
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setExpiration_after',
            event
        );
        
        this._dispatchStorageEvent(event);
        
        return this;
    }
    
    /**
    *   getExpiration
    *
    *   @return int
    */
    getExpiration() {
        const config = this.getConfigs();
        return config.get('expiration') || 0;
    }
    
    /**
    *   setAutoDate
    *
    *   @param string jobname
    *   @param string start_time_string
    *   @param ?string end_time_string
    *   @return this
    */
    setAutoDate(jobname, start_time_string, end_time_string = '') {
        const event = {
            target:this,
            jobname:jobname,
            start_time_string:start_time_string,
            end_time_string:end_time_string     
        };
            
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setAutoDate_before',
            event
        );
        
        const auto_date = {};
        
        const id = start_time_string;
        auto_date.id = id;
        auto_date.auto_date_job = jobname;
        auto_date.auto_date_start = start_time_string;
        auto_date.auto_date_end = end_time_string;
        
        const config = this.getConfigs();
        const auto_dates = config.get('auto_date') || {};
        auto_dates[id] = auto_date;
        
        config.set('auto_date', auto_dates);
            
        this._storage.setItem(
            this._CONFIG_NAMESPACE,
            JSON.stringify(config)
        );
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_setAutoDate_after',
            event
        );
        
        this._dispatchStorageEvent(event);
        
        return this;
    }
    
    /**
    *   removeAutoDate
    *
    *   @param string id
    *   @return this
    */
    removeAutoDate(id) {
        const event = {target:this, id:id};
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_removeAutoDate_before',
            event
        );
        
        const auto_date = {};
        
        const config = this.getConfigs();
        const auto_dates = config.get('auto_date') || {};
        delete auto_dates[id];
        
        config.set('auto_date', auto_dates);
            
        this._storage.setItem(
            this._CONFIG_NAMESPACE,
            JSON.stringify(config)
        );
        
        this._eventDispatcher.dispatchEvent(
            'MarcheRepository_removeAutoDate_after',
            event
        );
        
        this._dispatchStorageEvent(event);
        
        return this;
    }
}
    
//////////////////////////////////////////

/**
*   JobInputView
*
*/
class JobInputView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _repository
    *
    *   @var MarcheRepository
    */
    _repository;
    
    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    *   @param MarcheRepository repository
    */
    constructor(eventDispatcher, repository) {
        this._eventDispatcher = eventDispatcher;
        this._repository = repository;
        this._initEvent();
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        this._eventDispatcher.addEventListener(
            'MarcheRepository_update_storage',
            () => this.render()
        );
        
        //登録ボタン
        document.querySelector('#job_input_view button[name="job_name_button"]')
            .addEventListener('click', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'JobInputView_inputJob_before',
                    {target:this, event:event}
                );
                
                const elem = document.querySelector(
                    '#job_input_view input[name="job_name"]'
                );
                
                const job_name = {};
                job_name.jobname = elem.value;
                
                if (! job_name.jobname) {
                    return;
                }
                
                job_name.id = this._repository.generateId();
                
                this._repository.autoJob(job_name.id);
                this._repository.setJobItem(job_name.id, job_name.jobname);
                
                elem.value = '';
                
                window.location.hash = '#timecard_view';
                
                this._eventDispatcher.dispatchEvent(
                    'JobInputView_inputJob_after',
                    {
                        target:this,
                        event:event,
                        job_name:job_name,
                    }
                );
            });
        
        
        //ダブルクリックで記録
        document.querySelector('#job_input_view tbody')
            .addEventListener('dblclick', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'JobInputView_addJob_before',
                    {target:this, event:event}
                );
                
                const job_input_table = {};
                job_input_table.id = this._repository.generateId();
                job_input_table.name = event.target.textContent;
                
                this._repository.autoJob(job_input_table.id);
                this._repository.setJobItem(
                    job_input_table.id,
                    event.target.textContent
                );
                
                window.location.hash = '#timecard_view';
                
                this._eventDispatcher.dispatchEvent(
                    'JobInputView_addJob_after',
                    {
                        target:this,
                        event:event,
                        job_input_table:job_input_table,
                    }
                );
            });
    }
    
    /**
    *   JOB入力 描画
    *
    */
    render() {
        const html = this._repository.dataCollection()
            .groupByJobNameOrderDesc()
            .map((jobname) => {
            
                return [
                    '<tr>',
                    `<td>${jobname}</td>`,
                    '</tr>'
                ].join('');
            });
        
        const elem = document.querySelector('#job_input_view table tbody');
        elem.textContent = null;
        elem.insertAdjacentHTML('beforeend', html.join(''));
    }
}

/**
*   TimeCardView
*
*/
class TimeCardView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _repository
    *
    *   @var MarcheRepository
    */
    _repository;
    
    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    *   @param MarcheRepository repository
    */
    constructor(eventDispatcher, repository) {
        this._eventDispatcher = eventDispatcher;
        this._repository = repository;
        this._initView();
        this._initEvent();
    }
    
    /**
    *   画面初期化
    *
    */
    _initView() {
        document.querySelector('#timecard_view input[name="job_date"]')
            .value = DateFormatter.toDate(UnixDate.today());
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        this._eventDispatcher.addEventListener(
            'MarcheRepository_update_storage',
            () => this.render()
        );
        
        this._eventDispatcher.addEventListener(
            'TotalDataView_changeDate_after',
            () => this.render()
        );
        
        //日付変更
        document.querySelector('#timecard_view input[name="job_date"]')
            .addEventListener('change', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'TimeCardView_changeDate_before',
                    {target:this, event:event}
                );
                
                const job_date = {};
                job_date.job_date = event.target.value;
                
                const elem = document.querySelector(
                    '#total_data_view input[name="job_date"]'
                ).value = event.target.value;
                
                this.render();
                
                this._eventDispatcher.dispatchEvent(
                    'TimeCardView_changeDate_after',
                    {
                        target:this,
                        event:event,
                        job_date:job_date,
                    }
                );
            });
            
        //タイムカード削除
        document.querySelector('#timecard_view table tbody')
            .addEventListener('dblclick', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'TimeCardView_removeData_before',
                    {target:this, event:event}
                );
                
                const timecard_table = {};
                timecard_table.name = event.target.parentNode
                    .children[1].textContent;
                timecard_table.start_time = event.target.parentNode
                    .children[2].textContent;
                
                if (!confirm(timecard_table.name
                    + ' ' 
                    + timecard_table.start_time + 'を削除しますか')
                ) {
                    return;
                }
                
                timecard_table.id = event.target.parentNode
                    .firstChild.textContent;
                
                this._repository.removeJobItem(timecard_table.id);
                
                this._eventDispatcher.dispatchEvent(
                    'TimeCardView_removeData_after',
                    {
                        target:this,
                        event:event,
                        timecard_table:timecard_table,
                    }
                );
            });
    }
    
    /**
    *   タイムカード 描画
    *
    */
    render() {
        const target_str_date =
            document.querySelector('#timecard_view input[name="job_date"]')
            .value;
        
        const html = this._repository.dataCollection()
            .findByDateString(target_str_date)
            .map((job_data) => {
                return [
                '<tr>',
                `<td class="display-none">${job_data.id}</td>`,
                `<td>${job_data.name}</td>`,
                `<td>${job_data.start_time}</td>`,
                `<td>${job_data.diff_time || ''}</td>`,
                '</tr>',
                ].join('');
            });
        
        const elem = document.querySelector('#timecard_view table tbody');
        elem.textContent = null;
        elem.insertAdjacentHTML('beforeend', html.join(''));
    }
}

/**
*   TotalDataView
*
*/
class TotalDataView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _repository
    *
    *   @var MarcheRepository
    */
    _repository;
    
    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    *   @param MarcheRepository repository
    */
    constructor(eventDispatcher, repository) {
        this._eventDispatcher = eventDispatcher;
        this._repository = repository;
        this._initView();
        this._initEvent();
    }
    
    /**
    *   画面初期化
    *
    */
    _initView() {
        document.querySelector('#total_data_view input[name="job_date"]')
            .value = DateFormatter.toDate(UnixDate.today());
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        this._eventDispatcher.addEventListener(
            'MarcheRepository_update_storage',
            () => this.render()
        );
        
        this._eventDispatcher.addEventListener(
            'TimeCardView_changeDate_after',
            () => this.render()
        );
        
        //日付変更
        document.querySelector('#total_data_view input[name="job_date"]')
            .addEventListener('change', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'TotalDataView_changeDate_before',
                    {target:this, event:event}
                );
                
                const job_date = {};
                job_date.job_date = event.value;
                
                document.querySelector(
                    '#timecard_view input[name="job_date"]'
                ).value = event.target.value;
                
                this.render();
                
                this._eventDispatcher.dispatchEvent(
                    'TotalDataView_changeDate_after',
                    {
                        target:this,
                        event:event,
                        job_date:job_date
                    }
                );
            });
    }
    
    /**
    *   集計 描画
    *
    */
    render() {
        const target_str_date =
            document.querySelector(
                '#total_data_view input[name="job_date"]'
            ).value;
        
        let today_total = 0;
        
        let html = this._repository.dataCollection()
            .groupByDateString(target_str_date)
            .map((job_data) => {
            
            today_total += job_data.diff_time;
            
            return [
                '<tr>',
                `<td>${job_data.name}</td>`,
                `<td>${job_data.diff_time.toFixed(2)}</td>`,
                '</tr>',
            ].join('');
        });
        
        html = html.concat([
            '<tr>',
            '<td>合計</td>',
            `<td>${today_total.toFixed(2)}</td>`,
            '</tr>',
        ].join(''));
        
        const elem = document.querySelector('#total_data_view table tbody');
        elem.textContent = null;
        elem.insertAdjacentHTML('beforeend', html.join(''));
    }
}

/**
*   ConfigView
*
*/
class ConfigView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _repository
    *
    *   @var MarcheRepository
    */
    _repository;
    
    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    *   @param MarcheRepository repository
    */
    constructor(eventDispatcher, repository) {
        this._eventDispatcher = eventDispatcher;
        this._repository = repository;
        this._repository.autoJob();
        this._initEvent();
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        this._eventDispatcher.addEventListener(
            'MarcheRepository_update_storage',
            () => this.render()
        );
        
        document.querySelector(
            '#config_view button[name="config_expiration_button"]'
            ).addEventListener('click', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_setExpiration_before',
                    {target:this, event:event}
                );
                
                const expire_day = {};
                expire_day.expire_day = document.querySelector(
                    '#config_view input[name="config_expiration"]'
                ).value;
                
                this._repository.setExpiration(expire_day.expire_day);
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_setExpiration_after',
                    {target:this, event:event, expire_day:expire_day}
                );
            });
        
        document.querySelector('#config_view button[name="auto_date_button"]')
            .addEventListener('click', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_addAutoDate_before',
                    {target:this, event:event}
                );
                
                const auto_date = {};
                
                let elem_job = document.querySelector(
                    '#config_view input[name="auto_date_job"]'
                );
                auto_date.auto_date_job = elem_job.value;
                
                let elem_start = document.querySelector(
                    '#config_view input[name="auto_date_start"]'
                );
                auto_date.auto_date_start = elem_start.value;
                
                if (auto_date.auto_date_job.trim() === ''
                    || auto_date.auto_date_start.trim() === ''
                ) {
                    this._eventDispatcher.dispatchEvent(
                        'ConfigView_addAutoDate_data_empty',
                        {
                            target:this,
                            event:event,
                            auto_date:auto_date,
                        }
                    );
                    return;
                }
                
                let elem_end = document.querySelector(
                    '#config_view input[name="auto_date_end"]'
                );
                auto_date.auto_date_end = elem_end.value;
                
                this._repository.setAutoDate(
                    auto_date.auto_date_job,
                    auto_date.auto_date_start,
                    auto_date.auto_date_end
                );
                
                this._repository.autoJob();
                
                elem_job.value = '';
                elem_start.value = '';
                elem_end.value = '';
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_addAutoDate_after',
                    {
                        target:this,
                        event:event,
                        auto_date:auto_date,
                    }
                );
            });
        
        document.querySelector('#auto_date_table tbody')
            .addEventListener('dblclick', (event) =>{
                event.preventDefault();
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_removeAutoDate_before',
                    {target:this, event:event}
                );
                
                const auto_date = {};
                auto_date.auto_date_job = event.target.parentNode
                    .children[1].textContent;
                auto_date.auto_date_start = event.target.parentNode
                    .children[2].textContent;
                auto_date.auto_date_end = event.target.parentNode
                    .children[3].textContent;
                
                
                if (!confirm(auto_date.auto_date_job
                    + ' '
                    + auto_date.auto_date_start + 'を削除しますか')
                ) {
                    return;
                }
                
                auto_date.id = event.target.parentNode
                    .firstChild.textContent;
                
                this._repository.removeAutoDate(auto_date.id);
                this._repository.autoJob();
                
                this._eventDispatcher.dispatchEvent(
                    'ConfigView_removeAutoDate_after',
                    {
                        target:this,
                        event:event,
                        auto_date:auto_date,
                    }
                );
            });
    }
    
    /**
    *   設定 描画
    *
    */
    render() {
        document.querySelector('#config_view input[name="config_expiration"]')
            .value = this._repository.getExpiration();
        
        const html = Object.values(this._repository.getConfigs().autoDates())
            .sort()
            .map((obj) => {
                return [
                    '<tr>',
                    `<td class="display-none">${obj.id}</td>`,
                    `<td>${obj.auto_date_job}</td>`,
                    `<td>${obj.auto_date_start}</td>`,
                    `<td>${obj.auto_date_end || ''}</td>`,
                    '</tr>'
                ].join('')
        });
        
        const elem = document.querySelector('#auto_date_table tbody');
        elem.textContent = null;
        elem.insertAdjacentHTML('beforeend', html.join(''));
    }
}

/**
*   MessageView
*
*/
class MessageView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    */
    constructor(eventDispatcher) {
        this._eventDispatcher = eventDispatcher;
        this._initEvent();
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        this._eventDispatcher.addEventListener(
            'JobInputView_inputJob_after',
            (event) => {
                this.info(
                    `${event.job_name.jobname} 登録しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'JobInputView_addJob_after',
            (event) => {
                this.info(
                    `${event.job_input_table.name} 登録しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'TimeCardView_removeData_after',
            (event) => {
                this.info(
                    `${event.timecard_table.start_time} ${event.timecard_table.name} 削除しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'ConfigView_setExpiration_after',
            (event) => {
                this.info(
                    `データ保持日数 ${event.expire_day.expire_day} 設定しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'ConfigView_addAutoDate_after',
            (event) => {
                this.info(
                    `自動JOB ${event.auto_date.auto_date_job} 設定しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'ConfigView_addAutoDate_data_empty',
            (event) => {
                this.error(
                    `自動JOB 入力が正しくありません`,
                    _MESSGAGE_DELAY_ERROR
                );
            }
        );
        
        this._eventDispatcher.addEventListener(
            'ConfigView_removeAutoDate_after',
            (event) => {
                this.info(
                    `自動JOB ${event.auto_date.auto_date_job} 削除しました`,
                    _MESSGAGE_DELAY_INFO
                );
            }
        );
    }
    
    /**
    *   メッセージウィンドウ非表示
    *
    *
    */
    close() {
        const message_body = document.querySelector(
            '#message_view div:first-child'
        );
        
        message_body.textContent = "";
        
        message_body.classList.remove('background-color-info');
        message_body.classList.remove('u-background-color-warning');
        message_body.classList.remove('background-color-error');
        
        document.querySelector('#message_view')
            .classList.add('display-none');
            
        document.body.classList.remove('position-fixed');
    }

    /**
    *   描画
    *
    *   @param string class_name
    *   @param string message
    *   @param int delay_time
    *
    */
    render(class_name, message, delay_time) {
        const message_body = document.querySelector(
            '#message_view div:first-child'
        );
        
        message_body.textContent = message.replace("\n", '<br>');
        message_body.classList.add(class_name);
        
        delay_time = delay_time * 1000 || 1000;
        setTimeout(this.close, delay_time);
        
        document.querySelector('#message_view')
            .classList.remove('display-none');
        
        document.body.classList.add('position-fixed');
    }

    /**
    *   メッセージウィンドウ 通知描画
    *
    *   @param string message
    *   @param int delay_time
    *
    */
    info(message, delay_time = 1) {
        this.render('background-color-info', message, delay_time);
    };

    /**
    *   メッセージウィンドウ エラー描画
    *
    *   @param string message
    *   @param int delay_time
    *
    */
    error(message, delay_time = 1) {
        this.render('background-color-error', message, delay_time);
    };
}

/**
*   TitleHeaderView
*
*/
class TitleHeaderView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   _repository
    *
    *   @var MarcheRepository
    */
    _repository;
    
    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    *   @param MarcheRepository repository
    */
    constructor(eventDispatcher, repository) {
        this._eventDispatcher = eventDispatcher;
        this._repository = repository;
        this._initEvent();
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        document.querySelector('header button[name="csv_button"]')
            .addEventListener('click', (event) =>{
                event.preventDefault();
                
                const storage_data = this._repository.dataCollection()
                    .all();
                    
                const html = Object.keys(storage_data)
                    .sort()
                    .map((jobtime) => {
                        return [
                            `${DateFormatter.toDate(jobtime)},`,
                            `${DateFormatter.toTime(jobtime)},`,
                            `${storage_data[jobtime]}`,
                    ].join('');
                });
                
                document.querySelector('textarea[name="csv_data"]')
                    .value = html.join("\n");
                
                document.querySelector('#csv_view')
                    .classList.remove('display-none');
                
                document.body.classList.add('position-fixed');
            });
    }
}

/**
*   CsvView
*
*/
class CsvView
{
    /**
    *   _eventDispatcher
    *
    *   @var EventDispatcher
    */
    _eventDispatcher;

    /**
    *   constructor
    *
    *   @param EventDispatcher eventDispatcher
    */
    constructor(eventDispatcher) {
        this._eventDispatcher = eventDispatcher;
        this._initEvent();
    }
    
    /**
    *   イベント初期化
    *
    */
    _initEvent() {
        document.querySelector('#csv_view button[name="csv_close_button"]')
            .addEventListener('click', (event) =>{
                event.preventDefault();
                
                document.querySelector('#csv_view')
                    .classList.add('display-none');
                
                document.body.classList.remove('position-fixed');
            });
    }
}

///////////////////

try {
    var eventDispatcher = new EventDispatcher();
    
    const repository = new MarcheRepository(eventDispatcher);
    
    const messageView = new MessageView(eventDispatcher);
    
    const jobInputView = new JobInputView(eventDispatcher, repository);
    
    const timeCardView = new TimeCardView(eventDispatcher, repository);
    
    const totalDataView = new TotalDataView(eventDispatcher, repository);
    
    const configView = new ConfigView(eventDispatcher, repository);
    
    const titleHeaderView = new TitleHeaderView(eventDispatcher, repository);
    
    const csvView = new CsvView(eventDispatcher);
    
    configView.render();
    jobInputView.render();
    timeCardView.render();
    totalDataView.render();
    
} catch (e) {
    console.error(e);
    MessageView.error(e);
} 
