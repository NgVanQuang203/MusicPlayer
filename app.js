const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'Quang_Mucsic';

const cd = $(".cd");
const heading = $(".infor h2");
const nameSinger = $("header .name-singer");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const timeLeft = $(".time-left");
const timeRight = $(".time-right");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const volumeOnOff = $(".volumeOnOff");
const volume = $(".volume");
const volumeRange = $(".volume-range");
const options = $$(".song .option");



const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isVolume: true,
  config:
    JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY,)) || {},
  setConfig: function(key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  song: [
    {
      name: "MyLove",
      singer: "WestLife",
      image: "./assets/music/img/Westlife Greatest Hits Album Cover.jpg",
      path: "./assets/music/songs/Westlife_-_My_Love_(Jesusful.com).mp3",
    },
    {
      name: "Âm Thầm Bên Em",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/am-tham-ben-em-live-son-tung-m-tp.jpg",
      path: "./assets/music/songs/AmThamBenEm-SonTungMTP-4066476.mp3",
    },
    {
      name: "Đôi Mươi",
      singer: "Hoàng Dũng",
      image: "./assets/music/img/1200x1200bf-60.jpg",
      path: "./assets/music/songs/DoiMuoi-HoangDungTheVoice-7817479.mp3",
    },
    {
      name: "Đoạn Kết Mới",
      singer: "Hoàng Dũng",
      image: "./assets/music/img/1200x1200bf-60.jpg",
      path: "./assets/music/songs/DoanKetMoi-HoangDungTheVoice-7662770.mp3",
    },
    {
      name: "Chúng Ta Của Hiện Tại",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/70a345571f4fdac72acbf6c5c3fceee5.jpg",
      path: "./assets/music/songs/chungtacuahientai.mp3",
    },
    {
      name: "Buông Đôi Tay Nhau Ra",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/mqdefault.jpg",
      path: "./assets/music/songs/buongdoitaynhaura.mp3",
    },
    {
      name: "Nơi Này Có Anh",
      singer: "Sơn Tùng M-TP",
      image:
        "./assets/music/img/b6c44f836516ce8f33d539e140300a55.1000x1000x1.jpg",
      path: "./assets/music/songs/Noinaycoanh.mp3",
    },
    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/lactroi.jpg",
      path: "./assets/music/songs/Lactroi_lyrics.mp3",
    },
    {
      name: "Chắc Ai Đó Sẽ Về",
      singer: "Sơn Tùng M-TP",
      image:
        "./assets/music/img/chac-ai-do-se-ve-bi-nghi-dao-nhac-doisongphapluat1.jpg",
      path: "./assets/music/songs/ChacAidosevelyrics.mp3",
    },
    {
      name: "Tháng Tư Là Lời Nói Dối Của Em",
      singer: "Hà Anh Tuấn",
      image: "./assets/music/img/R.png",
      path: "./assets/music/songs/ThangTuLaLoiNoiDoilyrics.mp3",
    },
    {
      name: "Hoàng Hôn Tháng 8",
      singer: "Hà Anh Tuấn",
      image: "./assets/music/img/1641280778689_500.jpg",
      path: "./assets/music/songs/HoangHonThangTam-HaAnhTuan-5166364.mp3",
    },
  ],
  songs: [],
  render: function () {
    const htmls = this.song.map((song, index) => {
      return `
                <div class="song song-${index}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid  fa-ellipsis-vertical"></i>
                    <div class="option-child">
                      <a class="download" href download data-index="${index}">
                      <i class="fa-solid fa-download"></i>
                      Tải Xuống
                      </a>
                      <a class="delete" data-index="${index}">
                      <i class="fa-solid fa-trash"></i>
                        Xóa khỏi danh sách
                      </a>
                    </div>
                    </div>
                </div> 
               
            `;
    });
    playlist.innerHTML = htmls.join("");
    this.songs = document.querySelectorAll(".song");

  },
  
  defineProperties: function () {
    Object.defineProperty(this, "CurrentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },
  formatTime: function (time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // *Xử lý CD quay/dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10 seconds
        iterations: Infinity, // Vô hạn
      }
    );
    cdThumbAnimate.pause();

    // *Xử lý phóng to thu nhỏ image CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    //Xử lý play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
        if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
          _this.songs.forEach((song) => {
            song.classList.remove("active");
          });
          _this.songs[_this.currentIndex].classList.add("active");
        }
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Tiến độ bài hát
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Load Tổng số thời gian bài hát
    audio.addEventListener("loadedmetadata", function () {
      timeRight.textContent = _this.formatTime(audio.duration);
    });

    // Load timeLeft khi thay đổi
    progress.addEventListener("input", function (e) {
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
    // Click next button
    nextBtn.onclick = function () {
    
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSongg();
      }
      audio.play();
      if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
        
        _this.songs.forEach((song) => {
          song.classList.remove("active");
        });
        _this.songs[_this.currentIndex].classList.add("active");
      }
      _this.ScrollActiveSong();
    };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
        _this.songs.forEach((song) => {
          song.classList.remove("active");
        });
        _this.songs[_this.currentIndex].classList.add("active");
      }
      _this.ScrollActiveSong();
    };

    // *Xử lý random
    randomBtn.onclick = function (e) {
      if (_this.isRepeat) {
        repeatBtn.click();
      }
      
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
      _this.setConfig('isRandom', _this.isRandom);
    };
    // Xử lý next song khi end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Xử lý phát lại 1 bài
    repeatBtn.onclick = function () {
      if (_this.isRandom) {
        randomBtn.click();
      }
      
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
      _this.setConfig('isRepeat', _this.isRepeat);
      
    };
    // Click Song, Option, Delete Song
    playlist.onclick = function (e) {
      const songnode = e.target.closest('.song:not(.active)');
      const option = e.target.closest('.option');
      const optionChild = e.target.closest('.option-child');
      const downloadSong = e.target.closest('.download')
      const deleteSong = e.target.closest('.delete')
      const popUp_Confirm = $('.player .popup-confirm');

      const handleClick = (index)=>{
        _this.currentIndex = index;
        _this.loadCurrentSong();
        // Active Song
        if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
          _this.songs.forEach((song) => {
            song.classList.remove("active");
          });
          _this.songs[_this.currentIndex].classList.add("active");
        }
        _this.ScrollActiveSong();
        audio.play();
      }
      if(songnode && !option)
      {
        if(songnode){
          handleClick(Number(songnode.dataset.index));
          
        }
      }
      if(option){
        option.classList.toggle("active");
      }
      if(downloadSong){
        handleClick(Number(downloadSong.dataset.index));
        downloadSong.href = _this.CurrentSong.path;
        downloadSong.download = `${_this.CurrentSong.name} - ${_this.CurrentSong.singer}.mp3`;
        setTimeout(function(){
          _this.toastMessage([
            title = 'Tải xuống thành công!',
            message = 'Hãy kiểm tra trong thư mục download của bạn',
            type = 'success',
            duration = 3000
          ])
        }, 3000);
      }

      if(deleteSong){
        const indexDelete = Number(deleteSong.dataset.index);
        if(_this.isPlaying){
          _this.toastMessage([
            title = 'Thất Bại!',
            message = 'Trình phát nhạc đang chạy. Vui lòng tắt đi để xóa bài hát!',
            type = 'error',
            duration = 3000
          ]);
          return ;
        }
        if(_this.song.length <= 1){
          _this.toastMessage([
            title = 'Thất Bại!',
            message = 'Không thể xóa bài hát cuối cùng!',
            type = 'error',
            duration = 3000
          ]);
          return ;
        }
        popUp_Confirm.style.display = 'block';
        $('.btnAgree').onclick = function(){
          _this.removeSong(indexDelete);
          popUp_Confirm.style.display = 'none';
        }
        $('.btnCancel').onclick = function(){
          popUp_Confirm.style.display = 'none';
        }
        
        
      }
    };
   

    volumeRange.onchange = function (e) {
      
        const sleekVolumn = e.target.value;
        audio.volume = sleekVolumn / 100;
        console.log(audio.volume);
        if(volumeRange.value > 0){
          volume.classList.remove("active");
          _this.isVolume = true;
        }
        else{
          volume.classList.add("active");
          _this.isVolume = false;
        }
    };

    // Xử lý khi click Volume
    volumeOnOff.onclick = function (e) {
      if(_this.isVolume){
        volumeRange.value = 0;
        audio.volume = 0;
        volume.classList.add("active");
        _this.isVolume = false;

      }
      else {
        volume.classList.remove("active");
        volumeRange.value = 100;
        audio.volume= 1;
        _this.isVolume = true;
      }
    };
    // Xử lý khi click vào Option
  

  },
  loadConfig: function(){
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  removeSong: function(index){
    
    const render = document.querySelector(".song-" + index);
    if(render){
      this.song.splice(index, 1);
      this.render();
    }
    this.loadCurrentSong();
  },
  getValueIndex: function (currentIndex) {
    const songOfIndex = this.songs[currentIndex];
    console.log(songOfIndex); // Kiểm tra giá trị của songOfIndex
    if (songOfIndex && songOfIndex.getAttribute) {
      const valueIndex = songOfIndex.getAttribute("data-index");
      console.log(valueIndex);
      return valueIndex;
    } else {
      return null; // hoặc giá trị mặc định nếu không tìm thấy phần tử hoặc thuộc tính
    }
  },
  ScrollActiveSong: function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    },300);
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSongg: function () {
    this.currentIndex++;
    if (this.currentIndex > this.song.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }
    this.loadCurrentSong();
  },
  
  loadCurrentSong: function () {
    heading.textContent = this.CurrentSong.name;
    nameSinger.textContent = this.CurrentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.CurrentSong.image}')`;
    audio.src = this.CurrentSong.path;
  },
  // Toast Message
  toastMessage: function ([
      title = '',
      message ='',
      type= '',
      duration = 2000
    ]){
    const toastParent = document.querySelector('#toast');
    if(toastParent) {
      const toastChild = document.createElement('div');
      const autoremoveToast = setTimeout(function () {
        toastParent.removeChild(toastChild);
      }, duration + 1000);
      const icons ={
        success: 'fa-regular fa-circle-check',
        error: 'fa-solid fa-circle-exclamation'
      }
      const icon = icons[type];
      const delay = (duration / 1000).toFixed(2);

      toastChild.classList.add('toast', `toast-${type}`);
      toastChild.style.animation = `slideInLeft ease 0.3s, fadeOut linear 1s ${delay}s forwards`;

      toastChild.innerHTML = `
        <div class="toast_icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast_body">
        <h3 class="toast_title">${title}</h3>
        <p class="toast_message toast-${type}">${message}</p>
        </div>
        <div class="toast_close">
        <i class="fa-solid fa-xmark"></i>
        </div>
      `
      toastChild.addEventListener('click', function(e){
        const closeNode = e.target.closest('.toast_close');
        if(closeNode){
          toastParent.removeChild(toastChild);
        }
        clearTimeout(autoremoveToast);
      });
      toastParent.appendChild(toastChild);
    }
  },
  detectDevices: function(){
    if(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)){
      volume.style.display = 'none';
    }
    
  },
  start: function () {
    // Định nghĩa
    this.loadConfig();
    this.detectDevices();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
  },
};

app.start();
//
