const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd');
const heading = $('.infor h2')
const nameSinger = $('header .name-singer');
const cdThumb = $('.cd-thumb')
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const timeLeft = $(".time-left");
const timeRight = $(".time-right");


const app = {
    currentIndex: 0,
    isPlaying: false,
    song : [
    {
        name : "MyLove",
        singer : "WestLife",
        image: "./assets/music/img/Westlife Greatest Hits Album Cover.jpg",
        path : "./assets/music/songs/Westlife_-_My_Love_(Jesusful.com).mp3"
    },
    {
        name : "Âm thầm bên em",
        singer : "Sơn Tùng M-TP",
        image: "./assets/music/img/am-tham-ben-em-live-son-tung-m-tp.jpg",
        path : "./assets/music/songs/AmThamBenEm-SonTungMTP-4066476.mp3"
    },
    ],
    render: function(){
        const htmls = this.song.map(song =>{
            return `
                <div class="song">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
                </div> 
               
            `
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'CurrentSong', {
            get: function(){return this.song[this.currentIndex];},
        });
    },
    formatTime: function(time){
        let minutes = Math.floor(time/60);
        let seconds = Math.floor(time%60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes +":"+seconds;
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // *Xử lý phóng to thu nhỏ image CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Xử lý play
       

        playBtn.onclick = function(){
           if(_this.isPlaying){
                audio.pause();
           }
           else{
                audio.play();
           }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }
       
        // Tiến độ bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        
        // Load Tổng số thời gian bài hát
        audio.addEventListener("loadedmetadata", function(){
            timeRight.textContent = _this.formatTime(audio.duration);
        });

        // Load timeLeft khi thay đổi
        progress.addEventListener('input',function(e){
            const timeChange = (audio.duration / 100) * e.target.value;
            timeLeft.textContent = _this.formatTime(timeChange);
        });
        audio.addEventListener("timeupdate", function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
                timeLeft.textContent = _this.formatTime(audio.currentTime);
            }
        });

    },
    loadCurrentSong: function(){
        
        heading.textContent = this.CurrentSong.name;
        nameSinger.textContent = this.CurrentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.CurrentSong.image}')`;
        audio.src = this.CurrentSong.path;

    },
    
    start: function() {
        // Định nghĩa 


        this.defineProperties();

       
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
       
    }  
}
    app.start();